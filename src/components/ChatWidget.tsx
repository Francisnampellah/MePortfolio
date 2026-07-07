"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type Msg = { role: "user" | "bot"; text: string };

const CHIPS = [
  "What does Nampellah build?",
  "Is he available for work?",
  "I've got a project",
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MAX_SENTENCES_PER_BUBBLE = 3; // keep bubbles to 2-3 sentences
const CHUNK_SENTENCES = 2; // when re-chunking a long block, group this many

/**
 * Split a paragraph into sentences. Splits only at whitespace that follows
 * sentence-ending punctuation AND precedes a capital letter or quote — so
 * abbreviations ("e.g.", "i.e.", "vs.") stay intact because they're followed by
 * a lowercase word, not a new capitalized sentence.
 */
function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=["'“(]?[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Regroup sentences into chunks of `size`, merging a lone trailing sentence back. */
function chunkSentences(sentences: string[], size = CHUNK_SENTENCES): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i += size) {
    chunks.push(sentences.slice(i, i + size).join(" "));
  }
  if (chunks.length > 1 && sentences.length % size === 1) {
    const orphan = chunks.pop()!;
    chunks[chunks.length - 1] += " " + orphan;
  }
  return chunks;
}

/**
 * Turn one model reply into consecutive chat bubbles so answers arrive as several
 * short texts instead of a wall of text. First splits on the `<split>` token or a
 * blank line (the model's natural paragraph break); then, so this works even when
 * the model returns one long block, breaks any segment over 3 sentences into
 * ~2-sentence chunks. Also drops any `##LEAD##` trailer not stripped server-side.
 */
