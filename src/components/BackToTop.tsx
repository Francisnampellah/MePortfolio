"use client";

import { ArrowUp } from "lucide-react";
import { useFullPageScroll } from "@/lib/fullPageScroll";

export function BackToTop() {
  const { index, goToIndex } = useFullPageScroll();
  const show = index > 0;

  return (
    <button
      onClick={() => goToIndex(0)}
      aria-label="Back to top"
      className="fixed bottom-[86px] right-[22px] z-[70] hidden h-[42px] w-[42px] place-items-center rounded-[9px] border border-[#ddd9d3] bg-white text-ink transition-all duration-300 hover:border-accent md:grid"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(10px)",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
