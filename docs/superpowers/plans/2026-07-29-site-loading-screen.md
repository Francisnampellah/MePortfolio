# Site Loading Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hold a full-screen branded loader over the homepage until the hero is genuinely painted, then reveal a finished page.

**Architecture:** A readiness registry (`SiteReadyProvider`) reserves a fixed set of *gates* on mount and derives aggregate progress plus a reveal decision. Gate owners report progress into slots the provider already reserved, so a lazily-mounted owner can never make the progress bar collapse. Pure reveal/aggregation logic lives in a dependency-free core module that is unit tested; React wiring is a thin layer over it.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript (strict), Tailwind, `@react-three/fiber` + `@react-three/drei`, Vitest + Testing Library (added by Task 1).

## Global Constraints

- Scope is the homepage (`/`) only. **Do not modify `src/app/layout.tsx`** — blog, `/namps-ui`, `/namps-native`, and `/admin` must be unaffected.
- **Do not modify `src/lib/fullPageScroll.tsx`.** The input lock lives entirely in the loader.
- Minimum loader display: **400 ms**. Failure net: **25 000 ms**.
- Gate weights: `fonts` = **10**, `hero-3d` = **90**.
- Desktop breakpoint for the hero model: **`(min-width: 1024px)`** — must match the `lg:block` in `src/components/Hero.tsx:82`.
- The loader must be present in the server-rendered HTML with `visible` as its *initial* state. Initial client state must match the server render — no hydration mismatch.
- Unmounting the loader must be driven by a **timer, not `transitionend`** — `src/app/globals.css:45` forces all transitions to `0.001ms` under `prefers-reduced-motion`.
- TypeScript is `strict: true`. Path alias `@/*` → `./src/*`.
- Tailwind tokens available: `ink` `#1a1a1a`, `line` `#e8e5e0`, `accent` `var(--accent)`, `surface` `#faf9f7`, `surface2` `#f5f3f0`, `muted` `#6f6a64`, `muted2` `#8a857e`, `muted3` `#9a948c`, `faint` `#a39e96`.
- Every task ends with a commit.

## Deviation from the spec (deliberate)

The spec says `HeroToolChest` registers the `hero-3d` gate. This plan instead has **`SiteReadyProvider` reserve both gate slots in a single commit**, with `HeroToolChest` reporting into the reserved slot via `useGateReporter("hero-3d")`.

Reason: `HeroToolChest` is `dynamic(ssr: false)` (`src/components/Hero.tsx:12`), so it mounts a beat after the page. If it registered its own gate, `fonts` could reach ready first and drive aggregate progress to 100%, which would then collapse to 10% when the 3D gate joined. Reserving upfront removes the collapse and puts the viewport/WebGL probe in one place.

## File Structure

| File | Responsibility |
|---|---|
| `vitest.config.ts` | new — test runner config (jsdom, `@` alias) |
| `src/lib/siteReadyCore.ts` | new — pure gate math and the reveal rule. No React, no DOM. |
| `src/lib/siteReadyCore.test.ts` | new — unit tests for the above |
| `src/lib/siteReady.tsx` | new — `SiteReadyProvider`, `useSiteReady`, `useGateReporter`, environment probes |
| `src/lib/siteReady.test.tsx` | new — provider behavior tests |
| `src/lib/heroWaitLines.ts` | new — wait copy shared by the loader and the inline hero fallback |
| `src/components/SiteLoader.tsx` | new — the overlay UI and input lock |
| `src/components/HeroToolChest.tsx` | modify — report into `hero-3d`, switch to 2K model, use shared wait lines, add an error boundary |
| `src/app/page.tsx` | modify — wrap in provider, render loader |

---

