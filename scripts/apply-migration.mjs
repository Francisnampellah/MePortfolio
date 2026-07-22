/**
 * Apply supabase/migrations/001_portfolio.sql via Postgres connection string.
 *
 * Get the URI from: Supabase Dashboard → Project Settings → Database →
 * Connection string → URI (use the "Session mode" / direct host if available).
 *
 * Then either:
 *   set DATABASE_URL in .env.local, or
 *   pass it: DATABASE_URL="postgresql://..." npm run db:migrate
 */
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, "..", "supabase", "migrations", "001_portfolio.sql");

const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
const projectRef = (process.env.NEXT_PUBLIC_SUPABASE_URL || "")
  .replace(/^https?:\/\//, "")
  .split(".")[0];

if (!url) {
  const sqlEditor = projectRef
    ? `https://supabase.com/dashboard/project/${projectRef}/sql/new`
    : "https://supabase.com/dashboard/project/_/sql/new";
  console.error(`
Missing DATABASE_URL (or SUPABASE_DB_URL).

Fastest path (no password needed):
  1. Open ${sqlEditor}
  2. Paste contents of supabase/migrations/001_portfolio.sql
  3. Click Run
  4. npm run db:seed

Or add the Database URI to .env.local as DATABASE_URL and re-run:
  npm run db:migrate
`);
  process.exit(1);
}

const sql = readFileSync(sqlPath, "utf8");
const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
try {
  await client.query(sql);
  console.log("✓ Applied", path.relative(process.cwd(), sqlPath));
} finally {
  await client.end();
}
