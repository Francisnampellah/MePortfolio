"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";

/**
 * The "connector" selection pattern (docs/homepage-design.md §5): a selector list
 * and a detail panel share a relative grid, and a bridge element in the gutter
 * visually extends the selected item's border into the panel. Defined once here;
 * TechStack and Projects (and any future list+detail section) consume it.
 */

/** One spring for the sliding pill and the bridge, so they glide in lockstep. */
export const ACTIVE_SPRING = { type: "spring", stiffness: 380, damping: 34 } as const;

const OVERLAP = 4; // px the bridge eats into each neighbor, painting over both seam borders
const CORNER = 12; // px — matches rounded-xl, so the bridge only touches the straight border run
const MD = 768; // below this the layout stacks and there is no gutter to bridge

export type ConnectorRect = { top: number; height: number; left: number };

/**
 * Measures where the bridge belongs for the active list item.
 * `side` says which side of the list the gutter is on; `gap` must equal the
 * grid's actual column gap; bump `revision` to force a re-measure when the
 * list's contents change (e.g. a filter).
 */
export function useConnector(
  active: number,
  side: "gutter-after-list" | "gutter-before-list",
  gap: number,
  revision = 0
) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [rect, setRect] = useState<ConnectorRect | null>(null);

  useEffect(() => {
    const measure = () => {
      const btn = itemRefs.current[active];
      const list = listRef.current;
      if (!btn || !list || window.innerWidth < MD) {
        setRect(null);
        return;
      }
      const left =
        side === "gutter-after-list" ? list.offsetLeft + list.offsetWidth : list.offsetLeft - gap;
      setRect({ top: btn.offsetTop, height: btn.offsetHeight, left });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, side, gap, revision]);

  return { listRef, itemRefs, rect };
}

/** Sharp-edged (deliberately — see §9 of the design doc), corner-inset bridge. */
export function ConnectorBridge({ rect, gap }: { rect: ConnectorRect | null; gap: number }) {
  if (!rect) return null;
  return (
    <motion.span
      layout
      aria-hidden
      className="pointer-events-none absolute z-10 hidden md:block"
      style={{
        top: rect.top + CORNER,
        left: rect.left - OVERLAP,
        width: gap + OVERLAP * 2,
        height: Math.max(rect.height - CORNER * 2, 4),
        background: "#faf2ee",
        borderTop: "1px solid var(--accent)",
        borderBottom: "1px solid var(--accent)",
      }}
      transition={ACTIVE_SPRING}
    />
  );
}

/** Brief glow flash on the detail panel whenever the selection changes. */
export function useSelectionPulse(active: number) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 550);
    return () => clearTimeout(t);
  }, [active]);
  return pulse;
}

/** Accent-tinted border + halo for the detail panel, brighter while pulsing. */
export function selectionGlow(pulse: boolean): CSSProperties {
  return {
    borderColor: "color-mix(in srgb, var(--accent) 32%, #e8e5e0)",
    boxShadow: pulse
      ? "0 0 0 5px color-mix(in srgb, var(--accent) 15%, transparent), 0 20px 46px rgba(194,97,63,.16)"
      : "0 0 0 3px color-mix(in srgb, var(--accent) 7%, transparent), 0 16px 36px rgba(194,97,63,.09)",
    transition: "box-shadow .55s cubic-bezier(.2,.7,.2,1)",
  };
}
