"use client";

import { ChevronDown } from "lucide-react";
import { useFullPageScroll } from "@/lib/fullPageScroll";

/**
 * Desktop-only (md+) "game menu" chrome around the slideshow: a dot rail on the
 * right edge (one per slide, active dot stretched into an accent pill, labels on
 * hover), a slide counter bottom-left, and a scroll hint on the landing slide.
 * Mobile gets the app-style TabBar instead.
 */

const LABELS: Record<string, string> = {
  home: "start",
  tech: "toolbox",
  projects: "selected work",
  experience: "journey",
  testimonials: "references",
  github: "open source",
  blog: "writing",
  contact: "contact",
};

const pad = (n: number) => String(n).padStart(2, "0");

export function SlideHud() {
  const { sectionIds, index, goToIndex } = useFullPageScroll();

  return (
    <>
      {/* Dot rail */}
      <div className="fixed right-4 top-1/2 z-[70] hidden -translate-y-1/2 flex-col items-center gap-2.5 md:flex">
        {sectionIds.map((id, i) => {
          const active = i === index;
          return (
            <button
              key={id}
              onClick={() => goToIndex(i)}
              aria-label={`Go to ${LABELS[id] ?? id}`}
              aria-current={active ? "true" : undefined}
              className="group relative flex h-[22px] w-[22px] items-center justify-center"
            >
              <span
                className={`pointer-events-none absolute right-full mr-1.5 whitespace-nowrap rounded-md border border-line bg-white/95 px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.08em] transition-opacity duration-200 ${
                  active ? "text-accent opacity-100" : "text-muted2 opacity-0 group-hover:opacity-100"
                }`}
              >
                {LABELS[id] ?? id}
              </span>
              <span
                className={`rounded-full transition-all duration-300 ${
                  active
                    ? "h-[22px] w-[7px] bg-accent"
                    : "h-[7px] w-[7px] border border-[#c9c4bd] bg-white group-hover:border-accent"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Slide counter */}
      <div
        aria-hidden
        className="fixed bottom-5 left-6 z-[70] hidden select-none font-mono text-[11px] tracking-[0.08em] md:block"
      >
        <span className="font-semibold text-accent">{pad(index + 1)}</span>
        <span className="text-faint"> / {pad(sectionIds.length)}</span>
      </div>

      {/* Scroll hint — landing slide only */}
      <div
        aria-hidden
        className={`fixed bottom-4 left-1/2 z-[70] hidden -translate-x-1/2 flex-col items-center gap-0.5 transition-opacity duration-500 md:flex ${
          index === 0 ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted2">scroll</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-accent" strokeWidth={2} />
      </div>
    </>
  );
}
