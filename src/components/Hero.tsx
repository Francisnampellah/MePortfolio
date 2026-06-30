"use client";

import { Download } from "lucide-react";
import { Reveal } from "./Reveal";
import { ImageSlot } from "./ImageSlot";
import { scrollToId } from "@/lib/useScroll";
import { PROFILE, HERO_STATS, CLIENTS } from "@/lib/data";

export function Hero() {
  return (
    <section id="home" className="relative z-[1] mx-auto max-w-page px-6 pb-[72px] pt-24">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <Reveal
          className="relative h-[104px] w-[104px] rounded-full p-[3px]"
          style={{ background: "var(--accent)", boxShadow: "0 8px 26px rgba(194,97,63,.22)" }}
        >
          <div className="h-full w-full overflow-hidden rounded-full bg-surface2">
            <ImageSlot id="hero-photo" rounded="full" placeholder="Drop photo" alt="Baraka Nampellah" defaultSrc="/baraka.jpg" />
          </div>
          <span className="absolute bottom-1.5 right-1 h-[18px] w-[18px] rounded-full border-[3px] border-white bg-[#2e9e63]" />
        </Reveal>

        <Reveal delay={0.05} className="mt-[18px] font-mono text-[12.5px] tracking-[0.02em] text-muted2">
          {PROFILE.name} · {PROFILE.location.split(",")[0]}
        </Reveal>

        {/* Terminal as the centerpiece */}
        <Reveal
          delay={0.1}
          className="mx-auto mt-[22px] w-full max-w-[680px] overflow-hidden rounded-[13px] border border-[#2a2a2a] bg-[#141414] text-left"
          style={{ boxShadow: "0 18px 44px rgba(20,20,20,.28)" }}
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
            <div className="text-muted2">{PROFILE.stackJson}</div>
            <div className="mt-2">
              <span style={{ color: "#e0855f" }}>$</span> <span className="text-[#f5f3f0]">status</span> --available{" "}
              <span style={{ color: "#3fcf7f" }}>true</span>
              <span className="ml-[5px] inline-block h-[15px] w-2 translate-y-[2px] animate-blink bg-[#f5f3f0] align-baseline" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16} as="div">
          <p className="mx-auto mt-6 max-w-[580px] text-[16px] leading-relaxed text-muted text-pretty">
            {PROFILE.intro}
          </p>
        </Reveal>

        <Reveal delay={0.22} className="mt-[26px] flex flex-wrap justify-center gap-3">
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("projects");
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
        <Reveal delay={0.3} className="mt-[34px] flex w-full flex-wrap justify-center overflow-hidden rounded-[11px] border border-line sm:w-auto">
          {HERO_STATS.map((s, i) => (
            <div
              key={s.k}
              className={`min-w-[120px] flex-1 px-[30px] py-[18px] text-center ${
                i < HERO_STATS.length - 1 ? "border-r border-line" : ""
              }`}
            >
              <div className="text-[26px] font-extrabold tracking-[-0.02em] text-[#141414]">{s.v}</div>
              <div className="mt-1 font-mono text-[11.5px] text-muted2">{s.k}</div>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Companies */}
      <Reveal delay={0.36} className="mt-16 border-t border-line pt-7">
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
    </section>
  );
}
