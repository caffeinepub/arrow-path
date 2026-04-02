# Arrow Path (Waymark Splash Screen)

## Current State
The app is a functional 2D arrow-path puzzle game with a dark neon arcade theme. It loads directly into the game without any splash/intro screen. The header shows the title 'Arrow Path' and a logo mark.

## Requested Changes (Diff)

### Add
- A `SplashScreen` component (`src/frontend/src/components/game/SplashScreen.tsx`) that displays:
  - A minimalist icon: a single arrow pointing into a circle (SVG, inline, matching neon-cyan theme)
  - The game title 'Waymark' in bold, sans-serif font (using the existing `font-display` / Orbitron class)
  - A subtitle 'Find the Path' in a smaller, lighter style
  - A 'Play' or 'Start' button that dismisses the splash and shows the main game
  - Subtle entrance animation using `motion/react`
- A `showSplash` state in `App.tsx` (initially `true`) that renders `SplashScreen` when true, and the full game UI when false

### Modify
- `App.tsx`: Wrap existing game JSX with a conditional; render `SplashScreen` when `showSplash === true`, game UI when false

### Remove
- Nothing removed

## Implementation Plan
1. Create `SplashScreen.tsx` with the icon, title, subtitle, and start button; animate in with `motion/react`
2. Add `showSplash` state to `App.tsx`, rendering `SplashScreen` on first load and the game once dismissed
3. Validate (lint, typecheck, build)
