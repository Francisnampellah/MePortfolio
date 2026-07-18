# Homepage design spec

This is the reference for how the homepage (`src/app/page.tsx`) is meant to
work — the full-page slideshow mechanism, the "connector" interaction
pattern, and each section's design. If a future change breaks one of these
rules, that's a regression, not a redesign.

## 1. Concept

The homepage is **not** a normal scrolling document. It's a full-screen
slideshow: each section is exactly one viewport tall, and scrolling (wheel,
trackpad, touch, or keyboard) jumps directly to the next/previous section
with a smooth animated transition — like paging through a game menu, not
like scrolling a webpage. The user never sees two sections partially on
screen at once.

**This is a `md+` (≥768px) experience.** Below `md`, the stacked mobile
layouts make most sections taller than one screen, so hijacking scroll
would clip content behind `overflow-hidden` with no way to reach it. Small
screens therefore get a **native scrolling document**: sections take their
natural height (with a one-screen minimum), the hijack listeners are never
attached, and nav/progress/back-to-top stay in sync via an
IntersectionObserver instead of the slide index. The mode is re-evaluated
live on resize/rotation.

## 2. The scroll mechanism (`src/lib/fullPageScroll.tsx`)

- `FullPageScrollProvider` owns the current slide `index`, exposes
  `goToIndex(i)` / `goToId(id)`, and renders nothing itself — it's pure state
  + event wiring, so it can wrap `Nav`, the slide stack, and floating UI
  (`BackToTop`, `ChatWidget`) all at once.
- `FullPageStage` is the actual viewport: `position: fixed`, pinned below
  the nav (`top-16` / 64px), `overflow: hidden`. Its children are stacked in
  a `flex flex-col` and moved as **one unit** via a single `translateY`
  (`framer-motion` `MotionValue`), animated with a custom tween
  (`duration: 0.85s`, `ease: [0.76, 0, 0.24, 1]`) — not native CSS
  scroll-snap. This is what gives the "video game" transition feel: exact
  control over duration and easing, not whatever the browser's snap
  behavior happens to do.
- **Input handling**, all on `window`:
  - `wheel` — any `deltaY` beyond a small threshold (8px) triggers one
    `goToIndex` step. `e.preventDefault()` blocks native scrolling entirely.
  - `keydown` — `ArrowDown`/`PageDown`/`Space` → next, `ArrowUp`/`PageUp` →
    prev, `Home`/`End` → first/last. Skipped while focus is in an
    input/textarea/select/contenteditable (so the Contact form works
    normally).
  - `touchstart`/`touchmove`/`touchend` — the gesture is **axis-locked** on
    first significant movement: predominantly-vertical swipes past 50px
    trigger one step (with `preventDefault()` on the vertical moves to stop
    native bounce), while predominantly-horizontal swipes are left entirely
    to the browser so scrollable card rows still pan on touch devices at
    `md+` (tablets).
  - `ctrlKey` on a `wheel` event means the user is pinch-zooming (this is
    how trackpads report it) — that event is let through untouched, never
    treated as a navigation input.
- **Trackpad momentum fix (acceleration filter)**: a real swipe on a
  trackpad doesn't fire one wheel event, it fires a long decaying tail of
  small events for 500–900ms after the finger lifts. Naively reacting to
  every event skips multiple sections from one swipe. The fix is the
  fullpage.js-style heuristic: keep a rolling window of recent `|deltaY|`
  values and compare the average of the last ~10 against the last ~70. A
  genuine new gesture **accelerates** (recent ≥ middle) and triggers a
  step; a momentum tail **decelerates** (recent < middle) and is ignored.
  A pause longer than `WHEEL_GESTURE_GAP_MS` (200ms) clears the window so
  the next push starts fresh. Deltas are recorded even while the
  transition is animating, so a tail still decaying when the lock lifts
  reads as deceleration and can't re-trigger.
  - This replaced an earlier "settle timer" (any wheel activity reset a
    500ms timer; navigation blocked until it expired). That timer also
    blocked **continuous mouse-wheel scrolling** — steady scrolling kept
    resetting it, so only the first notch registered and the rest were
    eaten until you stopped for half a second. The acceleration filter
    lets continuous scrolling page through slides while still collapsing
    one flick to one slide.
