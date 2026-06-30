"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type Msg = { role: "user" | "bot"; text: string };

const CHIPS = ["What do you build?", "Your tech stack?", "Let's collaborate"];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Baraka");
  const [greeting, setGreeting] = useState(
    "Hey! 👋 I'm Baraka's AI — ask me about my work, stack, or projects."
  );
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadDone, setLeadDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // load bot display config + any persisted conversation
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
      localStorage.setItem("baraka_chat", JSON.stringify(m.slice(-30)));
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

    const apiMessages = next
      .slice(-12)
      .map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));

    let reply = "";
    let captured = false;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      reply = data.reply || "…";
      captured = !!data.leadCaptured;
    } catch {
      reply = "I couldn't reach the server just now — try again, or email Bnampellah1@gmail.com.";
    }

    const after = [...next, { role: "bot" as const, text: reply }];
    setMessages(after);
    setLoading(false);
    if (captured) setLeadDone(true);
    persist(after);
    scrollDown();
  };

  const showChips = messages.length <= 1 && !loading;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggle}
        aria-label="Chat with Baraka's assistant"
        className="fixed bottom-[22px] right-[22px] z-[71] flex h-[52px] items-center gap-2.5 rounded-[26px] bg-ink pl-3.5 pr-[18px] text-white shadow-[0_10px_30px_rgba(20,18,15,.28)] transition-transform hover:scale-[1.02]"
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
        <div className="fixed bottom-[86px] right-[22px] z-[72] flex h-[min(580px,calc(100vh-130px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_24px_70px_rgba(20,18,15,.3)] max-[760px]:inset-x-3 max-[760px]:bottom-20 max-[760px]:h-[min(72vh,calc(100vh-110px))] max-[760px]:w-auto">
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

            {leadDone ? (
              <div className="inline-flex items-center gap-2 self-center rounded-full border border-[#c8e6d4] bg-[#eaf6ef] px-3.5 py-2 text-[12px] font-semibold text-[#1f7a4d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2e9e63]" />
                Details captured — Baraka will be in touch
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
