"use client";

import { PageHeader } from "@/components/namps-ui/Doc";

const NEUTRALS = [
  ["Cloud", "#FAF9F5", "--pui-bg"],
  ["Ivory", "#F1EEE6", "--pui-panel"],
  ["White", "#FFFFFF", "--pui-card"],
  ["Ink", "#1A1915", "--pui-text"],
  ["Slate", "#78746C", "--pui-muted"],
];
const BRAND = [
  ["Clay", "#CC785C", "--pui-accent"],
  ["Clay Deep", "#B5614A", "--pui-accent-strong"],
];
const SEMANTIC = [
  ["Sage", "#3E7B53", "--pui-green"],
  ["Ochre", "#946E1E", "--pui-amber"],
  ["Rust", "#B14638", "--pui-red"],
  ["Steel", "#42699B", "--pui-blue"],
];

function Swatches({ rows }: { rows: string[][] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginTop: 12 }}>
      {rows.map(([name, hex, token]) => (
        <div key={name}>
          <div
            style={{
              height: 64,
              borderRadius: 11,
              border: "1px solid var(--pui-border)",
              background: hex,
            }}
          />
          <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, color: "var(--pui-muted)", fontFamily: "var(--pui-font-mono)" }}>
            {hex}
          </div>
          <div style={{ fontSize: 11, color: "var(--pui-muted)", fontFamily: "var(--pui-font-mono)" }}>
            {token}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Colors() {
  return (
    <>
      <PageHeader
        eyebrow="Foundations"
        title="Color"
        lede="Warm neutrals carry the interface; clay leads; muted semantics signal state. Each color is a CSS token with a matching dark-mode value."
      />
      <h2>Neutrals</h2>
      <p className="muted">The paper-warm surfaces that form the canvas.</p>
      <Swatches rows={NEUTRALS} />
      <h2>Brand</h2>
      <p className="muted">Clay is the single accent &mdash; used sparingly for primary actions and focus.</p>
      <Swatches rows={BRAND} />
      <h2>Semantic</h2>
      <p className="muted">Muted, never neon. Each has a soft <code className="doc__inline-code">-bg</code> companion for fills.</p>
      <Swatches rows={SEMANTIC} />
    </>
  );
}
