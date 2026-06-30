import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  isCollection,
  readCollection,
  writeCollection,
  expectedToken,
  SESSION_COOKIE,
} from "@/lib/cms";

function authed(): boolean {
  return cookies().get(SESSION_COOKIE)?.value === expectedToken();
}

type Ctx = { params: { collection: string } };

export async function GET(_req: Request, { params }: Ctx) {
  if (!authed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isCollection(params.collection))
    return NextResponse.json({ error: "unknown collection" }, { status: 404 });
  try {
    return NextResponse.json(await readCollection(params.collection));
  } catch {
    return NextResponse.json({ error: "read failed" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!authed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isCollection(params.collection))
    return NextResponse.json({ error: "unknown collection" }, { status: 404 });

  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  try {
    await writeCollection(params.collection, data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "write failed — the filesystem may be read-only (e.g. on Vercel). Run the CMS locally or self-hosted." },
      { status: 500 }
    );
  }
}
