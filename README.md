# Baraka Nampellah — Portfolio (Next.js)

A clean, engineer-built personal portfolio with a built-in content manager. Light-mode
first, hairline borders, mono accents, one premium clay accent colour. App Router, fully
typed, animated with Framer Motion.

## Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS**
- **Framer Motion** — scroll reveals, scroll-progress bar
- **lucide-react** — line icons
- **File-based CMS** — JSON content + an authenticated `/admin` dashboard

## Getting started

```bash
npm install
npm run dev
# site:  http://localhost:3000
# admin: http://localhost:3000/admin   (default password: admin)
```

Build for production:

```bash
npm run build
npm start
```

## Content management (`/admin`)

The site reads editable content from JSON files in **`content/`** (plus SQLite for
inbox + traffic). A simple CMS lets you edit them in the browser.

1. Go to **`/admin`** and sign in.
2. Tabs are grouped:
   - **Overview** — anonymous **Traffic** (unique visitors / pageviews)
   - **Site content** — Profile, **Hero** (stats + clients), **Toolbox** (capabilities),
     Projects, Experience, Education, Certifications, Testimonials, Blog posts, Assistant
   - **Inbox** — Leads, Submissions, Chat contacts (emails from chat), Chat logs
3. Edit fields inline. Lists support **add, delete, and reorder**. Toolbox has dedicated
   fields for evidence lines, tools, and “See it in action” links.
4. Click **Save changes** — JSON collections write to `content/*.json`; inbox rows update
   SQLite. Traffic is read-only.

### Password

Set in an environment variable (copy `.env.example` to `.env.local`):

```
ADMIN_PASSWORD=your-strong-password
```

If unset, the password is `admin`. Auth is a signed http-only session cookie (8h).

### Important: where it works

The CMS **writes to the local filesystem**, so saving works when the app runs on a
server you control (local dev, a VPS, Docker, Render, Railway, Fly.io, etc.).

On **read-only/serverless hosts like Vercel**, the filesystem isn't writable at runtime —
the dashboard still loads and lets you edit, but **Save** will fail. Options there:
- Run the CMS locally, commit the updated `content/*.json`, and push to redeploy; **or**
- Swap the read/write functions in `src/lib/cms.ts` for a database / headless CMS / the
  GitHub API. The API surface (`GET`/`PUT /api/admin/[collection]`) stays the same.

## AI assistant (floating chat)

A floating button (bottom-right) opens an assistant that answers from your live content
and **captures collaboration leads**.

- **Knowledge base** is built at request time from `content/*.json` (profile, Toolbox
  capabilities, projects, experience, education, certifications) — editing in `/admin`
  updates what the assistant knows.
- **Personality is editable in `/admin` → Assistant**: display name, tone, greeting, and notes.
- **Lead capture** stores name / email / note in **SQLite** (`data/app.db`). View in
  **`/admin` → Leads**. Submissions and chat contacts live there too.
- Powered by the Anthropic API via `POST /api/chat` (server-side; your key stays secret).

Set your key in `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
# optional, defaults to claude-3-5-haiku-latest
ANTHROPIC_MODEL=claude-3-5-haiku-latest
```

Without a key the widget still works but returns a friendly fallback message. Leads and
traffic need a **writable** host (local / VPS / Docker / Render / Railway / Fly) — not a
read-only serverless filesystem alone.

## Project structure

```
content/                # ← editable JSON (CMS reads & writes these)
  profile.json hero.json capabilities.json projects.json …
  experience.json education.json certifications.json
  testimonials.json posts.json bot.json
data/app.db             # SQLite — leads, submissions, chat contacts, traffic
src/
  app/
    layout.tsx          # fonts, SEO metadata, VisitBeacon
    page.tsx            # composes every section
    globals.css         # theme tokens + resets
    blog/[id]/page.tsx  # article reader pages
    admin/              # CMS dashboard (login + editor)
    api/admin/          # login / logout / [collection] / traffic
    api/visit/          # anonymous visit beacon
  components/           # one component per section + shared UI
  lib/
    data.ts             # typed exports from content/*.json
    articles.ts         # article bodies derived from posts.json
    cms.ts              # collection read/write + auth helpers
    db.ts               # SQLite helpers (inbox + traffic)
    bot.ts              # assistant knowledge + prompts
```

## Customising

- **Content:** edit in `/admin`, or hand-edit the files in `content/`.
- **Accent colour:** change `--accent` in `src/app/globals.css` to retheme the whole site.
- **Profile photo:** `public/baraka.jpg` (hero + article bylines).
- **CV / certificates:** replace `public/Baraka-Nampellah-CV.pdf` and the PDFs under
  `public/certs/` (paths are set per-certification in the CMS).

## Notes

- The contact form is a front-end demo. Wire it to an API route, Formspree, or Resend.
- The GitHub section uses static sample data — swap `buildContribGrid`, `GH_STATS`,
  `LANGUAGES`, `COMMITS` in `data.ts` for live GitHub API data if desired.
- Fully responsive (mobile → ultrawide) and respects `prefers-reduced-motion`.
