"use client";

import { useEffect, useState } from "react";
import { PROFILE } from "@/lib/data";
import { WAIT_LINES, WAIT_LINE_ROTATE_MS } from "@/lib/heroWaitLines";
import { useSiteReady } from "@/lib/siteReady";

const FADE_MS = 500;

/** Keys that scroll the page — blocked while the loader is up. */
const SCROLL_KEYS = new Set([
  " ",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  "ArrowUp",
  "ArrowDown",
]);

/**
 * Full-screen loader held over the homepage until the hero is painted.
 *
 * Rendered on the server with `mounted` true so it is in the initial HTML —
 * no white flash before hydration, and the first client render matches.
 */
export function SiteLoader() {
  const { progress, revealed } = useSiteReady();
  const [mounted, setMounted] = useState(true);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    if (revealed) return;
    const id = window.setInterval(
      () => setLineIdx((i) => (i + 1) % WAIT_LINES.length),
      WAIT_LINE_ROTATE_MS
    );
    return () => window.clearInterval(id);
  }, [revealed]);

  // Unmount on a timer rather than transitionend: globals.css collapses every
  // transition to 0.001ms under prefers-reduced-motion, which makes the event
  // unreliable to hang teardown on.
  useEffect(() => {
    if (!revealed) return;
    const id = window.setTimeout(() => setMounted(false), FADE_MS);
    return () => window.clearTimeout(id);
  }, [revealed]);

  // Hold the page still. FullPageScrollProvider binds its wheel/touch/key
  // handlers on window without capture, so intercepting in the capture phase
  // starves it without touching that file.
  useEffect(() => {
    if (!mounted) return;

    const stop = (e: Event) => {
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
    };
    const stopScrollKeys = (e: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(e.key)) return;
      stop(e);
    };
    const opts = { capture: true, passive: false } as const;

    window.addEventListener("wheel", stop, opts);
    window.addEventListener("touchmove", stop, opts);
    window.addEventListener("keydown", stopScrollKeys, opts);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("wheel", stop, opts);
      window.removeEventListener("touchmove", stop, opts);
      window.removeEventListener("keydown", stopScrollKeys, opts);
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  if (!mounted) return null;

  const pct = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!revealed}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface transition-opacity duration-500 ${
        revealed ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div
        aria-hidden
        className="text-[22px] font-extrabold tracking-[-0.03em] text-ink"
      >
        {PROFILE.initials}
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-muted">{WAIT_LINES[lineIdx]}</p>

      {/* Percentage is decorative — announcing every tick would spam a screen reader. */}
      <div
        aria-hidden
        className="mt-5 h-[3px] w-36 overflow-hidden rounded-full bg-[#efeae4]"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p
        aria-hidden
        className="mt-2 font-mono text-[10px] tabular-nums tracking-[0.06em] text-faint"
      >
        {pct}%
      </p>
    </div>
  );
}
