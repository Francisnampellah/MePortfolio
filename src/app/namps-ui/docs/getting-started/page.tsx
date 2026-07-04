import { PageHeader, Code } from "@/components/namps-ui/Doc";
import { CodeBlock } from "namps-ui";

export default function GettingStarted() {
  return (
    <>
      <PageHeader
        eyebrow="Getting started"
        title="Installation"
        lede="Add namps-ui to any React 18+ project. These steps assume Next.js (App Router), but the package is framework-agnostic."
      />

      <h2>1. Install</h2>
      <CodeBlock code={"npm install namps-ui"} filename="terminal" />
      <p className="muted">
        Peer dependencies: <Code>react &gt;= 18</Code> and <Code>react-dom &gt;= 18</Code>.
      </p>

      <h2>2. Import the stylesheet</h2>
      <p>
        Import the single stylesheet <Code>once</Code> at your app root. It ships the theme tokens
        and every component&rsquo;s styles.
      </p>
      <CodeBlock
        filename="app/layout.tsx"
        code={`import "namps-ui/styles.css";`}
      />

      <h2>3. Wrap with providers</h2>
      <p>
        <Code>ThemeProvider</Code> manages light/dark (stamping <Code>data-theme</Code> on{" "}
        <Code>&lt;html&gt;</Code> and persisting to localStorage). <Code>ToastProvider</Code> hosts
        the notification region.
      </p>
      <CodeBlock
        filename="app/layout.tsx"
        code={`import { ThemeProvider, ToastProvider } from "namps-ui";
import "namps-ui/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="light">
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}`}
      />

      <h2>4. Use components</h2>
      <p>
        Import what you need. Components that hold state (Tabs, Accordion, Modal&hellip;) must live in
        a Client Component &mdash; add <Code>&quot;use client&quot;</Code> at the top of the file.
      </p>
      <CodeBlock
        filename="app/page.tsx"
        code={`"use client";
import { Button, Field, Input, useToast } from "namps-ui";

export default function Page() {
  const { toast } = useToast();
  return (
    <Field label="Workspace name" hint="Visible to all members.">
      <Input defaultValue="Acme AI" />
      <Button onClick={() => toast({ tone: "success", title: "Saved" })}>
        Save
      </Button>
    </Field>
  );
}`}
      />

      <h2>Next.js note</h2>
      <p className="muted">
        When consuming the package from a local workspace (this monorepo), add{" "}
        <Code>transpilePackages: [&quot;namps-ui&quot;]</Code> to <Code>next.config.mjs</Code>. When
        installed from npm as a built package, this isn&rsquo;t needed.
      </p>
    </>
  );
}
