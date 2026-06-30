/**
 * Server-side helpers for the AI assistant: builds the knowledge base and
 * system prompt from the editable content/*.json files.
 */
import { readCollection } from "./cms";

export type BotConfig = {
  name: string;
  tone: string;
  greeting: string;
  notes: string;
};

export const DEFAULT_BOT: BotConfig = {
  name: "Baraka",
  tone: "Friendly",
  greeting:
    "Hey! 👋 I'm Baraka's AI — ask me about my work, stack, or projects. Want to collaborate? I can take your details too.",
  notes: "",
};

const TONES: Record<string, string> = {
  Friendly:
    "Warm, approachable, and conversational. Use natural language and the occasional emoji.",
  Professional:
    "Polished, concise, and professional. Clear and confident, minimal slang, no emoji.",
  Witty:
    "Playful and witty with light humor, but still genuinely helpful and accurate.",
};

/** Reads the bot config from content/bot.json (falls back to defaults). */
export async function getBotConfig(): Promise<BotConfig> {
  try {
    const c = (await readCollection("bot")) as Partial<BotConfig>;
    return { ...DEFAULT_BOT, ...c };
  } catch {
    return DEFAULT_BOT;
  }
}

/** Builds a compact factual knowledge base from the live content files. */
export async function buildKnowledge(): Promise<string> {
  const [profile, projects, experience, education, certifications] =
    (await Promise.all([
      readCollection("profile"),
      readCollection("projects"),
      readCollection("experience"),
      readCollection("education"),
      readCollection("certifications"),
    ])) as [any, any[], any[], any[], any[]];

  const lines: string[] = [];
  lines.push(
    `IDENTITY: ${profile.name}, ${profile.role} based in ${profile.location}. Remote-friendly, available for new projects (full-time, contract, freelance).`
  );
  lines.push(
    `CONTACT: email ${profile.email}; phone ${profile.phone}; GitHub ${profile.github}; LinkedIn ${profile.linkedin}; website ${profile.website}.`
  );
  lines.push(`FOCUS: ${profile.tagline}. ${profile.intro}`);
  lines.push(
    "EXPERIENCE: " +
      experience
        .map(
          (e) =>
            `${e.role} at ${e.company} (${e.period}) — ${e.points.join(" ")}`
        )
        .join(" | ")
  );
  lines.push(
    "PROJECTS: " +
      projects
        .map(
          (p) =>
            `${p.title} [${p.tags.join(", ")}] — ${p.desc} Outcome: ${p.outcome}. Tech: ${p.tech.join(", ")}.`
        )
        .join(" | ")
  );
  lines.push(
    "EDUCATION: " + education.map((d) => `${d.title}, ${d.org} (${d.year})`).join("; ")
  );
  lines.push(
    "CERTIFICATIONS: " +
      certifications.map((c) => `${c.title} — ${c.issuer} (${c.year})`).join("; ")
  );
  return lines.join("\n");
}

/** Composes the full system prompt the model is given. */
export function systemPrompt(cfg: BotConfig, knowledge: string): string {
  const toneLine = TONES[cfg.tone] || TONES.Friendly;
  return [
    `You are the AI assistant on ${cfg.name} Nampellah's portfolio website. You speak AS Baraka, in the first person ('I', 'my').`,
    "TONE: " + toneLine,
    cfg.notes
      ? "EXTRA PERSONALITY NOTES from Baraka (follow these): " + cfg.notes
      : "",
    "Keep replies short — usually 1–4 sentences. Be specific and grounded ONLY in the facts below; if you do not know something, say so honestly and offer to pass the question to the real Baraka. Never invent employers, dates, or numbers.",
    "GOAL: help visitors (recruiters, startups, clients, collaborators) understand what I build and how I create value, and gently guide interested people toward working together.",
    'LEAD CAPTURE: If the person wants to collaborate, hire, or work together, collect their NAME, EMAIL, and a short NOTE about the project/role — ask for any missing piece, one friendly question at a time. Once you have all three, confirm warmly AND append on a new final line exactly: ##LEAD## {"name":"...","email":"...","note":"..."} (valid JSON, no extra text after it). Only emit ##LEAD## once all three are known.',
    "\nFACTS ABOUT ME:\n" + knowledge,
  ]
    .filter(Boolean)
    .join("\n");
}
