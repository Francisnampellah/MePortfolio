import { NextResponse } from "next/server";
import { getBotConfig } from "@/lib/bot";

export const dynamic = "force-dynamic";

/** Public: exposes only the safe display bits the widget needs. */
export async function GET() {
  const cfg = await getBotConfig();
  return NextResponse.json({ name: cfg.name, greeting: cfg.greeting });
}
