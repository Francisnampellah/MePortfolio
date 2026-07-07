/**
 * Notification email via Resend (https://resend.com) using its HTTP API — no
 * extra npm dependency, works locally and on serverless. Configured through env
 * vars; if RESEND_API_KEY is not set, sending is skipped gracefully so the chat
 * never breaks.
 *
 *   RESEND_API_KEY    — from https://resend.com/api-keys (free tier is fine)
 *   NOTIFY_EMAIL_TO   — where notifications go (default: Bnampellah1@gmail.com)
 *   NOTIFY_EMAIL_FROM — verified sender. Default onboarding@resend.dev works
 *                       out of the box, but only delivers to the email that owns
 *                       the Resend account. For any recipient, verify a domain
 *                       in Resend and set this to an address on that domain.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const LOG_PREFIX = "[email]";

export function emailConfig() {
  return {
    key: process.env.RESEND_API_KEY?.trim() || "",
    to: process.env.NOTIFY_EMAIL_TO?.trim() || "Bnampellah1@gmail.com",
    from:
      process.env.NOTIFY_EMAIL_FROM?.trim() ||
      "Nampellah Portfolio <onboarding@resend.dev>",
  };
}

export function isEmailConfigured(): boolean {
  return !!emailConfig().key;
}

export type EmailResult = { ok: boolean; skipped?: boolean; error?: string };

/** Send a plain-text notification email. Never throws — returns a result. */
export async function sendEmail(subject: string, text: string): Promise<EmailResult> {
  const { key, to, from } = emailConfig();
  if (!key) {
    console.warn(
      `${LOG_PREFIX} RESEND_API_KEY not set — skipping notification email. Add it to .env.local to receive these.`
    );
    return { ok: false, skipped: true };
  }
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`${LOG_PREFIX} Resend ${res.status}: ${err.slice(0, 300)}`);
      return { ok: false, error: `Resend ${res.status}` };
    }
    console.log(`${LOG_PREFIX} sent notification to ${to} | "${subject}"`);
    return { ok: true };
  } catch (err) {
    console.error(`${LOG_PREFIX} send failed:`, err);
    return { ok: false, error: err instanceof Error ? err.message : "send failed" };
  }
}
