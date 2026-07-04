"use client";

import * as React from "react";
import { CodeBlock } from "namps-ui";

/* ---- Live example with source ---- */
export interface ExampleProps {
  children: React.ReactNode;
  code?: string;
  layout?: "row" | "block" | "center";
  filename?: string;
}
export function Example({ children, code, layout = "row", filename = "example.tsx" }: ExampleProps) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="example">
      <div className="example__preview" data-layout={layout === "row" ? undefined : layout}>
        {children}
      </div>
      {code && (
        <>
          <div className="example__bar">
            <span>{filename}</span>
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              style={{
                background: "none",
                border: "1px solid var(--pui-border-strong)",
                borderRadius: 7,
                padding: "4px 10px",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--pui-muted)",
                cursor: "pointer",
                fontFamily: "var(--pui-font-sans)",
              }}
            >
              {show ? "Hide code" : "Show code"}
            </button>
          </div>
          {show && <CodeBlock code={code} />}
        </>
      )}
    </div>
  );
}

/* ---- Props reference table ---- */
export interface PropRow {
  name: string;
  type: string;
  def?: string;
  desc: string;
}
export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <table className="props">
      <thead>
        <tr>
          <th style={{ width: "22%" }}>Prop</th>
          <th style={{ width: "30%" }}>Type</th>
          <th style={{ width: "14%" }}>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td>
              <code>{r.name}</code>
            </td>
            <td>
              <span className="type mono">{r.type}</span>
            </td>
            <td>{r.def ? <span className="mono" style={{ color: "var(--pui-muted)" }}>{r.def}</span> : "—"}</td>
            <td>{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---- Page heading ---- */
export function PageHeader({ eyebrow, title, lede }: { eyebrow?: string; title: string; lede?: string }) {
  return (
    <header style={{ marginBottom: 8 }}>
      {eyebrow && <div className="doc__eyebrow">{eyebrow}</div>}
      <h1>{title}</h1>
      {lede && <p className="doc__lede">{lede}</p>}
    </header>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return <code className="doc__inline-code">{children}</code>;
}
