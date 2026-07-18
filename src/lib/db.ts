/**
 * Simple embedded database for captured data — powered by Node's built-in
 * SQLite (`node:sqlite`, Node ≥ 22.5), so there is NO extra dependency and no
 * native build step. The file lives at data/app.db (gitignored).
 *
 * Tables:
 *   leads       — people interested in working with Nampellah
 *   submissions — orders / requests / opinions left via the chat
 *   visitors    — remembered contacts (by email), for returning-visitor memory
 *   site_hits   — anonymous pageviews for the traffic counter
 *
 * If SQLite is ever unavailable, callers should treat a thrown error as "no DB"
 * and fall back to their JSON store; the chat route does this defensively.
 */
import path from "path";
import fs from "fs";
// Node built-in; requires the nodejs runtime (not edge).
import { DatabaseSync } from "node:sqlite";

export type LeadRow = { at: string; name: string; email: string; note: string };
export type SubmissionRow = {
  at: string;
  type: string;
  name: string;
  email: string;
  message: string;
};
export type VisitorRow = {
  name: string;
  email: string;
  firstSeen: string;
  lastSeen: string;
  visits: number;
};

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "app.db");

let _db: DatabaseSync | null = null;

/** Lazily open the database and ensure the schema exists. */
function db(): DatabaseSync {
  if (!_db) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    _db = new DatabaseSync(DB_PATH);
  }
  // Idempotent — safe on every call so hot reloads pick up new tables.
  _db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      at     TEXT NOT NULL,
      name   TEXT NOT NULL DEFAULT '',
      email  TEXT NOT NULL DEFAULT '',
      note   TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS submissions (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      at      TEXT NOT NULL,
      type    TEXT NOT NULL,
      name    TEXT NOT NULL DEFAULT '',
      email   TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS visitors (
      email      TEXT PRIMARY KEY,
      name       TEXT NOT NULL DEFAULT '',
      first_seen TEXT NOT NULL,
      last_seen  TEXT NOT NULL,
      visits     INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS site_hits (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      at         TEXT NOT NULL,
      day        TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      path       TEXT NOT NULL DEFAULT '/'
    );
    CREATE INDEX IF NOT EXISTS idx_site_hits_day ON site_hits(day);
    CREATE INDEX IF NOT EXISTS idx_site_hits_visitor ON site_hits(visitor_id);
  `);
  return _db;
}

/* ---------------- writes ---------------- */

export function insertLead(row: LeadRow): void {
  db()
    .prepare(`INSERT INTO leads (at, name, email, note) VALUES (?, ?, ?, ?)`)
    .run(row.at, row.name, row.email, row.note);
}

export function insertSubmission(row: SubmissionRow): void {
  db()
    .prepare(
      `INSERT INTO submissions (at, type, name, email, message) VALUES (?, ?, ?, ?, ?)`
    )
    .run(row.at, row.type, row.name, row.email, row.message);
}

/**
 * Remember a contact by email. New email → insert; existing → refresh name
 * (if a fuller one is given), bump visit count, update last_seen.
 */
export function upsertVisitor(name: string, email: string, at: string): void {
  const key = email.toLowerCase();
  if (!key) return;
  db()
    .prepare(
      `INSERT INTO visitors (email, name, first_seen, last_seen, visits)
       VALUES (?, ?, ?, ?, 1)
       ON CONFLICT(email) DO UPDATE SET
         name      = CASE WHEN excluded.name <> '' THEN excluded.name ELSE visitors.name END,
         last_seen = excluded.last_seen,
         visits    = visitors.visits + 1`
    )
    .run(key, name, at, at);
}

/* ---------------- reads ---------------- */

export function getVisitor(email: string): VisitorRow | null {
  const key = email.trim().toLowerCase();
  if (!key) return null;
  const r = db()
    .prepare(
      `SELECT email, name, first_seen AS firstSeen, last_seen AS lastSeen, visits
       FROM visitors WHERE email = ?`
    )
    .get(key) as VisitorRow | undefined;
  return r ?? null;
}

export function listLeads(): LeadRow[] {
  return db()
    .prepare(`SELECT at, name, email, note FROM leads ORDER BY id DESC`)
    .all() as LeadRow[];
}

export function listSubmissions(): SubmissionRow[] {
  return db()
    .prepare(`SELECT at, type, name, email, message FROM submissions ORDER BY id DESC`)
    .all() as SubmissionRow[];
}

export function listVisitors(): VisitorRow[] {
  return db()
    .prepare(
      `SELECT email, name, first_seen AS firstSeen, last_seen AS lastSeen, visits
       FROM visitors ORDER BY last_seen DESC`
    )
    .all() as VisitorRow[];
}

/* ---------------- admin replace-all (used by the CMS editor) ---------------- */

export function replaceLeads(rows: LeadRow[]): void {
  const conn = db();
  const tx = conn.prepare("DELETE FROM leads");
  tx.run();
  const ins = conn.prepare(`INSERT INTO leads (at, name, email, note) VALUES (?, ?, ?, ?)`);
  for (const r of rows) ins.run(r.at ?? "", r.name ?? "", r.email ?? "", r.note ?? "");
}

export function replaceSubmissions(rows: SubmissionRow[]): void {
  const conn = db();
  conn.prepare("DELETE FROM submissions").run();
  const ins = conn.prepare(
    `INSERT INTO submissions (at, type, name, email, message) VALUES (?, ?, ?, ?, ?)`
  );
  for (const r of rows) ins.run(r.at ?? "", r.type ?? "", r.name ?? "", r.email ?? "", r.message ?? "");
}

export function replaceVisitors(rows: VisitorRow[]): void {
  const conn = db();
  conn.prepare("DELETE FROM visitors").run();
  const ins = conn.prepare(
    `INSERT INTO visitors (email, name, first_seen, last_seen, visits) VALUES (?, ?, ?, ?, ?)`
  );
  for (const r of rows)
    ins.run(
      (r.email ?? "").toLowerCase(),
      r.name ?? "",
      r.firstSeen ?? new Date().toISOString(),
      r.lastSeen ?? new Date().toISOString(),
      Number(r.visits) || 1
    );
}

/* ---------------- anonymous traffic counter ---------------- */

export type TrafficDay = { day: string; pageviews: number; visitors: number };

export type TrafficStats = {
  totalVisitors: number;
  totalPageviews: number;
  todayVisitors: number;
  todayPageviews: number;
  last7Days: TrafficDay[];
};

/** Record one anonymous pageview. `visitorId` is a browser-local UUID. */
export function recordSiteHit(visitorId: string, path: string, at = new Date().toISOString()): void {
  const id = visitorId.trim().slice(0, 80);
  if (!id) return;
  const cleanPath = (path || "/").slice(0, 200);
  const day = at.slice(0, 10);
  db()
    .prepare(`INSERT INTO site_hits (at, day, visitor_id, path) VALUES (?, ?, ?, ?)`)
    .run(at, day, id, cleanPath);
}

export function getTrafficStats(): TrafficStats {
  const conn = db();
  const today = new Date().toISOString().slice(0, 10);

  const totalPageviews = Number(
    (conn.prepare(`SELECT COUNT(*) AS n FROM site_hits`).get() as { n: number }).n
  );
  const totalVisitors = Number(
    (conn.prepare(`SELECT COUNT(DISTINCT visitor_id) AS n FROM site_hits`).get() as { n: number }).n
  );
  const todayPageviews = Number(
    (conn.prepare(`SELECT COUNT(*) AS n FROM site_hits WHERE day = ?`).get(today) as { n: number }).n
  );
  const todayVisitors = Number(
    (
      conn
        .prepare(`SELECT COUNT(DISTINCT visitor_id) AS n FROM site_hits WHERE day = ?`)
        .get(today) as { n: number }
    ).n
  );

  const days: TrafficDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const day = d.toISOString().slice(0, 10);
    const pageviews = Number(
      (conn.prepare(`SELECT COUNT(*) AS n FROM site_hits WHERE day = ?`).get(day) as { n: number }).n
    );
    const visitors = Number(
      (
        conn
          .prepare(`SELECT COUNT(DISTINCT visitor_id) AS n FROM site_hits WHERE day = ?`)
          .get(day) as { n: number }
      ).n
    );
    days.push({ day, pageviews, visitors });
  }

  return { totalVisitors, totalPageviews, todayVisitors, todayPageviews, last7Days: days };
}