- **Lock safety net**: the `animatingRef` transition lock is released by
  framer's `onComplete` (after a `COOLDOWN_MS` grace), but a mid-transition
  resize cancels the animation via `y.set` **without** firing `onComplete`,
  which would strand the lock and kill scrolling until reload. A backstop
  timer (`ANIM_LOCK_MAX_MS`) always releases it. Combined with the
  acceleration filter this guarantees **one input gesture = one slide**
  without any state that can get permanently stuck.
- Resizing re-measures `FullPageStage`'s `clientHeight` and snaps the
  transform to the correct offset for the current index (no animation).
- **Slide height comes from the measured stage, not `dvh`.** The stage
  publishes its measured `clientHeight` as the `--slide-h` CSS variable,
  and every slide root is `md:h-[var(--slide-h)] md:min-h-0` (with a
  `calc(100dvh - 4rem)` fallback for first paint). This is load-bearing:
  the transform steps by the *measured* pixel height, but `calc(100dvh -
  4rem)` can compute to a slightly different value on fractional-pixel
  displays (Windows display scaling), and that few-px disagreement
  accumulates across slides until a sliver of the neighbouring section
  shows at the top/bottom. Driving both from one measured value removes the
  drift. (Also why `md:min-h-0` is needed — the mobile `min-h` must not
  win at `md+` and force the slide taller than `--slide-h`.)
- **Deep links / shareable URLs**: on load, a `#section` hash jumps straight
  to that slide (or scrolls to it natively below `md`); as the active
  section changes, `history.replaceState` keeps the hash current (cleared
  on the first slide). `replaceState`, not `pushState` — paging through
  slides must not pollute the back button.
- **Mode gating**: all of the above hijacking (including the
  `overflow: hidden` on `<body>`) is only active while
  `(min-width: 768px)` matches; below that the provider swaps to native
  scrolling + IntersectionObserver index tracking (see §1), and
  `goToIndex`/`goToId` fall back to `scrollIntoView` (sections carry
  `scroll-mt-16` to clear the fixed nav).

## 3. Fitting content to one screen: reorient, don't shrink

Every slide root carries the same sizing recipe:

```
min-h-[calc(100dvh-4rem)] w-full shrink-0 scroll-mt-16 flex flex-col justify-center
overflow-x-clip py-14 md:h-[calc(100dvh-4rem)] md:overflow-hidden md:py-0
```

(`4rem` = the 64px nav the stage is pinned under; `shrink-0` stops the
stage's flex column from squeezing slides; `justify-center` vertically
centers content that has spare room.) At `md+` the height is **exact** and
`overflow-hidden` guarantees a slide can never bleed into its neighbor.
Below `md` (native-scroll mode, §1) it's a **minimum**: sections grow to
their natural height, `py-14` gives stacked content breathing room, and
`scroll-mt-16` keeps anchor scrolls clear of the fixed nav. Most sections
carry the recipe on their own `<section>` root; `Contact` + `Footer` share
one slide, so the wrapper `div` in `page.tsx` carries it for both.

When a section is too tall for one screen, the fix is to **reorient its
layout at the same type scale** — never to shrink it:

- Font sizes, padding, and content stay exactly as designed. No "smaller
  fonts to make it fit", no dropped content.
- Example: `Experience`'s vertical timeline was too tall (4 jobs + the
  education grid), so it became an **abstract horizontal career-path
  axis** — roles as stops on a time line with a big minimal "now showing"
  display above — deliberately low-detail (no bullet lists) so the visual
  carries it and it fits one screen easily.

An earlier approach (`FitToHeight`, a `transform: scale()` wrapper that
uniformly shrank too-tall sections like a browser zoom-out) was dropped in
favor of this: every section now genuinely fits its slide at 100% scale
instead of rendering zoomed out.

## 4. Section order

Defined once, in `SECTION_IDS` in `src/app/page.tsx` — this array is the
single source of truth for slide order, nav highlighting, and `goToId`
lookups:

