# Toolbox redesign — Projects-mirrored layout

**Date:** 2026-07-18  
**Status:** Approved  
**File:** `src/components/TechStack.tsx`

## Goal

Make the Toolbox section feel composed and consistent with Featured projects: one centered focal block with breathing room, not a full-slide dashboard.

## Decision

Skills-first (PipMeter cards as hero). Compact RadarWheel as supporting visual. Keep existing components and selection behavior.

## Layout

1. `SectionHeading` — unchanged (`02 / toolbox`, title, blurb).
2. Focal (`lg+`): `grid` with skills column larger (`1fr`) and radar smaller (`~240px`).
3. Mobile: skills first, then compact radar.
4. Numbered `01–06` selector under focal, content-width only (no edge-bleed feel).

## Remove / quiet

- Drop `AVG / CLASSES / SKILLS` meta pills.
- Soften ghost class name (smaller / lower opacity).

## Keep

- `RadarWheel`, `PipMeter`, `TECH_GROUPS`, score/tier, AnimatePresence, radar axes + index selection.
