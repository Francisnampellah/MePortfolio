"use client";

import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { NAV_ITEMS, PROFILE } from "@/lib/data";
import { useFullPageScroll } from "@/lib/fullPageScroll";

export function Nav() {
  const { activeId, goToId } = useFullPageScroll();

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    goToId(id);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-[80] h-16 border-b border-line bg-white/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-full max-w-page items-center justify-between px-6">
        {/* Brand — logo mark + name */}
        <a href="#home" onClick={go("home")} className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-[10px] bg-white p-1.5 transition-transform duration-300 group-hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt={`${PROFILE.shortName} logo`} className="h-full w-full object-contain" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[14.5px] font-bold tracking-[-0.01em] text-ink">{PROFILE.shortName}</span>
            <span className="mt-1 hidden font-mono text-[10px] tracking-[0.01em] text-muted2 sm:block">
              {PROFILE.role}
            </span>
          </span>
        </a>

        {/* Center nav — subtle underline marks the active section */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((n) => {
            const on = activeId === n.id;
            return (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={go(n.id)}
                className="relative px-2.5 py-2 text-[13px] font-medium transition-colors duration-200"
                style={{ color: on ? "#1a1a1a" : "#8a857e" }}
              >
                {n.label}
                {on ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                ) : null}
              </a>
            );
          })}
        </div>

        {/* Actions — section nav lives in the bottom TabBar below md */}
        <div className="flex items-center gap-2">
          <a
            href={PROFILE.cvUrl}
            download
            className="hidden items-center gap-1.5 rounded-lg border border-[#ddd9d3] bg-white/60 px-3 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-accent sm:inline-flex"
          >
            <Download className="h-[15px] w-[15px]" strokeWidth={2} />
            CV
          </a>
          <a
            href="#contact"
            onClick={go("contact")}
            className="group inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-black"
          >
            Let&apos;s talk
            <span className="text-accent transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
