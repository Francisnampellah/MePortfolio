import { PROFILE } from "./data";

/**
 * Single source of truth for site-wide SEO constants. `metadataBase`, the
 * sitemap, robots, canonicals, JSON-LD and the OG images all read from here so
 * the production URL and identity are never duplicated / drift out of sync.
 *
 * Override the domain per-environment with NEXT_PUBLIC_SITE_URL (e.g. a Vercel
 * preview URL) without touching code.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  PROFILE.website ||
  "https://baraka-nampellah.dev"
).replace(/\/$/, "");

export const SITE_NAME = PROFILE.shortName; // "Baraka Nampellah"
export const SITE_TITLE = `${PROFILE.shortName} · ${PROFILE.role}`;

export const SITE_DESCRIPTION =
  "Full Stack Software Engineer from Dar es Salaam, Tanzania building scalable backends, cross platform mobile apps, and AI ready systems with NestJS, Django, React, Next.js, Flutter, and PostgreSQL.";

export const OG_IMAGE_ALT = `${PROFILE.shortName} · ${PROFILE.role}`;

/** Profiles that verify this identity — feeds JSON-LD `sameAs`. */
export const SAME_AS = [PROFILE.github, PROFILE.linkedin].filter(Boolean);

export const SEO_KEYWORDS = [
  "Baraka Nampellah",
  "Baraka Francis Nampellah",
  "Full Stack Software Engineer",
  "Software Engineer Tanzania",
  "Software Engineer Dar es Salaam",
  "NestJS developer",
  "React developer",
  "Next.js developer",
  "Flutter developer",
  "React Native developer",
  "TypeScript",
  "Django REST",
  "PostgreSQL",
  "Microservices",
  "Docker",
  "AWS",
  "Agentic AI",
];

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

/** "Jun 2026" → "2026-06-01" (ISO) for datePublished / sitemap lastmod. */
export function postDateISO(date: string): string {
  const m = date.match(/([A-Za-z]{3,})\s+(\d{4})/);
  if (!m) return `${new Date().getFullYear()}-01-01`;
  const mm = MONTHS[m[1].slice(0, 3).toLowerCase()] ?? "01";
  return `${m[2]}-${mm}-01`;
}
