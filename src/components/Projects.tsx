"use client";

import { useState } from "react";
import { Github } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./Section";
import { ImageSlot } from "./ImageSlot";
import { PROJECTS, PROJECT_FILTERS } from "@/lib/data";

export function Projects() {
  const [filter, setFilter] = useState("All");
  const visible = PROJECTS.filter((p) => filter === "All" || p.tags.includes(filter));

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

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {visible.map((p, i) => (
          <Reveal
            key={p.no}
            as="article"
            delay={(i % 2) * 0.07}
            className="flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-colors hover:border-[#d6d1ca]"
          >
            <div className="relative aspect-video border-b border-line bg-surface2">
              <ImageSlot id={`proj-${p.no}`} placeholder="Drop project image" alt={p.title} />
              <div className="pointer-events-none absolute left-[13px] top-[13px] flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-line bg-white/90 px-[9px] py-1 font-mono text-[10.5px] font-medium text-[#54504a]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-[13px] p-5">
              <div className="flex items-start justify-between gap-3.5">
                <h3 className="text-[19px] font-bold tracking-[-0.02em]">{p.title}</h3>
                <span className="shrink-0 rounded-md border border-line bg-surface px-[9px] py-1 font-mono text-[10.5px] font-medium text-muted2">
                  {p.role}
                </span>
              </div>
              <p className="text-[14px] leading-relaxed text-muted">{p.desc}</p>

              <div className="grid grid-cols-2 overflow-hidden rounded-[9px] border border-line">
                <div className="border-r border-line px-[13px] py-[11px]">
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-faint">Problem</div>
                  <div className="mt-1 text-[12px] leading-[1.4] text-[#54504a]">{p.problem}</div>
                </div>
                <div className="px-[13px] py-[11px]">
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-faint">Outcome</div>
                  <div className="mt-1 text-[12px] font-semibold leading-[1.4] text-accent">{p.outcome}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
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
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#ddd9d3] bg-white py-2.5 text-[12.5px] font-semibold text-ink transition-colors hover:border-[#c2613f]"
                >
                  <Github className="h-3.5 w-3.5" strokeWidth={2} />
                  GitHub
                </a>
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-black"
                >
                  Live Demo ↗
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
