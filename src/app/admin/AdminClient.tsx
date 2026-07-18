"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Drawer,
  EmptyState,
  Field,
  Icons,
  Input,
  SearchInput,
  Select,
  Spinner,
  StatCard,
  Textarea,
  useToast,
} from "namps-ui";
import {
  Activity,
  Award,
  Bot,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Inbox,
  LayoutTemplate,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  MessagesSquare,
  Newspaper,
  Save,
  Trash2,
  ArrowUp,
  ArrowDown,
  User,
  UserPlus,
  Wrench,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { PROFILE } from "@/lib/data";

type TabKind = "object" | "list" | "traffic" | "capabilities" | "hero";
type Tab = { key: string; label: string; kind: TabKind; icon: LucideIcon };

const NAV_GROUPS: { title: string; items: Tab[] }[] = [
  {
    title: "Today",
    items: [{ key: "traffic", label: "Traffic", kind: "traffic", icon: Activity }],
  },
  {
    title: "Site content",
    items: [
      { key: "profile", label: "Profile", kind: "object", icon: User },
      { key: "hero", label: "Hero", kind: "hero", icon: LayoutTemplate },
      { key: "capabilities", label: "Toolbox", kind: "capabilities", icon: Wrench },
      { key: "projects", label: "Projects", kind: "list", icon: FolderKanban },
      { key: "experience", label: "Experience", kind: "list", icon: Briefcase },
      { key: "education", label: "Education", kind: "list", icon: GraduationCap },
      { key: "certifications", label: "Certifications", kind: "list", icon: Award },
      { key: "testimonials", label: "Testimonials", kind: "list", icon: MessageSquareQuote },
      { key: "posts", label: "Blog posts", kind: "list", icon: Newspaper },
      { key: "bot", label: "Assistant", kind: "object", icon: Bot },
    ],
  },
  {
    title: "Inbox",
    items: [
      { key: "leads", label: "Leads", kind: "list", icon: UserPlus },
      { key: "submissions", label: "Submissions", kind: "list", icon: Inbox },
      { key: "visitors", label: "Chat contacts", kind: "list", icon: Mail },
      { key: "chat-logs", label: "Chat logs", kind: "list", icon: MessagesSquare },
    ],
  },
];

const COLLECTIONS = NAV_GROUPS.flatMap((g) => g.items);
const LONG_KEYS = ["desc", "note", "quote", "intro", "lede", "excerpt", "tagline", "message"];

type Json = Record<string, unknown>;

type TrafficStats = {
  totalVisitors: number;
  totalPageviews: number;
  todayVisitors: number;
  todayPageviews: number;
  last7Days: { day: string; pageviews: number; visitors: number }[];
};

type CapItem = {
  name: string;
  short: string;
  tagline: string;
  evidence: [string, string];
  evidenceLink?: { label: string; href: string } | null;
  tools: string[];
  action:
    | { kind: "project"; projectNo: string; label?: string }
    | { kind: "blog"; href: string; label?: string };
};

type HeroData = {
  stats: { v: string; k: string }[];
  clients: string[];
};

function itemLabel(item: Json, i: number) {
  return String(item.title || item.name || item.company || item.id || `Item ${i + 1}`);
}

function itemMeta(item: Json) {
  const bits = [item.role, item.company, item.short, item.cat, item.date, item.email]
    .filter(Boolean)
    .map(String);
  return bits.slice(0, 2).join(" · ");
}

/* ---------- field controls ---------- */

function StringField({
  k,
  value,
  onChange,
}: {
  k: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const long = LONG_KEYS.includes(k) || value.length > 64;
  return (
    <Field label={k}>
      {long ? (
        <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </Field>
  );
}

function StringListField({
  k,
  value,
  onChange,
}: {
  k: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <Field label={`${k} — one per line`}>
      <Textarea
        rows={Math.max(2, value.length || 2)}
        value={value.join("\n")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          )
        }
      />
    </Field>
  );
}

function SectionsField({
  value,
  onChange,
}: {
  value: { h: string; paras: string[] }[];
  onChange: (v: { h: string; paras: string[] }[]) => void;
}) {
  const set = (i: number, patch: Partial<{ h: string; paras: string[] }>) =>
    onChange(value.map((s, j) => (i === j ? { ...s, ...patch } : s)));
  return (
    <div className="cms-fields__full flex flex-col gap-3">
      <span className="cms-field-label">Article sections</span>
      {value.map((s, i) => (
        <div key={i} className="rounded-xl border border-[var(--cms-line)] bg-[var(--cms-cream)] p-3">
          <div className="flex items-center gap-2">
            <Input
              value={s.h}
              onChange={(e) => set(i, { h: e.target.value })}
              placeholder="Heading"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Remove section"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="mt-2">
            <Textarea
              rows={3}
              value={s.paras.join("\n")}
              onChange={(e) => set(i, { paras: e.target.value.split("\n").filter(Boolean) })}
              placeholder="Paragraphs — one per line"
            />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        leftIcon={<Icons.Plus />}
        onClick={() => onChange([...value, { h: "", paras: [] }])}
      >
        Add section
      </Button>
    </div>
  );
}

function ObjectFields({
  obj,
  onChange,
}: {
  obj: Json;
  onChange: (next: Json) => void;
}) {
  const set = (k: string, v: unknown) => onChange({ ...obj, [k]: v });
  return (
    <div className="cms-fields">
      {Object.entries(obj).map(([k, v]) => {
        if (k === "sections") {
          return (
            <SectionsField
              key={k}
              value={v as { h: string; paras: string[] }[]}
              onChange={(nv) => set(k, nv)}
            />
          );
        }
        if (Array.isArray(v) && v.every((x) => typeof x === "string")) {
          return (
            <div key={k} className="cms-fields__full">
              <StringListField k={k} value={v as string[]} onChange={(nv) => set(k, nv)} />
            </div>
          );
        }
        if (typeof v === "string") {
          const long = LONG_KEYS.includes(k) || v.length > 64;
          return (
            <div key={k} className={long ? "cms-fields__full" : ""}>
              <StringField k={k} value={v} onChange={(nv) => set(k, nv)} />
            </div>
          );
        }
        if (typeof v === "number") {
          return (
            <Field key={k} label={k}>
              <Input
                type="number"
                value={v}
                onChange={(e) => set(k, Number(e.target.value))}
              />
            </Field>
          );
        }
        return (
          <div key={k} className="cms-fields__full">
            <Field label={`${k} (JSON)`}>
              <Textarea
                rows={3}
                defaultValue={JSON.stringify(v, null, 2)}
                onChange={(e) => {
                  try {
                    set(k, JSON.parse(e.target.value));
                  } catch {
                    /* ignore until valid */
                  }
                }}
              />
            </Field>
          </div>
        );
      })}
    </div>
  );
}

function HeroFields({
  obj,
  onChange,
}: {
  obj: HeroData;
  onChange: (next: HeroData) => void;
}) {
  const setStat = (i: number, patch: Partial<{ v: string; k: string }>) =>
    onChange({
      ...obj,
      stats: obj.stats.map((s, j) => (i === j ? { ...s, ...patch } : s)),
    });
  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="cms-field-label">Hero stats</span>
        <p className="cms-hint mb-3">Shown under the headline on the home section.</p>
        <div className="flex flex-col gap-2">
          {obj.stats.map((s, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <Input
                value={s.v}
                onChange={(e) => setStat(i, { v: e.target.value })}
                placeholder="2+"
                style={{ maxWidth: 100 }}
              />
              <Input
                value={s.k}
                onChange={(e) => setStat(i, { k: e.target.value })}
                placeholder="years experience"
                style={{ flex: 1, minWidth: 180 }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Remove stat"
                onClick={() => onChange({ ...obj, stats: obj.stats.filter((_, j) => j !== i) })}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Icons.Plus />}
            onClick={() => onChange({ ...obj, stats: [...obj.stats, { v: "", k: "" }] })}
          >
            Add stat
          </Button>
        </div>
      </div>
      <StringListField
        k="clients"
        value={obj.clients}
        onChange={(clients) => onChange({ ...obj, clients })}
      />
    </div>
  );
}

function CapabilityFields({
  item,
  onChange,
}: {
  item: CapItem;
  onChange: (next: CapItem) => void;
}) {
  const evidence = Array.isArray(item.evidence) ? item.evidence : ["", ""];
  const line1 = typeof evidence[0] === "string" ? evidence[0] : "";
  const line2 = typeof evidence[1] === "string" ? evidence[1] : "";
  const link = item.evidenceLink || { label: "", href: "" };
  const action = item.action || { kind: "project" as const, projectNo: "" };

  const setEvidence = (i: 0 | 1, v: string) => {
    const next: [string, string] = [line1, line2];
    next[i] = v;
    onChange({ ...item, evidence: next });
  };

  return (
    <div className="cms-fields">
      <StringField k="name" value={item.name || ""} onChange={(v) => onChange({ ...item, name: v })} />
      <StringField
        k="short (tab label)"
        value={item.short || ""}
        onChange={(v) => onChange({ ...item, short: v })}
      />
      <div className="cms-fields__full">
        <StringField
          k="tagline"
          value={item.tagline || ""}
          onChange={(v) => onChange({ ...item, tagline: v })}
        />
      </div>
      <div className="cms-fields__full">
        <Field label="evidence line 1">
          <Textarea rows={2} value={line1} onChange={(e) => setEvidence(0, e.target.value)} />
        </Field>
      </div>
      <div className="cms-fields__full">
        <Field label="evidence line 2">
          <Textarea rows={2} value={line2} onChange={(e) => setEvidence(1, e.target.value)} />
        </Field>
      </div>
      <div className="cms-fields__full rounded-xl border border-[var(--cms-line)] bg-[var(--cms-cream)] p-3">
        <span className="cms-field-label">Optional link inside line 2</span>
        <p className="cms-hint mb-2">
          If the label appears in line 2, it becomes a link. Leave blank for none.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            value={link.label}
            onChange={(e) =>
              onChange({
                ...item,
                evidenceLink:
                  e.target.value || link.href
                    ? { label: e.target.value, href: link.href }
                    : null,
              })
            }
            placeholder="Link label"
          />
          <Input
            value={link.href}
            onChange={(e) =>
              onChange({
                ...item,
                evidenceLink:
                  link.label || e.target.value
                    ? { label: link.label, href: e.target.value }
                    : null,
              })
            }
            placeholder="/blog/slug or https://…"
          />
        </div>
      </div>
      <div className="cms-fields__full">
        <StringListField
          k="tools"
          value={item.tools || []}
          onChange={(tools) => onChange({ ...item, tools })}
        />
      </div>
      <div className="cms-fields__full rounded-xl border border-[var(--cms-line)] bg-[var(--cms-cream)] p-3">
        <span className="cms-field-label">See it in action</span>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <Select
            value={action.kind}
            onChange={(e) => {
              const kind = e.target.value as "project" | "blog";
              onChange({
                ...item,
                action:
                  kind === "project"
                    ? { kind: "project", projectNo: "01" }
                    : { kind: "blog", href: "/blog/" },
              });
            }}
            options={[
              { label: "Project deep-link", value: "project" },
              { label: "Blog article", value: "blog" },
            ]}
          />
          {action.kind === "project" ? (
            <Input
              value={action.projectNo}
              onChange={(e) =>
                onChange({ ...item, action: { kind: "project", projectNo: e.target.value } })
              }
              placeholder="Project no (e.g. 06)"
            />
          ) : (
            <Input
              value={action.href}
              onChange={(e) =>
                onChange({ ...item, action: { kind: "blog", href: e.target.value } })
              }
              placeholder="/blog/slug"
              style={{ gridColumn: "span 2" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TrafficPanel({ stats }: { stats: TrafficStats }) {
  const max = Math.max(1, ...stats.last7Days.map((d) => d.visitors));
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total visitors" value={stats.totalVisitors.toLocaleString()} />
        <StatCard label="Total pageviews" value={stats.totalPageviews.toLocaleString()} />
        <StatCard label="Today — visitors" value={stats.todayVisitors.toLocaleString()} />
        <StatCard label="Today — pageviews" value={stats.todayPageviews.toLocaleString()} />
      </div>
      <Card padded>
        <div className="cms-field-label">Last 7 days — unique visitors</div>
        <div className="cms-chart">
          {stats.last7Days.map((d) => (
            <div key={d.day} className="cms-chart__col">
              <span className="text-[10px] tabular-nums text-[var(--cms-muted)]">{d.visitors}</span>
              <div
                className="cms-chart__bar"
                style={{ height: `${Math.max(4, (d.visitors / max) * 88)}px` }}
                title={`${d.day}: ${d.visitors} visitors, ${d.pageviews} views`}
              />
              <span className="text-[9px] text-[var(--cms-muted)]">{d.day.slice(5)}</span>
            </div>
          ))}
        </div>
        <p className="cms-hint mt-4">
          Anonymous counts only — a visitor is a browser that loaded the site. Reloads and page
          changes count as pageviews; the same browser counts once toward unique visitors.
        </p>
      </Card>
    </div>
  );
}

function SidebarNav({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (key: string) => void;
}) {
  return (
    <nav className="cms-nav">
      {NAV_GROUPS.map((group) => (
        <div key={group.title} className="cms-nav__group">
          <div className="cms-nav__label">{group.title}</div>
          {group.items.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.key}
                type="button"
                className="cms-nav__btn"
                data-active={active === c.key}
                onClick={() => onSelect(c.key)}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {c.label}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

const BLANK_CAPABILITY: CapItem = {
  name: "",
  short: "",
  tagline: "",
  evidence: ["", ""],
  evidenceLink: null,
  tools: [],
  action: { kind: "project", projectNo: "01" },
};

function blankFrom(sample: Json): Json {
  const out: Json = {};
  for (const [k, v] of Object.entries(sample)) {
    if (Array.isArray(v)) out[k] = [];
    else if (typeof v === "number") out[k] = 0;
    else if (typeof v === "object" && v) out[k] = {};
    else out[k] = "";
  }
  return out;
}

/* ---------- main client ---------- */

export function AdminClient() {
  const { toast } = useToast();
  const [active, setActive] = useState(COLLECTIONS[0].key);
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const meta = COLLECTIONS.find((c) => c.key === active)!;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    setQuery("");
    const url = active === "traffic" ? "/api/admin/traffic" : `/api/admin/${active}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (alive) setData(d);
      })
      .catch(() => alive && setError("Failed to load."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [active]);

  const save = async () => {
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/${active}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) {
      toast({ title: "Saved", description: `${meta.label} updated.`, tone: "success" });
    } else {
      const j = await res.json().catch(() => ({}));
      const msg = j.error || "Save failed.";
      setError(msg);
      toast({ title: "Save failed", description: msg, tone: "danger" });
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  const selectTab = (key: string) => {
    setActive(key);
    setDrawerOpen(false);
  };

  const list = Array.isArray(data) ? (data as Json[]) : null;

  const filteredList = useMemo(() => {
    if (!list) return null;
    const q = query.trim().toLowerCase();
    if (!q) return list.map((item, i) => ({ item, i }));
    return list
      .map((item, i) => ({ item, i }))
      .filter(({ item }) => JSON.stringify(item).toLowerCase().includes(q));
  }, [list, query]);

  const updateItem = (i: number, next: Json) =>
    setData((list as Json[]).map((it, j) => (i === j ? next : it)));
  const removeItem = (i: number) => setData((list as Json[]).filter((_, j) => j !== i));
  const moveItem = (i: number, dir: -1 | 1) => {
    const arr = [...(list as Json[])];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setData(arr);
  };
  const addItem = () => {
    if (meta.kind === "capabilities") {
      setData([...(list as CapItem[]), { ...BLANK_CAPABILITY }]);
      return;
    }
    const template = list && list[0] ? blankFrom(list[0]) : {};
    setData([...(list as Json[]), template]);
  };

  const countLabel = (() => {
    if (meta.kind === "traffic" && data && typeof data === "object" && !("error" in (data as object))) {
      const t = data as TrafficStats;
      return `${t.totalVisitors.toLocaleString()} visitors · ${t.todayPageviews} views today`;
    }
    if (list) return `${list.length} item${list.length === 1 ? "" : "s"}`;
    if (meta.kind === "object" || meta.kind === "hero") return "Single document";
    return "";
  })();

  const userFooter = (
    <div className="cms-user">
      <Avatar name={PROFILE.shortName} size="md" />
      <div className="cms-user__meta">
        <div className="cms-user__name">{PROFILE.shortName}</div>
        <div className="cms-user__role">Admin</div>
      </div>
      <button type="button" className="cms-user__logout" onClick={logout} aria-label="Sign out">
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="cms-shell">
      <aside className="cms-sidebar">
        <div className="cms-brand">
          <span className="cms-brand__mark">{PROFILE.initials}</span>
          <span className="cms-brand__name">Portfolio CMS</span>
        </div>
        <SidebarNav active={active} onSelect={selectTab} />
        {userFooter}
      </aside>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="left" title="Menu">
        <div className="cms-drawer-nav">
          <SidebarNav active={active} onSelect={selectTab} />
          {userFooter}
        </div>
      </Drawer>

      <div className="cms-main">
        <div className="cms-topbar">
          <Button type="button" variant="ghost" size="sm" onClick={() => setDrawerOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <span className="text-[14px] font-semibold">Portfolio CMS</span>
        </div>

        <header className="cms-header">
          <div>
            <h1 className="cms-header__title">{meta.label}</h1>
            <p className="cms-header__sub">{countLabel}</p>
          </div>
          <div className="cms-header__actions">
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
              onClick={() => window.open("/", "_blank")}
            >
              View site
            </Button>
            {meta.kind !== "traffic" ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                leftIcon={saving ? <Spinner size={14} /> : <Save className="h-3.5 w-3.5" />}
                disabled={saving || loading}
                onClick={save}
              >
                {saving ? "Saving…" : "Save changes"}
              </Button>
            ) : null}
          </div>
        </header>

        {(meta.kind === "list" || meta.kind === "capabilities") && !loading ? (
          <div className="cms-toolbar">
            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${meta.label.toLowerCase()}…`}
            />
            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<Icons.Plus />}
              onClick={addItem}
            >
              Add {meta.kind === "capabilities" ? "capability" : "item"}
            </Button>
          </div>
        ) : null}

        <div className="cms-body">
          {error && !loading ? (
            <p className="mb-4 text-[13px] text-[#c0392b]">{error}</p>
          ) : null}

          {loading ? (
            <div className="flex justify-center py-24">
              <Spinner />
            </div>
          ) : meta.kind === "traffic" && data && !("error" in (data as object)) ? (
            <TrafficPanel stats={data as TrafficStats} />
          ) : meta.kind === "hero" && data ? (
            <div className="cms-card">
              <HeroFields obj={data as HeroData} onChange={(n) => setData(n)} />
            </div>
          ) : meta.kind === "object" && data ? (
            <div className="cms-card">
              <ObjectFields obj={data as Json} onChange={(n) => setData(n)} />
            </div>
          ) : meta.kind === "capabilities" && filteredList ? (
            filteredList.length === 0 ? (
              <EmptyState
                title="No capabilities match"
                description="Try a different search, or add a new Toolbox capability."
                action={
                  <Button variant="primary" leftIcon={<Icons.Plus />} onClick={addItem}>
                    Add capability
                  </Button>
                }
              />
            ) : (
              <div className="flex flex-col gap-3">
                <p className="cms-hint">
                  Powers the Toolbox section — tab order here is tab order on the site.
                </p>
                {filteredList.map(({ item, i }) => {
                  const cap = item as unknown as CapItem;
                  return (
                    <div key={i} className="cms-card">
                      <div className="cms-card__head">
                        <div>
                          <div className="cms-card__title">{cap.short || cap.name || `Capability ${i + 1}`}</div>
                          <div className="cms-card__meta">{cap.tagline || "Toolbox capability"}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge tone="neutral">{cap.tools?.length || 0} tools</Badge>
                          <Button type="button" variant="ghost" size="sm" aria-label="Move up" onClick={() => moveItem(i, -1)}>
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button type="button" variant="ghost" size="sm" aria-label="Move down" onClick={() => moveItem(i, 1)}>
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button type="button" variant="ghost" size="sm" aria-label="Delete" onClick={() => removeItem(i)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <CapabilityFields
                        item={cap}
                        onChange={(n) => updateItem(i, n as unknown as Json)}
                      />
                    </div>
                  );
                })}
              </div>
            )
          ) : filteredList ? (
            filteredList.length === 0 ? (
              <EmptyState
                title={`No ${meta.label.toLowerCase()} found`}
                description={query ? "Try a different search." : "Add your first item to get started."}
                action={
                  <Button variant="primary" leftIcon={<Icons.Plus />} onClick={addItem}>
                    Add item
                  </Button>
                }
              />
            ) : (
              <div className="flex flex-col gap-3">
                {active === "visitors" ? (
                  <p className="cms-hint">
                    Emails shared in chat — not the same as anonymous Traffic unique visitors.
                  </p>
                ) : null}
                {filteredList.map(({ item, i }) => (
                  <div key={i} className="cms-card">
                    <div className="cms-card__head">
                      <div>
                        <div className="cms-card__title">{itemLabel(item, i)}</div>
                        {itemMeta(item) ? (
                          <div className="cms-card__meta">{itemMeta(item)}</div>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button type="button" variant="ghost" size="sm" aria-label="Move up" onClick={() => moveItem(i, -1)}>
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" aria-label="Move down" onClick={() => moveItem(i, 1)}>
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" aria-label="Delete" onClick={() => removeItem(i)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <ObjectFields obj={item} onChange={(n) => updateItem(i, n)} />
                  </div>
                ))}
              </div>
            )
          ) : data && typeof data === "object" && "error" in data ? (
            <EmptyState
              title="Couldn’t load"
              description={String((data as { error?: string }).error || error || "Failed to load.")}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
