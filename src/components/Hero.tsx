"use client";

import { Download } from "lucide-react";
import { Reveal } from "./Reveal";
import { SECTION_INNER, SECTION_SLIDE_ROOT } from "./Section";
import { useFullPageScroll } from "@/lib/fullPageScroll";
import { PROFILE, HERO_STATS, CLIENTS } from "@/lib/data";

export function Hero() {
  const { goToId } = useFullPageScroll();

  return (
    <section id="home" className={SECTION_SLIDE_ROOT}>
      <div className={SECTION_INNER}>
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Left — copy */}
        <div className="text-left">
          {/* Eyebrow */}
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11.5px] font-medium text-muted2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {PROFILE.role}
            </span>
          </Reveal>

          {/* Headline */}
          <Reveal delay={0.06} as="div">
            <h1 className="mt-5 max-w-[600px] text-[clamp(32px,5vw,54px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink text-pretty">
              Good software should feel simple{" "}
              <span style={{ color: "var(--accent)" }}>— even when the engineering isn&apos;t</span>.
            </h1>
          </Reveal>

          <Reveal delay={0.12} as="div">
            <p className="mt-5 max-w-[500px] text-[16px] leading-relaxed text-muted text-pretty">
              I build full-stack products and intelligent agents that turn complex operations into effortless workflows.
            </p>
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
          <Reveal delay={0.24} className="mt-11 flex flex-wrap gap-x-9 gap-y-5">
            {HERO_STATS.map((s, i) => (
              <div key={s.k} className={i > 0 ? "border-l border-line pl-9" : ""}>
                <div className="text-[26px] font-extrabold tracking-[-0.02em] text-ink">{s.v}</div>
                <div className="mt-1 font-mono text-[11.5px] text-muted2">{s.k}</div>
              </div>
            ))}
          </Reveal>
        </div>

        {/* Right — terminal visual (omitted below lg: stacked it would not fit one screen at full type size) */}
        <div className="relative hidden lg:block">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-10 -inset-y-16 -z-10 opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(45% 45% at 60% 35%, rgba(194,97,63,.28), transparent 70%)",
            }}
          />

          <Reveal
            delay={0.1}
            className="mx-auto w-full max-w-[460px] overflow-hidden rounded-[13px] border border-[#2a2a2a] bg-[#141414] text-left lg:mx-0 lg:ml-auto"
            style={{ boxShadow: "0 24px 60px rgba(20,20,20,.28)" }}
          >
            <div className="flex items-center gap-[7px] border-b border-[#2a2a2a] bg-[#1c1c1c] px-4 py-3">
              <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
              <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
              <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
              <span className="ml-1.5 font-mono text-[11.5px] text-muted2">baraka@dev ~ portfolio</span>
            </div>
            <div className="px-6 py-5 font-mono text-[13.5px] leading-[2] text-[#b8b2a8]">
              <div>
                <span style={{ color: "#e0855f" }}>$</span> <span className="text-[#f5f3f0]">whoami</span>
              </div>
              <div className="text-muted2">Baraka Nampellah — Full-Stack Software Engineer</div>
              <div className="mt-2">
                <span style={{ color: "#e0855f" }}>$</span> <span className="text-[#f5f3f0]">cat</span> focus.txt
              </div>
              <div className="text-[15.5px] font-medium leading-[1.5] text-[#f5f3f0]">
                Scalable backends · Mobile apps · <span style={{ color: "#e0855f" }}>AI-ready systems</span>
              </div>
              <div className="mt-2">
                <span style={{ color: "#e0855f" }}>$</span> <span className="text-[#f5f3f0]">cat</span> stack.json
              </div>
              <div className="break-all text-muted2">{PROFILE.stackJson}</div>
              <div className="mt-2">
                <span style={{ color: "#e0855f" }}>$</span> <span className="text-[#f5f3f0]">status</span> --available{" "}
                <span style={{ color: "#3fcf7f" }}>true</span>
                <span className="ml-[5px] inline-block h-[15px] w-2 translate-y-[2px] animate-blink bg-[#f5f3f0] align-baseline" />
              </div>
            </div>
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
