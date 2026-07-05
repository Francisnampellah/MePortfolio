"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useMotionValue, animate, type MotionValue } from "framer-motion";

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const DURATION = 0.85;
const COOLDOWN_MS = 150;
const WHEEL_THRESHOLD = 8;
const TOUCH_THRESHOLD = 50;
// A gap this long between wheel events ends the current gesture: the trackpad
// momentum tail has died, so the next event starts a fresh (accelerating) gesture.
const WHEEL_GESTURE_GAP_MS = 200;
// Backstop: even if framer's onComplete never fires (e.g. a resize interrupts the
// animation with y.set), the input lock must release. This is the longest a single
// transition + cooldown can legitimately take, plus a small margin.
const ANIM_LOCK_MAX_MS = DURATION * 1000 + COOLDOWN_MS + 150;
// The slideshow hijack only runs at md+; below that, slides can be taller than one screen
// (stacked layouts), so hijacking would clip content behind overflow-hidden with no way to
// reach it. Small screens get native document scrolling instead.
const DESKTOP_MQ = "(min-width: 768px)";

/** Mean of the last `n` entries — used to compare recent vs older wheel speed. */
function tailAverage(values: number[], n: number) {
  const start = Math.max(values.length - n, 0);
  let sum = 0;
  for (let i = start; i < values.length; i++) sum += values[i];
  const count = values.length - start;
  return count ? sum / count : 0;
}

type FullPageCtx = {
  sectionIds: string[];
  index: number;
  activeId: string;
  goToIndex: (i: number) => void;
  goToId: (id: string) => void;
  y: MotionValue<number>;
  stageRef: React.RefObject<HTMLDivElement>;
  /** Measured stage height in px (0 before first measure); slides use it so their
      height matches the translate step exactly — CSS `100dvh` can disagree with the
      measured height on fractional-pixel displays and let a neighbor sliver show. */
  stageH: number;
};

const Ctx = createContext<FullPageCtx | null>(null);

export function useFullPageScroll() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFullPageScroll must be used within FullPageScrollProvider");
  return ctx;
}

function isTypingTarget(el: Element | null) {
  const tag = el?.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (el as HTMLElement | null)?.isContentEditable === true;
}