### Task 1: Test infrastructure

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/lib/smoke.test.ts` (deleted at the end of this task)

**Interfaces:**
- Consumes: nothing
- Produces: `npx vitest run` executes `src/**/*.test.{ts,tsx}` in a jsdom environment with the `@/*` alias resolving to `src/*`. Test files import `describe`/`it`/`expect` explicitly from `vitest` (no globals, so `tsconfig.json` needs no change).

- [ ] **Step 1: Install the test dependencies**

```bash
npm install --save-dev vitest@^2.1.0 @vitejs/plugin-react@^4.3.0 jsdom@^25.0.0 @testing-library/react@^16.0.0 @testing-library/dom@^10.4.0
```

- [ ] **Step 2: Create the Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

- [ ] **Step 3: Add the test script**

In `package.json`, add to `"scripts"` (keep the existing four):

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 4: Write a smoke test that proves the runner and the alias work**

Create `src/lib/smoke.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { PROFILE } from "@/lib/data";

describe("test infrastructure", () => {
  it("runs and resolves the @ alias", () => {
    expect(PROFILE.initials).toBe("BN");
  });

  it("has a DOM available", () => {
    expect(typeof document.createElement("canvas")).toBe("object");
  });
});
```

- [ ] **Step 5: Run the smoke test**

Run: `npx vitest run src/lib/smoke.test.ts`
Expected: PASS, 2 tests. If the alias fails to resolve, the config in Step 2 is wrong — fix it before continuing.

- [ ] **Step 6: Delete the smoke test**

```bash
rm src/lib/smoke.test.ts
```

It has done its job; real tests arrive in Task 2.

- [ ] **Step 7: Verify the production build is unaffected**

Run: `npm run build`
Expected: builds successfully. `vitest.config.ts` must not break the Next build.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add vitest for unit testing site-readiness logic"
```

---

### Task 2: Pure readiness core

**Files:**
- Create: `src/lib/siteReadyCore.ts`
- Test: `src/lib/siteReadyCore.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type GateStatus = "pending" | "ready" | "failed"`
  - `type Gate = { weight: number; progress: number; status: GateStatus }`
  - `type GateMap = Record<string, Gate>`
  - `const MIN_DISPLAY_MS = 400`, `const FAILURE_NET_MS = 25_000`
  - `clampProgress(n: number): number`
  - `aggregateProgress(gates: GateMap): number`
  - `allGatesReady(gates: GateMap): boolean`
  - `anyGateFailed(gates: GateMap): boolean`
  - `shouldReveal(input: { gates: GateMap; elapsedMs: number; minDisplayMs?: number; failureNetMs?: number }): boolean`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/siteReadyCore.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/siteReadyCore.test.ts`
Expected: FAIL — cannot resolve `@/lib/siteReadyCore`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/siteReadyCore.ts`:

```ts
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
```

Note on `clampProgress`: `Math.min(100, Math.max(0, Infinity))` is `100` and `Math.max(0, -Infinity)` is `0`, so only `NaN` needs the explicit guard — that is why the test asserts `Infinity` clamps to `100` rather than `0`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/siteReadyCore.test.ts`
Expected: PASS, all tests.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/siteReadyCore.ts src/lib/siteReadyCore.test.ts
git commit -m "feat: add pure readiness core for the site loader"
```

---

### Task 3: Readiness provider and hooks

**Files:**
- Create: `src/lib/siteReady.tsx`
- Test: `src/lib/siteReady.test.tsx`

**Interfaces:**
- Consumes: everything exported by `@/lib/siteReadyCore` (Task 2).
- Produces:
  - `const FONTS_GATE = "fonts"`, `const HERO_3D_GATE = "hero-3d"`
  - `supportsWebGL(): boolean`
  - `expectsHero3d(): boolean`
  - `<SiteReadyProvider minDisplayMs? failureNetMs? expectHero3d?>` — the optional props exist so tests can drive it; production usage passes none.
  - `useSiteReady(): { progress: number; revealed: boolean }` — throws outside a provider.
  - `useGateReporter(id: string): { setProgress(n: number): void; markReady(): void; markFailed(): void }` — **no-ops** outside a provider or when the gate was never reserved.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/siteReady.test.tsx`:

```tsx
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  HERO_3D_GATE,
  SiteReadyProvider,
  useGateReporter,
  useSiteReady,
} from "@/lib/siteReady";

/** Renders the readiness values plus a handle on the hero reporter. */
function Probe() {
  const { progress, revealed } = useSiteReady();
  const hero = useGateReporter(HERO_3D_GATE);
  return (
    <div>
      <span data-testid="progress">{progress}</span>
      <span data-testid="revealed">{String(revealed)}</span>
      <button data-testid="hero-half" onClick={() => hero.setProgress(50)} />
      <button data-testid="hero-ready" onClick={() => hero.markReady()} />
      <button data-testid="hero-failed" onClick={() => hero.markFailed()} />
    </div>
  );
}

