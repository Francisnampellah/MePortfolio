# Site Loading Screen — Design

Date: 2026-07-29
Scope: homepage (`/`) only

## Problem

The homepage renders instantly, then assembles itself in front of the visitor. The
hero's right column shows a small inline loader (`HeroModelWait`) while ~14.5 MB of
4K textures stream in for the alarm-clock model. The first impression is a
half-built page.

We want a full-screen loading screen that holds until the hero is genuinely ready to
look at, then reveals a finished page.

## Decisions

| Question | Decision |
|---|---|
| What gates the reveal | Hero assets only — fonts and the hero 3D model. Everything below the fold keeps loading behind the loader. |
| What "ready" means | Hero fully painted: model framed, textures decoded and recolored, first frame drawn. Not merely "bytes downloaded". |
| Route scope | `/` only. `layout.tsx` is untouched, so blog, both doc sites, and admin are unaffected. |
| Failure path | Generous net: reveal on any gate failure, or after 25 s. Normal loads face no time pressure. |
| Texture payload | Switch the hero to the 2K model already in the repo. |
| Repeat visits | Loader still mounts, with a 400 ms minimum display so a cached load fades rather than flashes. |
| Loader look | Branded minimal — initials mark, accent progress rail, live percentage, rotating wait lines. |

## Two constraints discovered while exploring

**The hero 3D column is CSS-hidden, not conditionally rendered.** `Hero.tsx:82` wraps
`HeroToolChest` in `<div className="relative hidden lg:block">`. Below 1024 px the
component still mounts, but R3F's `<Canvas>` does not initialize in a zero-size
container, so `onReady` never fires. A gate that unconditionally waits on the model
would hang every mobile visitor until the 25 s net. The gate set must therefore be
viewport-aware.

**Reduced motion is already handled globally.** `globals.css:45` forces every
transition to `0.001ms` under `prefers-reduced-motion`. The fade-out degrades on its
own and needs no special casing — but unmounting must be driven by a timer, not by a
`transitionend` event.

## Architecture

A readiness registry, so no component needs to know what else is loading.

### `src/lib/siteReady.tsx`

`SiteReadyProvider` owns a map of *gates*. A gate registers by id, reports `0–100`
progress, and terminates in `ready` or `failed`.

The provider derives:

- **aggregate progress** — weighted across registered gates, clamped monotonic so it
  never runs backwards when a gate registers late
- **`allReady`** — every registered gate is `ready`
- **`revealed`** — the reveal decision (below)

Public surface:

- `useRegisterGate(id, { weight, enabled })` → `{ setProgress, markReady, markFailed }`.
  A gate with `enabled: false` never joins the registry and cannot block the reveal.
- `useSiteReady()` → `{ progress, revealed }`, for the loader UI.

### Gates on the homepage

| Gate | Weight | Source | Resolves on |
|---|---|---|---|
| `fonts` | 10 | provider | `document.fonts.ready` |
| `hero-3d` | 90 | `HeroToolChest` | existing `onReady` callback |

`hero-3d` registers only when **both** hold:

1. `matchMedia("(min-width: 1024px)")` matches — mirroring the `lg:block` breakpoint
2. a WebGL context probe succeeds

Otherwise the gate set is just `fonts`, which resolves in a few hundred milliseconds.
This is the mobile constraint handled at its source rather than papered over with a
timeout.

`HeroToolChest` feeds `useProgress()` in as progress and calls `markReady()` from the
`onReady` it already fires — after the model is framed, glass fixed, textures
recolored, and a frame requested. That signal exists today; it is simply not exposed.
If the GLTF loader errors, it calls `markFailed()`.

### Reveal rules

Reveal when:

- `allReady && elapsed >= 400ms` (minimum-display floor), **or**
- any gate reports `failed`, **or**
- 25 s have elapsed

On a forced reveal the hero keeps its existing inline `HeroModelWait`, so a stalled
model degrades to exactly today's behavior rather than a broken page.

### No-flash requirement

The overlay renders in the server output with `visible` as its **initial** state, so
it is painted before hydration — no white flash. Initial state matches the server
render, so there is no hydration mismatch.

### Input lock

While visible, the overlay attaches `wheel`, `touchmove`, and `keydown` listeners to
`window` in the **capture** phase with `passive: false`, and stops propagation.
`FullPageScrollProvider` registers non-capture listeners, so they never receive the
events. `document.body` gets `overflow: hidden`, restored on reveal.

`fullPageScroll.tsx` is not modified. The coupling lives entirely in the loader.

## Components

### `src/components/SiteLoader.tsx`

Full-bleed `surface` (`#faf9f7`), `fixed inset-0`, `z-[100]`.

Centered stack:

- `PROFILE.initials` as a mark
- a 144 px accent progress rail matching `HeroModelWait`'s visual language
- live percentage in mono, tabular-nums
- rotating wait lines

Accessibility: `role="status"`, `aria-live="polite"`, `aria-busy` while loading.

Fades out over 500 ms; unmounts on a timer.

### `src/lib/heroWaitLines.ts`

The `WAIT_LINES` array currently hardcoded in `HeroToolChest.tsx:29` moves here so the
loader and the inline hero fallback share one source.

## Payload change

`MODEL_URL` in `HeroToolChest.tsx:19` moves from `alarm_clock_4k.gltf` to
`alarm_clock_2k.gltf`.

Verified: the 2K gltf references the `_2k.jpg` textures, shares the same
`alarm_clock_01.bin` geometry, and declares the same material names — so
`recolorTealMapToAccent` and `fixClockGlass`, which match on material name and `map`,
work unchanged.

Payload: ~14.9 MB → ~4.7 MB.

## Files touched

| File | Change |
|---|---|
| `src/lib/siteReady.tsx` | new — provider, registry, hooks |
| `src/lib/heroWaitLines.ts` | new — shared wait copy |
| `src/components/SiteLoader.tsx` | new — overlay UI |
| `src/components/HeroToolChest.tsx` | register `hero-3d` gate; `MODEL_URL` → 2K; import shared wait lines |
| `src/app/page.tsx` | wrap in `SiteReadyProvider`, render `SiteLoader` |

## Verification

- Homepage at ≥1024 px: loader holds until the clock is visibly spinning, then fades.
- Homepage below 1024 px: loader clears in well under a second, does not wait on the model.
- Throttled to Slow 3G: percentage advances smoothly; no stall at 0 or 100.
- Repeat visit in the same tab: loader appears briefly and fades — no jarring flash.
- WebGL disabled: loader clears immediately; hero falls back without blocking.
- Scroll and arrow keys do nothing while the loader is up; both work immediately after.
- `/blog`, `/namps-ui`, `/namps-native`, `/admin`: no loader, unchanged.
