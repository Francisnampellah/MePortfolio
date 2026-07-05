"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Github } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./Section";
import { ImageSlot } from "./ImageSlot";
import { PROJECTS, PROJECT_FILTERS } from "@/lib/data";

/**
 * Abstract featured-work view (same language as the Experience axis / Tech Stack):
 * one project fills a big image-led focal display — ghost number, title, one-line
 * summary, light tech tags, two actions — and a row of numbered dots below moves
 * between them. Deliberately low-detail: the old problem/outcome grid and blurb
 * are dropped so the image and title carry it. Autoplay advances the dots.
 */

const AUTOPLAY_MS = 6500;

export function Projects() {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  const visible = PROJECTS.filter((p) => filter === "All" || p.tags.includes(filter));
  const current = visible[active] ?? visible[0];

  useEffect(() => {
    setActive(0);
  }, [filter]);

  useEffect(() => {
    if (paused || reduced || visible.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % visible.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, reduced, visible.length]);

  const go = (delta: number) => setActive((a) => (a + delta + visible.length) % visible.length);

  return (
    <section
      id="projects"
      className="relative z-[1] flex min-h-[calc(100dvh-4rem)] w-full shrink-0 scroll-mt-16 flex-col justify-center overflow-x-clip py-14 md:h-[var(--slide-h)] md:min-h-0 md:overflow-hidden md:py-0"
    >
      <div className="mx-auto w-full max-w-page px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionLabel>03 / selected work</SectionLabel>
            <h2 className="mt-2.5 text-[clamp(26px,3.4vw,38px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#141414]">
              Featured projects
            </h2>
          </div>
          <div className="flex flex-wrap gap-[7px]">
            {PROJECT_FILTERS.map((f) => {
              const on = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="rounded-[7px] border px-[13px] py-[7px] font-mono text-[12px] font-medium transition-all"
                  style={{
                    color: on ? "#fff" : "#3f3a35",
                    background: on ? "#1a1a1a" : "#fff",
                    borderColor: on ? "#1a1a1a" : "#e8e5e0",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </Reveal>

        {!current ? (
          <div className="mt-8 rounded-xl border border-line bg-white py-[46px] text-center text-[14px] text-muted3">
            No projects match this filter.
          </div>
        ) : (
          <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            {/* Focal display */}
            <div className="relative mt-6 min-h-[300px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${filter}-${current.no}`}
                  initial={reduced ? undefined : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -16 }}
                  transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 0.7, 0.2, 1] }}
                  className="grid grid-cols-1 items-center gap-7 md:grid-cols-[1.35fr_1fr]"
                >
                  {/* Image hero */}
                  <div className="relative overflow-hidden rounded-2xl border border-line bg-surface2">
                    <div className="relative h-[clamp(190px,32vh,300px)]">
                      <ImageSlot id={`proj-${current.no}`} placeholder="Drop project image" alt={current.title} />
                    </div>
                    <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
                      {current.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-line bg-white/90 px-[9px] py-1 font-mono text-[10.5px] font-medium text-[#54504a] backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Info — ghost number, title, one-liner, tech, actions */}
                  <div className="relative text-center md:text-left">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-14 right-0 select-none font-extrabold leading-none tracking-[-0.04em] text-[120px] md:left-0 md:right-auto"
                      style={{ color: "color-mix(in srgb, var(--accent) 7%, transparent)" }}
                    >
                      {current.no}
                    </span>
                    <div className="relative">
                      <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">{current.role}</div>
                      <h3 className="mt-2 text-[clamp(24px,3vw,36px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
                        {current.title}
                      </h3>
                      <p className="mx-auto mt-3 max-w-[440px] text-[14.5px] leading-relaxed text-muted md:mx-0">
                        {current.outcome}
                      </p>
                      <div className="mt-4 flex flex-wrap justify-center gap-1.5 md:justify-start">
                        {current.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-line bg-white px-2.5 py-1 font-mono text-[10.5px] text-[#7c776f]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6 flex justify-center gap-2.5 md:justify-start">
                        <a
                          href={current.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#ddd9d3] bg-white px-4 py-2.5 text-[12.5px] font-semibold text-ink transition-colors hover:border-[#c2613f]"
                        >
                          <Github className="h-3.5 w-3.5" strokeWidth={2} />
                          GitHub
                        </a>
                        <a
                          href={current.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-black"
                        >
                          Live Demo ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Selector — numbered dots + counter + arrows */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {visible.map((p, i) => {
                  const on = i === active;
                  return (
                    <button
                      key={p.no}
                      onClick={() => setActive(i)}
                      aria-pressed={on}
                      aria-label={p.title}
                      className={`grid h-8 w-8 place-items-center rounded-lg border font-mono text-[11px] font-semibold tabular-nums transition-colors ${
                        on
                          ? "border-accent bg-[#faf2ee] text-accent"
                          : "border-line bg-white text-muted2 hover:border-[#d9b8a8]"
                      }`}
                    >
                      {p.no}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted3">
                  {String(active + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => go(-1)}
                    aria-label="Previous project"
                    className="grid h-9 w-9 place-items-center rounded-lg border border-[#ddd9d3] bg-white text-ink transition-colors hover:border-accent"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => go(1)}
                    aria-label="Next project"
                    className="grid h-9 w-9 place-items-center rounded-lg border border-[#ddd9d3] bg-white text-ink transition-colors hover:border-accent"
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
