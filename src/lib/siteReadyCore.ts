/**
 * Pure readiness math for the site loading screen.
 *
 * Deliberately free of React and DOM references so the reveal rules can be
 * tested directly. The React wiring lives in ./siteReady.tsx.
 */

export type GateStatus = "pending" | "ready" | "failed";

export type Gate = {
  /** Relative share of the aggregate progress bar. */
  weight: number;
  /** 0..100, only meaningful while pending. */
  progress: number;
  status: GateStatus;
};

export type GateMap = Record<string, Gate>;

/** Never flash the loader for less than this — a cached load should fade, not blink. */
export const MIN_DISPLAY_MS = 400;

/** Last resort so a stalled asset can never lock a visitor out of the site. */
export const FAILURE_NET_MS = 25_000;

export function clampProgress(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

/**
 * Weighted mean across registered gates. A settled gate counts as 100 whatever
 * it last reported, so a gate that finishes without ever emitting 100 cannot
 * pin the bar below full.
 */
export function aggregateProgress(gates: GateMap): number {
  const entries = Object.values(gates);
  if (entries.length === 0) return 0;

  let weighted = 0;
  let total = 0;
  for (const gate of entries) {
    const value = gate.status === "pending" ? clampProgress(gate.progress) : 100;
    weighted += value * gate.weight;
    total += gate.weight;
  }

  return total === 0 ? 0 : Math.round(weighted / total);
}

export function allGatesReady(gates: GateMap): boolean {
  const entries = Object.values(gates);
  if (entries.length === 0) return false;
  return entries.every((gate) => gate.status === "ready");
}

export function anyGateFailed(gates: GateMap): boolean {
  return Object.values(gates).some((gate) => gate.status === "failed");
}

export type RevealInput = {
  gates: GateMap;
  elapsedMs: number;
  minDisplayMs?: number;
  failureNetMs?: number;
};

/**
 * The reveal rule. Settled means "ready or failed" — both let the page through,
 * and both still respect the minimum display time. Only the failure net ignores it.
 */
export function shouldReveal({
  gates,
  elapsedMs,
  minDisplayMs = MIN_DISPLAY_MS,
  failureNetMs = FAILURE_NET_MS,
}: RevealInput): boolean {
  if (elapsedMs >= failureNetMs) return true;
  if (allGatesReady(gates) || anyGateFailed(gates)) return elapsedMs >= minDisplayMs;
  return false;
}
