/**
 * Seed Supabase from content/*.json
 * Usage: node --env-file=.env.local scripts/seed-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const contentDir = path.join(root, "content");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / publishable (or service role) key");
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CMS_IDS = [
  "profile",
  "hero",
  "capabilities",
  "projects",
  "experience",
  "education",
  "certifications",
  "testimonials",
  "posts",
  "bot",
  "chat-logs",
];

async function seedCms() {
  for (const id of CMS_IDS) {
    const file = path.join(contentDir, `${id}.json`);
    try {
      const data = JSON.parse(readFileSync(file, "utf8"));
      const { error } = await sb.from("cms_docs").upsert({
        id,
        data,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      console.log(`✓ cms_docs/${id}`);
    } catch (err) {
      console.error(`✗ cms_docs/${id}:`, err.message || err);
    }
  }
}

async function seedLeads() {
  try {
    const rows = JSON.parse(readFileSync(path.join(contentDir, "leads.json"), "utf8"));
    if (!Array.isArray(rows) || !rows.length) {
      console.log("· leads (empty, skip)");
      return;
    }
    await sb.from("leads").delete().gte("id", 0);
    const { error } = await sb.from("leads").insert(
      rows.map((r) => ({
        at: r.at || new Date().toISOString(),
        name: r.name || "",
        email: r.email || "",
        note: r.note || "",
      }))
    );
    if (error) throw error;
    console.log(`✓ leads (${rows.length})`);
  } catch (err) {
    console.error("✗ leads:", err.message || err);
  }
}

async function seedSubmissions() {
  try {
    const rows = JSON.parse(readFileSync(path.join(contentDir, "submissions.json"), "utf8"));
    if (!Array.isArray(rows) || !rows.length) {
      console.log("· submissions (empty, skip)");
      return;
    }
    await sb.from("submissions").delete().gte("id", 0);
    const { error } = await sb.from("submissions").insert(
      rows.map((r) => ({
        at: r.at || new Date().toISOString(),
        type: r.type || "request",
        name: r.name || "",
        email: r.email || "",
        message: r.message || "",
      }))
    );
    if (error) throw error;
    console.log(`✓ submissions (${rows.length})`);
  } catch (err) {
    console.error("✗ submissions:", err.message || err);
  }
}

async function main() {
  console.log("Seeding Supabase…");
  console.log("Files in content/:", readdirSync(contentDir).join(", "));
  await seedCms();
  await seedLeads();
  await seedSubmissions();
  console.log("Done.");
}

main();
