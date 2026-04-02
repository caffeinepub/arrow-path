import type { Level, TileType } from "../types/game";

function makeGrid(): TileType[][] {
  return Array.from({ length: 8 }, () => Array(8).fill("empty") as TileType[]);
}

function setTile(
  grid: TileType[][],
  row: number,
  col: number,
  tile: TileType,
): void {
  grid[row][col] = tile;
}

// Level 1 - First Steps
const level1Grid = makeGrid();
setTile(level1Grid, 0, 0, "start");
setTile(level1Grid, 7, 7, "goal");
setTile(level1Grid, 2, 2, "wall");
setTile(level1Grid, 2, 3, "wall");
setTile(level1Grid, 3, 5, "wall");
setTile(level1Grid, 4, 5, "wall");
setTile(level1Grid, 5, 2, "wall");
setTile(level1Grid, 5, 3, "wall");

// Level 2 - The Bend
const level2Grid = makeGrid();
setTile(level2Grid, 0, 3, "start");
setTile(level2Grid, 7, 3, "goal");
setTile(level2Grid, 2, 3, "wall");
setTile(level2Grid, 2, 4, "wall");
setTile(level2Grid, 3, 1, "wall");
setTile(level2Grid, 3, 6, "wall");
setTile(level2Grid, 5, 3, "wall");
setTile(level2Grid, 5, 4, "wall");

// Level 3 - Detour
const level3Grid = makeGrid();
setTile(level3Grid, 0, 0, "start");
setTile(level3Grid, 3, 7, "goal");
setTile(level3Grid, 1, 1, "wall");
setTile(level3Grid, 1, 2, "wall");
setTile(level3Grid, 1, 3, "wall");
setTile(level3Grid, 2, 4, "wall");
setTile(level3Grid, 2, 5, "wall");
setTile(level3Grid, 3, 4, "wall");

// Level 4 - The Loop Risk
const level4Grid = makeGrid();
setTile(level4Grid, 1, 0, "start");
setTile(level4Grid, 6, 7, "goal");
setTile(level4Grid, 1, 3, "wall");
setTile(level4Grid, 2, 5, "wall");
setTile(level4Grid, 3, 2, "wall");
setTile(level4Grid, 4, 4, "wall");
setTile(level4Grid, 5, 1, "wall");
setTile(level4Grid, 5, 6, "wall");

// Level 5 - Maze Runner
const level5Grid = makeGrid();
setTile(level5Grid, 0, 0, "start");
setTile(level5Grid, 7, 7, "goal");
setTile(level5Grid, 0, 3, "wall");
setTile(level5Grid, 1, 1, "wall");
setTile(level5Grid, 1, 5, "wall");
setTile(level5Grid, 2, 3, "wall");
setTile(level5Grid, 3, 1, "wall");
setTile(level5Grid, 3, 6, "wall");
setTile(level5Grid, 4, 3, "wall");
setTile(level5Grid, 5, 5, "wall");
setTile(level5Grid, 6, 1, "wall");
setTile(level5Grid, 6, 4, "wall");

export const LEVELS: Level[] = [
  {
    id: "level-1",
    name: "First Steps",
    grid: level1Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-2",
    name: "The Bend",
    grid: level2Grid,
    startDir: "down",
    inventory: [
      { direction: "down", count: 2 },
      { direction: "right", count: 1 },
      { direction: "left", count: 1 },
    ],
  },
  {
    id: "level-3",
    name: "Detour",
    grid: level3Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "up", count: 1 },
      { direction: "down", count: 1 },
    ],
  },
  {
    id: "level-4",
    name: "The Loop Risk",
    grid: level4Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 3 },
      { direction: "down", count: 2 },
      { direction: "left", count: 1 },
    ],
  },
  {
    id: "level-5",
    name: "Maze Runner",
    grid: level5Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 3 },
      { direction: "down", count: 3 },
      { direction: "left", count: 1 },
      { direction: "up", count: 1 },
    ],
  },
];
