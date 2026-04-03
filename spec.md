# Waymark – 3-Star Par Rating System

## Current State
- A star system exists (`starRating.ts`) but uses a flawed ratio-based formula (`arrowsUsed / totalArrows`) that doesn't match the user's intent
- `WinModal.tsx` has a `StarDisplay` component but no sound effects
- `LevelSelector.tsx` shows small 3-dot indicators for stars, not actual star icons
- Levels do NOT have a `par` field; all levels currently give exactly the minimum arrows needed
- The `onLevelComplete` callback passes `arrowsUsed` (placed arrows count) and `totalArrows` (total inventory)

## Requested Changes (Diff)

### Add
- `par` field to `LevelConfig` interface and all 50 level configs in `levels.ts`
  - Par = the minimum arrows needed to solve (equals the sum of `allowedArrows` values since levels use exact inventory)
- `ding` sound effect using Web Audio API (synthesized, no external files) in `WinModal.tsx` — plays once per star as each star animates in
- Gold neon glow CSS for star elements

### Modify
- `starRating.ts`: Replace ratio formula with Par-based logic:
  - 3 stars: `arrowsUsed === par`
  - 2 stars: `arrowsUsed === par + 1`
  - 1 star: `arrowsUsed >= par + 2`
  - Signature: `calcStars(arrowsUsed: number, par: number): StarCount`
- `types/game.ts`: Add `par: number` to the `Level` interface
- `data/levels.ts`: Add `par` to `LevelConfig`, pass it through `buildLevel`, set par on each level config = sum of its `allowedArrows`
- `useGameState.ts`: The `onLevelComplete` callback should pass `arrowsUsed` (number of arrows actually placed/used = `placedArrows.size`) and the level's `par` value instead of `totalArrows`
- `App.tsx`: Update `calcStars(arrowsUsed, totalArrows)` call → `calcStars(arrowsUsed, par)`, get `par` from `LEVELS[levelIndex].par`
- `WinModal.tsx`: 
  - Animate stars appearing one by one with staggered delay
  - Each star triggers a synthesized "ding" sound via Web Audio API (ascending pitch per star)
  - Gold/yellow neon glow: `oklch(0.85 0.18 80)` color with `drop-shadow(0 0 8px oklch(0.85 0.18 80 / 0.8))`
  - Stars scale from 0→1.4→1 with spring animation
- `LevelSelector.tsx`: Replace `StarDots` (3 tiny dots) with `StarIcons` showing actual ★ characters in gold, with neon glow if earned

### Remove
- The old ratio-based `calcStars` logic in `starRating.ts`

## Implementation Plan
1. Update `types/game.ts` — add `par: number` to `Level`
2. Update `data/levels.ts` — add `par` to `LevelConfig`, calculate par per level as sum of allowedArrows, pass through buildLevel
3. Update `starRating.ts` — new par-based formula, update `calcStars` signature
4. Update `useGameState.ts` — pass `LEVELS[levelIndex].par` as third arg to `onLevelComplete` instead of `totalArrows`
5. Update `App.tsx` — update callback to destructure `par`, call `calcStars(arrowsUsed, par)`
6. Update `WinModal.tsx` — staggered star animation, Web Audio ding sounds, gold neon glow
7. Update `LevelSelector.tsx` — replace StarDots with gold star icons
