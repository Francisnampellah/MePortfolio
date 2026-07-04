"use client";

import { useState } from "react";
import { Button, IconButton, CheckIcon, CloseIcon, PlusIcon } from "namps-native";
import { PageHeader, Example, PropsTable } from "@/components/namps-native/Doc";

export default function Buttons() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Button & IconButton"
        lede="Solid, outlined, tinted, ghost, and destructive emphasis — one consistent API across every size and state."
      />

      <h2>Variants</h2>
      <Example
        code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="soft">Soft</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`}
      >
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </Example>

      <h2>Sizes</h2>
      <Example
        code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
      >
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Example>

      <h2>Loading & disabled</h2>
      <Example
        code={`<Button loading={loading} onPress={() => {
  setLoading(true);
  setTimeout(() => setLoading(false), 1200);
}}>
  {loading ? "Saving…" : "Save"}
</Button>
<Button disabled>Disabled</Button>`}
      >
        <Button
          loading={loading}
          onPress={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1200);
          }}
        >
          {loading ? "Saving…" : "Save"}
        </Button>
        <Button disabled>Disabled</Button>
      </Example>

      <h2>Icons</h2>
      <Example
        code={`<Button leftIcon={<PlusIcon />}>New</Button>
<Button rightIcon={<CheckIcon />} variant="secondary">Confirm</Button>`}
      >
        <Button leftIcon={<PlusIcon />}>New</Button>
        <Button rightIcon={<CheckIcon />} variant="secondary">
          Confirm
        </Button>
      </Example>

      <h2>IconButton</h2>
      <p className="muted">Icon-only controls require an accessibility label — there&rsquo;s no visible text.</p>
      <Example
        code={`<IconButton icon={<PlusIcon />} accessibilityLabel="Add" />
<IconButton icon={<CloseIcon />} accessibilityLabel="Close" variant="secondary" />
<IconButton icon={<CheckIcon />} accessibilityLabel="Confirm" round variant="soft" />`}
      >
        <IconButton icon={<PlusIcon />} accessibilityLabel="Add" />
        <IconButton icon={<CloseIcon />} accessibilityLabel="Close" variant="secondary" />
        <IconButton icon={<CheckIcon />} accessibilityLabel="Confirm" round variant="soft" />
      </Example>

      <h2>Button props</h2>
      <PropsTable
        rows={[
          { name: "variant", type: "primary · secondary · soft · ghost · danger", def: "primary", desc: "Visual emphasis." },
          { name: "size", type: "sm · md · lg", def: "md", desc: "Control height & padding." },
          { name: "loading", type: "boolean", def: "false", desc: "Shows a spinner and blocks presses." },
          { name: "disabled", type: "boolean", def: "false", desc: "Disables the button." },
          { name: "fullWidth", type: "boolean", def: "false", desc: "Stretch to fill the parent's width." },
          { name: "leftIcon / rightIcon", type: "ReactNode", desc: "Rendered before/after the label." },
          { name: "onPress", type: "(e: GestureResponderEvent) => void", desc: "Press handler." },
        ]}
      />

      <h2>IconButton props</h2>
      <PropsTable
        rows={[
          { name: "icon", type: "ReactNode", desc: "The icon element, required." },
          { name: "variant", type: "primary · secondary · soft · ghost · danger", def: "ghost", desc: "Visual emphasis." },
          { name: "size", type: "sm · md · lg", def: "md", desc: "Control size." },
          { name: "round", type: "boolean", def: "false", desc: "Fully rounded instead of the size radius." },
          { name: "accessibilityLabel", type: "string", desc: "Required — there is no visible text." },
        ]}
      />
    </>
  );
}
