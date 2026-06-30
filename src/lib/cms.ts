import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/** Collections that the CMS can read/write. Each maps to content/<name>.json */
export const COLLECTIONS = [
  "profile",
  "projects",
  "experience",
  "education",
  "certifications",
  "testimonials",
  "posts",
  "bot",
  "leads",
] as const;

export type Collection = (typeof COLLECTIONS)[number];

const CONTENT_DIR = path.join(process.cwd(), "content");

export function isCollection(x: string): x is Collection {
  return (COLLECTIONS as readonly string[]).includes(x);
}

export async function readCollection(c: Collection): Promise<unknown> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, `${c}.json`), "utf8");
  return JSON.parse(raw);
}

export async function writeCollection(c: Collection, data: unknown): Promise<void> {
  await fs.writeFile(
    path.join(CONTENT_DIR, `${c}.json`),
    JSON.stringify(data, null, 2) + "\n",
    "utf8"
  );
}

/* ---- auth (shared password from env ADMIN_PASSWORD, default "admin") ---- */
export const SESSION_COOKIE = "cms_session";

function password(): string {
  return process.env.ADMIN_PASSWORD || "admin";
}

export function checkPassword(pw: string): boolean {
  return pw === password();
}

/** Opaque session token derived from the password. */
export function expectedToken(): string {
  return crypto.createHash("sha256").update("cms:" + password()).digest("hex");
}
