"use client";

import { Alert, Button, useToast } from "namps-ui";
import { PageHeader, Example, PropsTable } from "@/components/namps-ui/Doc";

export default function Feedback() {
  const { toast } = useToast();

  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Feedback"
        lede="Communicate status and outcomes — inline alerts for persistent context, toasts for transient confirmation."
      />

      <h2>Alert</h2>
      <Example
        layout="block"
        code={`<Alert tone="info" title="New region available">
  Route requests through eu-west for lower latency.
</Alert>
<Alert tone="success" title="Payment confirmed">…</Alert>
<Alert tone="warning" title="Approaching quota">…</Alert>
<Alert tone="danger" title="Key compromised" onDismiss={() => {}}>…</Alert>`}
      >
        <Alert tone="info" title="New region available">
          You can now route requests through eu-west for lower latency.
        </Alert>
        <Alert tone="success" title="Payment confirmed">
          Your invoice for June has been paid. Receipt sent to billing.
        </Alert>
        <Alert tone="warning" title="Approaching quota">
          You&rsquo;ve used 90% of your monthly tokens. Consider upgrading.
        </Alert>
        <Alert tone="danger" title="Key compromised" onDismiss={() => {}}>
          The key legacy-v1 was revoked after suspicious activity.
        </Alert>
      </Example>

      <h2>Toast</h2>
      <p className="muted">
        Call <code className="doc__inline-code">useToast()</code> anywhere under{" "}
        <code className="doc__inline-code">&lt;ToastProvider&gt;</code>. Toasts auto-dismiss after
        4.5s by default.
      </p>
      <Example
        code={`const { toast } = useToast();

<Button onClick={() => toast({ tone: "success", title: "Changes saved" })}>
  Success
</Button>
<Button onClick={() => toast({ tone: "danger", title: "Upload failed", description: "File exceeds 25 MB." })}>
  Error
</Button>`}
      >
        <Button variant="secondary" onClick={() => toast({ tone: "success", title: "Changes saved", description: "Your workspace settings were updated." })}>
          Success toast
        </Button>
        <Button variant="secondary" onClick={() => toast({ tone: "danger", title: "Upload failed", description: "The file exceeds the 25 MB limit." })}>
          Error toast
        </Button>
        <Button variant="secondary" onClick={() => toast({ tone: "info", title: "New model available", description: "Claude Opus 4.6 is now in your workspace." })}>
          Info toast
        </Button>
      </Example>

      <h2>Props</h2>
      <PropsTable
        rows={[
          { name: "Alert.tone", type: '"info" | "success" | "warning" | "danger"', def: '"info"', desc: "Intent and icon." },
          { name: "Alert.title", type: "ReactNode", desc: "Bold heading; body is the children." },
          { name: "Alert.onDismiss", type: "() => void", desc: "Shows a close button when provided." },
          { name: "toast(opts)", type: "{ title, description?, tone?, duration? }", desc: "Queues a notification; returns its id." },
          { name: "duration", type: "number (ms)", def: "4500", desc: "0 keeps the toast until dismissed." },
        ]}
      />
    </>
  );
}
