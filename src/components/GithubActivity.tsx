import { Github } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel, SECTION_INNER, SECTION_SLIDE_ROOT } from "./Section";
import {
  PROFILE,
  GH_STATS,
  LANGUAGES,
  COMMITS,
  buildContribGrid,
} from "@/lib/data";

/** Map a 0–4 contribution level to a tinted accent swatch. */
function levelColor(n: number) {
  if (n <= 0) return "#efece8";
  return `color-mix(in srgb, var(--accent) ${n * 22 + 14}%, #fff)`;
}

/** Map a language "shade" to a colour relative to the accent. */
function langColor(shade: number) {
  if (shade === 1) return "var(--accent)";
  if (shade === 0.55) return "color-mix(in srgb, var(--accent) 55%, #fff)";
  if (shade === 0) return "#9a948c";
  return "#d8d3cc";
}

export function GithubActivity() {
  const weeks = buildContribGrid();

  return (
    <section id="github" className={SECTION_SLIDE_ROOT}>
      <div className={SECTION_INNER}>
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>06 / open source</SectionLabel>
          <h2 className="mt-2.5 text-[clamp(26px,3.4vw,38px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#141414]">
            GitHub activity
          </h2>
        </div>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#ddd9d3] bg-white px-[15px] py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-[#c2613f]"
        >
          <Github className="h-3.5 w-3.5" strokeWidth={2} />
          {PROFILE.githubHandle} ↗
        </a>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-3.5 lg:grid-cols-[1.55fr_1fr]">
        {/* Contribution graph + stats */}
        <Reveal delay={0.08} className="rounded-xl border border-line bg-white p-[22px]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[13.5px] font-semibold text-[#3f3a35]">
              Contributions across the last year
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-muted3">
              less
              <span className="flex gap-[3px]">
                {[0, 1, 2, 4].map((n) => (
                  <i
                    key={n}
                    className="inline-block h-2.5 w-2.5 rounded-[2px]"
                    style={{ background: levelColor(n) }}
                  />
                ))}
              </span>
              more
            </span>
          </div>
          {/* Below md the year is wider than the card, so it pans horizontally
              (edge-to-edge, scrollbar hidden) instead of being clipped; at md+
              it fits the wide card and stays static. */}
          <div className="-mx-[22px] flex gap-[3px] overflow-x-auto px-[22px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:overflow-hidden md:px-0">
            {weeks.map((days, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {days.map((n, di) => (
                  <span
                    key={di}
                    className="h-[11px] w-[11px] rounded-[2px]"
                    style={{ background: levelColor(n) }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-[22px] grid grid-cols-2 gap-y-4 border-t border-line pt-[18px] sm:grid-cols-4 sm:gap-y-0">
            {GH_STATS.map((g) => (
              <div key={g.k} className="pr-3.5">
                <div className="text-[22px] font-extrabold tracking-[-0.02em] text-[#141414]">{g.v}</div>
                <div className="mt-0.5 font-mono text-[10.5px] text-muted2">{g.k}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="flex flex-col gap-3.5">
          {/* Languages */}
          <Reveal delay={0.14} className="rounded-xl border border-line bg-white p-5">
            <div className="mb-[13px] text-[13.5px] font-semibold text-[#3f3a35]">Most used languages</div>
            <div className="mb-[13px] flex h-2 overflow-hidden rounded-full border border-line">
              {LANGUAGES.map((l) => (
                <span key={l.name} style={{ width: `${l.pct}%`, background: langColor(l.shade) }} />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {LANGUAGES.map((l) => (
                <div key={l.name} className="flex items-center justify-between text-[12.5px]">
                  <span className="flex items-center gap-2 text-[#3f3a35]">
                    <i className="inline-block h-2 w-2 rounded-full" style={{ background: langColor(l.shade) }} />
                    {l.name}
                  </span>
                  <span className="font-mono text-[11px] text-muted3">{l.pct}%</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Recent commits */}
          <Reveal delay={0.2} className="rounded-xl border border-line bg-white p-5">
            <div className="mb-[13px] text-[13.5px] font-semibold text-[#3f3a35]">Recent commits</div>
            <div className="flex flex-col gap-[11px]">
              {COMMITS.map((c) => (
                <div key={c.msg} className="flex items-start gap-2.5">
                  <span className="mt-1 h-[7px] w-[7px] shrink-0 rounded-full bg-accent" />
                  <div>
                    <div className="font-mono text-[12px] leading-[1.4] text-[#3f3a35]">{c.msg}</div>
                    <div className="mt-0.5 font-mono text-[10.5px] text-faint">
                      {c.repo} · {c.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
      </div>
    </section>
  );
}
