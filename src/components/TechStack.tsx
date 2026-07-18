"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SectionLabel, SECTION_INNER, SECTION_SLIDE_ROOT } from "./Section";
import { Reveal } from "./Reveal";
import { CAPABILITIES, type CapabilityAction, type EvidencePart } from "@/lib/data";
import { useFullPageScroll } from "@/lib/fullPageScroll";

/**
 * Toolbox — capability-first. Tabs pick an outcome; tools are chips;
 * evidence is concrete; no self-ratings.
 */

function selectProject(projectNo: string) {
  const no = projectNo.padStart(2, "0");
  window.history.replaceState(null, "", `#project-${no}`);
  window.dispatchEvent(new CustomEvent("select-project", { detail: { no } }));
}

function EvidenceLines({ lines }: { lines: [EvidencePart[], EvidencePart[]] }) {
  return (
    <div className="mt-5 max-w-[560px] space-y-1 text-[15px] leading-snug text-muted">
      {lines.map((parts, lineIdx) => (
        <p key={lineIdx} className="text-pretty">
          {parts.map((part, i) =>
            typeof part === "string" ? (
              <span key={i}>{part}</span>
            ) : (
              <Link
                key={i}
                href={part.href}
                className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:text-ink hover:decoration-ink/40"
              >
                {part.label}
              </Link>
            )
          )}
        </p>
      ))}
    </div>
  );
}

export function TechStack() {
  const [active, setActive] = useState(0);
  const cap = CAPABILITIES[active];
  const { goToId } = useFullPageScroll();

  const openAction = (action: CapabilityAction) => {
    if (action.kind === "blog") return;
    selectProject(action.projectNo);
    goToId("projects");
  };

  return (
    <section id="tech" className={`${SECTION_SLIDE_ROOT} border-t border-line bg-surface`}>
      <div className={SECTION_INNER}>
        <Reveal>
          <SectionLabel>02 / toolbox</SectionLabel>
          <p className="mt-2.5 max-w-[540px] text-[15.5px] leading-relaxed text-muted">
            Pick a capability to see the work behind it.
          </p>
        </Reveal>

        <div className="relative mt-8 min-h-[240px] max-w-[720px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.26, ease: [0.22, 0.7, 0.2, 1] }}
              className="relative"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-6 left-0 z-0 hidden select-none whitespace-nowrap font-extrabold uppercase leading-none tracking-[-0.04em] text-[clamp(48px,7vw,88px)] md:block"
                style={{ color: "color-mix(in srgb, var(--accent) 5%, transparent)" }}
              >
                {cap.short}
              </span>

              <div className="relative z-10">
                <div className="border-b border-line pb-4">
                  <h2 className="text-[clamp(22px,2.6vw,32px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
                    {cap.name}
                  </h2>
                  <p className="mt-1.5 font-mono text-[12.5px] text-muted2">{cap.tagline}</p>
                </div>

                <EvidenceLines lines={cap.evidence} />

                <div className="mt-5 flex flex-nowrap gap-1.5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {cap.tools.map((t) => (
                    <span
                      key={t}
                      className="shrink-0 rounded-full border border-line bg-white px-2.5 py-1 font-mono text-[10.5px] text-[#7c776f]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  {cap.action.kind === "blog" ? (
                    <Link
                      href={cap.action.href}
                      className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent transition-colors hover:text-ink"
                    >
                      See it in action →
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openAction(cap.action)}
                      className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent transition-colors hover:text-ink"
                    >
                      See it in action →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Selector — numbered index (horizontal scroll on small screens) */}
        <div className="mt-8 -mx-6 flex gap-1 overflow-x-auto px-6 sm:mx-0 sm:grid sm:grid-cols-7 sm:gap-2 sm:overflow-visible sm:px-0">
          {CAPABILITIES.map((g, i) => {
            const on = i === active;
            return (
              <button
                key={g.name}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={on}
                className="group flex w-[104px] shrink-0 flex-col items-start border-t-2 pt-2.5 text-left transition-colors sm:w-full"
                style={{ borderTopColor: on ? "var(--accent)" : "#e6ded6" }}
              >
                <span
                  className={`font-mono text-[15px] font-bold tabular-nums transition-colors ${
                    on ? "text-accent" : "text-faint group-hover:text-muted2"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`mt-0.5 text-[11.5px] leading-tight transition-colors ${
                    on ? "font-semibold text-ink" : "font-medium text-muted3 group-hover:text-muted"
                  }`}
                >
                  {g.short}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
