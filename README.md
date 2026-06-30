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

The site reads all of its editable content from JSON files in **`content/`**. A simple
CMS lets you edit them in the browser — no code, no redeploy for content tweaks.

1. Go to **`/admin`** and sign in.
2. Pick a collection tab (Profile, Projects, Experience, Education, Certifications,
   Testimonials, Blog posts).
3. Edit fields inline. For lists you can **add, delete, and reorder** items; blog posts
   include the full article body (lede + sections).
4. Click **Save changes** — the matching `content/*.json` file is written on the server.

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

A floating button (bottom-right) opens an assistant that **speaks as Baraka**, answers
from your live content, and **captures collaboration leads**.

- **Knowledge base** is built at request time from your `content/*.json` (profile,
  projects, experience, education, certifications) — so editing content in `/admin`
  updates what the assistant knows, no redeploy.
- **Personality is editable in `/admin` → Assistant**: display name, tone
  (Friendly / Professional / Witty), greeting, and free-form personality notes.
- **Lead capture**: when a visitor wants to collaborate, the assistant collects their
  name, email, and a note, then appends the lead to `content/leads.json`. View them in
  **`/admin` → Leads**.
- Powered by the Anthropic API via `POST /api/chat` (server-side; your key stays secret).

Set your key in `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
# optional, defaults to claude-3-5-haiku-latest
ANTHROPIC_MODEL=claude-3-5-haiku-latest
```

Without a key the widget still works but returns a friendly fallback message. As with the
CMS, **saving leads needs a writable filesystem** (local / VPS / Docker / Render / Railway
/ Fly) — on Vercel, point `readCollection`/`writeCollection` in `src/lib/cms.ts` at a DB
or send leads to email/Slack from `src/app/api/chat/route.ts` instead.

## Project structure

```
content/                # ← editable JSON (the CMS reads & writes these)
  profile.json projects.json experience.json education.json
  certifications.json testimonials.json posts.json
src/
  app/
    layout.tsx          # fonts (Inter + JetBrains Mono), SEO metadata
    page.tsx            # composes every section
    globals.css         # theme tokens + resets
    blog/[id]/page.tsx  # article reader pages (funny write-ups)
    admin/              # CMS dashboard (login + editor)
    api/admin/          # login / logout / [collection] read+write
  components/           # one component per section + shared (Reveal, ImageSlot…)
  lib/
    data.ts             # typed exports that import the content/*.json files
    articles.ts         # article bodies derived from posts.json
    cms.ts              # collection read/write + auth helpers
    icons.ts            # lucide icon map
    useScroll.ts        # active-section hook + smooth scroll
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
