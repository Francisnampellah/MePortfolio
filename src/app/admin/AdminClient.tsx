"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, LogOut, Check } from "lucide-react";

const COLLECTIONS: { key: string; label: string; kind: "object" | "list" }[] = [
  { key: "profile", label: "Profile", kind: "object" },
  { key: "projects", label: "Projects", kind: "list" },
  { key: "experience", label: "Experience", kind: "list" },
  { key: "education", label: "Education", kind: "list" },
  { key: "certifications", label: "Certifications", kind: "list" },
  { key: "testimonials", label: "Testimonials", kind: "list" },
  { key: "posts", label: "Blog posts", kind: "list" },
  { key: "bot", label: "Assistant", kind: "object" },
  { key: "leads", label: "Leads", kind: "list" },
  { key: "submissions", label: "Submissions", kind: "list" },
  { key: "visitors", label: "Visitors", kind: "list" },
  { key: "chat-logs", label: "Chat logs", kind: "list" },
];

const LONG_KEYS = ["desc", "note", "quote", "intro", "lede", "excerpt", "tagline", "message"];

type Json = Record<string, unknown>;

/* ---------- small field controls ---------- */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted2">
      {children}
    </span>
  );
}

const inputCls =
  "w-full rounded-lg border border-[#ddd9d3] bg-white px-3 py-2 text-[13.5px] text-ink outline-none transition-colors focus:border-accent";

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
    <label className="flex flex-col gap-1.5">
      <Label>{k}</Label>
      {long ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} resize-y`}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
    </label>
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
    <label className="flex flex-col gap-1.5">
      <Label>{k} — one per line</Label>
      <textarea
        rows={Math.max(2, value.length)}
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
        className={`${inputCls} resize-y font-mono text-[12.5px]`}
      />
    </label>
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
    <div className="flex flex-col gap-3">
      <Label>article sections</Label>
      {value.map((s, i) => (
        <div key={i} className="rounded-lg border border-line bg-surface p-3">
          <div className="flex items-center gap-2">
            <input
              value={s.h}
              onChange={(e) => set(i, { h: e.target.value })}
              placeholder="Heading"
              className={inputCls}
            />
            <button
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="shrink-0 rounded-md border border-line bg-white p-2 text-muted2 hover:text-[#c0392b]"
              aria-label="Remove section"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <textarea
            rows={3}
            value={s.paras.join("\n")}
            onChange={(e) => set(i, { paras: e.target.value.split("\n").filter(Boolean) })}
            placeholder="Paragraphs — one per line"
            className={`${inputCls} mt-2 resize-y`}
          />
        </div>
      ))}
      <button
        onClick={() => onChange([...value, { h: "", paras: [] }])}
        className="inline-flex w-fit items-center gap-1.5 rounded-md border border-line bg-white px-3 py-1.5 text-[12.5px] font-semibold text-ink hover:border-accent"
      >
        <Plus className="h-3.5 w-3.5" /> Add section
      </button>
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
    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
      {Object.entries(obj).map(([k, v]) => {
        if (k === "sections") {
          return (
            <div key={k} className="md:col-span-2">
              <SectionsField
                value={v as { h: string; paras: string[] }[]}
                onChange={(nv) => set(k, nv)}
              />
            </div>
          );
        }
        if (Array.isArray(v) && v.every((x) => typeof x === "string")) {
          return (
            <div key={k} className="md:col-span-2">
              <StringListField k={k} value={v as string[]} onChange={(nv) => set(k, nv)} />
            </div>
          );
        }
        if (typeof v === "string") {
          const long = LONG_KEYS.includes(k) || v.length > 64;
          return (
            <div key={k} className={long ? "md:col-span-2" : ""}>
              <StringField k={k} value={v} onChange={(nv) => set(k, nv)} />
            </div>
          );
        }
        if (typeof v === "number") {
          return (
            <label key={k} className="flex flex-col gap-1.5">
              <Label>{k}</Label>
              <input
                type="number"
                value={v}
                onChange={(e) => set(k, Number(e.target.value))}
                className={inputCls}
              />
            </label>
          );
        }
        // fallback: raw JSON
        return (
          <div key={k} className="md:col-span-2">
            <label className="flex flex-col gap-1.5">
              <Label>{k} (JSON)</Label>
              <textarea
                rows={3}
                defaultValue={JSON.stringify(v, null, 2)}
                onChange={(e) => {
                  try {
                    set(k, JSON.parse(e.target.value));
                  } catch {
                    /* ignore until valid */
                  }
                }}
                className={`${inputCls} resize-y font-mono text-[12px]`}
              />
            </label>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- main client ---------- */

export function AdminClient() {
  const [active, setActive] = useState(COLLECTIONS[0].key);
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const meta = COLLECTIONS.find((c) => c.key === active)!;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    fetch(`/api/admin/${active}`)
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
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Save failed.");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  const list = Array.isArray(data) ? (data as Json[]) : null;

  const updateItem = (i: number, next: Json) =>
    setData((list as Json[]).map((it, j) => (i === j ? next : it)));
  const removeItem = (i: number) =>
    setData((list as Json[]).filter((_, j) => j !== i));
  const moveItem = (i: number, dir: -1 | 1) => {
    const arr = [...(list as Json[])];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setData(arr);
  };
  const addItem = () => {
    const template = list && list[0] ? blankFrom(list[0]) : {};
    setData([...(list as Json[]), template]);
  };

  return (
    <div className="mx-auto max-w-[920px] px-6 py-10">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#141414]">
            Content Manager
          </h1>
          <p className="mt-1 font-mono text-[11px] text-muted2">
            edits write to content/*.json
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="rounded-lg border border-line bg-white px-3.5 py-2 text-[13px] font-semibold text-ink hover:border-accent"
          >
            View site ↗
          </a>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-[13px] font-semibold text-ink hover:border-accent"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>

      {/* tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-line pb-4">
        {COLLECTIONS.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className="rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors"
            style={{
              color: active === c.key ? "#fff" : "#3f3a35",
              background: active === c.key ? "#1a1a1a" : "#fff",
              border: `1px solid ${active === c.key ? "#1a1a1a" : "#e8e5e0"}`,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* body */}
      <div className="mt-6">
        {loading ? (
          <p className="py-16 text-center font-mono text-[13px] text-muted2">loading…</p>
        ) : meta.kind === "object" && data ? (
          <div className="rounded-xl border border-line bg-white p-5">
            <ObjectFields obj={data as Json} onChange={(n) => setData(n)} />
          </div>
        ) : list ? (
          <div className="flex flex-col gap-4">
            {list.map((item, i) => (
              <div key={i} className="rounded-xl border border-line bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted2">
                    {String(item.title || item.name || item.company || item.id || `item ${i + 1}`)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => moveItem(i, -1)} className="rounded-md border border-line bg-white p-1.5 text-muted2 hover:text-ink" aria-label="Move up">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => moveItem(i, 1)} className="rounded-md border border-line bg-white p-1.5 text-muted2 hover:text-ink" aria-label="Move down">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => removeItem(i)} className="rounded-md border border-line bg-white p-1.5 text-muted2 hover:text-[#c0392b]" aria-label="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <ObjectFields obj={item} onChange={(n) => updateItem(i, n)} />
              </div>
            ))}
            <button
              onClick={addItem}
              className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-ink hover:border-accent"
            >
              <Plus className="h-4 w-4" /> Add item
            </button>
          </div>
        ) : null}
      </div>

      {/* save bar */}
      <div className="sticky bottom-4 mt-8 flex items-center justify-between gap-3 rounded-xl border border-line bg-white/95 px-4 py-3 backdrop-blur">
        <span className="text-[13px] text-muted">
          {error ? <span className="text-[#c0392b]">{error}</span> : `Editing: ${meta.label}`}
        </span>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-black disabled:opacity-60"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

/** Build a blank item from an existing one (same keys, emptied values). */
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
