"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      window.location.reload();
    } else {
      setError("Incorrect password.");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-[360px] rounded-2xl border border-line bg-white p-8"
      >
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-white">
          <Lock className="h-5 w-5" strokeWidth={2} />
        </div>
        <h1 className="mt-5 text-[22px] font-extrabold tracking-[-0.02em] text-[#141414]">
          Content Manager
        </h1>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
          Sign in to edit your portfolio content.
        </p>

        <label className="mt-6 flex flex-col gap-1.5">
          <span className="font-mono text-[11px] text-muted2">password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="rounded-[9px] border border-[#ddd9d3] bg-white px-3.5 py-3 text-[14px] text-ink outline-none transition-colors focus:border-accent"
            placeholder="••••••••"
          />
        </label>

        {error ? <p className="mt-3 text-[13px] text-[#c0392b]">{error}</p> : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-[9px] bg-ink py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-black disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="mt-4 font-mono text-[10.5px] leading-relaxed text-faint">
          Default password is <span className="text-muted2">admin</span> — set
          ADMIN_PASSWORD in .env.local to change it.
        </p>
      </form>
    </div>
  );
}
