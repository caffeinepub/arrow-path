# Waymark - Star Rating System + Chapter Themes

## Current State
- 50 levels with tap-to-place arrow mechanics
- Nordic Night palette (#2E3440 base, #88C0D0 arrows, #A3BE8C goal)
- Compact dropdown level selector with progress bar showing 1/50 unlocked
- Ball movement with ghost trail, win modal, reset/play buttons
- No star rating system, no chapter themes

## Requested Changes (Diff)

### Add
- **Star Rating System**: Award 1-3 stars per level based on arrows used (fewer arrows = more stars)
  - 3 stars: solved using ≤ 50% of available arrows
  - 2 stars: solved using ≤ 80% of available arrows
  - 1 star: solved using all or more arrows
  - Stars are shown in the win modal after completion
  - Stars are stored in localStorage per level and shown in the level selector grid
  - Already-starred levels show their best star count in the level selector
- **Chapter Themes**: Every 10 levels, change the background/accent color scheme
  - Chapter 1 (Levels 1-10): "Arctic" - current Nordic Night blue (#2E3440 / #88C0D0)
  - Chapter 2 (Levels 11-20): "Ember" - deep charcoal with warm orange accents
  - Chapter 3 (Levels 21-30): "Forest" - dark green tones with sage accents
  - Chapter 4 (Levels 31-40): "Dusk" - deep purple/violet background with lavender accents
  - Chapter 5 (Levels 41-50): "Crimson" - near-black with red/pink accents
  - Chapter name is shown as a subtle label above the level selector
  - Background color transitions smoothly when moving between chapters
  - Grid border glow color matches the current chapter accent

### Modify
- **WinModal**: Add star display (3 animated stars, filled based on performance)
- **LevelSelector**: Show star count in each level button (1-3 gold stars or empty)
- **App.tsx / GameGrid**: Apply chapter theme CSS variables based on current level index
- **useGameState**: Expose arrow-usage count for star calculation on win

### Remove
- Nothing removed

## Implementation Plan
1. Define chapter theme data (5 chapters, color tokens per chapter)
2. Add `chapterTheme` CSS variable injection based on `currentLevelIndex` in App.tsx
3. Compute star rating on win: compare arrows placed vs total inventory available
4. Persist star ratings per level in localStorage
5. Update WinModal to animate and display earned stars
6. Update LevelSelector to show best star count per completed level
7. Show chapter name label near level selector
8. Smooth CSS transition on background color change between chapters
