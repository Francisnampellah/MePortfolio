import { NextResponse } from "next/server";
import { readCollection, writeCollection } from "@/lib/cms";
import { getBotConfig, buildKnowledge, systemPrompt } from "@/lib/bot";
import { sendEmail } from "@/lib/email";
import { insertLead, insertSubmission, upsertVisitor, getVisitor } from "@/lib/db";

export const runtime = "nodejs";

type Visitor = { name?: string; email?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A capture must have all its required fields (and a valid email) before we store/confirm it. */
function leadComplete(o: Record<string, unknown>): boolean {
  return (
    str(o.name).length > 0 &&
    EMAIL_RE.test(str(o.email)) &&
    str(o.note).length > 0
  );
}
function submissionComplete(type: string, o: Record<string, unknown>): boolean {
  if (str(o.message).length === 0) return false;
  if (type === "opinion") return true; // name/email optional for feedback
  return str(o.name).length > 0 && EMAIL_RE.test(str(o.email));
}

export const dynamic = "force-dynamic";

type Msg = { role: "user" | "assistant"; content: string };

type ChatLogEntry = {
  at: string;
  userMessage: string;
  assistantReply: string;
  leadCaptured: boolean;
  status: "ok" | "error";
  error?: string;
  durationMs: number;
  model?: string;
  messageCount: number;
};

const LOG_PREFIX = "[/api/chat]";
const MAX_CHAT_LOGS = 200;
const SUBMISSION_TYPES = ["order", "request", "opinion"] as const;

/**
 * Extract the first balanced {...} JSON object that follows `marker` in the
 * reply (a hidden capture trailer). Returns the visible text with the trailer
 * removed, plus the parsed object (or null if absent/malformed).
 */
function extractTrailer(reply: string, marker: string): { text: string; obj: Record<string, unknown> | null } {
  const idx = reply.indexOf(marker);
  if (idx === -1) return { text: reply, obj: null };
  const before = reply.slice(0, idx).trim();
  const rest = reply.slice(idx + marker.length);
  const start = rest.indexOf("{");
  if (start === -1) return { text: before, obj: null };
  let depth = 0;
  let end = -1;
  for (let i = start; i < rest.length; i++) {
    if (rest[i] === "{") depth++;
    else if (rest[i] === "}" && --depth === 0) {
      end = i;
      break;
    }
  }
  if (end === -1) return { text: before, obj: null };
  try {
    return { text: before, obj: JSON.parse(rest.slice(start, end + 1)) };
  } catch {
    return { text: before, obj: null };
  }
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Build a "returning visitor" note for the system prompt from the browser-sent
 * visitor, enriched by the DB record (fuller name / visit count) when the email
 * is already known. Returns "" for a brand-new/anonymous visitor.
 */
function buildVisitorNote(v: Visitor | undefined): string {
  const email = str(v?.email);
  let name = str(v?.name);
  let visits = 0;
  if (email && EMAIL_RE.test(email)) {
    try {
      const known = getVisitor(email);
      if (known) {
        name = known.name || name;
        visits = known.visits;
      }
    } catch (err) {
      console.warn(`${LOG_PREFIX} visitor lookup failed:`, err);
    }
  }
  if (!name && !email) return "";
  const who = name ? name : "this visitor";
  const parts = [`You have spoken with ${who} before — treat them as a returning visitor.`];
  if (name) parts.push(`Name: ${name}.`);
  if (email) parts.push(`Email: ${email}.`);
  if (visits > 1) parts.push(`Prior visits: ${visits}.`);
  parts.push(
    "Greet them warmly by name. You already have these details, so do NOT ask for them again — reuse them, and only update if they offer a change."
  );
  return parts.join(" ");
}

type Notification = { subject: string; text: string };

/** Compose the notification email for a captured lead. */
function leadNotification(obj: Record<string, unknown>, lastMessage: string): Notification {
  const name = str(obj.name) || "Someone";
  const lines = [
    "New lead from your portfolio chat.",
    "",
    `Name:  ${str(obj.name) || "—"}`,
    `Email: ${str(obj.email) || "—"}`,
    `Note:  ${str(obj.note) || "—"}`,
    "",
    `Their last message: "${lastMessage}"`,
    "",
    "— Sent automatically by your portfolio AI assistant.",
  ];
  return { subject: `New lead via portfolio: ${name}`, text: lines.join("\n") };
}

/** Compose the notification email for a captured submission (order/request/opinion). */
function submissionNotification(
  entry: { type: string; name: string; email: string; message: string },
  lastMessage: string
): Notification {
  const who = entry.name || "Someone";
  const subjectByType: Record<string, string> = {
    order: `New order via portfolio: ${who}`,
    request: `New request via portfolio: ${who}`,
    opinion: `New feedback on your portfolio`,
  };
  const lines = [
    `New ${entry.type} from your portfolio chat.`,
    "",
    `Type:    ${entry.type}`,
    `Name:    ${entry.name || "—"}`,
    `Email:   ${entry.email || "—"}`,
    `Message: ${entry.message || "—"}`,
    "",
    `Their last message: "${lastMessage}"`,
    "",
    "— Sent automatically by your portfolio AI assistant.",
  ];
  return {
    subject: subjectByType[entry.type] ?? `New ${entry.type} via portfolio`,
    text: lines.join("\n"),
  };
}

function openAIConfig() {
  return {
    key: process.env.OPENAI_API_KEY?.trim() || "",
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
  };
}

function lastUserMessage(messages: Msg[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return messages.at(-1)?.content ?? "";
}

async function appendChatLog(entry: ChatLogEntry): Promise<void> {
  try {
    const logs = (await readCollection("chat-logs").catch(() => [])) as ChatLogEntry[];
    const list = Array.isArray(logs) ? logs : [];
    list.push(entry);
    await writeCollection("chat-logs", list.slice(-MAX_CHAT_LOGS));
  } catch (err) {
    console.error(`${LOG_PREFIX} failed to persist chat log:`, err);
  }
}

export async function POST(req: Request) {
  const started = Date.now();
  let messages: Msg[] = [];
  let model = openAIConfig().model;
  let reply = "";
  let leadCaptured = false;
  let submission: { type: string } | null = null;
  let visitor: Visitor | null = null;
  let status: ChatLogEntry["status"] = "ok";
  let error: string | undefined;

  try {
    let body: { messages?: Msg[]; visitor?: Visitor };
    try {
      body = await req.json();
    } catch {
      console.warn(`${LOG_PREFIX} invalid JSON body`);
      return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
    }

    messages = (body.messages || []).filter(
      (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
    );
    if (messages.length === 0) {
      console.warn(`${LOG_PREFIX} rejected: no messages`);
      return NextResponse.json({ error: "no messages" }, { status: 400 });
    }

    const userMessage = lastUserMessage(messages);
    console.log(
      `${LOG_PREFIX} request | messages=${messages.length} lastUser="${userMessage.slice(0, 120)}${userMessage.length > 120 ? "…" : ""}"`
    );

    // Returning-visitor memory: prefer what the DB knows (fuller name, visit
    // count) over what the browser sent, keyed by email.
    const visitorNote = buildVisitorNote(body.visitor);

    const cfg = await getBotConfig();
    const knowledge = await buildKnowledge();
    const system = systemPrompt(cfg, knowledge, visitorNote);

    const { key, model: configuredModel } = openAIConfig();
    model = configuredModel;

    if (!key) {
      status = "error";
      error = "OPENAI_API_KEY missing";
      reply =
        "I'm briefly offline — try again in a moment, or email me at Bnampellah1@gmail.com.";
      console.warn(`${LOG_PREFIX} ${error}. Add it to .env.local and restart \`npm run dev\`.`);
      return NextResponse.json({ reply, leadCaptured: false });
    }

    console.log(`${LOG_PREFIX} calling OpenAI | model=${model}`);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          messages: [{ role: "system", content: system }, ...messages],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        status = "error";
        error = `OpenAI ${res.status}: ${errText.slice(0, 300)}`;
        reply =
          "Sorry, I hit an error reaching my brain. Try again, or email Bnampellah1@gmail.com.";
        console.error(`${LOG_PREFIX} ${error}`);
        return NextResponse.json({ reply, leadCaptured: false });
      }

      const data = await res.json();
      reply = data?.choices?.[0]?.message?.content ?? "";

      if (!reply.trim()) {
        status = "error";
        error = "OpenAI returned an empty reply";
        reply =
          "Sorry, I got an empty response. Try again, or email Bnampellah1@gmail.com.";
        console.error(`${LOG_PREFIX} ${error}`, data);
        return NextResponse.json({ reply, leadCaptured: false });
      }
    } catch (err) {
      status = "error";
      error = err instanceof Error ? err.message : "OpenAI fetch failed";
      reply =
        "Hmm, I couldn't connect just now — mind trying again? You can always email Bnampellah1@gmail.com.";
      console.error(`${LOG_PREFIX} OpenAI fetch failed:`, err);
      return NextResponse.json({ reply, leadCaptured: false });
    }

    // Capture tools: parse + persist hidden ##SUBMIT## / ##LEAD## {json} trailers.
    // Only stored once ALL required fields are present (enforcement) — an
    // incomplete trailer is dropped, so nothing half-formed reaches Nampellah.
    let notify: Notification | null = null;

    const sub = extractTrailer(reply, "##SUBMIT##");
    if (sub.obj) {
      reply = sub.text;
      const type = str(sub.obj.type).toLowerCase();
      if (!(SUBMISSION_TYPES as readonly string[]).includes(type)) {
        console.warn(`${LOG_PREFIX} submission with unknown type: ${type || "(empty)"}`);
      } else if (!submissionComplete(type, sub.obj)) {
        console.warn(`${LOG_PREFIX} incomplete ${type} submission dropped (missing required fields)`);
      } else {
        const entry = {
          at: new Date().toISOString(),
          type,
          name: str(sub.obj.name),
          email: str(sub.obj.email),
          message: str(sub.obj.message),
        };
        try {
          insertSubmission(entry);
          if (entry.email) upsertVisitor(entry.name, entry.email, entry.at);
        } catch (err) {
          console.error(`${LOG_PREFIX} DB insert (submission) failed:`, err);
        }
        submission = { type };
        if (entry.email) visitor = { name: entry.name, email: entry.email };
        notify = submissionNotification(entry, userMessage);
        console.log(`${LOG_PREFIX} submission captured | type=${type} email=${entry.email || "?"}`);
      }
    }

    const lead = extractTrailer(reply, "##LEAD##");
    if (lead.obj) {
      reply = lead.text;
      if (!leadComplete(lead.obj)) {
        console.warn(`${LOG_PREFIX} incomplete lead dropped (missing required fields)`);
      } else {
        const entry = {
          at: new Date().toISOString(),
          name: str(lead.obj.name),
          email: str(lead.obj.email),
          note: str(lead.obj.note),
        };
        try {
          insertLead(entry);
          upsertVisitor(entry.name, entry.email, entry.at);
        } catch (err) {
          console.error(`${LOG_PREFIX} DB insert (lead) failed:`, err);
        }
        leadCaptured = true;
        visitor = { name: entry.name, email: entry.email };
        notify = leadNotification(lead.obj, userMessage);
        console.log(`${LOG_PREFIX} lead captured | name=${entry.name || "?"} email=${entry.email || "?"}`);
      }
    }

    // Email Nampellah when a message needs to reach him. Never blocks the reply
    // on failure — email errors are logged, not surfaced to the visitor.
    if (notify) {
      const r = await sendEmail(notify.subject, notify.text);
      if (!r.ok && !r.skipped) console.warn(`${LOG_PREFIX} notification email not sent: ${r.error}`);
    }

    const durationMs = Date.now() - started;
    console.log(
      `${LOG_PREFIX} ok | ${durationMs}ms | reply_len=${reply.length} lead=${leadCaptured} reply="${reply.slice(0, 120)}${reply.length > 120 ? "…" : ""}"`
    );

    return NextResponse.json({ reply, leadCaptured, submission, visitor });
  } finally {
    if (messages.length > 0) {
      const durationMs = Date.now() - started;
      await appendChatLog({
        at: new Date().toISOString(),
        userMessage: lastUserMessage(messages),
        assistantReply: reply,
        leadCaptured,
        status,
        error,
        durationMs,
        model,
        messageCount: messages.length,
      });
    }
  }
}
