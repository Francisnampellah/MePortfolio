"use client";

import { useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { useFullPageScroll } from "@/lib/fullPageScroll";

/** Thin accent progress bar pinned to the top of the viewport, tracking the current slide. */
export function ScrollProgress() {
  const { index, sectionIds } = useFullPageScroll();
  const progress = sectionIds.length > 1 ? index / (sectionIds.length - 1) : 0;
  // useSpring only reads a plain number as the *initial* value — it has to be
  // pushed via .set() to animate on later index changes.
  const scaleX = useSpring(0, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  useEffect(() => {
    scaleX.set(progress);
  }, [progress, scaleX]);

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[90] h-0.5 origin-left bg-accent"
    />
  );
}
