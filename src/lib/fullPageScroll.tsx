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
// Trackpads (Mac in particular) fire a long tail of momentum "wheel" events after a single
// swipe. Any new wheel activity — even below the trigger threshold — resets this timer, so the
// input lock isn't released until the trackpad has been fully still for this long.
const WHEEL_SETTLE_MS = 500;
// The slideshow hijack only runs at md+; below that, slides can be taller than one screen
// (stacked layouts), so hijacking would clip content behind overflow-hidden with no way to
// reach it. Small screens get native document scrolling instead.
const DESKTOP_MQ = "(min-width: 768px)";

type FullPageCtx = {
  sectionIds: string[];
  index: number;
  activeId: string;
  goToIndex: (i: number) => void;
  goToId: (id: string) => void;
  y: MotionValue<number>;
  stageRef: React.RefObject<HTMLDivElement>;
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
  const animatingRef = useRef(false);
  const wheelLockedRef = useRef(false);
  const wheelSettleTimer = useRef<number | undefined>(undefined);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<{ x: number; y: number; axis: "v" | "h" | null } | null>(null);
  const reducedRef = useRef(false);
  const hashAppliedRef = useRef(false);

  const measure = useCallback(() => {
    const h = stageRef.current?.clientHeight ?? window.innerHeight;
    slideHeightRef.current = h;
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
      animate(y, targetY, {
        duration: DURATION,
        ease: EASE,
        onComplete: () => {
          window.setTimeout(() => {
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

      // Any wheel activity (even sub-threshold momentum tail) pushes back the settle timer.
      window.clearTimeout(wheelSettleTimer.current);
      wheelSettleTimer.current = window.setTimeout(() => {
        wheelLockedRef.current = false;
      }, WHEEL_SETTLE_MS);

      if (animatingRef.current || wheelLockedRef.current) return;
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      wheelLockedRef.current = true;
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
      window.clearTimeout(wheelSettleTimer.current);
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
    <Ctx.Provider value={{ sectionIds, index, activeId: sectionIds[index], goToIndex, goToId, y, stageRef }}>
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
  const { y, stageRef } = useFullPageScroll();
  return (
    <div
      ref={stageRef}
      className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] pt-16 md:fixed md:inset-x-0 md:bottom-0 md:top-16 md:overflow-hidden md:pb-0 md:pt-0"
    >
      <motion.div style={{ y }} className="flex flex-col will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
