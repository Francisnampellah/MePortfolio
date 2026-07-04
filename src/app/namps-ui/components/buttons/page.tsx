"use client";

import { Button, Icons } from "namps-ui";
import { PageHeader, Example, PropsTable } from "@/components/namps-ui/Doc";

export default function Buttons() {
  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Button"
        lede="The primary action element. Five variants, three sizes, with icon, loading, and disabled states."
      />

      <h2>Variants</h2>
      <Example
        code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`}
      >
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
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

      <h2>With icons</h2>
      <Example
        code={`import { Icons } from "namps-ui";

<Button leftIcon={<Icons.Plus className="pui-icon" />}>Create</Button>
<Button variant="secondary" rightIcon={<Icons.ArrowRight className="pui-icon" />}>
  Continue
</Button>
<Button iconOnly aria-label="Search">
  <Icons.Search className="pui-icon" />
</Button>`}
      >
        <Button leftIcon={<Icons.Plus className="pui-icon" />}>Create</Button>
        <Button variant="secondary" rightIcon={<Icons.ArrowRight className="pui-icon" />}>
          Continue
        </Button>
        <Button iconOnly aria-label="Search">
          <Icons.Search className="pui-icon" />
        </Button>
      </Example>

      <h2>States</h2>
      <Example
        code={`<Button loading>Saving</Button>
<Button disabled>Disabled</Button>
<Button block>Full width</Button>`}
      >
        <Button loading>Saving</Button>
        <Button disabled>Disabled</Button>
        <div style={{ width: "100%" }}>
          <Button block>Full width</Button>
        </div>
      </Example>

      <h2>Props</h2>
      <PropsTable
        rows={[
          { name: "variant", type: '"primary" | "secondary" | "outline" | "ghost" | "danger"', def: '"primary"', desc: "Visual style." },
          { name: "size", type: '"sm" | "md" | "lg"', def: '"md"', desc: "Control size." },
          { name: "loading", type: "boolean", def: "false", desc: "Shows a spinner and disables the button." },
          { name: "iconOnly", type: "boolean", def: "false", desc: "Square icon button. Provide an aria-label." },
          { name: "block", type: "boolean", def: "false", desc: "Stretch to full container width." },
          { name: "leftIcon / rightIcon", type: "ReactNode", desc: "Icon rendered before / after the label." },
          { name: "...props", type: "button HTML attrs", desc: "onClick, type, disabled, etc." },
        ]}
      />
    </>
  );
}
