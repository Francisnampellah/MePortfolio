"use client";

import * as React from "react";
import { Button, Modal, Tooltip, DropdownMenu, MenuSeparator, Popover, Drawer, Field, Input, Icons } from "namps-ui";
import { PageHeader, Example, PropsTable } from "@/components/namps-ui/Doc";

export default function Overlays() {
  const [modal, setModal] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Overlays"
        lede="Layered surfaces — tooltips, dropdown menus, popovers, modals, and drawers. All close on Escape and outside click."
      />

      <h2>Tooltip</h2>
      <Example
        code={`<Tooltip label="Copied to clipboard">
  <Button variant="secondary">Hover me</Button>
</Tooltip>`}
      >
        <Tooltip label="Copied to clipboard">
          <Button variant="secondary">Hover me</Button>
        </Tooltip>
      </Example>

      <h2>DropdownMenu</h2>
      <Example
        code={`<DropdownMenu
  trigger={<Button variant="secondary">Account</Button>}
  items={[
    { label: "Profile", icon: <Icons.Info /> },
    { label: "Settings" },
    { label: "Sign out", tone: "danger" },
  ]}
/>`}
      >
        <DropdownMenu
          trigger={<Button variant="secondary" rightIcon={<Icons.ChevronDown className="pui-icon" />}>Account</Button>}
          items={[
            { label: "Profile", onSelect: () => {} },
            { label: "Settings", onSelect: () => {} },
            { label: "Sign out", tone: "danger", onSelect: () => {} },
          ]}
        />
      </Example>

      <h2>Popover</h2>
      <p className="muted">Like a menu, but holds arbitrary content.</p>
      <Example
        code={`<Popover trigger={<Button variant="secondary">Filters</Button>}>
  <Field label="Search"><Input placeholder="Name…" /></Field>
</Popover>`}
      >
        <Popover trigger={<Button variant="secondary">Filters</Button>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Search">
              <Input placeholder="Name…" />
            </Field>
            <Button block size="sm">Apply</Button>
          </div>
        </Popover>
      </Example>

      <h2>Modal</h2>
      <Example
        code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open dialog</Button>
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Revoke this key?"
  footer={<>
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={() => setOpen(false)}>Revoke</Button>
  </>}
>
  Revoking production will immediately break any service using it.
</Modal>`}
      >
        <Button onClick={() => setModal(true)}>Open dialog</Button>
        <Modal
          open={modal}
          onClose={() => setModal(false)}
          title="Revoke this key?"
          icon={
            <span style={{ width: 40, height: 40, borderRadius: 11, background: "var(--pui-red-bg)", color: "var(--pui-red)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.AlertTriangle style={{ width: 21, height: 21 }} />
            </span>
          }
          footer={
            <>
              <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setModal(false)}>Revoke key</Button>
            </>
          }
        >
          Revoking <span style={{ fontFamily: "var(--pui-font-mono)", color: "var(--pui-text)" }}>production</span> will
          immediately break any service using it. This action cannot be undone.
        </Modal>
      </Example>

      <h2>Drawer</h2>
      <Example
        code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open drawer</Button>
<Drawer open={open} onClose={() => setOpen(false)} side="right" title="Edit member">
  …form fields…
</Drawer>`}
      >
        <Button variant="secondary" onClick={() => setDrawer(true)}>Open drawer</Button>
        <Drawer
          open={drawer}
          onClose={() => setDrawer(false)}
          side="right"
          title="Edit member"
          footer={
            <>
              <Button variant="secondary" onClick={() => setDrawer(false)}>Cancel</Button>
              <Button onClick={() => setDrawer(false)}>Save</Button>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Name">
              <Input defaultValue="Sam Park" />
            </Field>
            <Field label="Email">
              <Input defaultValue="sam@acme.ai" />
            </Field>
          </div>
        </Drawer>
      </Example>

      <h2>Props</h2>
      <PropsTable
        rows={[
          { name: "Tooltip.label", type: "ReactNode", desc: "Bubble content; wraps a single child." },
          { name: "DropdownMenu.items", type: "{ label, icon?, onSelect?, tone? }[]", desc: "Simple list; or pass children for custom content." },
          { name: "DropdownMenu.align", type: '"start" | "end"', def: '"start"', desc: "Panel edge alignment." },
          { name: "Popover.trigger / children", type: "ReactNode", desc: "Toggle element and panel content." },
          { name: "Modal.open / onClose", type: "boolean / () => void", desc: "Controlled visibility." },
          { name: "Modal.title / icon / footer", type: "ReactNode", desc: "Header label, decorative icon, action row." },
          { name: "Drawer.side", type: '"left" | "right"', def: '"right"', desc: "Edge the sheet slides in from." },
        ]}
      />
    </>
  );
}