function toBubbles(reply: string): string[] {
  const cut = stripMarkdown(reply.split(/##LEAD##|##SUBMIT##/)[0]);
  const segments = cut
    .split(/\s*<split>\s*|\n\s*\n/gi)
    .map((s) => s.trim())
    .filter(Boolean);

  const bubbles: string[] = [];
  for (const seg of segments) {
    const sentences = splitSentences(seg);
    if (sentences.length <= MAX_SENTENCES_PER_BUBBLE) {
      bubbles.push(seg);
    } else {
      bubbles.push(...chunkSentences(sentences));
    }
  }
  return bubbles;
}

/** Natural typing pause before a bubble, scaled to its length (400–1400ms). */
function bubbleDelay(text: string): number {
  return Math.min(1400, 400 + text.length * 16);
}

/**
 * Strip markdown so it doesn't render as literal *, -, #, ` in the plain-text
 * bubbles. Bot replies sometimes come back with **bold** or "- " bullet lists;
 * those symbols have no meaning here and just look like noise.
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/`{1,3}/g, "") // inline/fenced code ticks
    .replace(/(^|\n)[ \t]{0,3}#{1,6}[ \t]+/g, "$1") // # headings
    .replace(/(^|\n)[ \t]*[-*•][ \t]+/g, "$1") // leading list bullets
    .replace(/__(.+?)__/g, "$1") // __bold__
    .replace(/\*+/g, "") // ** bold, * italic, and any stray asterisks
    .replace(/[ \t]{2,}/g, " ") // collapse doubled spaces left behind
    .replace(/[ \t]+\n/g, "\n") // trailing spaces before newlines
    .trim();
}

/** Confirmation banner text for a captured lead or submission (empty = none). */
function captureNotice(leadCaptured?: boolean, submissionType?: string): string {
  switch (submissionType) {
    case "order":
      return "Order received — Nampellah will be in touch";
    case "request":
      return "Request noted — Nampellah will follow up";
    case "opinion":
      return "Thanks — your feedback reached Nampellah";
  }
  return leadCaptured ? "Details captured — Nampellah will be in touch" : "";
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Nampellah AI");
  const [greeting, setGreeting] = useState(
    "Karibu. I speak for Nampellah when he's busy shipping. What brings you here?"
  );
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  // Remembered contact (name/email) so a returning visitor isn't re-asked.
  const visitorRef = useRef<{ name?: string; email?: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // load bot display config + any persisted conversation + remembered visitor
  useEffect(() => {
    fetch("/api/bot")
      .then((r) => r.json())
      .then((d) => {
        if (d?.name) setName(d.name);
        if (d?.greeting) setGreeting(d.greeting);
      })
      .catch(() => {});
    try {
      const saved = JSON.parse(localStorage.getItem("baraka_chat") || "null");
      if (Array.isArray(saved) && saved.length) setMessages(saved);
    } catch {}
    try {
      const v = JSON.parse(localStorage.getItem("baraka_visitor") || "null");
      if (v && (v.name || v.email)) visitorRef.current = v;
    } catch {}
  }, []);

  const scrollDown = () =>
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && messages.length === 0) setMessages([{ role: "bot", text: greeting }]);
    if (next) scrollDown();
  };

  const persist = (m: Msg[]) => {
    try {
      localStorage.setItem("baraka_chat", JSON.stringify(m.slice(-60)));
    } catch {}
  };

  const send = async (textArg?: string) => {
    const text = (textArg ?? input).trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    persist(next);
    scrollDown();

    // Merge consecutive same-role bubbles so a multi-bubble reply counts as ONE
    // turn (not 3-4 messages), then send a generous window. Without this the
    // model quickly loses details the visitor gave earlier — e.g. their name and
    // email scroll out of view and it starts re-asking for them.
    const merged: { role: "assistant" | "user"; content: string }[] = [];
    for (const m of next) {
      const role: "assistant" | "user" = m.role === "bot" ? "assistant" : "user";
      const last = merged[merged.length - 1];
      if (last && last.role === role) last.content += "\n\n" + m.text;
      else merged.push({ role, content: m.text });
    }
    const apiMessages = merged.slice(-24);

    let reply = "";
    let noticeText = "";
    try {
      console.log("[ChatWidget] sending", { messageCount: apiMessages.length, last: text });
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, visitor: visitorRef.current || undefined }),
      });

      let data: {
        reply?: string;
        leadCaptured?: boolean;
        submission?: { type?: string } | null;
        visitor?: { name?: string; email?: string } | null;
        error?: string;
      } = {};
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error("[ChatWidget] invalid JSON response", { status: res.status, parseErr });
        throw new Error(`Invalid server response (${res.status})`);
      }

      console.log("[ChatWidget] response", {
        status: res.status,
        ok: res.ok,
        leadCaptured: data.leadCaptured,
        submission: data.submission?.type,
        replyPreview: data.reply?.slice(0, 120),
        error: data.error,
      });

      if (!res.ok) {
        throw new Error(data.error || `Server error (${res.status})`);
      }

      reply = data.reply?.trim() || "";
      if (!reply) {
        throw new Error("Empty reply from server");
      }
      noticeText = captureNotice(data.leadCaptured, data.submission?.type);

      // Remember this visitor's contact for next time (survives reloads).
      if (data.visitor && (data.visitor.name || data.visitor.email)) {
        visitorRef.current = { ...visitorRef.current, ...data.visitor };
        try {
          localStorage.setItem("baraka_visitor", JSON.stringify(visitorRef.current));
        } catch {}
      }
    } catch (err) {
      console.error("[ChatWidget] request failed", err);
      reply = "I couldn't reach the server just now — try again, or email Bnampellah1@gmail.com.";
    }

    // Drip the reply out as consecutive bubbles for a natural texting rhythm:
    // reveal the first immediately, then show the typing indicator and pause
    // before each following bubble.
    const bubbles = toBubbles(reply);
    if (bubbles.length === 0) bubbles.push("…");

    let acc = next;
    for (let i = 0; i < bubbles.length; i++) {
      if (i > 0) {
        setLoading(true);
        scrollDown();
        await sleep(bubbleDelay(bubbles[i]));
      }
      setLoading(false);
      acc = [...acc, { role: "bot" as const, text: bubbles[i] }];
      setMessages(acc);
      persist(acc);
      scrollDown();
    }

    setLoading(false);
    if (noticeText) setNotice(noticeText);
  };

  const showChips = messages.length <= 1 && !loading;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggle}
        aria-label="Chat with Nampellah's AI assistant"
        className="fixed bottom-[22px] right-[22px] z-[71] flex h-[52px] items-center gap-2.5 rounded-[26px] bg-ink pl-3.5 pr-[18px] text-white shadow-[0_10px_30px_rgba(20,18,15,.28)] transition-transform hover:scale-[1.02] max-md:bottom-[calc(4.5rem+env(safe-area-inset-bottom))] max-md:right-4"
      >
        <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-accent">
          <MessageCircle className="h-4 w-4 text-white" strokeWidth={2} />
        </span>
        <span className="text-[13.5px] font-semibold tracking-[-0.01em]">
          {open ? "Close" : "Ask me anything"}
        </span>
      </button>

      {/* Panel */}
      {open ? (
        <div className="fixed bottom-[86px] right-[22px] z-[72] flex h-[min(580px,calc(100vh-130px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_24px_70px_rgba(20,18,15,.3)] max-[760px]:inset-x-3 max-[760px]:bottom-[calc(8.5rem+env(safe-area-inset-bottom))] max-[760px]:h-[min(68vh,calc(100vh-210px))] max-[760px]:w-auto">
          {/* header */}
          <div className="flex items-center gap-[11px] border-b border-line bg-surface px-4 py-3.5">
            <div className="relative h-[38px] w-[38px] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/baraka.jpg"
                alt="Baraka"
                className="h-[38px] w-[38px] rounded-full border border-line object-cover object-top"
              />
              <span className="absolute -bottom-px -right-px h-[11px] w-[11px] rounded-full border-2 border-surface bg-[#2e9e63]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[14px] font-bold tracking-[-0.01em]">
                {name}
                <span className="rounded border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] px-1.5 py-px font-mono text-[8px] font-semibold uppercase tracking-[0.06em] text-accent">
                  AI
                </span>
              </div>
              <div className="font-mono text-[10px] text-muted2">Usually replies in seconds</div>
            </div>
            <button
              onClick={toggle}
              aria-label="Close"
              className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white text-[15px] text-muted hover:border-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto bg-white p-4">
            {messages.map((m, i) => {
              const bot = m.role === "bot";
              return (
                <div
                  key={i}
                  className={`flex max-w-[84%] items-end gap-2 ${
                    bot ? "flex-row self-start" : "flex-row-reverse self-end"
                  }`}
                >
                  {bot ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/baraka.jpg" alt="" className="h-6 w-6 shrink-0 rounded-full object-cover object-top" />
                  ) : null}
                  <div
                    className="whitespace-pre-wrap px-3 py-2.5 text-[13.5px] leading-[1.55]"
                    style={{
                      color: bot ? "#3f3a35" : "#fff",
                      background: bot ? "#f5f3f0" : "var(--accent)",
                      border: bot ? "1px solid var(--line)" : "none",
                      borderRadius: bot ? "14px 14px 14px 4px" : "14px 14px 4px 14px",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}

            {loading ? (
              <div className="flex items-end gap-2 self-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/baraka.jpg" alt="" className="h-6 w-6 rounded-full object-cover object-top" />
                <div className="flex gap-1 rounded-[14px_14px_14px_4px] bg-surface2 px-3.5 py-3">
                  {[0, 0.2, 0.4].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-[#b3aea6]"
                      style={{ animation: `blink 1s ease-in-out ${d}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {notice ? (
              <div className="inline-flex items-center gap-2 self-center rounded-full border border-[#c8e6d4] bg-[#eaf6ef] px-3.5 py-2 text-[12px] font-semibold text-[#1f7a4d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2e9e63]" />
                {notice}
              </div>
            ) : null}
          </div>

          {/* chips */}
          {showChips ? (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2.5">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={() => send(c)}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-[#3f3a35] hover:border-accent"
                >
                  {c}
                </button>
              ))}
            </div>
          ) : null}

          {/* input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2.5 border-t border-line bg-surface px-3.5 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              className="flex-1 rounded-[11px] border border-[#ddd9d3] bg-white px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-accent"
            />
            <button
              type="submit"
              aria-label="Send"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] bg-accent text-white"
            >
              <Send className="h-[17px] w-[17px]" strokeWidth={2} />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
