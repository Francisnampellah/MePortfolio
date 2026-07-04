"use client";

import Link from "next/link";
import { Button, Card, Badge, Heading, Text } from "namps-native";

export default function Home() {
  return (
    <>
      <div className="doc__eyebrow">Design system · React Native</div>
      <h1 style={{ fontSize: 52, maxWidth: "16ch" }}>
        A calm, premium UI library for React Native.
      </h1>
      <p className="doc__lede">
        namps-native is a typography-first, token-driven component system for AI, productivity, and
        enterprise apps. Every component draws from one coherent design language — spacious, highly
        readable, and consistent enough that learning one component teaches you the rest.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "24px 0 8px" }}>
        <Link href="/namps-native/docs/getting-started">
          <Button size="lg">Get started</Button>
        </Link>
        <Link href="/namps-native/components/buttons">
          <Button size="lg" variant="secondary">
            Browse components
          </Button>
        </Link>
      </div>

      <h2>Why namps-native</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
          marginTop: 18,
        }}
      >
        {[
          { title: "Token-driven", body: "No component hardcodes a color, space, or radius — everything resolves from the theme." },
          { title: "One consistent API", body: "The same variant, size, loading, disabled, onPress / onValueChange, and style props recur everywhere." },
          { title: "Composable", body: "Small primitives assemble into rich screens." },
          { title: "Fully typed", body: "Every prop, hook, and token is exported and documented." },
        ].map((f) => (
          <Card key={f.title} variant="outlined" padding={5}>
            <Heading level={4}>{f.title}</Heading>
            <Text tone="muted">{f.body}</Text>
          </Card>
        ))}
      </div>

      <h2>What&rsquo;s included</h2>
      <p className="muted">
        Button, IconButton, Text, Heading, Card, Input, Switch, Checkbox, and Badge — reference
        implementations for the rest of the spec, following the same folder and prop conventions.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        {["Button", "IconButton", "Text", "Heading", "Card", "Input", "Switch", "Checkbox", "Badge"].map(
          (c) => (
            <Badge key={c}>{c}</Badge>
          )
        )}
      </div>
    </>
  );
}
