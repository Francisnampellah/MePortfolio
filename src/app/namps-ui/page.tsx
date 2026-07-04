"use client";

import Link from "next/link";
import { Button, Badge, Card, Icons } from "namps-ui";

export default function Home() {
  return (
    <>
      <div className="doc__eyebrow">Design system · 33 components</div>
      <h1 style={{ fontSize: 52, maxWidth: "16ch" }}>
        Components, crafted with warmth and clarity.
      </h1>
      <p className="doc__lede">
        A complete, accessible React component library that mirrors Anthropic&rsquo;s interface —
        paper-warm surfaces, a confident clay accent, and an editorial type system. Built for
        modular, scalable Next.js.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "24px 0 8px" }}>
        <Link href="/namps-ui/docs/getting-started">
          <Button size="lg" rightIcon={<Icons.ArrowRight className="pui-icon" />}>
            Get started
          </Button>
        </Link>
        <Link href="/namps-ui/components/buttons">
          <Button size="lg" variant="secondary">
            Browse components
          </Button>
        </Link>
      </div>

      <h2>Why namps-ui</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginTop: 18,
        }}
      >
        {[
          {
            icon: <Icons.CheckCircle className="pui-icon" style={{ width: 22, height: 22 }} />,
            title: "Accessible by default",
            body: "Keyboard navigation, focus rings, ARIA roles, and reduced-motion-friendly transitions throughout.",
          },
          {
            icon: <Icons.Sun className="pui-icon" style={{ width: 22, height: 22 }} />,
            title: "Light & dark",
            body: "One data-theme attribute flips every token. Persisted automatically via ThemeProvider.",
          },
          {
            icon: <Icons.Sort className="pui-icon" style={{ width: 22, height: 22 }} />,
            title: "Token-driven",
            body: "Every value is a --pui-* CSS variable. Re-skin the whole system from your own stylesheet.",
          },
        ].map((f) => (
          <Card key={f.title}>
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 11,
                background: "var(--pui-accent-bg)",
                color: "var(--pui-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              {f.icon}
            </span>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 13.5, color: "var(--pui-muted)", lineHeight: 1.55 }}>
              {f.body}
            </div>
          </Card>
        ))}
      </div>

      <h2>What&rsquo;s included</h2>
      <p className="muted">
        Actions, forms, display, disclosure, data, navigation, feedback, overlays, and utilities.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        {[
          "Button", "Input", "Textarea", "Select", "Checkbox", "Switch", "RadioGroup", "Slider",
          "Badge", "Tag", "Avatar", "Card", "StatCard", "Progress", "Spinner", "Skeleton",
          "EmptyState", "Accordion", "Tabs", "Table", "Breadcrumbs", "Pagination", "Segmented",
          "Alert", "Toast", "Tooltip", "DropdownMenu", "Modal", "Popover", "Drawer", "ToggleGroup",
          "Stepper", "CodeBlock",
        ].map((c) => (
          <Badge key={c}>{c}</Badge>
        ))}
      </div>
    </>
  );
}
