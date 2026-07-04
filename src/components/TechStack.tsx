"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./Section";
import { ICONS } from "@/lib/icons";
import { TECH_GROUPS } from "@/lib/data";

function overallOf(items: { level: number }[]) {
  return Math.round(items.reduce((s, t) => s + t.level, 0) / items.length);
}

export function TechStack() {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true });

  return (
    <section id="tech" className="relative z-[1] mx-auto max-w-page px-6 py-16">
      <SectionHeading
        label="01 / toolbox"
        title="A modern, full-stack toolkit"
        blurb="Type-safe from database to UI — the same tools I reach for across mobile, web, and backend systems."
      />

      <div className="mt-[34px] grid grid-cols-[repeat(auto-fill,minmax(min(500px,100%),500px))] items-start gap-3.5">
        {TECH_GROUPS.map((g, i) => {
          const Icon = ICONS[g.icon];
          const overall = overallOf(g.items);
          const isOpen = !!open[i];
          return (
            <Reveal
              key={g.name}
              delay={(i % 2) * 0.05}
              className="overflow-hidden rounded-xl border border-line bg-white transition-colors hover:border-[#d6d1ca]"
            >
              <button
                onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3.5 bg-white px-[18px] py-4 text-left"
              >
                <Icon className="h-[22px] w-[22px] shrink-0 text-ink" strokeWidth={2} />
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-bold tracking-[-0.01em] text-ink">{g.name}</div>
                  <div className="font-mono text-[11px] text-muted3">{g.tagline}</div>
                </div>
                <div className="flex shrink-0 items-center gap-[11px]">
                  <div className="hidden h-[5px] w-[72px] overflow-hidden rounded-full bg-[#efece8] sm:block">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${overall}%` }} />
                  </div>
                  <span className="min-w-[34px] font-mono text-[12.5px] font-semibold text-ink">{overall}%</span>
                  <ChevronDown
                    className="h-3.5 w-3.5 text-muted3 transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </div>
              </button>

              <div
                className="overflow-hidden transition-all duration-[380ms] ease-[cubic-bezier(.2,.7,.2,1)]"
                style={{ maxHeight: isOpen ? 520 : 0, opacity: isOpen ? 1 : 0 }}
              >
                <div className="flex flex-col gap-[13px] px-[18px] pb-5 pt-0.5 sm:pl-[54px]">
                  {g.items.map((t) => (
                    <div key={t.name}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[13.5px] font-medium text-[#3f3a35]">{t.name}</span>
                        <span className="font-mono text-[10.5px] text-faint">{t.label}</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-[#efece8]">
                        <div
                          className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-[cubic-bezier(.2,.7,.2,1)]"
                          style={{ width: isOpen ? `${t.level}%` : 0 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
