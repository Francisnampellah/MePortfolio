"use client";

import { useState } from "react";
import { Input, Checkbox, Switch, Text } from "namps-native";
import { PageHeader, Example, PropsTable } from "@/components/namps-native/Doc";

export default function Forms() {
  const [email, setEmail] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [wifi, setWifi] = useState(true);

  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Input, Checkbox, Switch"
        lede="Controlled via value + onValueChange (or onChangeText), or uncontrolled via defaultValue — the same pattern across every field."
      />

      <h2>Input</h2>
      <Example
        layout="block"
        code={`const [email, setEmail] = useState("");

<Input
  label="Email"
  placeholder="you@example.com"
  value={email}
  onChangeText={setEmail}
  helperText="We'll never share it."
/>`}
      >
        <div style={{ maxWidth: 320, width: "100%" }}>
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            helperText="We'll never share it."
          />
        </div>
      </Example>

      <h2>Input — error state</h2>
      <Example
        code={`<Input label="Email" value="not-an-email" error="Enter a valid email address." />`}
      >
        <div style={{ maxWidth: 320, width: "100%" }}>
          <Input label="Email" value="not-an-email" onChangeText={() => {}} error="Enter a valid email address." />
        </div>
      </Example>

      <h2>Checkbox</h2>
      <Example
        code={`const [marketing, setMarketing] = useState(false);

<Checkbox label="Email me product updates" value={marketing} onValueChange={setMarketing} />`}
      >
        <Checkbox label="Email me product updates" value={marketing} onValueChange={setMarketing} />
      </Example>

      <h2>Switch</h2>
      <Example
        code={`const [wifi, setWifi] = useState(true);

<Switch value={wifi} onValueChange={setWifi} accessibilityLabel="Wi-Fi" />`}
      >
        <Switch value={wifi} onValueChange={setWifi} accessibilityLabel="Wi-Fi" />
        <Text tone="muted">{wifi ? "On" : "Off"}</Text>
      </Example>

      <h2>Input props</h2>
      <PropsTable
        rows={[
          { name: "label", type: "string", desc: "Field label rendered above the control." },
          { name: "helperText", type: "string", desc: "Helper text below the control." },
          { name: "error", type: "string", desc: "Error message — sets the error visual state, replaces helperText." },
          { name: "size", type: "sm · md · lg", def: "md", desc: "Control size." },
          { name: "leftAdornment / rightAdornment", type: "ReactNode", desc: "Rendered inside, before/after the text." },
          { name: "value / onChangeText", type: "string / (text: string) => void", desc: "Controlled state." },
        ]}
      />

      <h2>Switch & Checkbox props</h2>
      <PropsTable
        rows={[
          { name: "value", type: "boolean", desc: "Controlled value." },
          { name: "defaultValue", type: "boolean", def: "false", desc: "Uncontrolled initial value." },
          { name: "onValueChange", type: "(value: boolean) => void", desc: "Called with the next value on toggle." },
          { name: "label", type: "string", desc: "Checkbox only — optional inline label." },
          { name: "accessibilityLabel", type: "string", desc: "Switch — required, there is no visible label." },
        ]}
      />
    </>
  );
}
