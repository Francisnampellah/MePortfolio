"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./Section";
import { EXPERIENCE, EDUCATION } from "@/lib/data";

/**
 * Abstract career-path timeline: roles are glowing stops on a real horizontal
 * time axis, placed by the start date parsed from each `period`, so it reads as
 * time flowing left (earliest) → right (now). Deliberately low-detail — no
 * bullet lists — the visual *is* the content: a big ghost year, the role title,
 * and a light tech row for whichever stop is active. Below md it stacks into a
 * minimal vertical list.
 */

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/** Decimal-year of a period's start, e.g. "Mar 2026 — Present" → 2026.17. */
function startValue(period: string): number {
  const start = period.split(/[—–-]/)[0].trim();
  const year = start.match(/\d{4}/);
  const month = start.match(/[A-Za-z]{3}/);
  return (year ? parseInt(year[0], 10) : 0) + (month ? (MONTHS[month[0].toLowerCase()] ?? 0) / 12 : 0);
}

const isPresent = (period: string) => /present|now|current/i.test(period);

const PAD = 0.07; // fraction of axis width kept clear at each end
const MIN_GAP = 0.16; // minimum fraction between adjacent stops so they never collide

export function Experience() {
  // Stops sorted earliest → latest, each with a clamped position along [PAD, 1-PAD].
  const stops = useMemo(() => {
    const withVal = EXPERIENCE.map((job, i) => ({ job, i, t: startValue(job.period) }));
    const sorted = [...withVal].sort((a, b) => a.t - b.t || a.i - b.i);
    const tMin = sorted[0].t;
    const span = sorted[sorted.length - 1].t - tMin || 1;

    const spaced = sorted.map((s) => (s.t - tMin) / span);
    for (let k = 1; k < spaced.length; k++) {
      if (spaced[k] < spaced[k - 1] + MIN_GAP) spaced[k] = spaced[k - 1] + MIN_GAP;
    }
    const last = spaced[spaced.length - 1] || 1;
    const scale = last > 1 ? 1 / last : 1;

    return sorted.map((s, k) => ({
      job: s.job,
      pos: PAD + spaced[k] * scale * (1 - PAD * 2),
      year: (s.job.period.match(/\d{4}/) ?? [""])[0],
      now: isPresent(s.job.period),
    }));
  }, []);

  // Default to the current (rightmost / "now") role — the headline of the journey.
  const [active, setActive] = useState(stops.length - 1);
  const s = stops[active];
  const job = s.job;

  return (
    <section
      id="experience"
      className="relative z-[1] flex min-h-[calc(100dvh-4rem)] w-full shrink-0 scroll-mt-16 flex-col justify-center overflow-x-clip border-t border-line bg-surface py-14 md:h-[var(--slide-h)] md:min-h-0 md:overflow-hidden md:py-0"
    >
      <div className="mx-auto w-full max-w-page px-6">
        <Reveal>
          <SectionLabel>04 / journey</SectionLabel>
          <h2 className="mt-2.5 text-[clamp(26px,3.4vw,38px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#141414]">
            Experience timeline
          </h2>
        </Reveal>

        {/* ---- Desktop: abstract horizontal time axis ---- */}
        <div className="hidden md:block">
          {/* Now-showing display */}
          <div className="relative mt-10 flex h-[210px] items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: [0.22, 0.7, 0.2, 1] }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Ghost year — big, faded, behind the title for depth */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-8 select-none font-extrabold leading-none tracking-[-0.04em] text-[clamp(96px,15vw,190px)]"
                  style={{ color: "color-mix(in srgb, var(--accent) 8%, transparent)" }}
                >
                  {s.now ? "now" : s.year}
                </span>

                <div className="relative flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-white font-mono text-[13px] font-semibold text-accent shadow-sm">
                    {job.icon}
                  </span>
                  <h3 className="text-left text-[clamp(24px,3.2vw,40px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
                    {job.role}
                  </h3>
                </div>

                <div className="relative mt-3 flex items-center gap-2.5 text-[15px]">
                  <span className="font-semibold text-accent">{job.company}</span>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-faint" />
                  <span className="font-mono text-[12.5px] text-muted2">{job.period}</span>
                </div>

                <div className="relative mt-4 flex flex-wrap justify-center gap-1.5">
                  {job.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line bg-white px-2.5 py-1 font-mono text-[10.5px] text-[#7c776f]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* The axis */}
          <div className="relative mt-6 h-[58px]">
            <div aria-hidden className="absolute left-[7%] right-[7%] top-0 h-[2px] rounded-full bg-[#e6ded6]" />
            <motion.div
              aria-hidden
              className="absolute top-0 h-[2px] rounded-full"
              style={{
                left: `${PAD * 100}%`,
                background: "linear-gradient(90deg, color-mix(in srgb, var(--accent) 45%, transparent), var(--accent))",
              }}
              animate={{ width: `${Math.max(s.pos - PAD, 0) * 100}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            />

            {stops.map((st, i) => {
              const on = i === active;
              return (
                <button
                  key={st.job.company}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  aria-label={`${st.job.role} — ${st.job.company}`}
                  className="group absolute top-0 flex -translate-x-1/2 flex-col items-center"
                  style={{ left: `${st.pos * 100}%` }}
                >
                  <span className="relative grid h-4 w-4 -translate-y-1/2 place-items-center">
                    {st.now ? (
                      <span aria-hidden className={`absolute h-4 w-4 rounded-full bg-accent/25 ${on ? "animate-ping" : ""}`} />
                    ) : null}
                    <span
                      className={`relative rounded-full transition-all duration-300 ${
                        on
                          ? "h-4 w-4 bg-accent shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
                          : "h-[10px] w-[10px] border border-[#c9c4bd] bg-white group-hover:scale-125 group-hover:border-accent"
                      }`}
                    />
                  </span>
                  <span
                    className={`mt-2.5 font-mono text-[11px] transition-colors ${
                      on ? "font-semibold text-accent" : "text-muted2 group-hover:text-ink"
                    }`}
                  >
                    {st.now ? "now" : st.year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- Mobile: minimal vertical stack, newest first ---- */}
        <div className="mt-6 flex flex-col gap-2.5 md:hidden">
          {[...stops].reverse().map((st) => (
            <div key={st.job.company} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-line bg-surface font-mono text-[12px] font-semibold text-accent">
                {st.job.icon}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[14.5px] font-bold leading-tight tracking-[-0.01em]">{st.job.role}</h3>
                <div className="truncate text-[12.5px] font-medium text-accent">{st.job.company}</div>
              </div>
              <span className="shrink-0 font-mono text-[10.5px] text-muted2">{st.now ? "now" : st.year}</span>
            </div>
          ))}
        </div>

        {/* Education strip */}
        <Reveal className="mt-9 md:mt-12">
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
