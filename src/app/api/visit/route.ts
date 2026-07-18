import { NextResponse } from "next/server";
import { recordSiteHit } from "@/lib/db";

export const runtime = "nodejs";

/**
 * Anonymous pageview beacon. Body: { id: string, path?: string }
 * No cookies of our own — the client keeps a local UUID.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { id?: string; path?: string };
    const id = typeof body.id === "string" ? body.id.trim() : "";
    if (!id || id.length < 8 || id.length > 80) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    let path = typeof body.path === "string" ? body.path : "/";
    if (!path.startsWith("/")) path = "/";
    // Don't count admin or API noise.
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true, skipped: true });
    }
    recordSiteHit(id, path.split("?")[0].slice(0, 200));
    return NextResponse.json({ ok: true });
  } catch {
    // Fail soft — never break the page for analytics.
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
