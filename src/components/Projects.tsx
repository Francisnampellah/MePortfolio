"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Github } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./Section";
import { ImageSlot } from "./ImageSlot";
import { PROJECTS, PROJECT_FILTERS } from "@/lib/data";

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
    const t = setInterval(() => {
      setActive((a) => (a + 1) % visible.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, reduced, visible.length]);

  const go = (delta: number) =>
    setActive((a) => (a + delta + visible.length) % visible.length);

  return (
    <section id="projects" className="relative z-[1] mx-auto max-w-page px-6 py-16">
      <Reveal className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <SectionLabel>02 / selected work</SectionLabel>
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
        <Reveal
          delay={0.08}
          className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Left — carousel */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={current.no}
                  initial={reduced ? undefined : { opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduced ? undefined : { opacity: 0, x: -28 }}
                  transition={{ duration: reduced ? 0 : 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                  className="flex flex-1 flex-col"
                >
                  <div className="relative aspect-video border-b border-line bg-surface2">
                    <ImageSlot id={`proj-${current.no}`} placeholder="Drop project image" alt={current.title} />
                    <div className="pointer-events-none absolute left-[13px] top-[13px] flex flex-wrap gap-1.5">
                      {current.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-line bg-white/90 px-[9px] py-1 font-mono text-[10.5px] font-medium text-[#54504a]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-[13px] p-6">
                    <div className="flex items-start justify-between gap-3.5">
                      <h3 className="text-[21px] font-bold tracking-[-0.02em]">{current.title}</h3>
                      <span className="shrink-0 rounded-md border border-line bg-surface px-[9px] py-1 font-mono text-[10.5px] font-medium text-muted2">
                        {current.role}
                      </span>
                    </div>
                    <p className="text-[14.5px] leading-relaxed text-muted">{current.desc}</p>

                    <div className="grid grid-cols-2 overflow-hidden rounded-[9px] border border-line">
                      <div className="border-r border-line px-[13px] py-[11px]">
                        <div className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-faint">Problem</div>
                        <div className="mt-1 text-[12px] leading-[1.4] text-[#54504a]">{current.problem}</div>
                      </div>
                      <div className="px-[13px] py-[11px]">
                        <div className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-faint">Outcome</div>
                        <div className="mt-1 text-[12px] font-semibold leading-[1.4] text-accent">{current.outcome}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {current.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-line bg-surface px-2 py-[3px] font-mono text-[10.5px] text-[#7c776f]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex gap-[9px] pt-1">
                      <a
                        href={current.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#ddd9d3] bg-white py-2.5 text-[12.5px] font-semibold text-ink transition-colors hover:border-[#c2613f]"
                      >
                        <Github className="h-3.5 w-3.5" strokeWidth={2} />
                        GitHub
                      </a>
                      <a
                        href={current.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-black"
                      >
                        Live Demo ↗
                      </a>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between border-t border-line px-5 py-3.5">
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

          {/* Right — full project list */}
          <div className="flex flex-col gap-2 lg:h-full lg:overflow-y-auto lg:pr-1">
            {visible.map((p, i) => {
              const isActive = i === active;
              return (
                <button
                  key={p.no}
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                    isActive ? "border-accent bg-[#faf2ee]" : "border-line bg-white hover:border-[#d6d1ca]"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-[8px] font-mono text-[11px] font-semibold ${
                      isActive ? "bg-ink text-white" : "bg-surface text-muted2"
                    }`}
                  >
                    {p.no}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-bold tracking-[-0.01em] text-ink">{p.title}</div>
                    <div className="mt-0.5 truncate font-mono text-[10.5px] text-muted3">{p.role}</div>
                  </div>
                  {isActive ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> : null}
                </button>
              );
            })}
          </div>
        </Reveal>
      )}
    </section>
  );
}
