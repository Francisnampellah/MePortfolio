"use client";

import { useState } from "react";
import { Check, Download } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./Section";
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
            {/* Contact details as a monospace receipt — itemised lines with
                dotted leaders instead of cards. */}
            <div className="mt-6 max-w-[420px] font-mono text-[12.5px] leading-none text-ink">
              <div className="flex items-center justify-between border-b border-dashed border-[#d8d2c9] pb-2.5 text-[10px] uppercase tracking-[0.14em] text-faint">
                <span>Baraka Nampellah</span>
                <span>Reach me</span>
              </div>

              <ul className="flex flex-col gap-2.5 py-3.5">
                {CONTACT_LINKS.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline gap-1"
                    >
                      <span className="shrink-0 uppercase tracking-[0.06em] text-muted2 transition-colors group-hover:text-accent">
                        {c.label}
                      </span>
                      <span
                        aria-hidden
                        className="min-w-[14px] flex-1 -translate-y-[0.28em] border-b border-dotted border-[#cfc8bd]"
                      />
                      <span className="max-w-[60%] truncate font-semibold text-ink transition-colors group-hover:text-accent">
                        {c.value}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-2.5 border-t border-dashed border-[#d8d2c9] py-3.5">
                <div className="flex items-baseline gap-1">
                  <span className="shrink-0 uppercase tracking-[0.06em] text-muted2">Status</span>
                  <span aria-hidden className="min-w-[14px] flex-1 -translate-y-[0.28em] border-b border-dotted border-[#cfc8bd]" />
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#1f7a4d]">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2e9e63] opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2e9e63]" />
                    </span>
                    AVAILABLE
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="shrink-0 uppercase tracking-[0.06em] text-muted2">Response</span>
                  <span aria-hidden className="min-w-[14px] flex-1 -translate-y-[0.28em] border-b border-dotted border-[#cfc8bd]" />
                  <span className="font-semibold text-ink">&lt; 24 HRS</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="shrink-0 uppercase tracking-[0.06em] text-muted2">Based in</span>
                  <span aria-hidden className="min-w-[14px] flex-1 -translate-y-[0.28em] border-b border-dotted border-[#cfc8bd]" />
                  <span className="font-semibold text-ink">{PROFILE.location}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-[#d8d2c9] pt-3 text-center text-[10px] uppercase tracking-[0.24em] text-faint">
                ✦ thanks for scrolling ✦
              </div>
              <div
                aria-hidden
                className="mt-3 h-9 w-full opacity-90"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, #1a1a1a 0 2px, transparent 2px 5px, #1a1a1a 5px 6px, transparent 6px 8px, #1a1a1a 8px 11px, transparent 11px 13px)",
                }}
              />
              <div className="mt-1.5 text-center text-[9.5px] tracking-[0.3em] text-faint">BN·CONTACT·2026</div>

              <a
                href={PROFILE.cvUrl}
                download
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[9px] bg-ink p-3 text-[13px] font-semibold tracking-[0.02em] text-white transition-colors hover:bg-black"
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
