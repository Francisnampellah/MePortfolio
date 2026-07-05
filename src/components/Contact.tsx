"use client";

import { useState } from "react";
import { Check, Download } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./Section";
import { ICONS } from "@/lib/icons";
import { PROFILE, CONTACT_LINKS, PROJECT_TYPES } from "@/lib/data";

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="relative z-[1] mx-auto flex w-full max-w-page flex-1 scroll-mt-16 flex-col justify-center px-6 py-6">
      <div className="relative">
        {/* Ghost title behind the heading — same device as the other sections */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-14 -left-1 z-0 select-none font-extrabold uppercase leading-none tracking-[-0.04em] text-[clamp(70px,12vw,150px)]"
          style={{ color: "color-mix(in srgb, var(--accent) 7%, transparent)" }}
        >
          Contact
        </span>

        <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left — copy + links */}
          <Reveal>
            <SectionLabel>08 / contact</SectionLabel>
            <h2 className="mt-2.5 text-[clamp(26px,3.4vw,36px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#141414]">
              Let&apos;s build something exceptional.
            </h2>
            <p className="mt-3 max-w-[400px] text-[15px] leading-relaxed text-muted">
              Have a role, a project, or an idea? I reply within a day.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#c8e6d4] bg-[#eaf6ef] px-3.5 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2e9e63] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2e9e63]" />
              </span>
              <span className="text-[12.5px] font-semibold text-[#1f7a4d]">Available for new projects</span>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {CONTACT_LINKS.map((c) => {
                const Icon = ICONS[c.icon];
                return (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-2.5 transition-colors hover:border-[#d9b8a8]"
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0 text-muted2 transition-colors group-hover:text-accent" strokeWidth={2} />
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-faint">{c.label}</div>
                      <div className="truncate text-[13.5px] font-semibold text-ink">{c.value}</div>
                    </div>
                  </a>
                );
              })}
              <a
                href={PROFILE.cvUrl}
                download
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-ink p-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-black"
              >
                <Download className="h-4 w-4" strokeWidth={2} />
                Download my CV
              </a>
            </div>
          </Reveal>

          {/* Right — form */}
          <Reveal delay={0.12}>
            {sent ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-white text-center">
                <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-[#2e9e63] text-white">
                  <Check className="h-6 w-6" strokeWidth={2.5} />
                </span>
                <h3 className="text-[19px] font-bold">Message sent</h3>
                <p className="max-w-[250px] text-[13.5px] text-muted">
                  Thanks for reaching out — I&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="flex flex-col gap-3.5 rounded-2xl border border-line bg-white p-5 sm:p-6"
              >
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="font-mono text-[11px] text-muted2">name</span>
                    <input
                      required
                      placeholder="Your name"
                      className="rounded-[9px] border border-[#ddd9d3] bg-surface px-3.5 py-3 text-[14px] text-ink outline-none transition-colors focus:border-accent focus:bg-white"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="font-mono text-[11px] text-muted2">email</span>
                    <input
                      required
                      type="email"
                      placeholder="you@company.com"
                      className="rounded-[9px] border border-[#ddd9d3] bg-surface px-3.5 py-3 text-[14px] text-ink outline-none transition-colors focus:border-accent focus:bg-white"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[11px] text-muted2">project type</span>
                  <select className="rounded-[9px] border border-[#ddd9d3] bg-surface px-3.5 py-3 text-[14px] text-ink outline-none focus:border-accent focus:bg-white">
                    {PROJECT_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[11px] text-muted2">message</span>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell me a little about what you're building…"
                    className="resize-y rounded-[9px] border border-[#ddd9d3] bg-surface px-3.5 py-3 text-[14px] text-ink outline-none transition-colors focus:border-accent focus:bg-white"
                  />
                </label>
                <button
                  type="submit"
                  className="mt-0.5 rounded-[9px] bg-ink p-3.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-black"
                >
                  Send message →
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
