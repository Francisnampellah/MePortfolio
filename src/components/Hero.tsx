"use client";

import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import { Reveal } from "./Reveal";
import { SECTION_INNER, SECTION_SLIDE_ROOT } from "./Section";
import { useFullPageScroll } from "@/lib/fullPageScroll";
import { PROFILE, HERO_STATS, CLIENTS } from "@/lib/data";

import { HeroModelWait } from "./HeroModelWait";

const HeroToolChest = dynamic(
  () => import("./HeroToolChest").then((m) => m.HeroToolChest),
  {
    ssr: false,
    loading: () => (
      <div className="relative mx-auto aspect-square h-auto w-full max-w-[560px] lg:mx-0 lg:ml-auto lg:max-w-none lg:w-full">
        <HeroModelWait progress={6} message="Just a moment…" />
      </div>
    ),
  }
);

export function Hero() {
  const { goToId } = useFullPageScroll();

  return (
    <section id="home" className={SECTION_SLIDE_ROOT}>
      <div className={SECTION_INNER}>
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Left — copy */}
        <div className="text-left">
          {/* Headline */}
          <Reveal as="div">
            <h1 className="max-w-[600px] text-[clamp(32px,5vw,54px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink text-pretty">
              Good Product should feel simple{" "}
              <span style={{ color: "var(--accent)" }}>even when the engineering isn&apos;t</span>.
            </h1>
          </Reveal>

          <Reveal delay={0.12} as="div">
            <p className="mt-5 max-w-[500px] text-[16px] leading-relaxed text-muted text-pretty">
             A software engineer who believes good design and simple solutions is how we solve real problems.            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={0.18} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                goToId("projects");
              }}
              className="inline-flex items-center gap-2 rounded-[9px] bg-ink px-[22px] py-[13px] text-[14.5px] font-semibold text-white transition-colors hover:bg-black"
            >
              View Projects <span>→</span>
            </a>
            <a
              href={PROFILE.cvUrl}
              download
              className="inline-flex items-center gap-2 rounded-[9px] border border-[#ddd9d3] bg-white px-5 py-[13px] text-[14.5px] font-semibold text-ink transition-colors hover:border-accent"
            >
              <Download className="h-4 w-4" strokeWidth={2} />
              Download CV
            </a>
          </Reveal>

          {/* Stats */}
          <Reveal delay={0.24} className="mt-10 flex flex-wrap gap-x-8 gap-y-5 sm:mt-11 sm:gap-x-9">
            {HERO_STATS.map((s, i) => (
              <div key={s.k} className={i > 0 ? "sm:border-l sm:border-line sm:pl-9" : ""}>
                <div className="text-[26px] font-extrabold tracking-[-0.02em] text-ink">{s.v}</div>
                <div className="mt-1 font-mono text-[11.5px] text-muted2">{s.k}</div>
              </div>
            ))}
          </Reveal>
        </div>

        {/* Right — rotating clock */}
        <div className="relative hidden lg:block">
          <Reveal delay={0.1}>
            <HeroToolChest />
          </Reveal>
        </div>
      </div>

      {/* Companies — omitted on very short screens rather than shrinking anything */}
      <Reveal delay={0.4} className="mt-12 border-t border-line pt-7 [@media(max-height:720px)]:hidden">
        <div className="mb-[18px] text-center font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
          Teams I&apos;ve built with
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-3">
          {CLIENTS.map((c) => (
            <span key={c} className="text-[16px] font-bold tracking-[-0.01em] text-muted3">
              {c}
            </span>
          ))}
        </div>
      </Reveal>
      </div>
    </section>
  );
}
