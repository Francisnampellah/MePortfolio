"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./Section";
import { SKILL_RINGS, SKILL_BARS } from "@/lib/data";

const CIRC = 251.33; // 2π·40

function Ring({ level, label, name, sub }: { level: number; label: string; name: string; sub: string }) {
  const [shown, setShown] = useState(false);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center gap-[13px] rounded-xl border border-line bg-white p-[22px]">
      <div className="relative h-24 w-24">
        <svg ref={ref} width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
          <circle cx="48" cy="48" r="40" fill="none" stroke="#efece8" strokeWidth="7" />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={shown ? CIRC * (1 - level / 100) : CIRC}
            style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(.2,.7,.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-[20px] font-extrabold text-[#141414]">
          {label}
        </div>
      </div>
      <div className="text-center">
        <div className="text-[14.5px] font-bold">{name}</div>
        <div className="mt-0.5 font-mono text-[10.5px] text-muted3">{sub}</div>
      </div>
    </div>
  );
}

function Bar({ name, level }: { name: string; level: number }) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[13.5px] font-medium text-[#3f3a35]">{name}</span>
        <span className="font-mono text-[11px] text-muted3">{level}%</span>
      </div>
      <div className="h-[5px] overflow-hidden rounded-full bg-[#efece8]">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-[1100ms] ease-[cubic-bezier(.2,.7,.2,1)]"
          style={{ width: shown ? `${level}%` : 0 }}
        />
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative z-[1] border-t border-line bg-surface">
      <div className="mx-auto max-w-page px-6 py-16">
      <Reveal>
        <SectionLabel>05 / strengths</SectionLabel>
        <h2 className="mt-2.5 text-[clamp(26px,3.4vw,38px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#141414]">
          Where I&apos;m strongest
        </h2>
      </Reveal>

      <div className="mt-[34px] grid grid-cols-[repeat(auto-fill,minmax(min(250px,100%),1fr))] gap-3.5">
        {SKILL_RINGS.map((r) => (
          <Reveal key={r.name}>
            <Ring {...r} />
          </Reveal>
        ))}
      </div>

      <div className="mt-[18px] grid grid-cols-[repeat(auto-fill,minmax(min(500px,100%),1fr))] gap-x-9 gap-y-4">
        {SKILL_BARS.map((s) => (
          <Reveal key={s.name}>
            <Bar {...s} />
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}
