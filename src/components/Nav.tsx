"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Menu, X } from "lucide-react";
import { NAV_ITEMS, PROFILE } from "@/lib/data";
import { useActiveSection, scrollToId } from "@/lib/useScroll";

export function Nav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_ITEMS.map((n) => n.id));

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
    setOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-[80] border-b border-line bg-white/90 backdrop-blur-md backdrop-saturate-150">
        <div className="mx-auto flex max-w-page items-center justify-between px-6 py-3.5">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-[11px] font-semibold tracking-[-0.01em]"
          >
            <span className="grid h-[30px] w-[30px] place-items-center rounded-[7px] bg-accent font-mono text-[12px] font-semibold text-white">
              {PROFILE.initials}
            </span>
            <span className="text-[15px] tracking-[-0.01em]">
              {PROFILE.shortName}
            </span>
          </a>

          <div className="hidden items-center gap-0.5 md:flex">
            {NAV_ITEMS.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={go(n.id)}
                className="rounded-[7px] px-[11px] py-[7px] text-[13.5px] font-medium transition-colors"
                style={{ color: active === n.id ? "var(--accent)" : "#6f6a64" }}
              >
                {n.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={PROFILE.cvUrl}
              download
              className="hidden items-center gap-1.5 rounded-lg border border-[#ddd9d3] bg-white px-3.5 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:border-[#c2613f] sm:inline-flex"
            >
              <Download className="h-[15px] w-[15px]" strokeWidth={2} />
              CV
            </a>
            <a
              href="#contact"
              onClick={go("contact")}
              className="hidden items-center gap-1.5 rounded-lg bg-ink px-[15px] py-2 text-[13.5px] font-semibold text-white transition-colors hover:bg-black sm:inline-flex"
            >
              Contact
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              className="grid h-[38px] w-[38px] place-items-center rounded-lg border border-[#ddd9d3] bg-white text-ink md:hidden"
            >
              {open ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>
      </nav>

      {open ? (
        <div className="fixed inset-x-0 bottom-0 top-[57px] z-[79] flex flex-col gap-1 bg-white px-6 py-5 md:hidden">
          {NAV_ITEMS.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={go(n.id)}
              className="flex items-center justify-between border-b border-line px-1 py-[15px] text-[19px] font-semibold text-ink"
            >
              {n.label}
              <span className="text-[16px] text-accent">→</span>
            </a>
          ))}
          <a
            href={PROFILE.cvUrl}
            download
            className="mt-3.5 flex items-center justify-center gap-2.5 rounded-[9px] bg-ink p-[15px] text-[15px] font-semibold text-white"
          >
            Download CV
          </a>
        </div>
      ) : null}
    </>
  );
}
