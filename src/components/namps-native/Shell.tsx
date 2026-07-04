"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeProvider, useColorSchemeControl, createTheme, lightTheme, darkTheme } from "namps-native";
import { Button as UIButton, Badge as UIBadge, Icons } from "namps-ui";
import { NAV } from "@/lib/namps-native-nav";

// Match the type family used on the namps-ui site (loaded once via "namps-ui/styles.css").
// Cast past the token literals — createTheme's DeepPartial ties fontFamily to the
// library's own default font names, but any valid CSS font-family string works at runtime.
const fontFamily = { display: "Newsreader", body: "Hanken Grotesk", mono: "JetBrains Mono" } as any;
const nnLightTheme = createTheme(lightTheme, { fontFamily });
const nnDarkTheme = createTheme(darkTheme, { fontFamily });

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultPreference="light" light={nnLightTheme} dark={nnDarkTheme}>
      <ShellChrome>{children}</ShellChrome>
    </ThemeProvider>
  );
}

function ShellChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { scheme, toggle } = useColorSchemeControl();

  return (
    <div className="nn-docs" data-theme={scheme}>
      <div className="shell">
        <header className="shell__header">
          <Link href="/namps-native" className="shell__brand">
            <span className="shell__logo">
              <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }}>
                <path d="M12 3.2 20 7.6v8.8L12 20.8 4 16.4V7.6z" />
                <path d="M12 3.2v17.6M4 7.6l8 4.4 8-4.4" />
              </svg>
            </span>
            namps-native
          </Link>
          <UIBadge tone="accent">v1.0</UIBadge>
          <div style={{ flex: 1 }} />
          <Link href="/">
            <UIButton variant="ghost" size="sm" leftIcon={<Icons.ChevronLeft />}>
              Portfolio
            </UIButton>
          </Link>
          <UIButton variant="secondary" size="sm" onClick={toggle} aria-label="Toggle color theme">
            {scheme === "light" ? "Dark" : "Light"}
          </UIButton>
        </header>

        <div className="shell__body">
          <aside className="shell__sidebar">
            {NAV.map((group) => (
              <nav key={group.label} className="nav-group">
                <div className="nav-group__label">{group.label}</div>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-link"
                    data-active={pathname === item.href || undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ))}
          </aside>

          <main className="shell__main">
            <article className="doc">{children}</article>
          </main>
        </div>
      </div>
    </div>
  );
}
