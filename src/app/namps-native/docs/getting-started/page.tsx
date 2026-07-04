import { PageHeader, Code } from "@/components/namps-native/Doc";
import { CodeBlock } from "namps-ui";

export default function GettingStarted() {
  return (
    <>
      <PageHeader
        eyebrow="Docs"
        title="Installation"
        lede="namps-native targets React Native and Expo. It renders live on this docs site itself via react-native-web — every example below is the real package, not a mockup."
      />

      <h2>1. Install</h2>
      <CodeBlock code={"npm i namps-native react-native-reanimated react-native-svg"} filename="terminal" />
      <p className="muted">
        Peer dependencies: <Code>react &gt;= 18</Code>, <Code>react-native &gt;= 0.72</Code>,{" "}
        <Code>react-native-reanimated &gt;= 3</Code>, <Code>react-native-svg &gt;= 13</Code>.
      </p>

      <h2>2. Load fonts &amp; the Reanimated plugin</h2>
      <p>
        Load <Code>Newsreader</Code>, <Code>Geist</Code>, and <Code>JetBrainsMono</Code> via{" "}
        <Code>expo-font</Code> (or Google Fonts on web), and add the Reanimated Babel plugin last in
        your project&rsquo;s Babel config.
      </p>
      <CodeBlock
        filename="babel.config.js"
        code={`module.exports = {
  presets: ["babel-preset-expo"],
  plugins: ["react-native-reanimated/plugin"],
};`}
      />

      <h2>3. Wrap with ThemeProvider</h2>
      <p>
        <Code>ThemeProvider</Code> resolves light/dark from a preference (<Code>system</Code> by
        default) and gives every component access to the token set via context.
      </p>
      <CodeBlock
        filename="App.tsx"
        code={`import { ThemeProvider, Card, Heading, Text, Button } from "namps-native";

export default function App() {
  return (
    <ThemeProvider defaultPreference="system">
      <Card variant="elevated" padding={5}>
        <Heading level={3}>Weekly digest</Heading>
        <Text tone="muted">Everything that changed while you were away.</Text>
        <Button onPress={open}>Open report</Button>
      </Card>
    </ThemeProvider>
  );
}`}
      />

      <h2>4. Use components</h2>
      <p>
        Stateful controls (<Code>Switch</Code>, <Code>Checkbox</Code>, <Code>Input</Code>&hellip;) are
        controlled via <Code>value</Code> + <Code>onValueChange</Code>, or uncontrolled via{" "}
        <Code>defaultValue</Code>.
      </p>
      <CodeBlock
        filename="Settings.tsx"
        code={`import { useState } from "react";
import { Switch, Text } from "namps-native";

export function Settings() {
  const [wifi, setWifi] = useState(true);
  return (
    <>
      <Switch value={wifi} onValueChange={setWifi} accessibilityLabel="Wi-Fi" />
      <Text tone="muted">{wifi ? "On" : "Off"}</Text>
    </>
  );
}`}
      />

      <h2>On the web</h2>
      <p className="muted">
        This site consumes namps-native the same way an app would, with{" "}
        <Code>react-native$</Code> aliased to <Code>react-native-web</Code> in{" "}
        <Code>next.config.mjs</Code> and the Reanimated Babel plugin wired into a{" "}
        <Code>babel.config.js</Code> using the <Code>next/babel</Code> preset.
      </p>
    </>
  );
}
