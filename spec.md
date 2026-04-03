# Waymark — Pathfinding Validation + Level Editor

## Current State
- 50 levels defined in `src/frontend/src/data/levels.ts` via `LEVEL_CONFIGS` array
- Some levels may have walls blocking the only valid path
- No runtime or build-time path validation exists
- No way for the user to inspect or fix level layouts in-game
- Game supports tap-to-place arrows, ball simulation, cracked tiles, one-way gates

## Requested Changes (Diff)

### Add
- **BFS pathfinding validator** as a utility function in `src/frontend/src/utils/levelValidator.ts`
  - Takes a level config (grid, startPos, goalPos, allowedArrows, startDir) and BFS-simulates all possible arrow placements
  - Returns `{ valid: boolean, reason?: string }`
  - Run at module load time in `levels.ts` using `console.warn` to flag broken levels (dev aid only, does not crash app)
- **Clear buffer rule** enforced in the validator: warn if any wall is in the start tile's column (first few rows block initial path) or the goal tile's row
- **Admin / Level Editor mode** accessible via a hidden button (long-press the level number display in the footer for 1.5s, or a small gear icon only shown when `?admin=1` is in the URL)
  - When active, a floating panel appears with:
    - Toggle mode: click any grid cell to cycle it between Empty → Wall → Empty (visual toggle)
    - "Add Arrow" toggle for placing cracked tiles and gates via dropdowns
    - Export button: copies the current level's `walls` array to clipboard as a JSON snippet
    - Close button
  - Admin mode is purely local/in-memory — changes don't persist to levelData, they only affect the live grid for testing
- **Visual indicator** on the splash/level selector for levels that fail validation (small ⚠ icon next to the level in the grid selector)

### Modify
- `src/frontend/src/data/levels.ts`: after `buildLevel`, call validator and `console.warn` on any invalid level at module init
- `src/frontend/src/App.tsx`: wire admin mode toggle (URL param `?admin=1` shows a gear icon in the header that opens the editor panel)
- `src/frontend/src/components/game/GameGrid.tsx`: when admin mode is active, clicking a cell toggles wall/empty instead of placing an arrow

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/utils/levelValidator.ts` with a BFS-based solver that tries all possible single-arrow placements on eligible cells and checks if any arrangement leads ball from start to goal. Flag levels where zero solutions exist.
2. In `levels.ts`, import the validator and add a post-build warning loop.
3. Audit all 50 levels against the clear-buffer rule (no wall in start column, no wall in goal row) and fix violations directly in `LEVEL_CONFIGS`.
4. Create `src/frontend/src/components/game/LevelEditorPanel.tsx` — floating overlay with grid-cell toggle, export-to-clipboard, and close button.
5. Add `adminMode` state to `App.tsx` (enabled by `?admin=1` URL param). Pass it through to `GameGrid` and render `LevelEditorPanel` when active.
6. In `GameGrid`, when `adminMode=true`, clicking a cell calls `onAdminToggle(row, col)` instead of `onPlace`.
7. Validate, typecheck, build.
