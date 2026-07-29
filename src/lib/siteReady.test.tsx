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

/**
 * Stands in for the hero column, which is a `dynamic(ssr:false)` import and
 * therefore attaches long after the provider mounts. Renders nothing — it
 * exists only to call `useGateReporter` on its own delayed schedule so tests
 * can tell "gate reserved upfront" apart from "gate created on first use."
 */
function LateHeroProbe() {
  useGateReporter(HERO_3D_GATE);
  return null;
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

  it("reserves the hero gate before the hero component ever mounts, so a late mount changes nothing", async () => {
    // expectHero3d must be a stable reference across the rerender below —
    // a fresh closure each render would re-trigger the reserving effect and
    // reset the gates we're trying to observe settle.
    const expectHero3d = () => true;

    const { rerender } = render(
      <SiteReadyProvider expectHero3d={expectHero3d} minDisplayMs={0}>
        <Probe />
      </SiteReadyProvider>
    );

    // Fonts settle while the hero column has not mounted at all yet. If the
    // hero gate were only created when its own reporter first registered
    // (rather than reserved upfront by the provider), this is exactly the
    // moment fonts-alone would drive progress to 100.
    await flushFonts();
    const afterFonts = Number(progressText());
    expect(afterFonts).toBeLessThan(100);
    expect(afterFonts).toBe(10); // fonts ready (10) + hero reserved-but-pending (0) => 10

    // Now the hero column attaches, late, exactly like the real dynamic(ssr:false) import.
    await act(async () => {
      rerender(
        <SiteReadyProvider expectHero3d={expectHero3d} minDisplayMs={0}>
          <Probe />
          <LateHeroProbe />
        </SiteReadyProvider>
      );
    });

    // The slot was already reserved at mount, so a component attaching to it
    // later must not move the aggregate at all — there is nothing to "join."
    expect(Number(progressText())).toBe(afterFonts);
    expect(revealedText()).toBe("false");
  });
});

describe("useGateReporter", () => {
  it("no-ops outside a provider instead of throwing", () => {
    function Bare() {
      const reporter = useGateReporter(HERO_3D_GATE);
      reporter.setProgress(50);
      reporter.markReady();
      reporter.markFailed();
      return <span data-testid="ok">ok</span>;
    }
    render(<Bare />);
    expect(screen.getByTestId("ok").textContent).toBe("ok");
  });

  it("no-ops when the gate was never reserved", async () => {
    render(
      <SiteReadyProvider expectHero3d={() => false} minDisplayMs={0}>
        <Probe />
      </SiteReadyProvider>
    );

    await flushFonts();

    // hero-3d was never reserved (expectHero3d() is false here), so calling
    // through the Probe's hero reporter must not throw, must not resurrect
    // the gate, and must not perturb the aggregate.
    await act(async () => {
      screen.getByTestId("hero-half").click();
    });
    await act(async () => {
      screen.getByTestId("hero-ready").click();
    });
    await act(async () => {
      screen.getByTestId("hero-failed").click();
    });
    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    // Progress is driven solely by the fonts gate; the unreserved hero-3d
    // calls left no trace, and the provider still reveals normally.
    expect(progressText()).toBe("100");
    expect(revealedText()).toBe("true");
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
