# Waymark — 50 Levels Expansion

## Current State
- Game has 5 hand-crafted levels on an 8x8 grid
- LevelSelector renders one button per level in a horizontal row (works fine for 5, not for 50)
- useGameState hardcodes `8` as the grid dimension in bounds checks and findStart loops
- `LEVELS` array exported from `src/frontend/src/data/levels.ts`
- Backend tracks highest level reached per user

## Requested Changes (Diff)

### Add
- 45 new levels (levels 6–50) in `levels.ts`, bringing total to 50
- Levels 1–10: 8×8 grid, 2–4 walls, 2–3 arrows in inventory (gentle warm-up)
- Levels 11–25: 8×8 grid, 5–8 walls, 3–4 arrows, slightly tighter paths
- Levels 26–40: 8×8 grid, 8–12 walls, 3–4 arrows, maze-like layouts
- Levels 41–50: 8×8 grid, 12–16 walls, 3–4 arrows, only one valid Waymark path
- A scrollable level-selection screen / panel that can display all 50 levels in a compact grid

### Modify
- `LevelSelector` component: replace single-row button list with a compact scrollable grid (5 columns × 10 rows), fits in the footer area. Show lock icon overlay on locked levels. Keep same color scheme (current = cyan highlight, locked = dimmed).
- `useGameState` `findStart` and out-of-bounds checks: make grid dimension dynamic (read `grid.length` and `grid[0].length`) instead of hardcoded `8`, so it works for any grid size used in future levels.
- `App.tsx` WinModal/handleNextLevel: ensure it handles 50 levels correctly (no change needed beyond LEVELS.length being 50).

### Remove
- Nothing removed

## Implementation Plan
1. Expand `src/frontend/src/data/levels.ts` with 45 new levels (6–50). Each level must have: unique `id`, descriptive `name`, valid 8×8 `grid` with `start` + `goal` reachable with provided `inventory`, and a `startDir`.
2. Update `LevelSelector` to render a compact 5-column grid with scroll, lock icons, and proper accessibility.
3. Update `useGameState` findStart and bounds check to use `grid.length`/`grid[0].length` instead of magic number `8`.
4. Validate (typecheck + build).
