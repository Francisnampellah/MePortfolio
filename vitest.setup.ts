import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// vitest.config.ts intentionally does not enable `test.globals`, so
// @testing-library/react's own auto-cleanup (which only registers when it
// finds a global `afterEach`) never fires. Register it explicitly instead.
afterEach(() => {
  cleanup();
});