const progressText = () => screen.getByTestId("progress").textContent;
const revealedText = () => screen.getByTestId("revealed").textContent;

/** Let the document.fonts.ready promise settle inside act(). */
async function flushFonts() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { ready: Promise.resolve() },
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("SiteReadyProvider", () => {
  it("starts hidden with zero progress", () => {
    render(
      <SiteReadyProvider expectHero3d={() => false}>
        <Probe />
      </SiteReadyProvider>
    );
    expect(revealedText()).toBe("false");
  });

  it("reveals after fonts settle and the minimum display time elapses", async () => {
    render(
      <SiteReadyProvider expectHero3d={() => false} minDisplayMs={400}>
        <Probe />
      </SiteReadyProvider>
    );

    await flushFonts();
    expect(progressText()).toBe("100");
    expect(revealedText()).toBe("false");

    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(revealedText()).toBe("true");
  });

  it("does not wait on the hero model when it is not expected", async () => {
    render(
      <SiteReadyProvider expectHero3d={() => false} minDisplayMs={0}>
        <Probe />
      </SiteReadyProvider>
    );

    await flushFonts();
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(revealedText()).toBe("true");
  });

  it("holds for the hero gate when it is expected", async () => {
    render(
      <SiteReadyProvider expectHero3d={() => true} minDisplayMs={0}>
        <Probe />
      </SiteReadyProvider>
    );

    await flushFonts();
    await act(async () => {
      vi.advanceTimersByTime(1_000);
    });
    expect(revealedText()).toBe("false");
    // fonts ready (10) + hero at 0 (90) => 10
    expect(progressText()).toBe("10");
  });

  it("blends reported hero progress into the aggregate", async () => {
    render(
      <SiteReadyProvider expectHero3d={() => true} minDisplayMs={0}>
        <Probe />
      </SiteReadyProvider>
    );

    await flushFonts();
    await act(async () => {
      screen.getByTestId("hero-half").click();
    });
    // fonts ready (10) + hero at 50% of 90 (45) => 55
    expect(progressText()).toBe("55");
    expect(revealedText()).toBe("false");
  });

  it("reveals once the hero gate reports ready", async () => {
    render(
      <SiteReadyProvider expectHero3d={() => true} minDisplayMs={0}>
        <Probe />
      </SiteReadyProvider>
    );

    await flushFonts();
    await act(async () => {
      screen.getByTestId("hero-ready").click();
    });
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(progressText()).toBe("100");
    expect(revealedText()).toBe("true");
  });

  it("reveals when the hero gate fails", async () => {
    render(
      <SiteReadyProvider expectHero3d={() => true} minDisplayMs={0}>
        <Probe />
      </SiteReadyProvider>
    );

    await flushFonts();
    await act(async () => {
      screen.getByTestId("hero-failed").click();
    });
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(revealedText()).toBe("true");
  });

  it("reveals at the failure net when the hero gate never reports", async () => {
    render(
      <SiteReadyProvider expectHero3d={() => true} minDisplayMs={0} failureNetMs={25_000}>
        <Probe />
      </SiteReadyProvider>
    );

    await flushFonts();
    await act(async () => {
      vi.advanceTimersByTime(24_000);
    });
    expect(revealedText()).toBe("false");

    await act(async () => {
      vi.advanceTimersByTime(1_000);
    });
    expect(revealedText()).toBe("true");
  });

  it("never lets aggregate progress collapse when the hero gate is reserved upfront", async () => {
    render(
      <SiteReadyProvider expectHero3d={() => true} minDisplayMs={0}>
        <Probe />
      </SiteReadyProvider>
    );

    // Fonts settling first must not push the bar to 100 while the hero is pending.
    await flushFonts();
    expect(Number(progressText())).toBeLessThan(100);
  });
});

