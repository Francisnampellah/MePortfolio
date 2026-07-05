"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./Section";
import { useSelectionPulse, selectionGlow } from "@/lib/connector";
import { EXPERIENCE, EDUCATION } from "@/lib/data";

/**
 * Horizontal timeline of compact role cards — just role / company / period, so
 * the section stays uncluttered at a glance. The full story (bullet points +
 * tech) lives in one shared detail panel below, showing a single role at a
 * time: hover a card to switch on desktop, tap on touch.
 */
export function Experience() {
  const [active, setActive] = useState(0);
  const pulse = useSelectionPulse(active);
  const current = EXPERIENCE[active];

  return (
    <section
      id="experience"
      className="relative z-[1] flex min-h-[calc(100dvh-4rem)] w-full shrink-0 scroll-mt-16 flex-col justify-center overflow-x-clip border-t border-line bg-surface py-14 md:h-[calc(100dvh-4rem)] md:overflow-hidden md:py-0"
    >
      <div className="mx-auto w-full max-w-page px-6">
        <Reveal>
          <SectionLabel>03 / journey</SectionLabel>
          <h2 className="mt-2.5 text-[clamp(26px,3.4vw,38px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#141414]">
            Experience timeline
          </h2>
        </Reveal>

        <div className="relative mt-6">
          {/* the line the dots sit on — only when cards are actually in one row */}
          <div aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-line lg:block" />
          <div className="-mx-6 flex gap-3.5 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
            {EXPERIENCE.map((job, i) => {
              const on = i === active;
              return (
                <Reveal key={job.company} delay={i * 0.06} className="relative w-[230px] shrink-0 md:w-auto lg:pt-7">
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-0 hidden h-[15px] w-[15px] -translate-x-1/2 place-items-center rounded-full border border-accent bg-white lg:grid"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${on ? "bg-accent" : "bg-[#e0d9d2]"}`}
                    />
                  </span>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className={`w-full rounded-xl border px-4 py-3.5 text-left transition-colors duration-200 ${
                      on ? "border-accent bg-[#faf2ee]" : "border-line bg-white hover:border-[#d9b8a8]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] border border-line bg-white font-mono text-[11.5px] font-semibold text-accent">
                        {job.icon}
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-[14.5px] font-bold leading-tight tracking-[-0.01em]">{job.role}</h3>
                        <div className="truncate text-[12.5px] font-medium text-accent">{job.company}</div>
                      </div>
                    </div>
                    <span
                      className={`mt-2.5 inline-block rounded-[6px] border px-2 py-[3px] font-mono text-[10.5px] transition-colors duration-200 ${
                        on ? "border-[#eadfd7] bg-white text-accent" : "border-line bg-surface text-muted2"
                      }`}
                    >
                      {job.period}
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* Shared detail panel — one role's story at a time */}
          <Reveal className="mt-4">
            <div className="rounded-xl border bg-white p-5" style={selectionGlow(pulse)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
                      {current.company}
                    </div>
                    <div className="font-mono text-[10.5px] text-muted2">{current.period}</div>
                  </div>
                  <div className="mt-3 grid gap-x-8 gap-y-4 md:grid-cols-[1.7fr_1fr]">
                    <ul className="flex min-h-[92px] list-disc flex-col gap-1.5 pl-[17px]">
                      {current.points.map((pt) => (
                        <li key={pt} className="text-[13.5px] leading-[1.55] text-muted">
                          {pt}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap content-start gap-1.5 md:justify-end">
                      {current.tech.map((t) => (
                        <span
                          key={t}
                          className="h-fit rounded-md border border-line bg-surface px-2 py-[3px] font-mono text-[10.5px] text-[#7c776f]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        {/* Education strip */}
        <Reveal className="mt-5">
          <div className="grid gap-3 md:grid-cols-2">
            {EDUCATION.map((ed) => (
              <div key={ed.title} className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white px-[18px] py-3">
                <div className="min-w-0">
                  <h4 className="truncate text-[14.5px] font-bold leading-[1.3]">{ed.title}</h4>
                  <div className="mt-0.5 truncate text-[12.5px] font-medium text-accent">{ed.org}</div>
                </div>
                <span className="shrink-0 font-mono text-[10.5px] text-faint">{ed.year}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
