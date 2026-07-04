"use client";

import { useTheme } from "namps-native";
import { PageHeader } from "@/components/namps-native/Doc";

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 4px" }}>
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          background: hex,
          border: "1px solid var(--pui-border)",
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 12, fontFamily: "var(--pui-font-mono)", color: "var(--pui-muted)" }}>{hex}</div>
      </div>
    </div>
  );
}

export default function Colors() {
  const theme = useTheme();
  const c = theme.colors as unknown as Record<string, string>;

  const groups: { label: string; keys: string[] }[] = [
    { label: "Surfaces & text", keys: ["bg", "surface", "elevated", "sunken", "border", "borderStrong", "text", "textMuted", "textSubtle"] },
    { label: "Accent", keys: ["accent", "accentHover", "onAccent", "accentSoft"] },
    { label: "Status", keys: ["success", "successSoft", "warning", "warningSoft", "danger", "dangerSoft", "info", "infoSoft"] },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Foundations"
        title="Color"
        lede="A warm, low-saturation palette built on paper-like neutrals and a single clay accent. Colors are exposed as semantic tokens, never raw hex — themes and dark mode swap cleanly. These swatches read the live theme object, so toggling the header switch updates them."
      />
      {groups.map((g) => (
        <div key={g.label}>
          <h3>{g.label}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0 24px" }}>
            {g.keys
              .filter((k) => c[k])
              .map((k) => (
                <Swatch key={k} name={k} hex={c[k]} />
              ))}
          </div>
        </div>
      ))}
    </>
  );
}
