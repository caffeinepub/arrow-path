# Waymark — Professional 50-Level Upgrade

## Current State
- 50 levels all use an 8x8 grid built imperatively via `setTile()` calls in levels.ts
- `TileType` is a union of 8 string literals; no cracked tile or one-way gate types
- `Level` interface has `id`, `name`, `grid`, `inventory[]`, `startDir`
- `useGameState` runs ball on a 380ms interval; on wall/OOB fail it shows a 1-second "Failed" state before resetting — no instant reset
- `GameGrid` hardcodes `CELL_SIZE_DESKTOP=64` and `GRID_SIZE=8`; generates 64 fixed coordinate pairs
- `LevelSelector` is a compact dropdown, not a full-screen grid menu
- No cracked tile or one-way gate hazard logic exists

## Requested Changes (Diff)

### Add
- **`levelConfig` architecture**: new `LevelConfig` type with `gridSize`, `startPos`, `goalPos`, `walls[]`, `allowedArrows{}`, optional `crackedTiles[]`, `oneWayGates[]`. Generate `Level` from config at build time.
- **New TileTypes**: `cracked` (breaks after one pass, fail on second), `cracked_broken` (broken state), `gate_right`, `gate_left`, `gate_up`, `gate_down` (one-way passthrough)
- **50 redesigned levels**:
  - Levels 1–10: 6×6 grid, progressive intro, exact minimum arrows
  - Levels 11–30: 8×8 grid, harder routing, labyrinth goal walls, false paths
  - Levels 31–50: 10×10 grid, maximum complexity; levels 20+ include cracked tiles and one-way gates
  - Level 20: special "Hard Boss Level", 10×10 grid, only 3 arrows total
- **Fast Reset**: remove 1-second delay; on wall/OOB/cracked fail — instantly reset to editing state
- **Dynamic grid size**: `GameGrid` reads rows/cols from the grid prop; cell size adjusts based on grid dimensions
- **New hazard rendering**: cracked tiles show fracture pattern; broken tiles show red X; gates show directional indicator
- **Full-screen Level Selector**: replaces dropdown; shows 5×10 grid of level buttons with lock icons for locked levels
- **Smooth motion**: ball interval reduced to 220ms for crisper feel with CSS transition matching

### Modify
- `types/game.ts`: extend `TileType` union and `Level` interface
- `data/levels.ts`: completely rewrite using `levelConfig` declarative approach
- `hooks/useGameState.ts`: instant reset on fail, cracked tile state tracking, one-way gate direction enforcement
- `components/game/GameGrid.tsx`: dynamic grid size, new tile rendering
- `components/game/GridCell.tsx`: render cracked, cracked_broken, gate tiles
- `components/game/LevelSelector.tsx`: full-grid menu instead of compact dropdown
- `App.tsx`: wire new LevelSelector style (full screen overlay or page)

### Remove
- Old imperative `setTile`/`makeGrid` approach in levels.ts
- Hardcoded `GRID_SIZE=8` and `CELL_COORDS` in GameGrid
- 1-second fail delay before reset

## Implementation Plan
1. Update `types/game.ts` — add new TileTypes, update Level and GameState interfaces
2. Rewrite `data/levels.ts` — levelConfig objects for all 50 levels with exact arrows, labyrinth walls, false paths, cracked/gate tiles for 20+
3. Update `hooks/useGameState.ts` — instant reset, cracked tile broken tracking (per-run Map), gate direction enforcement
4. Update `components/game/GameGrid.tsx` — dynamic grid, cell size computed from grid dimensions
5. Update `components/game/GridCell.tsx` — render new tile types
6. Rebuild `components/game/LevelSelector.tsx` — full grid overlay with lock icon SVG
7. Wire everything in `App.tsx` if needed
