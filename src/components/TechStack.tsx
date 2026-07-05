"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./Section";
import { ICONS } from "@/lib/icons";
import { TECH_GROUPS } from "@/lib/data";
import {
  ACTIVE_SPRING,
  ConnectorBridge,
  selectionGlow,
  useConnector,
  useSelectionPulse,
} from "@/lib/connector";

const GAP = 14; // px — matches the grid's gap-3.5

function overallOf(items: { level: number }[]) {
  return Math.round(items.reduce((s, t) => s + t.level, 0) / items.length);
}

function tierOf(score: number) {
  if (score >= 90) return "S";
  if (score >= 85) return "A";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  return "C";
}

const SHORT_NAME: Record<string, string> = {
  "Backend & APIs": "Backend",
  Frontend: "Frontend",
  Mobile: "Mobile",
  Databases: "DB",
  "Cloud & DevOps": "Cloud",
  "Emerging Tech": "Emerging",
};

const RANK_STYLE: Record<string, string> = {
  expert: "border-accent text-accent bg-[#faf2ee]",
  advanced: "border-[#e2c9b8] text-[#8a5a3c] bg-white",
  proficient: "border-line text-muted2 bg-white",
  foundations: "border-line text-muted3 bg-white",
};

/** Hexagonal radar chart plotting each discipline's overall score — a game-style stat wheel. */
function StatRadar({
  groups,
  active,
}: {
  groups: { short: string; score: number }[];
  active: number;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 50);
    return () => clearTimeout(t);
  }, []);

  const n = groups.length;
  const R = 128;
  const cx = 170;
  const cy = 160;
  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pointAt = (i: number, r: number) => {
    const a = angleFor(i);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };
  const scorePoints = groups.map((g, i) => pointAt(i, (Math.max(g.score, 4) / 100) * R));

  return (
    // rendered 1:1 with the 340×330 viewBox so the chart labels keep their exact type size
    <div className="mx-auto w-[340px] max-w-full">
      <svg width="100%" viewBox="0 0 340 330" className="overflow-visible">
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <polygon
            key={r}
            points={groups.map((_, i) => pointAt(i, R * r).join(",")).join(" ")}
            fill="none"
            stroke="#eeeae4"
            strokeWidth="1"
          />
        ))}
        {groups.map((_, i) => {
          const [x, y] = pointAt(i, R);
          const isActive = i === active;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={isActive ? "var(--accent)" : "#eeeae4"}
              strokeWidth={isActive ? 1.5 : 1}
            />
          );
        })}
        <polygon
          points={scorePoints.map((p) => p.join(",")).join(" ")}
          fill="color-mix(in srgb, var(--accent) 22%, transparent)"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinejoin="round"
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            transform: shown ? "scale(1)" : "scale(0)",
            opacity: shown ? 1 : 0,
            transition: "transform 1s cubic-bezier(.2,.7,.2,1), opacity .5s ease",
          }}
        />
        {scorePoints.map(([x, y], i) => {
          const isActive = i === active;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={shown ? (isActive ? 5.5 : 3.5) : 0}
              fill={isActive ? "var(--accent)" : "var(--accent)"}
              opacity={isActive ? 1 : 0.75}
              style={{ transition: `r .3s ease ${0.55 + i * 0.05}s` }}
            />
          );
        })}
        {groups.map((g, i) => {
          const [x, y] = pointAt(i, R + 34);
          const isActive = i === active;
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-mono"
              fontSize={isActive ? 13.5 : 12}
              fontWeight={isActive ? 700 : 500}
              fill={isActive ? "var(--accent)" : "#8a857e"}
            >
              {g.short}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function SkillDial({ name, level, label }: { name: string; level: number; label: string }) {
  const [shown, setShown] = useState(false);
  const CIRC = 2 * Math.PI * 26;

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 30);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2.5 rounded-xl border border-line bg-surface p-4">
      <div className="relative h-16 w-16">
        <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
          <circle cx="32" cy="32" r="26" fill="none" stroke="#e8e5e0" strokeWidth="5" />
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={shown ? CIRC * (1 - level / 100) : CIRC}
            style={{ transition: "stroke-dashoffset .9s cubic-bezier(.2,.7,.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center font-mono text-[13px] font-extrabold tabular-nums text-ink">
          {level}
        </div>
      </div>
      <div className="text-center">
        <div className="text-[12px] font-semibold leading-tight text-ink">{name}</div>
        <span
          className={`mt-1 inline-block rounded-full border px-1.5 py-[1px] font-mono text-[8.5px] font-semibold uppercase tracking-[0.04em] ${
            RANK_STYLE[label] ?? RANK_STYLE.proficient
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export function TechStack() {
  const [active, setActive] = useState(0);
  const pulse = useSelectionPulse(active);
  const { listRef, itemRefs, rect } = useConnector(active, "gutter-after-list", GAP);

  const overalls = TECH_GROUPS.map((g) => overallOf(g.items));
  const avgPower = Math.round(overalls.reduce((s, v) => s + v, 0) / overalls.length);
  const totalSkills = TECH_GROUPS.reduce((s, g) => s + g.items.length, 0);
  const activeGroup = TECH_GROUPS[active];

  return (
    <section
      id="tech"
      className="relative z-[1] flex min-h-[calc(100dvh-4rem)] w-full shrink-0 scroll-mt-16 flex-col justify-center overflow-x-clip border-t border-line bg-surface py-14 md:h-[calc(100dvh-4rem)] md:overflow-hidden md:py-0"
    >
      <div className="mx-auto w-full max-w-page px-6">
        <SectionHeading
          label="01 / toolbox"
          title="A modern, full-stack toolkit"
          blurb="Type-safe from database to UI — pick a class to see its stat breakdown."
        />

        <div className="mt-[18px] flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted2">
          <span className="rounded-full border border-line bg-white px-3 py-1">AVG POWER {avgPower}</span>
          <span className="rounded-full border border-line bg-white px-3 py-1">{TECH_GROUPS.length} CLASSES</span>
          <span className="rounded-full border border-line bg-white px-3 py-1">{totalSkills} SKILLS TRACKED</span>
        </div>

        <div className="relative mt-[22px] grid grid-cols-1 gap-3.5 md:grid-cols-[260px_1fr] md:items-stretch">
          {/* Left — simple class selector: horizontal scroller on mobile, vertical list from md up */}
          <div
            ref={listRef}
            className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0"
          >
            {TECH_GROUPS.map((g, i) => {
              const Icon = ICONS[g.icon];
              const overall = overallOf(g.items);
              const isActive = i === active;
              return (
                <Reveal key={g.name} delay={(i % 2) * 0.04} className="shrink-0 md:shrink">
                  <button
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className={`relative flex w-[230px] items-center gap-3 overflow-hidden rounded-xl border px-3.5 py-3 text-left transition-colors md:w-full ${
                      isActive ? "border-accent" : "border-line bg-white hover:border-[#d6d1ca]"
                    }`}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="tech-active-pill"
                        className="absolute inset-0 bg-[#faf2ee]"
                        transition={ACTIVE_SPRING}
                      />
                    ) : null}
                    <span
                      className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-[9px] border ${
                        isActive ? "border-accent bg-white" : "border-line bg-surface"
                      }`}
                    >
                      <Icon className="h-4 w-4" style={{ color: isActive ? "var(--accent)" : "#1a1a1a" }} strokeWidth={2} />
                    </span>
                    <span className="relative z-10 min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-bold tracking-[-0.01em] text-ink">{g.name}</span>
                      <span className="block truncate font-mono text-[10px] text-muted3">{g.tagline}</span>
                    </span>
                    <span className="relative z-10 shrink-0 text-right">
                      <span className="block font-mono text-[13px] font-extrabold tabular-nums text-ink">{overall}</span>
                      <span className="block font-mono text-[8px] uppercase tracking-[0.06em] text-muted3">
                        {tierOf(overall)}
                      </span>
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* Right — bigger radar + the selected class's skill breakdown */}
          <Reveal delay={0.08}>
            <div className="h-full rounded-xl border bg-white p-5 sm:p-6" style={selectionGlow(pulse)}>
              {/* radar beside the breakdown (stacked below lg) so the panel stays one screen tall */}
              <div className="grid h-full grid-cols-1 items-center gap-5 lg:grid-cols-[340px_1fr]">
                <StatRadar
                  active={active}
                  groups={TECH_GROUPS.map((g) => ({ short: SHORT_NAME[g.name] ?? g.name, score: overallOf(g.items) }))}
                />

                <div className="border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[15px] font-bold tracking-[-0.01em] text-ink">{activeGroup.name}</div>
                      <div className="font-mono text-[10.5px] text-muted3">{activeGroup.tagline}</div>
                    </div>
                    <span className="shrink-0 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[10.5px] font-semibold text-muted2">
                      LV {overallOf(activeGroup.items)}
                    </span>
                  </div>
                  <div key={active} className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                    {activeGroup.items.map((t) => (
                      <SkillDial key={t.name} name={t.name} level={t.level} label={t.label} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Connector — extends the selected class's border into the stat panel */}
          <ConnectorBridge rect={rect} gap={GAP} />
        </div>
      </div>
    </section>
  );
}
