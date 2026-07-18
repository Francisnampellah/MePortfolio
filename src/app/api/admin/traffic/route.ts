import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { expectedToken, SESSION_COOKIE } from "@/lib/cms";
import { getTrafficStats } from "@/lib/db";

export const runtime = "nodejs";

function authed(): boolean {
  return cookies().get(SESSION_COOKIE)?.value === expectedToken();
}

/** Admin-only traffic summary for the visitor counter. */
export async function GET() {
  if (!authed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(getTrafficStats());
  } catch {
    return NextResponse.json({ error: "read failed" }, { status: 500 });
  }
}
