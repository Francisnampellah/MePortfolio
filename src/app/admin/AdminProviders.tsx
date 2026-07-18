"use client";

import { ThemeProvider, ToastProvider } from "namps-ui";

/** Client boundary so Theme/Toast context share one module instance with AdminClient. */
export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attributeTarget="self">
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
