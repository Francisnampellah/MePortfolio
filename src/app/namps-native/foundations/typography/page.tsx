"use client";

import { Heading, Text } from "namps-native";
import { PageHeader, Example } from "@/components/namps-native/Doc";

export default function Typography() {
  return (
    <>
      <PageHeader
        eyebrow="Foundations"
        title="Typography"
        lede="A serif display face for headings, a neutral grotesque for body copy, and a mono face for code — three families, one scale."
      />

      <h2>Headings</h2>
      <Example
        layout="block"
        code={`<Heading level={1}>Heading level 1</Heading>
<Heading level={2}>Heading level 2</Heading>
<Heading level={3}>Heading level 3</Heading>
<Heading level={4}>Heading level 4</Heading>`}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Heading level={1}>Heading level 1</Heading>
          <Heading level={2}>Heading level 2</Heading>
          <Heading level={3}>Heading level 3</Heading>
          <Heading level={4}>Heading level 4</Heading>
        </div>
      </Example>

      <h2>Text variants</h2>
      <Example
        layout="block"
        code={`<Text variant="bodyLg">Body large</Text>
<Text variant="body">Body — the default reading size.</Text>
<Text variant="label">Label</Text>
<Text variant="caption" tone="muted">Caption, muted</Text>
<Text variant="mono">const value = 42;</Text>`}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Text variant="bodyLg">Body large</Text>
          <Text variant="body">Body — the default reading size.</Text>
          <Text variant="label">Label</Text>
          <Text variant="caption" tone="muted">
            Caption, muted
          </Text>
          <Text variant="mono">const value = 42;</Text>
        </div>
      </Example>

      <h2>Tones</h2>
      <Example
        code={`<Text tone="default">Default</Text>
<Text tone="muted">Muted</Text>
<Text tone="subtle">Subtle</Text>
<Text tone="accent">Accent</Text>
<Text tone="danger">Danger</Text>
<Text tone="success">Success</Text>`}
      >
        <Text tone="default">Default</Text>
        <Text tone="muted">Muted</Text>
        <Text tone="subtle">Subtle</Text>
        <Text tone="accent">Accent</Text>
        <Text tone="danger">Danger</Text>
        <Text tone="success">Success</Text>
      </Example>
    </>
  );
}
