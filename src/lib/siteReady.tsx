"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  FAILURE_NET_MS,
  MIN_DISPLAY_MS,
  aggregateProgress,
  allGatesReady,
  anyGateFailed,
  clampProgress,
  shouldReveal,
  type GateMap,
  type GateStatus,
} from "./siteReadyCore";

export const FONTS_GATE = "fonts";
export const HERO_3D_GATE = "hero-3d";

const FONTS_WEIGHT = 10;
const HERO_3D_WEIGHT = 90;

/** Must match the `lg:block` breakpoint guarding the hero model in Hero.tsx. */
const DESKTOP_MQ = "(min-width: 1024px)";

/** Cheap probe — take a context and drop it immediately. */
export function supportsWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The hero model only mounts at lg+ (its column is `hidden lg:block`, so below
 * that the R3F canvas has zero size and never initialises) and it needs WebGL.
 * Anywhere else it is not "needed data" and must not gate the reveal.
 */
export function expectsHero3d(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(DESKTOP_MQ).matches && supportsWebGL();
}

type GateReporter = {
  setProgress: (n: number) => void;
  markReady: () => void;
  markFailed: () => void;
};

type SiteReadyCtx = {
  progress: number;
  revealed: boolean;
  setGateProgress: (id: string, progress: number) => void;
  setGateStatus: (id: string, status: GateStatus) => void;
};

const Ctx = createContext<SiteReadyCtx | null>(null);

export function SiteReadyProvider({
  children,
  minDisplayMs = MIN_DISPLAY_MS,
  failureNetMs = FAILURE_NET_MS,
  expectHero3d = expectsHero3d,
}: {
  children: ReactNode;
  minDisplayMs?: number;
  failureNetMs?: number;
  /** Injectable for tests; production relies on the default probe. */
  expectHero3d?: () => boolean;
}) {
  const [gates, setGates] = useState<GateMap>({});
  const [revealed, setRevealed] = useState(false);
  const startedAt = useRef(0);

  const setGateProgress = useCallback((id: string, progress: number) => {
    setGates((prev) => {
      const gate = prev[id];
      if (!gate || gate.status !== "pending") return prev;
      const next = clampProgress(progress);
      if (next === gate.progress) return prev;
      return { ...prev, [id]: { ...gate, progress: next } };
    });
  }, []);

  const setGateStatus = useCallback((id: string, status: GateStatus) => {
    setGates((prev) => {
      const gate = prev[id];
      if (!gate || gate.status === status) return prev;
      return { ...prev, [id]: { ...gate, status } };
    });
  }, []);

  // Reserve every gate in one commit. HeroToolChest is a dynamic(ssr:false)
  // import and mounts late — if it registered its own gate, fonts could reach
  // ready first and drive the bar to 100 before collapsing back to 10.
  useEffect(() => {
    startedAt.current = Date.now();
    const reserved: GateMap = {
      [FONTS_GATE]: { weight: FONTS_WEIGHT, progress: 0, status: "pending" },
    };
    if (expectHero3d()) {
      reserved[HERO_3D_GATE] = { weight: HERO_3D_WEIGHT, progress: 0, status: "pending" };
    }
    setGates(reserved);
  }, [expectHero3d]);

  // Fonts gate. Runs after the reserving effect above, so the slot exists.
  useEffect(() => {
    let cancelled = false;
    const settle = () => {
      if (!cancelled) setGateStatus(FONTS_GATE, "ready");
    };
    const fonts = document.fonts as FontFaceSet | undefined;
    if (fonts?.ready) fonts.ready.then(settle).catch(settle);
    else settle();
    return () => {
      cancelled = true;
    };
  }, [setGateStatus]);

  // Reveal decision. Re-evaluated whenever a gate moves.
  useEffect(() => {
    if (revealed) return;
    const elapsed = Date.now() - startedAt.current;

    if (shouldReveal({ gates, elapsedMs: elapsed, minDisplayMs, failureNetMs })) {
      setRevealed(true);
      return;
    }

    // Settled but still inside the minimum display window — wait it out.
    if (!allGatesReady(gates) && !anyGateFailed(gates)) return;
    const id = window.setTimeout(
      () => setRevealed(true),
      Math.max(0, minDisplayMs - elapsed)
    );
    return () => window.clearTimeout(id);
  }, [gates, revealed, minDisplayMs, failureNetMs]);

  // Failure net: a stalled asset must never lock a visitor out.
  useEffect(() => {
    const id = window.setTimeout(() => setRevealed(true), failureNetMs);
    return () => window.clearTimeout(id);
  }, [failureNetMs]);

  const progress = useMemo(() => aggregateProgress(gates), [gates]);

  const value = useMemo<SiteReadyCtx>(
    () => ({ progress, revealed, setGateProgress, setGateStatus }),
    [progress, revealed, setGateProgress, setGateStatus]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSiteReady(): { progress: number; revealed: boolean } {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSiteReady must be used within SiteReadyProvider");
  return { progress: ctx.progress, revealed: ctx.revealed };
}

/**
 * Report into a gate the provider reserved. Deliberately tolerant: if the gate
 * was not reserved (mobile, no WebGL) or there is no provider at all, every
 * call is a no-op, so a gate owner never needs to know whether it counts.
 */
export function useGateReporter(id: string): GateReporter {
  const ctx = useContext(Ctx);
  const setGateProgress = ctx?.setGateProgress;
  const setGateStatus = ctx?.setGateStatus;

  return useMemo(
    () => ({
      setProgress: (n: number) => setGateProgress?.(id, n),
      markReady: () => setGateStatus?.(id, "ready"),
      markFailed: () => setGateStatus?.(id, "failed"),
    }),
    [id, setGateProgress, setGateStatus]
  );
}
