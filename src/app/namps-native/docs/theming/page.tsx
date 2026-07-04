import { PageHeader, Code } from "@/components/namps-native/Doc";
import { CodeBlock } from "namps-ui";

export default function Theming() {
  return (
    <>
      <PageHeader
        eyebrow="Docs"
        title="Theming"
        lede="Every value — color, space, radius, type, shadow, motion — resolves from the active theme. No component hardcodes a raw value."
      />

      <h2>Reading tokens</h2>
      <p>
        Use <Code>useTheme()</Code> anywhere inside a <Code>ThemeProvider</Code> to read the resolved
        token set for the current scheme.
      </p>
      <CodeBlock
        code={`import { View } from "react-native";
import { useTheme } from "namps-native";

function Panel() {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        padding: theme.space[4],
        borderRadius: theme.radius.lg,
      }}
    />
  );
}`}
      />

      <h2>Overriding the theme</h2>
      <p>
        Pass a partial theme to <Code>createTheme</Code> — the rest inherits from{" "}
        <Code>lightTheme</Code>/<Code>darkTheme</Code>.
      </p>
      <CodeBlock
        code={`import { ThemeProvider, createTheme, lightTheme } from "namps-native";

const brand = createTheme(lightTheme, { colors: { accent: "#2A6FDB" } });

<ThemeProvider light={brand}>{/* ... */}</ThemeProvider>;`}
      />

      <h2>Controlling the scheme</h2>
      <p>
        <Code>useColorSchemeControl()</Code> exposes the resolved <Code>scheme</Code>, the raw{" "}
        <Code>preference</Code> (which may be <Code>&quot;system&quot;</Code>), and a{" "}
        <Code>toggle()</Code> — this is exactly what drives the theme switch in this site&rsquo;s
        header.
      </p>
      <CodeBlock
        code={`const { scheme, preference, setPreference, toggle } = useColorSchemeControl();`}
      />

      <h2>Token groups</h2>
      <table className="props">
        <thead>
          <tr>
            <th style={{ width: "22%" }}>Group</th>
            <th style={{ width: "30%" }}>Access</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Color</code></td>
            <td><span className="type mono">theme.colors.*</span></td>
            <td>bg, surface, elevated, sunken, border, text, textMuted, accent, onAccent, success, warning, danger, info (+ *Soft)</td>
          </tr>
          <tr>
            <td><code>Spacing</code></td>
            <td><span className="type mono">theme.space[1..12]</span></td>
            <td>4-point scale — space[4] === 16</td>
          </tr>
          <tr>
            <td><code>Radius</code></td>
            <td><span className="type mono">theme.radius.*</span></td>
            <td>sm, md, lg, xl, full</td>
          </tr>
          <tr>
            <td><code>Type</code></td>
            <td><span className="type mono">theme.fontSize / fontFamily / fontWeight / lineHeight</span></td>
            <td>serif display / grotesque body / mono</td>
          </tr>
          <tr>
            <td><code>Elevation</code></td>
            <td><span className="type mono">theme.shadow.{"{sm,md,lg}"}</span></td>
            <td>warm-tinted, deepen in dark</td>
          </tr>
          <tr>
            <td><code>Motion</code></td>
            <td><span className="type mono">theme.motion.duration / easing</span></td>
            <td>easing.standard = [0.2, 0, 0, 1]</td>
          </tr>
          <tr>
            <td><code>Sizing</code></td>
            <td><span className="type mono">theme.sizing.{"{sm,md,lg}"}</span></td>
            <td>shared control heights/padding</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