export function FullPageScrollProvider({
  sectionIds,
  children,
}: {
  sectionIds: string[];
  children: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  // null until the first media-query read, so the behavior effect doesn't run
  // a wrong-mode setup on the very first client render.
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const enabledRef = useRef(false);
  const y = useMotionValue(0);
  const slideHeightRef = useRef(0);
  const [stageH, setStageH] = useState(0);
  const animatingRef = useRef(false);
  const animLockTimer = useRef<number | undefined>(undefined);
  // Rolling window of recent |deltaY| values; a decelerating tail (momentum)
  // has a smaller recent average than middle average, an accelerating gesture larger.
  const scrollingsRef = useRef<number[]>([]);
  const lastWheelAtRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<{ x: number; y: number; axis: "v" | "h" | null } | null>(null);
  const reducedRef = useRef(false);
  const hashAppliedRef = useRef(false);

  const measure = useCallback(() => {
    const h = stageRef.current?.clientHeight ?? window.innerHeight;
    slideHeightRef.current = h;
    setStageH(h);
    if (enabledRef.current) y.set(-indexRef.current * h);
  }, [y]);

  const goToIndex = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(sectionIds.length - 1, target));
      if (!enabledRef.current) {
        // Native-scroll mode: defer to the browser; the IntersectionObserver
        // below keeps `index` in sync as the section arrives.
        indexRef.current = clamped;
        setIndex(clamped);
        document
          .getElementById(sectionIds[clamped])
          ?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth" });
        return;
      }
      if (clamped === indexRef.current || animatingRef.current) return;
      animatingRef.current = true;
      indexRef.current = clamped;
      setIndex(clamped);
      const targetY = -clamped * slideHeightRef.current;
      if (reducedRef.current) {
        y.set(targetY);
        animatingRef.current = false;
        return;
      }
      // Safety net: guarantee the lock releases even if onComplete is skipped
      // (a mid-transition resize cancels the animation via y.set without firing it).
      window.clearTimeout(animLockTimer.current);
      animLockTimer.current = window.setTimeout(() => {
        animatingRef.current = false;
      }, ANIM_LOCK_MAX_MS);
      animate(y, targetY, {
        duration: DURATION,
        ease: EASE,
        onComplete: () => {
          window.setTimeout(() => {
            window.clearTimeout(animLockTimer.current);
            animatingRef.current = false;
          }, COOLDOWN_MS);
        },
      });
    },
    [sectionIds, y]
  );

  const goToId = useCallback(
    (id: string) => {
      const i = sectionIds.indexOf(id);
      if (i >= 0) goToIndex(i);
    },
    [sectionIds, goToIndex]
  );

  // Mode detection: hijack at md+, native scroll below. Re-evaluated live so
  // rotating a tablet or resizing a window switches modes without a reload.
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mq = window.matchMedia(DESKTOP_MQ);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Behavior wiring for the current mode.
  useEffect(() => {
    if (enabled === null) return;
    enabledRef.current = enabled;

    // Deep-link support: apply the hash the page was opened with (once),
    // in whichever mode is active by then.
    if (!hashAppliedRef.current) {
      hashAppliedRef.current = true;
      const id = window.location.hash.slice(1);
      const i = sectionIds.indexOf(id);
      if (i > 0) {
        indexRef.current = i;
        setIndex(i);
        if (!enabled) {
          document.getElementById(id)?.scrollIntoView({ behavior: "auto" });
        }
      }
    }

    if (!enabled) {
      y.set(0);
      // Keep `index` (nav highlight, progress bar, back-to-top) tracking the
      // section nearest the middle of the viewport while the user scrolls natively.
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const i = sectionIds.indexOf(entry.target.id);
            if (i >= 0) {
              indexRef.current = i;
              setIndex(i);
            }
          }
        },
        { rootMargin: "-45% 0px -45% 0px" }
      );
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
      return () => observer.disconnect();
    }

    measure();
    // Mode switch (e.g. tablet rotation) can land mid-document; snap the stage
    // to whatever section the user was on.
    y.set(-indexRef.current * slideHeightRef.current);
    window.scrollTo(0, 0);

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    const onWheel = (e: WheelEvent) => {
      // Pinch-to-zoom on a Mac trackpad is reported as a wheel event with ctrlKey set —
      // let the browser handle that natively instead of hijacking it as a slide change.
      if (e.ctrlKey) return;
      e.preventDefault();

      const now = Date.now();
      // A pause longer than the gesture gap means the previous flick's momentum
      // has ended; forget it so the next push reads as a fresh, accelerating gesture.
      if (now - lastWheelAtRef.current > WHEEL_GESTURE_GAP_MS) scrollingsRef.current = [];
      lastWheelAtRef.current = now;

      const magnitude = Math.abs(e.deltaY);
      // Keep recording through the transition too, so a still-decaying momentum tail
      // is visible (as deceleration) the moment the lock lifts and can't trigger again.
      scrollingsRef.current.push(magnitude);
      if (scrollingsRef.current.length > 150) scrollingsRef.current.shift();

      if (animatingRef.current) return;
      if (magnitude < WHEEL_THRESHOLD) return;

      // Accelerating (recent faster than middle) = the user is actively scrolling →
      // advance. Decelerating = a momentum tail → ignore. This lets continuous
      // scrolling page through slides while one flick still moves exactly one slide.
      const recent = tailAverage(scrollingsRef.current, 10);
      const middle = tailAverage(scrollingsRef.current, 70);
      if (recent < middle) return;

      scrollingsRef.current = [];
      goToIndex(indexRef.current + (e.deltaY > 0 ? 1 : -1));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(document.activeElement)) return;
      if (animatingRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goToIndex(indexRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToIndex(indexRef.current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goToIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goToIndex(sectionIds.length - 1);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchRef.current = t ? { x: t.clientX, y: t.clientY, axis: null } : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      const start = touchRef.current;
      const t = e.touches[0];
      if (!start || !t) return;
      // Lock the gesture to an axis on first significant movement: vertical swipes
      // change slides, horizontal ones are left to scrollable rows (card lists etc.).
      if (!start.axis) {
        const dx = Math.abs(t.clientX - start.x);
        const dy = Math.abs(t.clientY - start.y);
        if (dx > 6 || dy > 6) start.axis = dy >= dx ? "v" : "h";
      }
      if (start.axis === "v") e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const start = touchRef.current;
      touchRef.current = null;
      if (!start || start.axis !== "v" || animatingRef.current) return;
      const endY = e.changedTouches[0]?.clientY ?? start.y;
      const delta = start.y - endY;
      if (Math.abs(delta) < TOUCH_THRESHOLD) return;
      goToIndex(indexRef.current + (delta > 0 ? 1 : -1));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.clearTimeout(animLockTimer.current);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // Keep the URL shareable: the hash always names the section on screen.
  useEffect(() => {
    if (!hashAppliedRef.current) return;
    const id = sectionIds[index];
    window.history.replaceState(null, "", index === 0 ? window.location.pathname : `#${id}`);
  }, [index, sectionIds]);

  return (
    <Ctx.Provider value={{ sectionIds, index, activeId: sectionIds[index], goToIndex, goToId, y, stageRef, stageH }}>
      {children}
    </Ctx.Provider>
  );
}

/**
 * At md+: fixed viewport-height stage below the nav; children are stacked slides
 * translated as one unit. Below md: a plain flow container (native scrolling),
 * padded down past the fixed nav.
 */
export function FullPageStage({ children }: { children: ReactNode }) {
  const { y, stageRef, stageH } = useFullPageScroll();
  return (
    <div
      ref={stageRef}
      // Publish the measured height as --slide-h so each slide is exactly one
      // stage tall (matches the translate step). Falls back to the dvh calc for
      // the first paint before measurement.
      style={{ ["--slide-h" as string]: stageH ? `${stageH}px` : "calc(100dvh - 4rem)" }}
      className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] pt-16 md:fixed md:inset-x-0 md:bottom-0 md:top-16 md:overflow-hidden md:pb-0 md:pt-0"
    >
      <motion.div style={{ y }} className="flex flex-col will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
