import { describe, expect, it } from "vitest";
import {
  FAILURE_NET_MS,
  MIN_DISPLAY_MS,
  aggregateProgress,
  allGatesReady,
  anyGateFailed,
  clampProgress,
  shouldReveal,
  type GateMap,
} from "@/lib/siteReadyCore";

const pending = (weight: number, progress = 0): GateMap[string] => ({
  weight,
  progress,
  status: "pending",
});

describe("clampProgress", () => {
  it("keeps values inside 0..100", () => {
    expect(clampProgress(-5)).toBe(0);
    expect(clampProgress(50)).toBe(50);
    expect(clampProgress(140)).toBe(100);
  });

  it("treats NaN as zero and clamps infinities to the ends", () => {
    expect(clampProgress(Number.NaN)).toBe(0);
    expect(clampProgress(Number.POSITIVE_INFINITY)).toBe(100);
    expect(clampProgress(Number.NEGATIVE_INFINITY)).toBe(0);
  });
});

describe("aggregateProgress", () => {
  it("is zero when nothing is registered", () => {
    expect(aggregateProgress({})).toBe(0);
  });

  it("weights gates by their declared weight", () => {
    const gates: GateMap = { fonts: pending(10, 100), hero: pending(90, 0) };
    expect(aggregateProgress(gates)).toBe(10);
  });

  it("counts a ready gate as 100 even if it never reported full progress", () => {
    const gates: GateMap = {
      fonts: { weight: 10, progress: 0, status: "ready" },
      hero: pending(90, 50),
    };
    expect(aggregateProgress(gates)).toBe(55);
  });

  it("reaches 100 when every gate is ready", () => {
    const gates: GateMap = {
      fonts: { weight: 10, progress: 0, status: "ready" },
      hero: { weight: 90, progress: 0, status: "ready" },
    };
    expect(aggregateProgress(gates)).toBe(100);
  });

  it("reports the single-gate case used on mobile", () => {
    const gates: GateMap = { fonts: { weight: 10, progress: 0, status: "ready" } };
    expect(aggregateProgress(gates)).toBe(100);
  });
});

describe("allGatesReady", () => {
  it("is false when nothing is registered", () => {
    expect(allGatesReady({})).toBe(false);
  });

  it("is false while any gate is pending", () => {
    const gates: GateMap = {
      fonts: { weight: 10, progress: 100, status: "ready" },
      hero: pending(90, 99),
    };
    expect(allGatesReady(gates)).toBe(false);
  });

  it("is true when every gate is ready", () => {
    const gates: GateMap = { fonts: { weight: 10, progress: 100, status: "ready" } };
    expect(allGatesReady(gates)).toBe(true);
  });

  it("is false when a gate failed", () => {
    const gates: GateMap = { hero: { weight: 90, progress: 12, status: "failed" } };
    expect(allGatesReady(gates)).toBe(false);
  });
});

describe("anyGateFailed", () => {
  it("detects a failed gate", () => {
    const gates: GateMap = {
      fonts: { weight: 10, progress: 100, status: "ready" },
      hero: { weight: 90, progress: 12, status: "failed" },
    };
    expect(anyGateFailed(gates)).toBe(true);
  });

  it("is false with no failures", () => {
    expect(anyGateFailed({ fonts: pending(10) })).toBe(false);
  });
});

describe("shouldReveal", () => {
  const ready: GateMap = { fonts: { weight: 10, progress: 100, status: "ready" } };
  const loading: GateMap = { fonts: pending(10, 40), hero: pending(90, 10) };

  it("holds while gates are pending", () => {
    expect(shouldReveal({ gates: loading, elapsedMs: 5_000 })).toBe(false);
  });

  it("holds when ready but under the minimum display time", () => {
    expect(shouldReveal({ gates: ready, elapsedMs: MIN_DISPLAY_MS - 1 })).toBe(false);
  });

  it("reveals once ready and past the minimum display time", () => {
    expect(shouldReveal({ gates: ready, elapsedMs: MIN_DISPLAY_MS })).toBe(true);
  });

  it("reveals on failure, still honouring the minimum display time", () => {
    const failed: GateMap = { hero: { weight: 90, progress: 3, status: "failed" } };
    expect(shouldReveal({ gates: failed, elapsedMs: 10 })).toBe(false);
    expect(shouldReveal({ gates: failed, elapsedMs: MIN_DISPLAY_MS })).toBe(true);
  });

  it("reveals at the failure net even with everything pending", () => {
    expect(shouldReveal({ gates: loading, elapsedMs: FAILURE_NET_MS })).toBe(true);
  });

  it("reveals at the failure net even with no gates registered at all", () => {
    expect(shouldReveal({ gates: {}, elapsedMs: FAILURE_NET_MS })).toBe(true);
  });

  it("honours overridden thresholds", () => {
    expect(
      shouldReveal({ gates: ready, elapsedMs: 20, minDisplayMs: 10, failureNetMs: 999 })
    ).toBe(true);
  });
});
