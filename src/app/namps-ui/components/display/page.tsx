"use client";

import { Badge, Tag, Avatar, AvatarGroup, Card, StatCard, Progress, Spinner, Skeleton, EmptyState, Button, Icons } from "namps-ui";
import { PageHeader, Example, PropsTable } from "@/components/namps-ui/Doc";

export default function Display() {
  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Display"
        lede="Surfaces and status: badges, tags, avatars, cards, stats, and loading affordances."
      />

      <h2>Badge & Tag</h2>
      <Example
        code={`<Badge tone="green" dot>Active</Badge>
<Badge tone="amber" dot>Idle</Badge>
<Badge tone="accent">New</Badge>
<Badge tone="green" solid>Paid</Badge>
<Tag onRemove={() => {}}>design</Tag>`}
      >
        <Badge tone="green" dot>Active</Badge>
        <Badge tone="amber" dot>Idle</Badge>
        <Badge tone="red" dot>Revoked</Badge>
        <Badge tone="accent">New</Badge>
        <Badge tone="green" solid>Paid</Badge>
        <Tag onRemove={() => {}}>design</Tag>
      </Example>

      <h2>Avatar</h2>
      <Example
        code={`<Avatar name="Jordan Keller" size="sm" tone="blue" />
<Avatar name="Rosa Mendez" size="md" />
<Avatar name="Lena Wu" size="lg" tone="amber" status="online" />

<AvatarGroup max={3}>
  <Avatar name="Jordan Keller" tone="blue" />
  <Avatar name="Rosa Mendez" />
  <Avatar name="Sam Park" tone="green" />
  <Avatar name="Lena Wu" tone="amber" />
</AvatarGroup>`}
      >
        <Avatar name="Jordan Keller" size="sm" tone="blue" />
        <Avatar name="Rosa Mendez" size="md" />
        <Avatar name="Lena Wu" size="lg" tone="amber" status="online" />
        <AvatarGroup max={3}>
          <Avatar name="Jordan Keller" tone="blue" />
          <Avatar name="Rosa Mendez" />
          <Avatar name="Sam Park" tone="green" />
          <Avatar name="Lena Wu" tone="amber" />
        </AvatarGroup>
      </Example>

      <h2>Card & StatCard</h2>
      <Example
        layout="block"
        code={`<StatCard label="Requests" value="1.24M" delta={{ value: "12.4%", direction: "up" }} />

<Card>
  <strong>Fast inference</strong>
  <p>Stream responses in milliseconds.</p>
</Card>`}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, width: "100%" }}>
          <StatCard label="Requests" value="1.24M" delta={{ value: "12.4%", direction: "up" }} />
          <StatCard label="Tokens" value="38.9B" delta={{ value: "8.1%", direction: "up" }} />
          <StatCard label="Spend" value="$9,420" delta={{ value: "3.2%", direction: "down" }} />
        </div>
      </Example>

      <h2>Progress, Spinner & Skeleton</h2>
      <Example
        layout="block"
        code={`<Progress value={72} />
<Progress />            {/* indeterminate */}
<Spinner />
<Skeleton width="60%" />`}
      >
        <Progress value={72} />
        <Progress />
        <div style={{ display: "flex", alignItems: "center", gap: 20, width: "100%" }}>
          <Spinner />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
            <Skeleton width="55%" />
            <Skeleton width="80%" />
            <Skeleton width="40%" />
          </div>
        </div>
      </Example>

      <h2>EmptyState</h2>
      <Example
        layout="center"
        code={`<EmptyState
  icon={<Icons.Search />}
  title="No keys yet"
  description="Create your first API key to start sending requests."
  action={<Button leftIcon={<Icons.Plus className="pui-icon" />}>Create key</Button>}
/>`}
      >
        <div style={{ maxWidth: 420, width: "100%" }}>
          <EmptyState
            icon={<Icons.Search style={{ width: 26, height: 26 }} />}
            title="No keys yet"
            description="Create your first API key to start sending requests to the Claude API."
            action={<Button leftIcon={<Icons.Plus className="pui-icon" />}>Create key</Button>}
          />
        </div>
      </Example>

      <h2>Key props</h2>
      <PropsTable
        rows={[
          { name: "Badge.tone", type: '"neutral" | "green" | "amber" | "red" | "blue" | "accent"', def: '"neutral"', desc: "Color." },
          { name: "Badge.solid / dot", type: "boolean", desc: "Filled style / leading status dot." },
          { name: "Tag.onRemove", type: "() => void", desc: "Renders a close button when provided." },
          { name: "Avatar.name", type: "string", desc: "Used for initials fallback and title." },
          { name: "Avatar.size / tone / status", type: "enum", desc: "sm|md|lg · accent|blue|green|amber · online|busy|away." },
          { name: "AvatarGroup.max", type: "number", desc: "Collapse overflow into a +N chip." },
          { name: "StatCard.delta", type: "{ value, direction }", desc: "Trend indicator (up green / down red)." },
          { name: "Progress.value", type: "number (0–100)", desc: "Omit for an indeterminate bar." },
        ]}
      />
    </>
  );
}
