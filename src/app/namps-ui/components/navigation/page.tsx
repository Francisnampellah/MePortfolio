"use client";

import * as React from "react";
import { Breadcrumbs, Pagination, Segmented } from "namps-ui";
import { PageHeader, Example, PropsTable } from "@/components/namps-ui/Doc";

export default function Navigation() {
  const [page, setPage] = React.useState(2);
  const [view, setView] = React.useState("all");

  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Navigation"
        lede="Wayfinding patterns — breadcrumbs for location, pagination for sequences, and a segmented control for switching views."
      />

      <h2>Breadcrumbs</h2>
      <Example
        code={`<Breadcrumbs items={[
  { label: "Home", href: "/" },
  { label: "Workspace", href: "/workspace" },
  { label: "Settings", href: "/workspace/settings" },
  { label: "API keys" },
]} />`}
      >
        <Breadcrumbs
          items={[
            { label: "Home", href: "#" },
            { label: "Workspace", href: "#" },
            { label: "Settings", href: "#" },
            { label: "API keys" },
          ]}
        />
      </Example>

      <h2>Pagination</h2>
      <Example
        layout="center"
        code={`const [page, setPage] = useState(2);

<Pagination page={page} count={12} onChange={setPage} />`}
      >
        <Pagination page={page} count={12} onChange={setPage} />
      </Example>

      <h2>Segmented control</h2>
      <Example
        code={`const [view, setView] = useState("all");

<Segmented
  value={view}
  onValueChange={setView}
  options={[
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Archived", value: "arch" },
  ]}
/>`}
      >
        <Segmented
          value={view}
          onValueChange={setView}
          options={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Archived", value: "arch" },
          ]}
        />
      </Example>

      <h2>Props</h2>
      <PropsTable
        rows={[
          { name: "Breadcrumbs.items", type: "{ label, href? }[]", desc: "Last item renders as current (no link)." },
          { name: "Pagination.page / count", type: "number", desc: "Current page and total page count (1-based)." },
          { name: "Pagination.onChange", type: "(page: number) => void", desc: "Fired on prev / next / page click." },
          { name: "Pagination.siblings", type: "number", def: "1", desc: "Pages shown either side of the current one." },
          { name: "Segmented", type: "value, onValueChange, options[]", desc: "Compact single-select toggle group." },
        ]}
      />
    </>
  );
}
