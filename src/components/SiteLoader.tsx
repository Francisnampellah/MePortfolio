"use client";

import { useEffect, useState } from "react";
import { PROFILE } from "@/lib/data";
import { WAIT_LINES, WAIT_LINE_ROTATE_MS } from "@/lib/heroWaitLines";
import { useSiteReady } from "@/lib/siteReady";

/**
 * Total reveal choreography, in ms — must match the Tailwind timing classes below.
 *
 * The panel's clip-path collapse starts at 200ms (delay) and runs for 900ms, so
 * the last pixel clears at 1100ms. The extra 60ms is slack before unmount.
 */
const REVEAL_MS = 1160;

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

/** Fade-and-drift applied to every foreground element, ahead of the curtain. */
const EXIT_BASE =
  "transition-[opacity,transform] duration-[260ms] ease-out motion-reduce:transition-none";

/**
 * Full-screen loader held over the homepage until the hero is painted.
 *
 * Rendered on the server with `mounted` true so it is in the initial HTML —
 * no white flash before hydration, and the first client render matches.
 *
 * The reveal is a masked curtain rather than a fade: foreground content exits
 * first, then the panel is clipped away from the top down, so the hero is
 * uncovered headline-first while the composition stays anchored in place.
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
    const id = window.setTimeout(() => setMounted(false), REVEAL_MS);
    return () => window.clearTimeout(id);
  }, [revealed]);

  // Hold the page still while loading. FullPageScrollProvider binds its
  // wheel/touch/key handlers on window without capture, so intercepting in
  // the capture phase starves it without touching that file. Release the lock
  // immediately when revealed, not when the curtain finishes clearing.
  useEffect(() => {
    if (revealed) return;

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
  }, [revealed]);

  if (!mounted) return null;

  const pct = Math.min(100, Math.max(0, Math.round(progress)));
  // Zero-padded so the counter never changes width as it crosses 10 and 100.
  const count = String(pct).padStart(3, "0");
  const exit = `${EXIT_BASE} ${revealed ? "-translate-y-[10px] opacity-0" : "translate-y-0 opacity-100"}`;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!revealed}
      style={{ clipPath: revealed ? "inset(100% 0 0 0)" : "inset(0 0 0 0)" }}
      className={`fixed inset-0 z-[100] bg-surface transition-[clip-path] delay-[200ms] duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        revealed ? "pointer-events-none" : ""
      }`}
    >
      {/* The counter ticks far too often to announce; one static line stands in. */}
      <span className="sr-only">Loading — preparing the page.</span>

      <div
        aria-hidden
        className="flex h-full flex-col justify-between p-8 lg:p-10"
      >
        <div
          className={`text-[12px] font-semibold uppercase leading-none tracking-[0.18em] text-ink ${exit}`}
        >
          {PROFILE.initials}
        </div>

        <div
          className={`font-semibold leading-[0.78] tracking-[-0.05em] tabular-nums text-ink text-[clamp(84px,13vw,176px)] ${exit}`}
        >
          {count}
        </div>
      </div>

      {/*
        Centre block: the "still working" signal. Progress lives in the corner
        counter and the bottom rail, so this stays qualitative — a spinner and
        copy — rather than repeating the number a third time.
      */}
      <div
        aria-hidden
        className={`absolute inset-0 flex flex-col items-center justify-center px-6 text-center ${exit}`}
      >
        <span className="h-6 w-6 animate-spin rounded-full border border-line border-t-accent [animation-duration:1.4s]" />

        {/* Keyed so React remounts the node and replays the entry animation. */}
        <p
          key={lineIdx}
          className="mt-5 animate-wait-line text-[15px] font-semibold tracking-[-0.015em] text-ink"
        >
          {WAIT_LINES[lineIdx]}
        </p>
        <p className="mt-2 max-w-[240px] text-[13px] leading-relaxed text-muted">
          Hang tight — something nice is loading.
        </p>
      </div>

      {/* Full-bleed hairline, sitting outside the panel's padding. */}
      <div
        aria-hidden
        className={`absolute inset-x-0 bottom-0 h-px bg-line ${exit}`}
      >
        <div
          className="h-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