describe("useGateReporter", () => {
  it("no-ops outside a provider instead of throwing", () => {
    function Bare() {
      const reporter = useGateReporter(HERO_3D_GATE);
      reporter.setProgress(50);
      reporter.markReady();
      return <span data-testid="ok">ok</span>;
    }
    render(<Bare />);
    expect(screen.getByTestId("ok").textContent).toBe("ok");
  });
});

describe("useSiteReady", () => {
  it("throws outside a provider", () => {
    function Bare() {
      useSiteReady();
      return null;
    }
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Bare />)).toThrow(/SiteReadyProvider/);
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/siteReady.test.tsx`
Expected: FAIL — cannot resolve `@/lib/siteReady`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/siteReady.tsx`:

```tsx
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/siteReady.test.tsx`
Expected: PASS, all tests.

If the failure-net test fails because the reveal effect fires first, check that `startedAt.current` is set in the reserving effect and not at declaration — a `useRef(Date.now())` initialiser would run during render and skew the elapsed time.

- [ ] **Step 5: Run the whole suite and typecheck**

Run: `npx vitest run && npx tsc --noEmit`
Expected: all tests PASS, no type errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/siteReady.tsx src/lib/siteReady.test.tsx
git commit -m "feat: add site readiness provider with reserved gates"
```

---

### Task 4: Loader UI and shared wait copy

**Files:**
- Create: `src/lib/heroWaitLines.ts`
- Create: `src/components/SiteLoader.tsx`

**Interfaces:**
- Consumes: `useSiteReady()` from `@/lib/siteReady` (Task 3); `PROFILE` from `@/lib/data`.
- Produces:
  - `WAIT_LINES: readonly string[]` from `@/lib/heroWaitLines`
  - `<SiteLoader />` from `@/components/SiteLoader` — must be rendered inside `SiteReadyProvider`.

- [ ] **Step 1: Create the shared wait copy**

Create `src/lib/heroWaitLines.ts`:

```ts
/**
 * Wait copy shared by the full-screen SiteLoader and the hero's inline
 * fallback, so the two never drift apart.
 */
export const WAIT_LINES: readonly string[] = [
  "Almost there…",
  "Still worth the wait…",
  "Bringing the clock in…",
  "Just a second more…",
];

export const WAIT_LINE_ROTATE_MS = 2200;
```

- [ ] **Step 2: Create the loader component**

Create `src/components/SiteLoader.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { PROFILE } from "@/lib/data";
import { WAIT_LINES, WAIT_LINE_ROTATE_MS } from "@/lib/heroWaitLines";
import { useSiteReady } from "@/lib/siteReady";

const FADE_MS = 500;

/** Keys that scroll the page — blocked while the loader is up. */
const SCROLL_KEYS = new Set([
  " ",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  "ArrowUp",
  "ArrowDown",
]);

/**
 * Full-screen loader held over the homepage until the hero is painted.
 *
 * Rendered on the server with `mounted` true so it is in the initial HTML —
 * no white flash before hydration, and the first client render matches.
 */
export function SiteLoader() {
  const { progress, revealed } = useSiteReady();
  const [mounted, setMounted] = useState(true);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    if (revealed) return;
    const id = window.setInterval(
      () => setLineIdx((i) => (i + 1) % WAIT_LINES.length),
      WAIT_LINE_ROTATE_MS
    );
    return () => window.clearInterval(id);
  }, [revealed]);

  // Unmount on a timer rather than transitionend: globals.css collapses every
  // transition to 0.001ms under prefers-reduced-motion, which makes the event
  // unreliable to hang teardown on.
  useEffect(() => {
    if (!revealed) return;
    const id = window.setTimeout(() => setMounted(false), FADE_MS);
    return () => window.clearTimeout(id);
  }, [revealed]);

  // Hold the page still. FullPageScrollProvider binds its wheel/touch/key
  // handlers on window without capture, so intercepting in the capture phase
  // starves it without touching that file.
  useEffect(() => {
    if (!mounted) return;

    const stop = (e: Event) => {
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
    };
    const stopScrollKeys = (e: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(e.key)) return;
      stop(e);
    };
    const opts = { capture: true, passive: false } as const;

    window.addEventListener("wheel", stop, opts);
    window.addEventListener("touchmove", stop, opts);
    window.addEventListener("keydown", stopScrollKeys, opts);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("wheel", stop, opts);
      window.removeEventListener("touchmove", stop, opts);
      window.removeEventListener("keydown", stopScrollKeys, opts);
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  if (!mounted) return null;

  const pct = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!revealed}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface transition-opacity duration-500 ${
        revealed ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div
        aria-hidden
        className="text-[22px] font-extrabold tracking-[-0.03em] text-ink"
      >
        {PROFILE.initials}
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-muted">{WAIT_LINES[lineIdx]}</p>

      {/* Percentage is decorative — announcing every tick would spam a screen reader. */}
      <div
        aria-hidden
        className="mt-5 h-[3px] w-36 overflow-hidden rounded-full bg-[#efeae4]"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p
        aria-hidden
        className="mt-2 font-mono text-[10px] tabular-nums tracking-[0.06em] text-faint"
      >
        {pct}%
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/heroWaitLines.ts src/components/SiteLoader.tsx
git commit -m "feat: add full-screen site loader UI"
```

---

### Task 5: Wire the hero model into the gate and drop to 2K textures

**Files:**
- Modify: `src/components/HeroToolChest.tsx`

**Interfaces:**
- Consumes: `useGateReporter`, `HERO_3D_GATE` from `@/lib/siteReady` (Task 3); `WAIT_LINES` from `@/lib/heroWaitLines` (Task 4).
- Produces: nothing new. `HeroToolChest`'s exported signature is unchanged.

Verified before planning: `alarm_clock_2k.gltf` references the `_2k.jpg` textures, shares the same `alarm_clock_01.bin` geometry, and declares the same material names — so `recolorTealMapToAccent` and `fixClockGlass`, which match on material name and `map`, work unchanged. Payload drops from ~14.9 MB to ~4.7 MB.

- [ ] **Step 1: Switch the model to the 2K asset**

In `src/components/HeroToolChest.tsx:19`, change:

```ts
const MODEL_URL = "/models/alarm_clock/alarm_clock_4k.gltf";
```

to:

```ts
const MODEL_URL = "/models/alarm_clock/alarm_clock_2k.gltf";
```

`useGLTF.preload(MODEL_URL)` further down already reads this constant, so it follows automatically.

- [ ] **Step 2: Replace the local wait copy with the shared module**

Delete the local `WAIT_LINES` declaration at `src/components/HeroToolChest.tsx:29-34`:

```ts
const WAIT_LINES = [
  "Almost there…",
  "Still worth the wait…",
  "Bringing the clock in…",
  "Just a second more…",
];
```

Add to the imports at the top of the file:

```ts
import { WAIT_LINES, WAIT_LINE_ROTATE_MS } from "@/lib/heroWaitLines";
import { HERO_3D_GATE, useGateReporter } from "@/lib/siteReady";
```

Then in `HeroToolChest`, replace the hardcoded rotate interval with the shared constant:

```tsx
    const id = setInterval(() => setLineIdx((i) => (i + 1) % WAIT_LINES.length), WAIT_LINE_ROTATE_MS);
```

- [ ] **Step 3: Add an error boundary so a failed model reports instead of crashing**

There is currently no boundary around the GLTF load — an asset error would take down the page. Add this class component near the top of `src/components/HeroToolChest.tsx`, after the imports:

```tsx
/**
 * Catches a failed GLTF/texture load so it degrades into "the site reveals
 * without the model" rather than crashing the page.
 */
class ModelErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
```

Extend the React import at the top of the file to include what the boundary needs:

```ts
import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
```

- [ ] **Step 4: Report progress and readiness into the gate**

In `HeroToolChest`, take a reporter and feed it. Replace the opening of the component:

```tsx
export function HeroToolChest() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const { activeId } = useFullPageScroll();
  const onHero = activeId === "home";
  const markReady = useCallback(() => setReady(true), []);
```

with:

```tsx
export function HeroToolChest() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const { activeId } = useFullPageScroll();
  const onHero = activeId === "home";

  // No-ops when the provider did not reserve this gate (mobile / no WebGL),
  // so this component never needs to know whether it is gating the site.
  const gate = useGateReporter(HERO_3D_GATE);

  const markReady = useCallback(() => {
    setReady(true);
    gate.markReady();
  }, [gate]);

  const handleProgress = useCallback(
    (n: number) => {
      setProgress(n);
      gate.setProgress(n);
    },
    [gate]
  );

  const handleModelError = useCallback(() => {
    gate.markFailed();
  }, [gate]);
```

- [ ] **Step 5: Point the canvas at the new callbacks and wrap the model**

In the same component's JSX, replace:

```tsx
          <ProgressBridge onProgress={setProgress} />
          <Suspense fallback={null}>
            <AlarmClock onReady={markReady} />
            <Environment preset="apartment" />
          </Suspense>
```

with:

```tsx
          <ProgressBridge onProgress={handleProgress} />
          <ModelErrorBoundary onError={handleModelError}>
            <Suspense fallback={null}>
              <AlarmClock onReady={markReady} />
              <Environment preset="apartment" />
            </Suspense>
          </ModelErrorBoundary>
```

- [ ] **Step 6: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors. If lint complains that `Component` or `ReactNode` is unused, the import edit in Step 3 was not applied.

- [ ] **Step 7: Commit**

```bash
git add src/components/HeroToolChest.tsx
git commit -m "feat: report hero model readiness to the site gate, drop to 2K textures"
```

---

### Task 6: Homepage integration and end-to-end verification

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `SiteReadyProvider` from `@/lib/siteReady` (Task 3); `SiteLoader` from `@/components/SiteLoader` (Task 4).
- Produces: the finished feature.

- [ ] **Step 1: Wrap the homepage**

In `src/app/page.tsx`, add the imports:

```ts
import { SiteLoader } from "@/components/SiteLoader";
import { SiteReadyProvider } from "@/lib/siteReady";
```

Then replace the returned tree so the provider is outermost and the loader renders first:

```tsx
export default function Home() {
  return (
    <SiteReadyProvider>
      <SiteLoader />
      <FullPageScrollProvider sectionIds={SECTION_IDS}>
        <ScrollProgress />
        <Nav />
        <FullPageStage>
          <main className="contents">
            <Hero />
            <About />
            <TechStack />
            <Projects />
            <Experience />
            <Testimonials />
            <GithubActivity />
            <Blog />
            <div className={CONTACT_SLIDE_ROOT}>
              <Contact />
              <Footer />
            </div>
          </main>
        </FullPageStage>
        <SlideHud />
        <TabBar />
        <BackToTop />
        <ChatWidget />
      </FullPageScrollProvider>
    </SiteReadyProvider>
  );
}
```

- [ ] **Step 2: Confirm the whole suite, types, lint, and build**

Run: `npx vitest run && npx tsc --noEmit && npm run lint && npm run build`
Expected: all tests PASS, no type errors, no lint errors, build succeeds.

- [ ] **Step 3: Verify the loader is in the server HTML (the no-flash requirement)**

Start the production server: `npm run start` (in a second terminal, after the build from Step 2).

Run: `curl -s http://localhost:3000 | grep -c 'aria-busy="true"'`
Expected: at least `1`. A `0` means the loader is not server-rendered and the page will flash before hydration — fix before continuing.

- [ ] **Step 4: Browser verification — desktop happy path**

Open `http://localhost:3000` at a window width ≥ 1024 px with the cache disabled (DevTools → Network → Disable cache).

Confirm:
- the loader covers the page from the first paint, with no white flash
- the percentage climbs smoothly — it must not sit at 0 and jump, nor reach 100 and hang
- the loader lifts only once the clock is visible and already spinning
- the fade lasts about half a second and the loader is gone from the DOM afterwards

- [ ] **Step 5: Browser verification — mobile path**

Narrow the window below 1024 px (or use DevTools device emulation) and hard-reload.

Expected: the loader clears in well under a second. It must **not** wait on the model — a multi-second hang here means `expectsHero3d()` is returning true when the hero column is hidden.

- [ ] **Step 6: Browser verification — slow network**

DevTools → Network → throttle to *Slow 3G*, hard-reload at desktop width.

Expected: progress advances gradually rather than stalling; the loader eventually lifts with the hero painted. Note the elapsed time — with the 2K textures it should be far short of the 25 s failure net.

- [ ] **Step 7: Browser verification — input lock**

While the loader is visible, try scrolling with the wheel, dragging on a touch device, and pressing ArrowDown / PageDown / Space.

Expected: nothing moves. Immediately after the loader lifts, all of them work normally — a stuck page means the cleanup in `SiteLoader`'s input-lock effect did not run.

- [ ] **Step 8: Browser verification — no WebGL**

Disable WebGL (Chrome: DevTools → Command Menu → "WebGL" → disable, or launch with `--disable-webgl`) and reload at desktop width.

Expected: the loader clears quickly instead of hanging for 25 s, and the page is usable with the hero showing its inline fallback.

- [ ] **Step 9: Browser verification — repeat visit and reduced motion**

Reload with the cache enabled: the loader should appear briefly and fade rather than blink out instantly.

Then enable `prefers-reduced-motion` (DevTools → Rendering → Emulate CSS media feature) and reload: the loader should still gate and then disappear promptly, with no animation and no stuck overlay.

- [ ] **Step 10: Verify the other routes are untouched**

Visit `/blog`, `/namps-ui`, `/namps-native`, and `/admin`.

Expected: no loading screen anywhere; all render exactly as before.

- [ ] **Step 11: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: gate the homepage behind the site loading screen"
```

---

## Self-Review

**Spec coverage:**

| Spec requirement | Task |
|---|---|
| Readiness registry with weighted progress, `allReady`, `revealed` | 2, 3 |
| `fonts` gate on `document.fonts.ready`, weight 10 | 3 |
| `hero-3d` gate weight 90, viewport + WebGL conditional | 3 (reserved), 5 (reported) |
| "Hero fully painted" via the existing `onReady` | 5 |
| Reveal rules — 400 ms floor, failure, 25 s net | 2, 3 |
| No-flash / SSR initial state | 4, verified in 6 Step 3 |
| Capture-phase input lock, no `fullPageScroll.tsx` change | 4, verified in 6 Step 7 |
| Loader UI: initials, accent rail, percentage, rotating lines, a11y | 4 |
| Shared `heroWaitLines` module | 4, consumed in 5 |
| 4K → 2K model switch | 5 |
| Homepage-only scope | 6, verified in 6 Step 10 |
| Full verification checklist | 6 |

No gaps.

**Placeholder scan:** none — every code step carries the literal code to write, and every verification step names the command and the expected result.

**Type consistency:** `GateStatus`, `Gate`, `GateMap` are defined in Task 2 and imported unchanged in Task 3. `setGateProgress`/`setGateStatus` are named identically in the context type, the provider, and `useGateReporter`. `useGateReporter` returns `setProgress`/`markReady`/`markFailed`, which is exactly what Task 5 calls. `WAIT_LINES` and `WAIT_LINE_ROTATE_MS` are defined in Task 4 and consumed with those names in Tasks 4 and 5. `HERO_3D_GATE` is exported in Task 3 and imported in Task 5.
