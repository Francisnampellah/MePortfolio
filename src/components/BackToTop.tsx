"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-[22px] right-[22px] z-[70] grid h-[42px] w-[42px] place-items-center rounded-[9px] border border-[#ddd9d3] bg-white text-ink transition-all duration-300 hover:border-accent"
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
