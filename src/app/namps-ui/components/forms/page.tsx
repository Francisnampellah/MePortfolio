"use client";

import * as React from "react";
import { Field, Input, SearchInput, Textarea, Select, Checkbox, Switch, RadioGroup, Slider } from "namps-ui";
import { PageHeader, Example, PropsTable } from "@/components/namps-ui/Doc";

export default function Forms() {
  const [plan, setPlan] = React.useState("pro");
  const [on, setOn] = React.useState(true);
  const [temp, setTemp] = React.useState(64);

  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Forms"
        lede="Inputs, selects, and selection controls with labels, hints, and validation — composable via the Field wrapper."
      />

      <h2>Field + Input</h2>
      <p className="muted">
        <code className="doc__inline-code">Field</code> renders the label and hint/error; pass any
        control as its child.
      </p>
      <Example
        layout="block"
        code={`<Field label="Workspace name" hint="Visible to all members.">
  <Input defaultValue="Acme AI" />
</Field>

<Field label="Billing email" error="Enter a valid email address.">
  <Input invalid defaultValue="acme@invalid" />
</Field>`}
      >
        <Field label="Workspace name" hint="Visible to all members.">
          <Input defaultValue="Acme AI" />
        </Field>
        <Field label="Billing email" error="Enter a valid email address.">
          <Input invalid defaultValue="acme@invalid" />
        </Field>
      </Example>

      <h2>Search, Select & Textarea</h2>
      <Example
        layout="block"
        code={`<SearchInput placeholder="Filter logs…" />

<Select options={[
  { label: "Claude Opus 4.6", value: "opus" },
  { label: "Claude Sonnet 4.6", value: "sonnet" },
]} />

<Textarea rows={3} defaultValue="You are a concise assistant." />`}
      >
        <SearchInput placeholder="Filter logs…" />
        <Select
          options={[
            { label: "Claude Opus 4.6", value: "opus" },
            { label: "Claude Sonnet 4.6", value: "sonnet" },
            { label: "Claude Haiku 4.2", value: "haiku" },
          ]}
        />
        <Textarea rows={3} defaultValue="You are a concise, helpful assistant for the Acme AI team." />
      </Example>

      <h2>Checkbox & Switch</h2>
      <Example
        code={`<Checkbox label="Accept terms" defaultChecked />
<Checkbox label="Send updates" />
<Switch checked={on} onChange={() => setOn(!on)} />`}
      >
        <Checkbox label="Accept terms" defaultChecked />
        <Checkbox label="Send updates" />
        <Switch checked={on} onChange={() => setOn(!on)} />
      </Example>

      <h2>RadioGroup</h2>
      <Example
        layout="block"
        code={`const [plan, setPlan] = useState("pro");

<RadioGroup
  name="plan"
  value={plan}
  onValueChange={setPlan}
  options={[
    { value: "starter", title: "Starter", description: "$0 · 1M tokens / mo" },
    { value: "pro", title: "Pro", description: "$80 · 20M tokens / mo" },
    { value: "scale", title: "Scale", description: "Custom · volume pricing" },
  ]}
/>`}
      >
        <div style={{ maxWidth: 360, width: "100%" }}>
          <RadioGroup
            name="plan"
            value={plan}
            onValueChange={setPlan}
            options={[
              { value: "starter", title: "Starter", description: "$0 · 1M tokens / mo" },
              { value: "pro", title: "Pro", description: "$80 · 20M tokens / mo" },
              { value: "scale", title: "Scale", description: "Custom · volume pricing" },
            ]}
          />
        </div>
      </Example>

      <h2>Slider</h2>
      <Example
        layout="block"
        code={`const [temp, setTemp] = useState(64);

<Slider value={temp} onValueChange={setTemp} />`}
      >
        <div style={{ maxWidth: 360, width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
            <span>Temperature</span>
            <span style={{ fontFamily: "var(--pui-font-mono)", color: "var(--pui-accent)" }}>
              {(temp / 100).toFixed(2)}
            </span>
          </div>
          <Slider value={temp} onValueChange={setTemp} />
        </div>
      </Example>

      <h2>Key props</h2>
      <PropsTable
        rows={[
          { name: "Field.label / hint / error", type: "ReactNode", desc: "Label, helper text, and error message (error replaces hint)." },
          { name: "Input.invalid", type: "boolean", def: "false", desc: "Red border + focus ring for validation failures." },
          { name: "Select.options", type: "{ label, value }[]", desc: "Convenience prop; or pass <option> children." },
          { name: "Checkbox / Switch", type: "input attrs", desc: "Controlled via checked / onChange; uncontrolled via defaultChecked." },
          { name: "RadioGroup", type: "value, onValueChange, options[]", desc: "Card-style single-select group." },
          { name: "Slider", type: "value, onValueChange, min?, max?", desc: "Controlled numeric range." },
        ]}
      />
    </>
  );
}
