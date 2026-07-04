"use client";

import { Card, Badge, Heading, Text } from "namps-native";
import { PageHeader, Example, PropsTable } from "@/components/namps-native/Doc";

export default function Display() {
  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Card & Badge"
        lede="Card is the primary container surface, mapping straight to elevation tokens. Badge is a small, static status marker."
      />

      <h2>Card variants</h2>
      <Example
        layout="block"
        code={`<Card variant="outlined" padding={5}>
  <Heading level={4}>Outlined</Heading>
  <Text tone="muted">Default surface, hairline border.</Text>
</Card>
<Card variant="elevated" padding={5}>
  <Heading level={4}>Elevated</Heading>
  <Text tone="muted">Raised surface with a soft shadow.</Text>
</Card>
<Card variant="filled" padding={5}>
  <Heading level={4}>Filled</Heading>
  <Text tone="muted">Sunken background, no border.</Text>
</Card>`}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, width: "100%" }}>
          <Card variant="outlined" padding={5}>
            <Heading level={4}>Outlined</Heading>
            <Text tone="muted">Default surface, hairline border.</Text>
          </Card>
          <Card variant="elevated" padding={5}>
            <Heading level={4}>Elevated</Heading>
            <Text tone="muted">Raised surface with a soft shadow.</Text>
          </Card>
          <Card variant="filled" padding={5}>
            <Heading level={4}>Filled</Heading>
            <Text tone="muted">Sunken background, no border.</Text>
          </Card>
        </div>
      </Example>

      <h2>Badge status</h2>
      <Example
        code={`<Badge status="neutral">Neutral</Badge>
<Badge status="info">Info</Badge>
<Badge status="success" dot>Active</Badge>
<Badge status="warning">Pending</Badge>
<Badge status="danger">Failed</Badge>`}
      >
        <Badge status="neutral">Neutral</Badge>
        <Badge status="info">Info</Badge>
        <Badge status="success" dot>
          Active
        </Badge>
        <Badge status="warning">Pending</Badge>
        <Badge status="danger">Failed</Badge>
      </Example>

      <h2>Card props</h2>
      <PropsTable
        rows={[
          { name: "variant", type: "outlined · elevated · filled", def: "outlined", desc: "Surface treatment, maps straight to elevation tokens." },
          { name: "padding", type: "space token key", def: "4", desc: "Inner padding (4 = 16px)." },
          { name: "onPress", type: "(e: GestureResponderEvent) => void", desc: "Makes the whole card pressable." },
        ]}
      />

      <h2>Badge props</h2>
      <PropsTable
        rows={[
          { name: "status", type: "info · success · warning · danger · neutral", def: "neutral", desc: "Semantic status → color." },
          { name: "dot", type: "boolean", def: "false", desc: "Shows a leading dot." },
        ]}
      />
    </>
  );
}
