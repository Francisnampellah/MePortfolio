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
- **Mac trackpad momentum fix**: a real swipe on a trackpad doesn't fire one
  wheel event, it fires a long decaying tail of small events for
  500–900ms after the finger lifts. Naively reacting to every event skips
  multiple sections from one swipe. The fix: any wheel activity — even
  below the trigger threshold — resets a 500ms "settle" timer
  (`WHEEL_SETTLE_MS`), and no new navigation is accepted until that timer
  expires with zero wheel activity. Combined with the `animatingRef` lock
  during the transition itself, this guarantees **one input gesture = one
  slide**, regardless of input device.
- Resizing re-measures `FullPageStage`'s `clientHeight` and snaps the
  transform to the correct offset for the current index (no animation).
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
  education grid), so it became a **horizontal** timeline — dots on a line
  across the top, cards side by side beneath — with the identical type
  scale. The orientation changed; the design didn't.

An earlier approach (`FitToHeight`, a `transform: scale()` wrapper that
uniformly shrank too-tall sections like a browser zoom-out) was dropped in
favor of this: every section now genuinely fits its slide at 100% scale
instead of rendering zoomed out.

## 4. Section order

Defined once, in `SECTION_IDS` in `src/app/page.tsx` — this array is the
single source of truth for slide order, nav highlighting, and `goToId`
lookups:

1. `home` — Hero (no numbered label; it's the landing slide)
2. `tech` — **01 / toolbox** — Tech Stack
3. `projects` — **02 / selected work** — Projects
4. `experience` — **03 / journey** — Experience
5. `testimonials` — **04 / references**
6. `github` — **05 / open source**
7. `blog` — **06 / writing**
8. `contact` — **07 / contact** (Contact + Footer share one slide)

Certifications, Skills, and AI Showcase (formerly 04/05/06) were removed
from the homepage on request. Their components (`Certifications.tsx`,
`Skills.tsx`, `AiShowcase.tsx`) and content (`content/certifications.json`,
still editable in `/admin`) are left in the repo, just not imported into
`page.tsx`. If they come back, they slot back in with the next free number
and everything after renumbers.

`NAV_ITEMS` in `src/lib/data.ts` must stay in sync with what's actually on
the page — it currently lists Stack / Projects / Experience / GitHub / Blog
(Testimonials and Contact are reachable but not in the top nav, matching
the original design).

## 5. The "connector" pattern

Used in **Tech Stack** and **Projects** (and available to reuse anywhere
with a "pick from a list, see detail" layout). It's what makes the selected
list item feel physically wired into the detail panel next to it, instead
of two separately-glowing boxes.

Layout: a simple selector list on one side (icon/number + label, one active
item highlighted) and a detail panel on the other (Tech Stack: hexagon
radar + skill dials; Projects: image carousel). Both live in the same
`position: relative` grid so a connector element can be absolutely
positioned in the gutter between them.

**Selection highlight** — not a className toggle. A single
`<motion.span layoutId="…-active-pill">` renders only inside the active
button; Framer Motion detects it moving between mount points across
re-renders and animates position/size with a spring
(`stiffness: 380, damping: 34`), producing one physics-based highlight that
glides between items — the classic "sliding tab indicator" recipe. Two
list-details pairs on the same page must use distinct `layoutId` strings
(`"tech-active-pill"` vs `"project-active-pill"`) or they'll fight each
other.

**The bridge** — a `motion.span` positioned in the exact gutter between the
list and the panel:
- Measured via `ref`s on the list container and the active button:
  `top = button.offsetTop`, `height = button.offsetHeight`,
  `left` = the gutter's x-position (computed from `list.offsetLeft` /
  `list.offsetWidth` depending on which side the list is on).
- `width = GAP + OVERLAP * 2`, positioned `OVERLAP` px into *both*
  neighbors (`OVERLAP = 4`) — this is what paints over the seam borders on
  both the button and the panel, instead of just filling empty space
  between them.
- Vertically inset by `CORNER = 12` px on top and bottom
  (`top: button.offsetTop + CORNER`, `height: button.offsetHeight -
  CORNER * 2`) — this matters more than it looks: `rounded-xl` gives both
  the button and the panel a 12px corner radius, and a flat-edged bridge
  spanning the *full* button height would clip visibly through that curve.
  Insetting by exactly the corner radius means the bridge only ever
  touches the *straight* part of each border, so the rounded corners curve
  away naturally with no double-curve artifact. (We tried giving the
  bridge its own rounded corners instead — don't; two curves meeting
  produces an ugly S-wiggle. Sharp-edged bridge, corner-matched inset,
  nothing else.)
- Fill color matches the active pill (`#faf2ee`) with a 1px accent
  (`var(--accent)`) top and bottom border — no left/right border, so it
  reads as an open-ended channel, not a boxed shape.
- `layout` prop (not manual CSS transition) so it glides with the same
  spring physics as the pill when the selection changes.
- Hidden below `md` (768px) — on narrower screens the list and panel stack
  vertically and there's no gutter to bridge.
- `GAP` matches whatever gap the grid actually uses: `14` (Tech Stack's
  `gap-3.5`) or `20` (Projects' `gap-5`) — if the grid gap changes, this
  constant must change with it or the math breaks.

## 6. Responsive rules

- The two-column list+panel layout (Tech Stack, Projects) switches from
  stacked to side-by-side at `md` (768px), not `lg` — below `lg` there was
  plenty of width for two columns and stacking wasted the whole tablet
  range.
- Below `md`, each list becomes a **horizontally scrollable row** of
  fixed-width cards (edge-to-edge bleed via negative margin, a peek of the
  next card as a scroll hint) instead of a tall vertical stack, and is
  reordered to appear *above* the detail panel (`order-1`/`order-2`) so you
  pick before you see detail.
- Any grid element sized in JS relative to a container width (the dial
  grid's column count, etc.) must key its breakpoint to whatever width the
  *container* actually has at that point in the layout, not blindly to the
  viewport — e.g. Tech Stack's skill-dial grid stays 2-column through the
  `md`–`lg` range (where the panel is squeezed next to the list) and only
  goes 4-column at `lg`, where the panel finally has room.

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
- The top nav's hamburger + full-screen menu were **removed**; below `md`
  the top bar is brand + CV (+ Contact at `sm+`) only, and all section
  navigation lives in the tab bar.
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
  scrolling.
- **Tech Stack** — hexagonal SVG radar chart (one axis per discipline,
  selected axis bold/accent) paired with the connector pattern described
  above; selecting a class swaps both the radar's highlighted axis and the
  skill-dial breakdown below it.
- **Projects** — image/description carousel (autoplay every 6.5s, pauses on
  hover, disabled under `prefers-reduced-motion`) paired with the full
  project list via the same connector pattern.
- **Experience** — horizontal timeline of **compact role cards** (icon,
  role, company, period — nothing else), 4-across at `lg` with dots on a
  line above, 2-across at `md`, a horizontally scrollable row below that.
  The bullet points + tech chips for **one role at a time** live in a
  shared detail panel beneath the cards: hovering a card switches the
  panel on desktop, tapping does on touch; the panel reuses
  `useSelectionPulse`/`selectionGlow` from `src/lib/connector.tsx` and
  cross-fades content on change. Redesigned this way (2026-07-05, on
  request) because showing every role's full details at once read as a
  wall of text. The education grid sits underneath.
- **Contact + Footer** share a single slide (footer is compact enough not
  to need one of its own).

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
