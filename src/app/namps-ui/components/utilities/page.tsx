"use client";

import * as React from "react";
import { Separator, Kbd, Link, ToggleGroup, Stepper, CodeBlock, List, ListItem, Icons } from "namps-ui";
import { PageHeader, Example, PropsTable } from "@/components/namps-ui/Doc";

export default function Utilities() {
  const [align, setAlign] = React.useState("left");

  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Utilities"
        lede="Small building blocks — separators, keyboard hints, links, toggle groups, steppers, code blocks, and lists."
      />

      <h2>Separator & Kbd</h2>
      <Example
        code={`<span>Save</span>
<Kbd>⌘</Kbd><Kbd>S</Kbd>
<Separator />`}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14 }}>Save</span>
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
          <Separator orientation="vertical" />
          <span style={{ fontSize: 14 }}>Search</span>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
      </Example>

      <h2>Link</h2>
      <Example
        code={`<Link href="/docs/theming">Read the theming guide</Link>
<Link href="https://npmjs.com" external>View on npm</Link>`}
      >
        <Link href="#">Read the theming guide</Link>
        <Link href="#" external>
          View on npm
        </Link>
      </Example>

      <h2>ToggleGroup</h2>
      <Example
        code={`const [align, setAlign] = useState("left");

<ToggleGroup
  value={align}
  onValueChange={setAlign}
  options={[
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
  ]}
/>`}
      >
        <ToggleGroup
          value={align}
          onValueChange={setAlign}
          options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ]}
        />
      </Example>

      <h2>Stepper</h2>
      <Example
        layout="block"
        code={`<Stepper current={1} steps={[
  { label: "Account", description: "Create your login" },
  { label: "Workspace", description: "Name your team" },
  { label: "Invite", description: "Add teammates" },
]} />`}
      >
        <Stepper
          current={1}
          steps={[
            { label: "Account", description: "Create your login" },
            { label: "Workspace", description: "Name your team" },
            { label: "Invite", description: "Add teammates" },
          ]}
        />
      </Example>

      <h2>CodeBlock</h2>
      <Example
        layout="block"
        code={`<CodeBlock filename="install.sh" code="npm install namps-ui" />`}
      >
        <div style={{ width: "100%" }}>
          <CodeBlock filename="install.sh" code={"npm install namps-ui"} />
        </div>
      </Example>

      <h2>List</h2>
      <Example
        layout="block"
        code={`<List>
  <ListItem>Production key · sk-ant-•••• 4a91</ListItem>
  <ListItem>Staging key · sk-ant-•••• 7c30</ListItem>
</List>`}
      >
        <div style={{ width: "100%" }}>
          <List>
            <ListItem>
              <Icons.CheckCircle className="pui-icon" style={{ width: 16, height: 16, color: "var(--pui-green)" }} />
              Production key · sk-ant-•••• 4a91
            </ListItem>
            <ListItem>
              <Icons.CheckCircle className="pui-icon" style={{ width: 16, height: 16, color: "var(--pui-green)" }} />
              Staging key · sk-ant-•••• 7c30
            </ListItem>
          </List>
        </div>
      </Example>

      <h2>Props</h2>
      <PropsTable
        rows={[
          { name: "Separator.orientation", type: '"horizontal" | "vertical"', def: '"horizontal"', desc: "Divider direction." },
          { name: "Link.external", type: "boolean", desc: "Adds target=_blank + rel=noreferrer." },
          { name: "ToggleGroup", type: "value, onValueChange, options[]", desc: "Single-select bordered toggle (options accept icons)." },
          { name: "Stepper.steps / current", type: "Step[] / number", desc: "Steps before current render as complete." },
          { name: "CodeBlock.code / filename", type: "string / ReactNode", desc: "Source text and optional title bar." },
          { name: "List / ListItem", type: "containers", desc: "Bordered list with divided rows." },
        ]}
      />
    </>
  );
}
