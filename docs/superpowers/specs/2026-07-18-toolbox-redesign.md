# Toolbox redesign — capability-first, claim + proof

**Date:** 2026-07-18 (superseded the earlier PipMeter/RadarWheel layout the same day)
**Status:** Approved
**Files:** `src/components/TechStack.tsx`, `src/lib/data.ts` (`CAPABILITIES`)

## Goal

Present the toolbox as six capabilities an employer cares about — not tool
lists or self-ratings — each described in one uniform, verifiable format.

## Decision

Capability-first tabs with a single **claim + proof** content formula
(chosen over "what you get + how" and "problem + approach" framings):

- **Evidence line 1 — claim.** First-person capability statement in plain
  terms ("I design / build / ship / integrate / model / take on …").
- **Evidence line 2 — proof.** A concrete production fact that backs the
  claim (six NestJS/Django services with 15+ role-guarded endpoints, two
  AI agents in production on WhatsApp/Telegram, two mobile + three web
  apps launched with two UI libraries, M-Pesa subscription flows in the
  field, 50-item Three.js catalog), with optional inline blog links.
- **One chip row — tools.** The exact tools/concepts used to deliver the
  claim; no scores, no self-ratings.

Rationale: employers scan skeptically — a claim alone is noise; a shipped
fact is what makes them pause. Every proof line is grounded in
`content/projects.json` or a blog post.

## Layout (`TechStack.tsx`)

1. Heading: no section title — just the `02 / toolbox` label and the
   "Pick a capability…" blurb. The active capability name is the `h2`.
2. Focal block (max-w-720): ghost short-name behind, capability title +
   mono tagline, two evidence lines (max-w-560), one horizontally
   scrollable chip row, "See it in action →" (jumps to the cited project
   via `select-project`, or opens the blog post).
3. Selector: numbered `01–07` top-border tabs; hover/focus/click selects;
   horizontal scroll on small screens, 7-col grid at `sm+`.

## Capabilities (order)

01 Design → project 06 · 02 APIs → project 06 · 03 Agents → project 02 ·
04 Frontend → project 09 · 05 Payments → project 03 · 06 Data →
project 06 · 07 Emerging → /blog/chaincode.

## Constraints

- `evidence` is typed as exactly two lines (`[EvidencePart[], EvidencePart[]]`).
- Each line stays short enough to render as ~one line at 560px/15px.
- Proof lines must stay in sync with `content/projects.json` facts —
  update both together.
