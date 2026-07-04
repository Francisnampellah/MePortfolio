import { PageHeader, Code } from "@/components/namps-ui/Doc";
import { CodeBlock } from "namps-ui";

const TOKENS: Array<[string, string]> = [
  ["--pui-bg", "App background"],
  ["--pui-panel", "Subtle raised / muted surface"],
  ["--pui-card", "Card & popover surface"],
  ["--pui-text", "Primary text"],
  ["--pui-muted", "Secondary text"],
  ["--pui-border", "Hairline borders"],
  ["--pui-border-strong", "Input / control borders"],
  ["--pui-accent", "Brand accent (clay)"],
  ["--pui-accent-strong", "Accent hover"],
  ["--pui-green / amber / red / blue", "Semantic colors (+ matching -bg)"],
  ["--pui-radius / -sm / -lg / -xl", "Corner radii"],
  ["--pui-shadow / -lg", "Elevation"],
  ["--pui-font-sans / -serif / -mono", "Type families"],
];

export default function Theming() {
  return (
    <>
      <PageHeader
        eyebrow="Getting started"
        title="Theming"
        lede="Every visual value is a CSS custom property. Switch light/dark with a hook, or re-skin the whole system by overriding tokens."
      />

      <h2>Switching theme</h2>
      <p>
        Use the <Code>useTheme()</Code> hook or the ready-made <Code>ThemeToggle</Code> button.
      </p>
      <CodeBlock
        filename="ThemeButton.tsx"
        code={`"use client";
import { useTheme } from "namps-ui";

export function ThemeButton() {
  const { theme, toggle, setTheme } = useTheme();
  return <button onClick={toggle}>Current: {theme}</button>;
}`}
      />

      <h2>Overriding tokens</h2>
      <p>
        Define the <Code>--pui-*</Code> variables anywhere in your own CSS to re-skin. Scope them to{" "}
        <Code>:root</Code> for global changes, or to a wrapper for local theming.
      </p>
      <CodeBlock
        filename="brand.css"
        code={`:root {
  --pui-accent: #4f7a5b;        /* swap clay for sage */
  --pui-accent-strong: #3f6149;
  --pui-radius: 12px;           /* rounder everywhere */
  --pui-font-sans: "Inter", system-ui, sans-serif;
}`}
      />

      <h2>Token reference</h2>
      <table className="props">
        <thead>
          <tr>
            <th style={{ width: "42%" }}>Token</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {TOKENS.map(([name, role]) => (
            <tr key={name}>
              <td>
                <code>{name}</code>
              </td>
              <td>{role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted">
        The full set, with light and dark values, lives in <Code>namps-ui/styles.css</Code>.
      </p>
    </>
  );
}
