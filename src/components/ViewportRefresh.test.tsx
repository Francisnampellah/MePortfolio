import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ViewportRefresh } from "./ViewportRefresh";

function setViewport(width: number, height: number) {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: height });
}

describe("ViewportRefresh", () => {
  let reload: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    reload = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, reload },
    });
    setViewport(375, 812);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not reload when only height changes (mobile browser chrome show/hide)", () => {
    render(<ViewportRefresh />);

    // Mobile Safari/Chrome collapse their toolbar on scroll, which grows
    // innerHeight without the user ever resizing or rotating anything.
    setViewport(375, 690);
    window.dispatchEvent(new Event("resize"));
    vi.advanceTimersByTime(450);

    expect(reload).not.toHaveBeenCalled();
  });

  it("reloads when width changes (a real breakpoint-relevant resize)", () => {
    render(<ViewportRefresh />);

    setViewport(1024, 812);
    window.dispatchEvent(new Event("resize"));
    vi.advanceTimersByTime(450);

    expect(reload).toHaveBeenCalledTimes(1);
  });
});
