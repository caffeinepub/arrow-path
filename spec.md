# Arrow Path

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- A fully playable 2D grid-based puzzle game called "Arrow Path"
- 8x8 game grid with tile types: Empty, Wall, Start, Goal, Arrow (Up/Down/Left/Right)
- Multiple built-in levels (at least 5) each with predefined Wall positions, Start/Goal tiles, and a limited arrow inventory
- Drag-and-drop mechanic to place arrow tiles from inventory onto empty grid cells
- Ball animation that moves cell-by-cell from Start following arrow directions
- Win condition: ball reaches Goal tile -> show success overlay with "Next Level" button
- Fail condition: ball hits wall or grid edge -> reset ball to Start
- Play/Reset buttons below the grid
- Arrow Inventory sidebar on the right showing available arrows with quantity badges
- Backend to persist level progress (current level, high scores)

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend: Store current level index and best completion scores per level for a user session
2. Frontend: Build grid rendering component with tile type visualization
3. Frontend: Implement drag-and-drop from inventory panel to grid cells
4. Frontend: Ball movement simulation loop with direction-change logic on arrow tiles
5. Frontend: Level data (hardcoded array of levels with grid layouts, inventories)
6. Frontend: Win/lose state management, success overlay, next-level flow
7. Frontend: Play and Reset button wiring
8. Frontend: Responsive layout - grid center, inventory right sidebar
