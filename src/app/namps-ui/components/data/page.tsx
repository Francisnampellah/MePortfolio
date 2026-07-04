"use client";

import { Table, type Column, Avatar, Badge } from "namps-ui";
import { PageHeader, Example, PropsTable } from "@/components/namps-ui/Doc";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  tone: "accent" | "blue" | "green" | "amber";
  status: { label: string; tone: "green" | "amber" | "red" };
}

const MEMBERS: Member[] = [
  { id: "1", name: "Jordan Keller", email: "jordan@acme.ai", role: "Owner", tone: "blue", status: { label: "Active", tone: "green" } },
  { id: "2", name: "Rosa Mendez", email: "rosa@acme.ai", role: "Admin", tone: "accent", status: { label: "Active", tone: "green" } },
  { id: "3", name: "Sam Park", email: "sam@acme.ai", role: "Member", tone: "green", status: { label: "Invited", tone: "amber" } },
  { id: "4", name: "Lena Wu", email: "lena@acme.ai", role: "Member", tone: "amber", status: { label: "Disabled", tone: "red" } },
];

const COLUMNS: Column<Member>[] = [
  {
    key: "name",
    header: "Member",
    sortable: true,
    sortValue: (r) => r.name,
    cell: (r) => (
      <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <Avatar name={r.name} tone={r.tone} size="sm" />
        <span>
          <span style={{ fontWeight: 600, display: "block" }}>{r.name}</span>
          <span style={{ fontSize: 12.5, color: "var(--pui-muted)" }}>{r.email}</span>
        </span>
      </span>
    ),
  },
  { key: "role", header: "Role", sortable: true, sortValue: (r) => r.role, cell: (r) => <span style={{ color: "var(--pui-muted)" }}>{r.role}</span> },
  {
    key: "status",
    header: "Status",
    cell: (r) => (
      <Badge tone={r.status.tone} dot>
        {r.status.label}
      </Badge>
    ),
  },
];

export default function Data() {
  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Table"
        lede="A typed, data-driven table with optional client-side sorting. Columns are objects with cell renderers — no markup repetition."
      />

      <h2>Sortable table</h2>
      <p className="muted">Click the Member or Role header to sort.</p>
      <Example
        layout="block"
        code={`interface Member { id: string; name: string; role: string; /* … */ }

const columns: Column<Member>[] = [
  {
    key: "name",
    header: "Member",
    sortable: true,
    sortValue: (r) => r.name,
    cell: (r) => <Avatar name={r.name} />,
  },
  { key: "role", header: "Role", cell: (r) => r.role },
  { key: "status", header: "Status", cell: (r) => <Badge dot>{r.status}</Badge> },
];

<Table rowKey={(r) => r.id} data={members} columns={columns} />`}
      >
        <div style={{ width: "100%" }}>
          <Table rowKey={(r) => r.id} data={MEMBERS} columns={COLUMNS} />
        </div>
      </Example>

      <h2>Props</h2>
      <PropsTable
        rows={[
          { name: "columns", type: "Column<T>[]", desc: "Column defs: key, header, cell(row), and optional sortable / sortValue / width / align." },
          { name: "data", type: "T[]", desc: "Row data of any shape." },
          { name: "rowKey", type: "(row, i) => Key", desc: "Stable React key for each row." },
          { name: "Column.cell", type: "(row: T) => ReactNode", desc: "Renders the cell — return any JSX." },
          { name: "Column.sortable", type: "boolean", desc: "Enables click-to-sort on the header." },
          { name: "Column.sortValue", type: "(row: T) => string | number", desc: "Value used when sorting by this column." },
        ]}
      />
    </>
  );
}
