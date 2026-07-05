import { NextResponse } from "next/server";
import { readCollection, writeCollection } from "@/lib/cms";
import { getBotConfig, buildKnowledge, systemPrompt } from "@/lib/bot";

export const dynamic = "force-dynamic";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  let body: { messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const messages = (body.messages || []).filter(
    (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
  );
  if (messages.length === 0) {
    return NextResponse.json({ error: "no messages" }, { status: 400 });
  }

  const cfg = await getBotConfig();
  const knowledge = await buildKnowledge();
  const system = systemPrompt(cfg, knowledge);

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({
      reply:
        "I'm not fully wired up yet (no OPENAI_API_KEY set). In the meantime: I'm Baraka, a full-stack engineer — ask away or email me at Bnampellah1@gmail.com.",
      leadCaptured: false,
    });
  }

  let reply = "";
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI error:", err);
      return NextResponse.json(
        { reply: "Sorry, I hit an error reaching my brain. Try again, or email Bnampellah1@gmail.com." },
        { status: 200 }
      );
    }
    const data = await res.json();
    reply = data?.choices?.[0]?.message?.content ?? "";
  } catch {
    return NextResponse.json(
      { reply: "Hmm, I couldn't connect just now — mind trying again? You can always email Bnampellah1@gmail.com." },
      { status: 200 }
    );
  }

  // Lead capture: parse + persist a ##LEAD## {json} trailer.
  let leadCaptured = false;
  const idx = reply.indexOf("##LEAD##");
  if (idx !== -1) {
    const jsonPart = reply.slice(idx + "##LEAD##".length).trim();
    try {
      const lead = JSON.parse(jsonPart);
      const leads = (await readCollection("leads").catch(() => [])) as unknown[];
      const list = Array.isArray(leads) ? leads : [];
      list.push({ at: new Date().toISOString(), ...lead });
      await writeCollection("leads", list);
      leadCaptured = true;
    } catch {
      /* malformed lead — ignore */
    }
    reply = reply.slice(0, idx).trim();
  }

  return NextResponse.json({ reply, leadCaptured });
}
