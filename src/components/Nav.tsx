"use client";

import { Download } from "lucide-react";
import { NAV_ITEMS, PROFILE } from "@/lib/data";
import { useFullPageScroll } from "@/lib/fullPageScroll";

export function Nav() {
  const { activeId, goToId } = useFullPageScroll();

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    goToId(id);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-[80] h-16 border-b border-line bg-white/90 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-full max-w-page items-center justify-between px-6">
        <a
          href="#home"
          onClick={go("home")}
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
              style={{ color: activeId === n.id ? "var(--accent)" : "#6f6a64" }}
            >
              {n.label}
            </a>
          ))}
        </div>

        {/* Below md, section navigation lives in the bottom TabBar (app-style);
            the top bar keeps only brand + actions. */}
        <div className="flex items-center gap-2.5">
          <a
            href={PROFILE.cvUrl}
            download
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#ddd9d3] bg-white px-3.5 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:border-[#c2613f]"
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
        </div>
      </div>
    </nav>
  );
}
