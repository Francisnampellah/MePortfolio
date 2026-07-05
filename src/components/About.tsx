"use client";

import { Reveal } from "./Reveal";
import { SectionLabel } from "./Section";
import { ImageSlot } from "./ImageSlot";
import { PROFILE } from "@/lib/data";

/**
 * Abstract identity slide (paired with Hero): a big faded ghost first-name
 * behind a concise statement, three minimal fact tiles, and the portrait as
 * the visual. Deliberately low-detail — the intro line does the talking.
 */

const FIRST_NAME = PROFILE.name.split(" ")[0];

const FACTS = [
  { k: "based in", v: PROFILE.location },
  { k: "focus", v: "Backends · Mobile · AI" },
  { k: "experience", v: "2+ years shipping" },
];

export function About() {
  return (
    <section
      id="about"
      className="relative z-[1] flex min-h-[calc(100dvh-4rem)] w-full shrink-0 scroll-mt-16 flex-col justify-center overflow-x-clip py-14 md:h-[var(--slide-h)] md:min-h-0 md:overflow-hidden md:py-0"
    >
      <div className="mx-auto w-full max-w-page px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          {/* Left — statement + facts, ghost name behind */}
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-16 -left-1 select-none whitespace-nowrap font-extrabold uppercase leading-none tracking-[-0.04em] text-[clamp(88px,15vw,180px)]"
              style={{ color: "color-mix(in srgb, var(--accent) 7%, transparent)" }}
            >
              {FIRST_NAME}
            </span>

            <div className="relative z-10">
              <Reveal>
                <SectionLabel>01 / about</SectionLabel>
              </Reveal>
              <Reveal delay={0.06} as="div">
                <p className="mt-3 max-w-[560px] text-[clamp(19px,2.4vw,28px)] font-bold leading-[1.3] tracking-[-0.02em] text-ink text-pretty">
                  {PROFILE.intro}
                </p>
              </Reveal>

              <Reveal delay={0.14} className="mt-8 grid max-w-[520px] grid-cols-1 gap-2.5 sm:grid-cols-3">
                {FACTS.map((f) => (
                  <div key={f.k} className="rounded-xl border border-line bg-white px-4 py-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">{f.k}</div>
                    <div className="mt-1 text-[13px] font-semibold leading-tight text-ink">{f.v}</div>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>

          {/* Right — portrait */}
          <Reveal delay={0.1} className="relative mx-auto w-full max-w-[380px]">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 opacity-70 blur-3xl"
              style={{ background: "radial-gradient(50% 50% at 55% 40%, rgba(194,97,63,.24), transparent 70%)" }}
            />
            <div className="overflow-hidden rounded-[20px] border border-line bg-surface2">
              <div className="relative aspect-[4/5]">
                <ImageSlot id="hero-photo" placeholder="Portrait" alt={PROFILE.name} defaultSrc="/baraka.jpg" />
              </div>
            </div>
            <div
              className="absolute -bottom-4 left-4 flex items-center gap-2.5 rounded-[11px] border border-line bg-white px-4 py-2.5"
              style={{ boxShadow: "0 14px 34px rgba(20,20,20,.12)" }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2e9e63] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2e9e63]" />
              </span>
              <span className="text-[12.5px] font-semibold text-ink">Available for new projects</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
