"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading, SECTION_INNER, SECTION_SLIDE_ROOT } from "./Section";
import { TECH_GROUPS } from "@/lib/data";

/**
 * Toolbox — Projects-mirrored composition: skills meters as the focal hero,
 * a compact radar as supporting visual, numbered class index underneath.
 */

const SHORT_NAME: Record<string, string> = {
  "Backend & APIs": "Backend",
  Frontend: "Frontend",
  Mobile: "Mobile",
  Databases: "Databases",
  "Cloud & DevOps": "Cloud",
  "Emerging Tech": "Emerging",
};

const overallOf = (items: { level: number }[]) =>
  Math.round(items.reduce((s, t) => s + t.level, 0) / items.length);

function tierOf(score: number) {
  if (score >= 90) return "S";
  if (score >= 85) return "A";
  if (score >= 80) return "B";
  return "C";
}

/** Compact hexagon radar; active axis lit; labels select a class. */
function RadarWheel({
  groups,
  active,
  onSelect,
}: {
  groups: { short: string; score: number }[];
  active: number;
  onSelect: (i: number) => void;
}) {
  const n = groups.length;
  const R = 88;
  const cx = 130;
  const cy = 120;
  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pointAt = (i: number, r: number) => {
    const a = angleFor(i);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };
  const scorePoints = groups.map((g, i) => pointAt(i, (Math.max(g.score, 4) / 100) * R));

  return (
    <div className="mx-auto w-[260px] max-w-full lg:mx-0">
      <svg width="100%" viewBox="0 0 260 240" className="overflow-visible">
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <polygon
            key={r}
            points={groups.map((_, i) => pointAt(i, R * r).join(",")).join(" ")}
            fill="none"
            stroke="#eae3db"
            strokeWidth="1"
          />
        ))}

        {groups.map((_, i) => {
          const [x, y] = pointAt(i, R);
          const on = i === active;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={on ? "var(--accent)" : "#eae3db"}
              strokeWidth={on ? 1.5 : 1}
              style={{ transition: "stroke .3s ease" }}
            />
          );
        })}

        <polygon
          points={scorePoints.map((p) => p.join(",")).join(" ")}
          fill="color-mix(in srgb, var(--accent) 20%, transparent)"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {scorePoints.map(([x, y], i) => {
          const on = i === active;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={on ? 5 : 3}
              fill="var(--accent)"
              opacity={on ? 1 : 0.7}
              style={{ transition: "r .3s ease" }}
            />
          );
        })}

        {groups.map((g, i) => {
          const [x, y] = pointAt(i, R + 24);
          const on = i === active;
          return (
            <g
              key={g.short}
              role="button"
              aria-label={g.short}
              onMouseEnter={() => onSelect(i)}
              onFocus={() => onSelect(i)}
              onClick={() => onSelect(i)}
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              <rect x={x - 36} y={y - 12} width="72" height="24" fill="transparent" />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-mono"
                fontSize={on ? 11.5 : 10.5}
                fontWeight={on ? 700 : 500}
                fill={on ? "var(--accent)" : "#8a857e"}
                style={{ transition: "fill .3s ease" }}
              >
                {g.short}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Segmented level meter — ten pips, filled proportional to the score. */
function PipMeter({ level }: { level: number }) {
  const N = 10;
  const filled = Math.round(level / 10);
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: N }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.03, duration: 0.2 }}
          className={`h-2 w-2 rounded-[3px] ${i < filled ? "bg-accent" : "bg-[#e4dcd4]"}`}
        />
      ))}
    </div>
  );
}

export function TechStack() {
  const [active, setActive] = useState(0);
  const group = TECH_GROUPS[active];
  const score = overallOf(group.items);
  const radarGroups = TECH_GROUPS.map((g) => ({
    short: SHORT_NAME[g.name] ?? g.name,
    score: overallOf(g.items),
  }));

  return (
    <section id="tech" className={`${SECTION_SLIDE_ROOT} border-t border-line bg-surface`}>
      <div className={SECTION_INNER}>
        <SectionHeading
          label="02 / toolbox"
          title="A modern, full-stack toolkit"
          blurb="Pick a class to see its strengths."
        />

        {/* Focal — skills hero + compact radar (Projects rhythm) */}
        <div className="mt-8 grid max-w-[920px] grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.7fr)] lg:gap-12">
          <div className="relative order-1 min-h-[220px]">
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
                  {SHORT_NAME[group.name] ?? group.name}
                </span>

                <div className="relative z-10">
                  <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
                    <div>
                      <h3 className="text-[clamp(22px,2.6vw,32px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
                        {group.name}
                      </h3>
                      <div className="mt-1 font-mono text-[12.5px] text-muted2">{group.tagline}</div>
                    </div>
                    <div className="flex shrink-0 items-baseline gap-1.5">
                      <span className="font-mono text-[clamp(28px,3.4vw,40px)] font-extrabold leading-none tabular-nums text-accent">
                        {score}
                      </span>
                      <span className="font-mono text-[12px] font-semibold text-muted2">/ {tierOf(score)}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {group.items.map((it) => (
                      <div key={it.name} className="rounded-xl border border-line bg-white p-3.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-[13px] font-semibold text-ink">{it.name}</span>
                          <span className="font-mono text-[12px] tabular-nums text-accent">{it.level}</span>
                        </div>
                        <div className="mt-2.5">
                          <PipMeter level={it.level} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="order-2 flex justify-center lg:justify-end">
            <RadarWheel groups={radarGroups} active={active} onSelect={setActive} />
          </div>
        </div>

        {/* Selector — numbered index, content-width */}
        <div className="mt-8 max-w-[920px] grid grid-cols-3 gap-2 sm:grid-cols-6">
          {TECH_GROUPS.map((g, i) => {
            const on = i === active;
            return (
              <button
                key={g.name}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={on}
                className="group flex flex-col items-start border-t-2 pt-2.5 text-left transition-colors"
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
                  {SHORT_NAME[g.name] ?? g.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
