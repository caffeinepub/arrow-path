# Waymark — Ad Simulation & Monetization UI

## Current State
Waymark is a 50-level puzzle game with chapter themes, 3-star rating system, animated win screen, and level selector. The game flow is: Splash Screen → Game (edit/play/won). The WinModal has a "Next Level" button that calls `handleNextLevel()` in App.tsx. The SplashScreen has a single "Play Game" button. There are no monetization or ad UI elements.

## Requested Changes (Diff)

### Add
1. **`AdScreen` component** (`src/frontend/src/components/game/AdScreen.tsx`)
   - Full-screen overlay, dark background (`oklch(0.08 0.01 255)`), matching Waymark aesthetic
   - Centered content: "Advertisement" label (dim), a large placeholder box styled like a mock ad (e.g. "🎮 This Space for Rent — Ad Placeholder", grayish bordered box with subtle shimmer)
   - A 5-second countdown timer shown as text (e.g. "Skip in 5..."). The timer counts down to 0.
   - A "✕ Close" button that is HIDDEN until the countdown hits 0, then fades in
   - Animated entry/exit via Framer Motion
   - Accepts props: `onClose: () => void`, `onReady?: () => void` (called when close becomes available)
   - Should feel premium, NOT cheap — use the dark Waymark palette, subtle border glow, and Montserrat/Inter fonts

2. **`HintModal` component** (`src/frontend/src/components/game/HintModal.tsx`)
   - Triggered by a Lightbulb icon button on the game screen
   - Step 1: Shows dialog "Watch a short video for a hint?" with "Watch" and "Cancel" buttons
   - Step 2 (after "Watch"): Shows the same AdScreen for 5 seconds
   - Step 3 (after ad closes): Reveals one valid arrow placement on the grid as a glowing ghost tile
   - The hint highlight lasts until the player presses Play or Resets
   - Accepts props: `chapterAccent`, `currentLevelIndex`, `placedArrows: Map<string, ArrowDir>`, `onRevealHint: (row: number, col: number, dir: ArrowDir) => void`, `onClose: () => void`
   - Hint logic: pick one arrow from the level's solution that hasn't been placed yet. Since levels don't store explicit solutions, use a simpler approach: find the first valid empty/start cell in the level's `allowedArrows` configuration and return it, OR randomly pick one of the level's inventory arrows and suggest a non-occupied grid cell near start. Keep it simple — just reveal a random unplaced arrow at a grid cell that is empty.

3. **`RemoveAdsButton`** on the SplashScreen
   - A sleek secondary button below "Play Game" on the SplashScreen
   - Text: "Remove Ads" with a small ✕ or 🚫 icon
   - On click: shows a modal/toast saying "Coming Soon — Premium upgrade available soon!"
   - Style: ghost/outline style, matching the dark theme but distinct from the Play button

4. **Lightbulb hint button** on game screen (in App.tsx header or near the grid)
   - Small icon button in the header right area (or near footer controls)
   - Shows a 💡 icon or SVG lightbulb
   - Only visible during `editing` phase (not while ball is running)
   - Clicking opens the HintModal

5. **Between-level ad trigger** in App.tsx
   - State: `showBetweenLevelAd: boolean`, `pendingNextLevel: boolean`
   - When `handleNextLevel()` is called AND `(currentLevelIndex + 1) % 3 === 0` AND `!adsRemoved`, set `showBetweenLevelAd = true` instead of calling `nextLevel()` directly
   - When the AdScreen closes, call `nextLevel()` and set `showBetweenLevelAd = false`
   - `adsRemoved` state defaults to false (no actual purchase needed — it's UI only, could persist in localStorage)

6. **Hint state** in App.tsx or GameGrid
   - `hintTile: { row: number; col: number; dir: ArrowDir } | null`
   - When a hint is revealed, render a glowing ghost arrow overlay on the specified cell
   - Clear hint when the player presses Play or Reset

### Modify
- **`WinModal.tsx`**: No changes needed to component itself. Ad logic handled in App.tsx by intercepting the `onNextLevel` callback.
- **`SplashScreen.tsx`**: Add "Remove Ads" button below the Play button. Add a small modal/alert for "Coming Soon."
- **`App.tsx`**: 
  - Add `showBetweenLevelAd` state
  - Add `hintTile` state  
  - Add `adsRemoved` state (localStorage-backed)
  - Modify `handleNextLevel` to check if ad should show
  - Render `AdScreen` overlay when `showBetweenLevelAd` is true
  - Render lightbulb button in header
  - Render `HintModal` when hint button is clicked
  - Pass hint reveal callback to HintModal
- **`GameGrid.tsx`**: Accept an optional `hintTile` prop and render a glowing ghost arrow overlay on that cell (semi-transparent, pulsing glow)

### Remove
- Nothing removed

## Implementation Plan
1. Create `AdScreen.tsx` — full-screen dark overlay with 5s countdown, hidden close button
2. Create `HintModal.tsx` — 2-step flow (confirm → ad → hint reveal)
3. Modify `SplashScreen.tsx` — add Remove Ads button + coming-soon dialog
4. Modify `GameGrid.tsx` — add optional `hintTile` prop for ghost arrow overlay
5. Modify `App.tsx` — wire up all ad/hint state, lightbulb button, between-level ad gate
