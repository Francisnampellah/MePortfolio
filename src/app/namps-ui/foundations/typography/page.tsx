"use client";

import { PageHeader } from "@/components/namps-ui/Doc";

const SCALE = [
  { sample: "Display", text: "The quick brown fox", font: "var(--pui-font-serif)", size: 40, weight: 500, note: "Newsreader 500" },
  { sample: "Heading", text: "The quick brown fox", font: "var(--pui-font-sans)", size: 26, weight: 600, note: "Hanken Grotesk 600" },
  { sample: "Subheading", text: "The quick brown fox", font: "var(--pui-font-sans)", size: 18, weight: 600, note: "Hanken Grotesk 600" },
  { sample: "Body", text: "The quick brown fox jumps over the lazy dog.", font: "var(--pui-font-sans)", size: 15, weight: 400, note: "Hanken Grotesk 400" },
  { sample: "Caption", text: "The quick brown fox jumps over the lazy dog.", font: "var(--pui-font-sans)", size: 13, weight: 400, note: "Hanken Grotesk 400 · muted" },
  { sample: "Mono", text: "const claude = await anthropic.run()", font: "var(--pui-font-mono)", size: 14, weight: 400, note: "JetBrains Mono 400" },
];

export default function Typography() {
  return (
    <>
      <PageHeader
        eyebrow="Foundations"
        title="Typography"
        lede="Newsreader sets an editorial display voice; Hanken Grotesk runs the interface; JetBrains Mono handles code. Anthropic's real faces (Styrene, Tiempos) are proprietary — these are close free substitutes, swappable via --pui-font-* tokens."
      />
      <div
        style={{
          marginTop: 18,
          border: "1px solid var(--pui-border)",
          borderRadius: "var(--pui-radius-lg)",
          overflow: "hidden",
          background: "var(--pui-card)",
        }}
      >
        {SCALE.map((row, i) => (
          <div
            key={row.sample}
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 24,
              padding: "18px 22px",
              borderTop: i === 0 ? "none" : "1px solid var(--pui-border)",
            }}
          >
            <span
              style={{
                fontFamily: row.font,
                fontSize: row.size,
                fontWeight: row.weight,
                letterSpacing: row.size > 24 ? "-0.02em" : undefined,
                color: row.sample === "Caption" ? "var(--pui-muted)" : "var(--pui-text)",
              }}
            >
              {row.text}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--pui-muted)",
                fontFamily: "var(--pui-font-mono)",
                whiteSpace: "nowrap",
              }}
            >
              {row.note}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
