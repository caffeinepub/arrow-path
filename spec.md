# Waymark — Nordic Night UI/UX Upgrade

## Current State
The game uses a "Dark Neon Arcade" theme with Orbitron font, OKLCH-based neon cyan (#78 0.18 192) and neon lime (#82 0.22 130) colors on a deep navy background. Framer Motion (`motion/react`) is already installed. All game components exist: SplashScreen, GameGrid, GridCell, InventoryPanel, WinModal, ArrowIcon. The ball is a simple white radial-gradient circle with a `neon-glow-ball` CSS class. Tile entry has no stagger animation.

## Requested Changes (Diff)

### Add
- Import Inter or Montserrat from Google Fonts in `index.css`
- Nordic Night palette CSS variables: `#2E3440` (background), `#88C0D0` (arrows/primary), `#A3BE8C` (goal/accent)
- Framer Motion stagger animation on grid tile entry (0.2s delay between tiles when level loads)
- Glowing white sphere ball with a blur/trail effect using CSS filter and pseudo-element or motion trail
- Inventory arrow hover: `whileHover={{ y: -4 }}` lift on Y-axis via Framer Motion
- Goal tile: CSS `@keyframes pulse-goal` animation that scales or glows rhythmically
- Play button pressed state: fade/dim surrounding UI (opacity transition on main layout areas) to focus on ball
- Update all color references from neon cyan/lime to Nordic Night palette

### Modify
- `index.css`: Replace Orbitron + Space Grotesk font imports with Inter/Montserrat. Update all OKLCH color tokens to match Nordic Night hex values converted to OKLCH. Update tile CSS classes.
- `tailwind.config.js`: Update font families to Inter/Montserrat. Update neon/palette color tokens.
- `App.tsx`: Add `isPlaying` opacity fade to sidebar/header/footer when game is running
- `GameGrid.tsx`: Add Framer Motion `motion.div` wrapper for each GridCell with staggered `initial/animate` variants triggered on `currentLevelIndex` key change. Add blur trail effect to ball (multiple trailing ghost divs or CSS filter blur).
- `GridCell.tsx`: Wrap content in `motion.div` to receive stagger from parent. Update goal tile to use pulse animation. Update color references.
- `InventoryPanel.tsx`: Wrap `InventoryItemCard` in `motion.div` with `whileHover={{ y: -4, transition: { duration: 0.15 } }}`.
- `SplashScreen.tsx`: Update colors to Nordic Night palette.
- `WinModal.tsx`: Update colors to Nordic Night palette.

### Remove
- Old Orbitron and Space Grotesk font references
- Old neon cyan/lime color tokens (replace, not just remove)

## Implementation Plan
1. Update `index.css`: swap fonts to Inter/Montserrat, update all OKLCH tokens to Nordic Night equivalents, add `pulse-goal` keyframe, update tile classes for new palette
2. Update `tailwind.config.js`: change font families and color tokens
3. Update `GameGrid.tsx`: add staggered tile entry using Framer Motion `variants` + `staggerChildren`, add ball blur trail effect (absolute positioned ghost elements that follow ball with opacity/blur)
4. Update `GridCell.tsx`: use `motion.div` for tile content, add `animate-pulse-goal` class to goal tile
5. Update `InventoryPanel.tsx`: wrap item cards in `motion.div` with `whileHover={{ y: -4 }}`
6. Update `App.tsx`: add `isPlaying` conditional to fade header/footer/sidebar opacity
7. Update `SplashScreen.tsx` and `WinModal.tsx`: swap palette to Nordic Night
