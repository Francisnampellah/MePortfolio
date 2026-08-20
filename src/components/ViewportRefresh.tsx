"use client";

import { useEffect } from "react";

const STORAGE_KEY = "meportfolio:viewport-sig";
const DEBOUNCE_MS = 450;

function viewportSignature() {
  // Width only: every layout-mode breakpoint in this app (`md`, `lg`) is a
  // min-width query. Mobile browsers grow/shrink innerHeight on their own as
  // the address bar collapses or reappears during scroll, with no resize or
  // rotation involved — keying on height as well turned that into a reload loop.
  return `${window.innerWidth}`;
}

/**
 * Hard-refresh when the viewport settles on a new width (resize / rotate).
 * Keeps full-page scroll and layout modes from getting stuck mid-breakpoint.
 */
export function ViewportRefresh() {
  useEffect(() => {
    const current = viewportSignature();
    try {
      sessionStorage.setItem(STORAGE_KEY, current);
    } catch {
      /* private mode — still listen, just can't guard as well */
    }

    let timer: number | undefined;

    const reloadIfChanged = () => {
      const next = viewportSignature();
      let prev = current;
      try {
        prev = sessionStorage.getItem(STORAGE_KEY) ?? current;
      } catch {
        /* ignore */
      }
      if (next === prev) return;
      try {
        sessionStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      window.location.reload();
    };

    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(reloadIfChanged, DEBOUNCE_MS);
    };

    const onOrientation = () => {
      window.clearTimeout(timer);
      // Orientation often reports old size for a frame — wait then reload.
      timer = window.setTimeout(reloadIfChanged, DEBOUNCE_MS);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientation);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientation);
    };
  }, []);

  return null;
}
