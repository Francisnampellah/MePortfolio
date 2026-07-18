"use client";

import { useState } from "react";
import { Button, Field, Input, Alert } from "namps-ui";
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
    <div className="cms-login">
      <form onSubmit={submit} className="cms-login__card">
        <div
          className="grid h-11 w-11 place-items-center rounded-[12px] text-white"
          style={{ background: "var(--cms-sidebar)" }}
        >
          <Lock className="h-5 w-5" strokeWidth={2} />
        </div>
        <h1 className="cms-login__title">Content Manager</h1>
        <p className="cms-login__lede">Sign in to edit your portfolio content.</p>

        <div className="mt-6">
          <Field label="Password" error={error || undefined}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              placeholder="••••••••"
              invalid={Boolean(error)}
            />
          </Field>
        </div>

        {error ? (
          <div className="mt-3">
            <Alert tone="danger">{error}</Alert>
          </div>
        ) : null}

        <div className="mt-5">
          <Button type="submit" variant="primary" disabled={busy} style={{ width: "100%" }}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-[var(--cms-muted)]">
          Default password is <strong>admin</strong> — set{" "}
          <code>ADMIN_PASSWORD</code> in <code>.env.local</code> to change it.
        </p>
      </form>
    </div>
  );
}