1. `home` — Hero (no numbered label; it's the landing slide)
2. `about` — **01 / about** — About (abstract identity slide, pairs with Hero)
3. `tech` — **02 / toolbox** — Tech Stack
4. `projects` — **03 / selected work** — Projects
5. `experience` — **04 / journey** — Experience
6. `testimonials` — **05 / references**
7. `github` — **06 / open source**
8. `blog` — **07 / writing**
9. `contact` — **08 / contact** (Contact + Footer share one slide)

(About was inserted after Hero on 2026-07-05; every following section's
`NN /` label shifted up by one — those numbers are hardcoded per component,
so adding/removing a section means renumbering them all.)

Certifications, Skills, and AI Showcase (formerly 04/05/06) were removed
from the homepage on request. Their components (`Certifications.tsx`,
`Skills.tsx`, `AiShowcase.tsx`) and content (`content/certifications.json`,
still editable in `/admin`) are left in the repo, just not imported into
`page.tsx`. If they come back, they slot back in with the next free number
and everything after renumbers.

`NAV_ITEMS` in `src/lib/data.ts` must stay in sync with what's actually on
the page — it currently lists About / Stack / Projects / Experience /
GitHub / Blog (Testimonials and Contact are reachable but not in the top
nav). `SlideHud`'s `LABELS` map and `TabBar` also key off section ids, so a
new section needs an entry there too.

## 5. The "abstract focal + selector" pattern

The three interactive sections — **Tech Stack**, **Projects**, and
**Experience** — all share one shape (converged there over several rounds
on request; the brief that stuck was "more abstract, not much detail, but
good visual"). It is:

- **One focal display** showing a *single* item at a time, big and
  low-detail. Common ingredients: a large **faded "ghost" backdrop**
  element for depth (Experience: the year; Tech Stack: the discipline
  name; Projects: the project number — all at ~7% accent tint), a big
  **title**, one supporting line, and a **light tag row**. No bullet
  lists, no dense metric grids — that detail was deliberately stripped
  (see §9).
- **A linear selector** you move along: Experience's stops on a time axis,
  Tech Stack's row of six discipline chips, Projects' row of numbered
  dots (plus prev/next + counter). Every selector responds to
  hover **and** click **and** focus; active = accent, others muted.
- **A cross-fade** between focal states: `AnimatePresence mode="wait"`
  keyed by the active index, a ~0.28s y-slide + fade. Any continuously
  animating visual (Tech Stack's power ring) is a persistent element that
  *springs* to the new value rather than cross-fading, so it feels alive.

Keep new interactive sections on this pattern rather than inventing a
fourth interaction.

**Retired — the "connector bridge":** an earlier version of Tech Stack and
Projects used a `motion.span` "bridge" (`src/lib/connector.tsx`) that
visually wired a selected list item into an adjacent detail panel, plus a
`layoutId` sliding pill. That whole list+detail-panel approach was replaced
by the focal+selector pattern above, so **`connector.tsx` is now unused
dead code** — kept only as a reference if a list+panel layout ever returns.
Don't wire it back into these three sections.

## 6. Responsive rules

- The focal displays (§5) go two-column (visual beside text) at `sm`/`md`
  and stack the visual above the text below that — the ring, image, and
  axis each keep their full size, they just reflow.
- Selector rows that can overflow on a phone (Tech Stack's six chips,
  Experience's mobile list) become **horizontally scrollable rows**
  (`-mx-6 … overflow-x-auto px-6`, edge-to-edge bleed) instead of wrapping
  into a tall block; at `md+` Tech Stack's chips become a fixed
  `grid-cols-6`.
- Experience swaps layout entirely by breakpoint: the horizontal time axis
  at `md+`, a vertical newest-first stack below (a horizontal axis can't
  breathe on a phone). Projects keeps the same focal layout at all widths,
  just stacking image-over-text.
- Anything wider than a phone card gets a horizontal pan below `md` rather
  than being clipped. The **GitHub** contribution graph (a full year ≈
  ~730px) is `overflow-x-auto` with an edge-to-edge bleed (`-mx-[22px]
  px-[22px]`, scrollbar hidden) below `md`, and `md:overflow-hidden` at `md+`
  where the wide card fits it whole. Its stats grid is `grid-cols-2` on a
  phone (`sm:grid-cols-4`) so four figures don't cram into ~78px columns.
- Divider-style separators (e.g. the **Hero** stats' `border-l` rules) are
  gated to `sm+`, because when the row wraps on a phone a leading border
  dangles at the start of the new line. Below `sm` the items separate by gap
  alone.
- **Decorative depth layers are hidden below `md` for focus.** The large
  faded "ghost" backdrop words (§5 — About's first name, Tech Stack's
  discipline, Projects' number, Contact's "Contact") and Tech Stack's
  `AVG / CLASSES / SKILLS` meta pills are `hidden md:block` / `md:flex`. With
  a full slide of whitespace at `md+` they read as subtle depth; stacked
  tightly on a phone they crowd/overlap the real content and compete for
  attention, so each section leads with one clear thing on mobile. This is a
  deliberate focus choice, **not** a missing element to "restore" — the
  ghost words remain a core part of the pattern at `md+`. (Experience's ghost
  year already lives inside its `hidden md:block` desktop path, so mobile
  never showed it.)

## 7. Chrome: game HUD (desktop) and app shell (mobile)

The slideshow is framed by mode-specific chrome so each mode reads as its
own experience — a game settings menu at `md+`, a native app below.

**Desktop — `SlideHud` (`src/components/SlideHud.tsx`, hidden below `md`):**
- **Dot rail**, fixed to the right edge, vertically centered: one dot per
  slide, click to jump. The active dot stretches into a vertical accent
  pill; its mono label (start / toolbox / selected work / …) is always
  visible, other labels appear on hover.
- **Slide counter** bottom-left: `03 / 08` in mono, current number in
  accent — HUD-style position feedback.
- **Scroll hint** bottom-center, only while on the first slide: "scroll" +
  bouncing chevron; fades out permanently-feeling once you navigate.

**Mobile — `TabBar` (`src/components/TabBar.tsx`, `md:hidden`):**
- Fixed bottom tab bar, five tabs: Home / Stack / Work / Blog / Contact,
  icon + 10px label, active in accent with a small top indicator bar,
  `env(safe-area-inset-bottom)` padding for gesture-nav phones.
- Sections without a tab of their own (experience, testimonials, github)
  keep the nearest *preceding* tab ("Work") lit while scrolled through —
  the way an app keeps a tab active on its inner screens.
- The top nav (`Nav.tsx`) is a **brand lockup** — the **logo mark**
  (`public/logo.png`, the Sisyphus-and-boulder icon, shown via `next/image`
  `fill` in a rounded tile, scaled `~1.42` to crop the baked-in cream
  padding) + name + a mono role subtitle at `sm+`. The `md+` center links
  mark the active section with a **subtle thin underline** only
  (`layoutId="nav-underline"`, a 2px accent bar that springs between links —
  deliberately understated, replaced an earlier filled pill on request).
  Actions: a CV button (`sm+`) plus a primary **"Let's talk →"** to Contact
  (always shown, since it's the only header action on mobile). The old
  hamburger + full-screen menu are gone; below `md` all section navigation
  lives in the bottom tab bar.
- `FullPageStage` gets `pb-[calc(3.5rem+env(safe-area-inset-bottom))]`
  below `md` so the last slide clears the bar; the chat bubble/panel are
  raised above it on mobile.
- `BackToTop` is desktop-only (the Home tab covers that job on mobile) and
  sits at `bottom-[86px]` so the chat pill — which occupies the corner at
  `bottom-[22px]` — doesn't cover it.

## 8. Per-section notes

- **Hero** — two-column on `lg+` (copy left, terminal-window visual right,
  hidden below `lg` to avoid doubling required height on stacked layouts).
  CTA buttons use `goToId` from `useFullPageScroll()`, not native anchor
  scrolling. Trimmed 2026-07-05 once About landed, to stop the two intro
  slides duplicating each other: the byline **portrait**, the floating
  **availability badge**, and the location line were removed (About owns the
  portrait + availability now); Hero leads with a mono **role eyebrow** →
  headline → CTAs → stats → clients, and stays the "code/terminal" identity
  while About is the "human/portrait" one.
- **About** — abstract identity slide (added 2026-07-05), same low-detail
  language as the rest, on the default (white) background: a large faded
  **ghost first-name** (accent at ~7%) behind a single concise statement
  (`PROFILE.intro`), three minimal fact tiles (based-in / focus /
  experience, data-driven from `PROFILE`), and the **framed portrait**
  (`hero-photo` ImageSlot, `4/5` in a `rounded-[20px]` frame + accent glow +
  availability badge). No stats grid or long bio — Hero carries the stats.
  Two-column at `lg+`, stacked below. (An accent-orange-panel variant with a
  circular/white-disc portrait was tried and reverted on request.)
- **Tech Stack** — capability-first toolbox (updated 2026-07-18). Five
  outcome tabs (APIs, Payments, Agents, Data, Systems): title, tagline,
  evidence with optional inline blog links, tool chips (no scores), and
  "See it in action →" to a project or blog. Data: `CAPABILITIES` in
  `src/lib/data.ts`.
- **Projects** — abstract focal+selector (§5), redesigned 2026-07-05 from a
  denser carousel card (which had a blurb + problem/outcome grid + inline
  list). Focal display: a big **image hero** beside the project number
  (ghosted), role kicker, title, a **one-line** summary (the project's
  `outcome`), a light tech-tag row, and GitHub / Live-demo actions.
  Selector: a row of **numbered dots** + counter + prev/next arrows.
  Autoplay every 6.5s, pauses on hover, disabled under
  `prefers-reduced-motion`. Filter chips (All / Mobile / …) unchanged; the
  `problem`/`desc` fields still exist in the data, just unused here now.
- **Experience** — **abstract career-path time axis** (redesigned
  2026-07-05, on request: it went compact-cards → detail-card → this, the
  brief being "more abstract, not much detail, but good visual"). At `md+`:
  roles are glowing stops on a real horizontal time line, positioned by the
  **start date parsed from each `period` string** (`startValue` → decimal
  year; a min-gap rule nudges apart roles that share a year, e.g. the two
  2025 stops, so they never collide). Left = earliest, right = now; the
  "Present" stop pulses and is the default active one. Hover/click/focus a
  stop to travel the path — an accent segment fills the line up to it, and
  the **"now showing" display** above cross-fades to that role. That
  display is intentionally minimal: a large faded **ghost year** behind,
  the **role title**, a `company · period` line, and a light tech-tag row —
  **no bullet points** (they read as clutter here and are what the earlier
  versions were rejected for). Below `md` (native scroll) it's a **minimal
  vertical stack, newest first** (icon, role, company, year — also no
  bullets). The education grid sits underneath in both modes. Note: date
  parsing keys off the free-text `period` (handles `"2025"`,
  `"Mar 2026 — Present"`, `"2024 — Feb 2026"`); a period with no 4-digit
  year sorts to the far left. The role bullet points still live in
  `content/experience.json` (editable in `/admin`), just unused by this
  section now.
- **Contact + Footer** share a single slide (footer is compact enough not
  to need one of its own). Restyled 2026-07-05 to match the other sections:
  a faded **ghost "Contact"** behind the heading and an open (un-boxed) two-
  column layout. The left column presents the contact details as a
  **monospace "receipt"** (replacing the earlier link cards): itemised
  `CONTACT_LINKS` lines with dotted leaders (label ···· value, the whole
  line a link), a meta block (status AVAILABLE with the live dot / response
  `< 24 HRS` / based-in), a centred "thanks for scrolling" line, a CSS
  barcode + `BN·CONTACT·2026` ref, then the CV button. The standalone green
  availability pill was folded into the receipt's status line. The right
  column is the form — fields on `bg-surface` that brighten to white on
  focus; it still just sets a local `sent` state on submit (no backend
  wired) — keep that in mind if real delivery is expected.

## 9. Things that have already been tried and rejected

Worth knowing before re-suggesting them:
- **Condensing component internals to hit 100vh** (smaller fonts, tighter
  padding, dropped content) — rejected; a too-tall section gets its layout
  reoriented at the same type scale instead (§3). Don't redo this.
- **`FitToHeight`** (a `transform: scale()` wrapper that uniformly shrank
  too-tall sections) — superseded once every section was made to genuinely
  fit its slide at 100% scale (§3). Don't reintroduce it.
- **Rounded corners on the connector bridge itself** — causes a double-curve
  visual artifact where it meets the button's own rounded corner. Keep it
  sharp-edged.
- **CSS `scroll-snap-type` instead of a JS-driven transform** — not used,
  because it doesn't allow custom easing/duration and doesn't fully solve
  trackpad multi-jump on its own.
