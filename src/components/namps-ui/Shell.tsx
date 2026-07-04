"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle, Icons } from "namps-ui";
import { NAV } from "@/lib/namps-ui-nav";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="shell">
      <header className="shell__header">
        <Link href="/namps-ui" className="shell__brand">
          <span className="shell__logo">
            <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }}>
              <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" />
            </svg>
          </span>
          namps-ui
        </Link>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--pui-accent)",
            background: "var(--pui-accent-bg)",
            padding: "3px 9px",
            borderRadius: 999,
          }}
        >
          v0.1
        </span>
        <div style={{ flex: 1 }} />
        <Link href="/" style={{ fontSize: 14, fontWeight: 500, color: "var(--pui-muted)" }}>
          ← Portfolio
        </Link>
        <ThemeToggle />
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
  );
}

/** Re-export so pages can grab the icon set without a second import line. */
export { Icons };
