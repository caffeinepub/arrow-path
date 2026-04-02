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

// Level 6 - Side Step
const level6Grid = makeGrid();
setTile(level6Grid, 0, 1, "start");
setTile(level6Grid, 7, 6, "goal");
setTile(level6Grid, 1, 1, "wall");
setTile(level6Grid, 3, 3, "wall");
setTile(level6Grid, 3, 4, "wall");
setTile(level6Grid, 5, 6, "wall");

// Level 7 - Zig Zag
const level7Grid = makeGrid();
setTile(level7Grid, 0, 0, "start");
setTile(level7Grid, 7, 4, "goal");
setTile(level7Grid, 0, 4, "wall");
setTile(level7Grid, 2, 2, "wall");
setTile(level7Grid, 4, 4, "wall");
setTile(level7Grid, 6, 2, "wall");

// Level 8 - The Gap
const level8Grid = makeGrid();
setTile(level8Grid, 3, 0, "start");
setTile(level8Grid, 3, 7, "goal");
setTile(level8Grid, 1, 3, "wall");
setTile(level8Grid, 2, 3, "wall");
setTile(level8Grid, 4, 3, "wall");
setTile(level8Grid, 5, 3, "wall");

// Level 9 - Corner Shot
const level9Grid = makeGrid();
setTile(level9Grid, 7, 0, "start");
setTile(level9Grid, 0, 7, "goal");
setTile(level9Grid, 5, 2, "wall");
setTile(level9Grid, 5, 3, "wall");
setTile(level9Grid, 2, 4, "wall");
setTile(level9Grid, 2, 5, "wall");

// Level 10 - Double Bend
const level10Grid = makeGrid();
setTile(level10Grid, 0, 0, "start");
setTile(level10Grid, 0, 7, "goal");
setTile(level10Grid, 0, 3, "wall");
setTile(level10Grid, 0, 4, "wall");
setTile(level10Grid, 3, 0, "wall");
setTile(level10Grid, 3, 7, "wall");
setTile(level10Grid, 6, 3, "wall");

// Level 11 - The Spiral
const level11Grid = makeGrid();
setTile(level11Grid, 0, 0, "start");
setTile(level11Grid, 4, 4, "goal");
setTile(level11Grid, 0, 3, "wall");
setTile(level11Grid, 1, 3, "wall");
setTile(level11Grid, 2, 5, "wall");
setTile(level11Grid, 3, 1, "wall");
setTile(level11Grid, 3, 5, "wall");
setTile(level11Grid, 5, 2, "wall");

// Level 12 - Cross Roads
const level12Grid = makeGrid();
setTile(level12Grid, 0, 4, "start");
setTile(level12Grid, 7, 4, "goal");
setTile(level12Grid, 2, 2, "wall");
setTile(level12Grid, 2, 3, "wall");
setTile(level12Grid, 2, 5, "wall");
setTile(level12Grid, 2, 6, "wall");
setTile(level12Grid, 5, 1, "wall");
setTile(level12Grid, 5, 6, "wall");

// Level 13 - Switchback
const level13Grid = makeGrid();
setTile(level13Grid, 1, 0, "start");
setTile(level13Grid, 6, 7, "goal");
setTile(level13Grid, 1, 4, "wall");
setTile(level13Grid, 2, 4, "wall");
setTile(level13Grid, 4, 3, "wall");
setTile(level13Grid, 5, 3, "wall");
setTile(level13Grid, 3, 6, "wall");
setTile(level13Grid, 6, 1, "wall");

// Level 14 - Narrow Pass
const level14Grid = makeGrid();
setTile(level14Grid, 0, 0, "start");
setTile(level14Grid, 7, 7, "goal");
setTile(level14Grid, 2, 1, "wall");
setTile(level14Grid, 2, 2, "wall");
setTile(level14Grid, 2, 3, "wall");
setTile(level14Grid, 4, 4, "wall");
setTile(level14Grid, 4, 5, "wall");
setTile(level14Grid, 4, 6, "wall");
setTile(level14Grid, 6, 2, "wall");

// Level 15 - Bounce House
const level15Grid = makeGrid();
setTile(level15Grid, 4, 0, "start");
setTile(level15Grid, 4, 7, "goal");
setTile(level15Grid, 1, 2, "wall");
setTile(level15Grid, 2, 2, "wall");
setTile(level15Grid, 6, 4, "wall");
setTile(level15Grid, 7, 4, "wall");
setTile(level15Grid, 3, 6, "wall");
setTile(level15Grid, 5, 2, "wall");
setTile(level15Grid, 5, 3, "wall");

// Level 16 - The Hook
const level16Grid = makeGrid();
setTile(level16Grid, 0, 7, "start");
setTile(level16Grid, 7, 0, "goal");
setTile(level16Grid, 0, 4, "wall");
setTile(level16Grid, 1, 4, "wall");
setTile(level16Grid, 3, 3, "wall");
setTile(level16Grid, 4, 3, "wall");
setTile(level16Grid, 6, 5, "wall");
setTile(level16Grid, 7, 5, "wall");

// Level 17 - Staircase
const level17Grid = makeGrid();
setTile(level17Grid, 0, 0, "start");
setTile(level17Grid, 7, 7, "goal");
setTile(level17Grid, 1, 2, "wall");
setTile(level17Grid, 2, 4, "wall");
setTile(level17Grid, 3, 6, "wall");
setTile(level17Grid, 4, 1, "wall");
setTile(level17Grid, 5, 3, "wall");
setTile(level17Grid, 6, 5, "wall");

// Level 18 - Mirror Run
const level18Grid = makeGrid();
setTile(level18Grid, 0, 3, "start");
setTile(level18Grid, 7, 4, "goal");
setTile(level18Grid, 1, 1, "wall");
setTile(level18Grid, 1, 6, "wall");
setTile(level18Grid, 3, 3, "wall");
setTile(level18Grid, 3, 4, "wall");
setTile(level18Grid, 5, 1, "wall");
setTile(level18Grid, 5, 6, "wall");
setTile(level18Grid, 6, 3, "wall");

// Level 19 - The Gauntlet
const level19Grid = makeGrid();
setTile(level19Grid, 0, 0, "start");
setTile(level19Grid, 7, 7, "goal");
setTile(level19Grid, 1, 3, "wall");
setTile(level19Grid, 2, 5, "wall");
setTile(level19Grid, 3, 1, "wall");
setTile(level19Grid, 3, 7, "wall");
setTile(level19Grid, 5, 0, "wall");
setTile(level19Grid, 5, 4, "wall");
setTile(level19Grid, 6, 6, "wall");

// Level 20 - Slalom
const level20Grid = makeGrid();
setTile(level20Grid, 0, 1, "start");
setTile(level20Grid, 7, 6, "goal");
setTile(level20Grid, 1, 0, "wall");
setTile(level20Grid, 1, 2, "wall");
setTile(level20Grid, 3, 3, "wall");
setTile(level20Grid, 3, 5, "wall");
setTile(level20Grid, 5, 2, "wall");
setTile(level20Grid, 5, 4, "wall");
setTile(level20Grid, 7, 3, "wall");
setTile(level20Grid, 7, 5, "wall");

// Level 21 - Barricade
const level21Grid = makeGrid();
setTile(level21Grid, 0, 0, "start");
setTile(level21Grid, 7, 7, "goal");
setTile(level21Grid, 2, 0, "wall");
setTile(level21Grid, 2, 1, "wall");
setTile(level21Grid, 2, 2, "wall");
setTile(level21Grid, 2, 3, "wall");
setTile(level21Grid, 5, 4, "wall");
setTile(level21Grid, 5, 5, "wall");
setTile(level21Grid, 5, 6, "wall");
setTile(level21Grid, 5, 7, "wall");
setTile(level21Grid, 3, 6, "wall");

// Level 22 - Pinball
const level22Grid = makeGrid();
setTile(level22Grid, 3, 0, "start");
setTile(level22Grid, 3, 7, "goal");
setTile(level22Grid, 0, 2, "wall");
setTile(level22Grid, 0, 5, "wall");
setTile(level22Grid, 2, 4, "wall");
setTile(level22Grid, 4, 2, "wall");
setTile(level22Grid, 4, 5, "wall");
setTile(level22Grid, 6, 3, "wall");
setTile(level22Grid, 7, 1, "wall");
setTile(level22Grid, 7, 6, "wall");

// Level 23 - The T-Junction
const level23Grid = makeGrid();
setTile(level23Grid, 0, 3, "start");
setTile(level23Grid, 7, 3, "goal");
setTile(level23Grid, 2, 1, "wall");
setTile(level23Grid, 2, 5, "wall");
setTile(level23Grid, 3, 1, "wall");
setTile(level23Grid, 3, 5, "wall");
setTile(level23Grid, 4, 2, "wall");
setTile(level23Grid, 4, 4, "wall");
setTile(level23Grid, 5, 0, "wall");
setTile(level23Grid, 5, 6, "wall");
setTile(level23Grid, 6, 2, "wall");

// Level 24 - Labyrinth I
const level24Grid = makeGrid();
setTile(level24Grid, 0, 0, "start");
setTile(level24Grid, 7, 7, "goal");
setTile(level24Grid, 1, 2, "wall");
setTile(level24Grid, 1, 4, "wall");
setTile(level24Grid, 1, 6, "wall");
setTile(level24Grid, 3, 1, "wall");
setTile(level24Grid, 3, 5, "wall");
setTile(level24Grid, 5, 2, "wall");
setTile(level24Grid, 5, 4, "wall");
setTile(level24Grid, 6, 6, "wall");
setTile(level24Grid, 7, 2, "wall");

// Level 25 - Obstacle Course
const level25Grid = makeGrid();
setTile(level25Grid, 7, 0, "start");
setTile(level25Grid, 0, 7, "goal");
setTile(level25Grid, 6, 2, "wall");
setTile(level25Grid, 5, 4, "wall");
setTile(level25Grid, 4, 2, "wall");
setTile(level25Grid, 4, 6, "wall");
setTile(level25Grid, 3, 4, "wall");
setTile(level25Grid, 2, 2, "wall");
setTile(level25Grid, 2, 6, "wall");
setTile(level25Grid, 1, 4, "wall");
setTile(level25Grid, 0, 2, "wall");

// Level 26 - The Maze
const level26Grid = makeGrid();
setTile(level26Grid, 0, 0, "start");
setTile(level26Grid, 7, 7, "goal");
setTile(level26Grid, 0, 4, "wall");
setTile(level26Grid, 1, 2, "wall");
setTile(level26Grid, 1, 4, "wall");
setTile(level26Grid, 2, 2, "wall");
setTile(level26Grid, 3, 4, "wall");
setTile(level26Grid, 3, 6, "wall");
setTile(level26Grid, 4, 1, "wall");
setTile(level26Grid, 4, 4, "wall");
setTile(level26Grid, 5, 6, "wall");
setTile(level26Grid, 6, 3, "wall");

// Level 27 - Fortress
const level27Grid = makeGrid();
setTile(level27Grid, 0, 1, "start");
setTile(level27Grid, 7, 6, "goal");
setTile(level27Grid, 2, 2, "wall");
setTile(level27Grid, 2, 3, "wall");
setTile(level27Grid, 2, 4, "wall");
setTile(level27Grid, 3, 2, "wall");
setTile(level27Grid, 3, 4, "wall");
setTile(level27Grid, 4, 2, "wall");
setTile(level27Grid, 4, 4, "wall");
setTile(level27Grid, 5, 2, "wall");
setTile(level27Grid, 5, 3, "wall");
setTile(level27Grid, 5, 4, "wall");

// Level 28 - Alley
const level28Grid = makeGrid();
setTile(level28Grid, 0, 0, "start");
setTile(level28Grid, 7, 7, "goal");
setTile(level28Grid, 1, 3, "wall");
setTile(level28Grid, 2, 3, "wall");
setTile(level28Grid, 3, 3, "wall");
setTile(level28Grid, 4, 4, "wall");
setTile(level28Grid, 5, 4, "wall");
setTile(level28Grid, 6, 4, "wall");
setTile(level28Grid, 2, 6, "wall");
setTile(level28Grid, 5, 1, "wall");

// Level 29 - Checkpoint
const level29Grid = makeGrid();
setTile(level29Grid, 0, 4, "start");
setTile(level29Grid, 7, 3, "goal");
setTile(level29Grid, 1, 2, "wall");
setTile(level29Grid, 1, 6, "wall");
setTile(level29Grid, 3, 0, "wall");
setTile(level29Grid, 3, 4, "wall");
setTile(level29Grid, 3, 7, "wall");
setTile(level29Grid, 5, 2, "wall");
setTile(level29Grid, 5, 5, "wall");
setTile(level29Grid, 6, 0, "wall");
setTile(level29Grid, 6, 7, "wall");

// Level 30 - The Bend II
const level30Grid = makeGrid();
setTile(level30Grid, 0, 0, "start");
setTile(level30Grid, 0, 7, "goal");
setTile(level30Grid, 0, 2, "wall");
setTile(level30Grid, 0, 3, "wall");
setTile(level30Grid, 0, 4, "wall");
setTile(level30Grid, 0, 5, "wall");
setTile(level30Grid, 3, 1, "wall");
setTile(level30Grid, 3, 6, "wall");
setTile(level30Grid, 5, 3, "wall");
setTile(level30Grid, 5, 4, "wall");
setTile(level30Grid, 7, 2, "wall");
setTile(level30Grid, 7, 5, "wall");

// Level 31 - Dead Ends
const level31Grid = makeGrid();
setTile(level31Grid, 0, 0, "start");
setTile(level31Grid, 7, 7, "goal");
setTile(level31Grid, 1, 5, "wall");
setTile(level31Grid, 1, 6, "wall");
setTile(level31Grid, 1, 7, "wall");
setTile(level31Grid, 3, 0, "wall");
setTile(level31Grid, 3, 1, "wall");
setTile(level31Grid, 3, 2, "wall");
setTile(level31Grid, 5, 4, "wall");
setTile(level31Grid, 5, 5, "wall");
setTile(level31Grid, 6, 2, "wall");
setTile(level31Grid, 7, 2, "wall");
setTile(level31Grid, 4, 6, "wall");

// Level 32 - The Pincer
const level32Grid = makeGrid();
setTile(level32Grid, 4, 0, "start");
setTile(level32Grid, 4, 7, "goal");
setTile(level32Grid, 2, 1, "wall");
setTile(level32Grid, 3, 1, "wall");
setTile(level32Grid, 5, 1, "wall");
setTile(level32Grid, 6, 1, "wall");
setTile(level32Grid, 2, 6, "wall");
setTile(level32Grid, 3, 6, "wall");
setTile(level32Grid, 5, 6, "wall");
setTile(level32Grid, 6, 6, "wall");
setTile(level32Grid, 4, 3, "wall");
setTile(level32Grid, 4, 4, "wall");

// Level 33 - Spiral II
const level33Grid = makeGrid();
setTile(level33Grid, 0, 0, "start");
setTile(level33Grid, 3, 3, "goal");
setTile(level33Grid, 0, 5, "wall");
setTile(level33Grid, 1, 5, "wall");
setTile(level33Grid, 2, 5, "wall");
setTile(level33Grid, 3, 5, "wall");
setTile(level33Grid, 5, 1, "wall");
setTile(level33Grid, 5, 2, "wall");
setTile(level33Grid, 5, 3, "wall");
setTile(level33Grid, 5, 4, "wall");
setTile(level33Grid, 2, 2, "wall");
setTile(level33Grid, 7, 7, "wall");

// Level 34 - Bottleneck
const level34Grid = makeGrid();
setTile(level34Grid, 0, 0, "start");
setTile(level34Grid, 7, 7, "goal");
setTile(level34Grid, 3, 0, "wall");
setTile(level34Grid, 3, 1, "wall");
setTile(level34Grid, 3, 2, "wall");
setTile(level34Grid, 3, 3, "wall");
setTile(level34Grid, 3, 5, "wall");
setTile(level34Grid, 3, 6, "wall");
setTile(level34Grid, 3, 7, "wall");
setTile(level34Grid, 5, 1, "wall");
setTile(level34Grid, 5, 6, "wall");
setTile(level34Grid, 1, 5, "wall");

// Level 35 - Bridge
const level35Grid = makeGrid();
setTile(level35Grid, 0, 3, "start");
setTile(level35Grid, 7, 4, "goal");
setTile(level35Grid, 2, 0, "wall");
setTile(level35Grid, 2, 1, "wall");
setTile(level35Grid, 2, 2, "wall");
setTile(level35Grid, 2, 5, "wall");
setTile(level35Grid, 2, 6, "wall");
setTile(level35Grid, 2, 7, "wall");
setTile(level35Grid, 5, 0, "wall");
setTile(level35Grid, 5, 1, "wall");
setTile(level35Grid, 5, 2, "wall");
setTile(level35Grid, 5, 5, "wall");
setTile(level35Grid, 5, 6, "wall");
setTile(level35Grid, 5, 7, "wall");

// Level 36 - The Void
const level36Grid = makeGrid();
setTile(level36Grid, 0, 0, "start");
setTile(level36Grid, 7, 7, "goal");
setTile(level36Grid, 1, 1, "wall");
setTile(level36Grid, 1, 2, "wall");
setTile(level36Grid, 2, 1, "wall");
setTile(level36Grid, 4, 4, "wall");
setTile(level36Grid, 4, 5, "wall");
setTile(level36Grid, 5, 4, "wall");
setTile(level36Grid, 3, 6, "wall");
setTile(level36Grid, 6, 2, "wall");
setTile(level36Grid, 7, 3, "wall");
setTile(level36Grid, 0, 5, "wall");

// Level 37 - Zigzag II
const level37Grid = makeGrid();
setTile(level37Grid, 0, 0, "start");
setTile(level37Grid, 7, 7, "goal");
setTile(level37Grid, 1, 0, "wall");
setTile(level37Grid, 1, 1, "wall");
setTile(level37Grid, 3, 2, "wall");
setTile(level37Grid, 3, 3, "wall");
setTile(level37Grid, 5, 4, "wall");
setTile(level37Grid, 5, 5, "wall");
setTile(level37Grid, 2, 5, "wall");
setTile(level37Grid, 4, 3, "wall");
setTile(level37Grid, 6, 6, "wall");
setTile(level37Grid, 0, 3, "wall");
setTile(level37Grid, 7, 4, "wall");

// Level 38 - Crossfire
const level38Grid = makeGrid();
setTile(level38Grid, 0, 0, "start");
setTile(level38Grid, 7, 7, "goal");
setTile(level38Grid, 0, 6, "wall");
setTile(level38Grid, 1, 6, "wall");
setTile(level38Grid, 2, 4, "wall");
setTile(level38Grid, 2, 5, "wall");
setTile(level38Grid, 4, 2, "wall");
setTile(level38Grid, 4, 3, "wall");
setTile(level38Grid, 6, 1, "wall");
setTile(level38Grid, 7, 1, "wall");
setTile(level38Grid, 3, 7, "wall");
setTile(level38Grid, 5, 0, "wall");

// Level 39 - The Snake
const level39Grid = makeGrid();
setTile(level39Grid, 0, 0, "start");
setTile(level39Grid, 7, 7, "goal");
setTile(level39Grid, 1, 2, "wall");
setTile(level39Grid, 1, 3, "wall");
setTile(level39Grid, 1, 4, "wall");
setTile(level39Grid, 1, 5, "wall");
setTile(level39Grid, 3, 2, "wall");
setTile(level39Grid, 3, 3, "wall");
setTile(level39Grid, 3, 4, "wall");
setTile(level39Grid, 3, 5, "wall");
setTile(level39Grid, 5, 2, "wall");
setTile(level39Grid, 5, 3, "wall");
setTile(level39Grid, 5, 4, "wall");
setTile(level39Grid, 5, 5, "wall");

// Level 40 - Finale I
const level40Grid = makeGrid();
setTile(level40Grid, 0, 0, "start");
setTile(level40Grid, 7, 7, "goal");
setTile(level40Grid, 0, 2, "wall");
setTile(level40Grid, 0, 3, "wall");
setTile(level40Grid, 0, 4, "wall");
setTile(level40Grid, 2, 6, "wall");
setTile(level40Grid, 2, 7, "wall");
setTile(level40Grid, 4, 0, "wall");
setTile(level40Grid, 4, 1, "wall");
setTile(level40Grid, 5, 5, "wall");
setTile(level40Grid, 6, 3, "wall");
setTile(level40Grid, 7, 1, "wall");
setTile(level40Grid, 7, 2, "wall");
setTile(level40Grid, 1, 4, "wall");

// Level 41 - Master Path
const level41Grid = makeGrid();
setTile(level41Grid, 0, 0, "start");
setTile(level41Grid, 7, 7, "goal");
setTile(level41Grid, 0, 3, "wall");
setTile(level41Grid, 0, 4, "wall");
setTile(level41Grid, 0, 5, "wall");
setTile(level41Grid, 2, 2, "wall");
setTile(level41Grid, 2, 6, "wall");
setTile(level41Grid, 2, 7, "wall");
setTile(level41Grid, 4, 0, "wall");
setTile(level41Grid, 4, 1, "wall");
setTile(level41Grid, 4, 5, "wall");
setTile(level41Grid, 6, 3, "wall");
setTile(level41Grid, 6, 4, "wall");
setTile(level41Grid, 7, 0, "wall");
setTile(level41Grid, 7, 1, "wall");

// Level 42 - The Corridor
const level42Grid = makeGrid();
setTile(level42Grid, 0, 0, "start");
setTile(level42Grid, 0, 7, "goal");
setTile(level42Grid, 1, 1, "wall");
setTile(level42Grid, 1, 2, "wall");
setTile(level42Grid, 1, 3, "wall");
setTile(level42Grid, 1, 5, "wall");
setTile(level42Grid, 1, 6, "wall");
setTile(level42Grid, 3, 2, "wall");
setTile(level42Grid, 3, 5, "wall");
setTile(level42Grid, 5, 2, "wall");
setTile(level42Grid, 5, 5, "wall");
setTile(level42Grid, 7, 1, "wall");
setTile(level42Grid, 7, 3, "wall");
setTile(level42Grid, 7, 4, "wall");
setTile(level42Grid, 7, 6, "wall");

// Level 43 - Labyrinth II
const level43Grid = makeGrid();
setTile(level43Grid, 7, 0, "start");
setTile(level43Grid, 0, 7, "goal");
setTile(level43Grid, 6, 2, "wall");
setTile(level43Grid, 5, 2, "wall");
setTile(level43Grid, 5, 4, "wall");
setTile(level43Grid, 4, 4, "wall");
setTile(level43Grid, 4, 6, "wall");
setTile(level43Grid, 3, 6, "wall");
setTile(level43Grid, 3, 1, "wall");
setTile(level43Grid, 2, 3, "wall");
setTile(level43Grid, 1, 5, "wall");
setTile(level43Grid, 6, 5, "wall");
setTile(level43Grid, 2, 1, "wall");
setTile(level43Grid, 0, 3, "wall");

// Level 44 - The Grid
const level44Grid = makeGrid();
setTile(level44Grid, 0, 0, "start");
setTile(level44Grid, 7, 7, "goal");
setTile(level44Grid, 1, 3, "wall");
setTile(level44Grid, 1, 4, "wall");
setTile(level44Grid, 2, 6, "wall");
setTile(level44Grid, 3, 1, "wall");
setTile(level44Grid, 3, 5, "wall");
setTile(level44Grid, 4, 3, "wall");
setTile(level44Grid, 5, 1, "wall");
setTile(level44Grid, 5, 6, "wall");
setTile(level44Grid, 6, 3, "wall");
setTile(level44Grid, 6, 4, "wall");
setTile(level44Grid, 0, 5, "wall");
setTile(level44Grid, 7, 2, "wall");
setTile(level44Grid, 2, 1, "wall");
setTile(level44Grid, 4, 6, "wall");

// Level 45 - Pressure Test
const level45Grid = makeGrid();
setTile(level45Grid, 0, 0, "start");
setTile(level45Grid, 7, 7, "goal");
setTile(level45Grid, 0, 4, "wall");
setTile(level45Grid, 1, 2, "wall");
setTile(level45Grid, 1, 6, "wall");
setTile(level45Grid, 3, 0, "wall");
setTile(level45Grid, 3, 4, "wall");
setTile(level45Grid, 4, 4, "wall");
setTile(level45Grid, 4, 7, "wall");
setTile(level45Grid, 5, 2, "wall");
setTile(level45Grid, 6, 5, "wall");
setTile(level45Grid, 7, 3, "wall");
setTile(level45Grid, 2, 4, "wall");
setTile(level45Grid, 6, 1, "wall");

// Level 46 - Deep Maze
const level46Grid = makeGrid();
setTile(level46Grid, 0, 0, "start");
setTile(level46Grid, 7, 7, "goal");
setTile(level46Grid, 1, 1, "wall");
setTile(level46Grid, 1, 3, "wall");
setTile(level46Grid, 1, 5, "wall");
setTile(level46Grid, 1, 7, "wall");
setTile(level46Grid, 3, 0, "wall");
setTile(level46Grid, 3, 2, "wall");
setTile(level46Grid, 3, 4, "wall");
setTile(level46Grid, 3, 6, "wall");
setTile(level46Grid, 5, 1, "wall");
setTile(level46Grid, 5, 3, "wall");
setTile(level46Grid, 5, 5, "wall");
setTile(level46Grid, 5, 7, "wall");
setTile(level46Grid, 7, 0, "wall");
setTile(level46Grid, 7, 2, "wall");

// Level 47 - Final Approach
const level47Grid = makeGrid();
setTile(level47Grid, 0, 0, "start");
setTile(level47Grid, 7, 7, "goal");
setTile(level47Grid, 0, 5, "wall");
setTile(level47Grid, 0, 6, "wall");
setTile(level47Grid, 0, 7, "wall");
setTile(level47Grid, 2, 2, "wall");
setTile(level47Grid, 2, 5, "wall");
setTile(level47Grid, 4, 2, "wall");
setTile(level47Grid, 4, 5, "wall");
setTile(level47Grid, 6, 0, "wall");
setTile(level47Grid, 6, 1, "wall");
setTile(level47Grid, 6, 2, "wall");
setTile(level47Grid, 7, 4, "wall");
setTile(level47Grid, 7, 5, "wall");
setTile(level47Grid, 3, 7, "wall");
setTile(level47Grid, 5, 0, "wall");

// Level 48 - The Summit
const level48Grid = makeGrid();
setTile(level48Grid, 7, 0, "start");
setTile(level48Grid, 0, 7, "goal");
setTile(level48Grid, 7, 2, "wall");
setTile(level48Grid, 7, 3, "wall");
setTile(level48Grid, 6, 5, "wall");
setTile(level48Grid, 6, 6, "wall");
setTile(level48Grid, 5, 1, "wall");
setTile(level48Grid, 5, 4, "wall");
setTile(level48Grid, 4, 6, "wall");
setTile(level48Grid, 3, 2, "wall");
setTile(level48Grid, 3, 5, "wall");
setTile(level48Grid, 2, 0, "wall");
setTile(level48Grid, 2, 4, "wall");
setTile(level48Grid, 1, 2, "wall");
setTile(level48Grid, 0, 5, "wall");
setTile(level48Grid, 4, 3, "wall");

// Level 49 - Grand Design
const level49Grid = makeGrid();
setTile(level49Grid, 0, 0, "start");
setTile(level49Grid, 7, 7, "goal");
setTile(level49Grid, 0, 3, "wall");
setTile(level49Grid, 0, 4, "wall");
setTile(level49Grid, 1, 6, "wall");
setTile(level49Grid, 2, 1, "wall");
setTile(level49Grid, 2, 4, "wall");
setTile(level49Grid, 3, 6, "wall");
setTile(level49Grid, 4, 1, "wall");
setTile(level49Grid, 4, 4, "wall");
setTile(level49Grid, 5, 2, "wall");
setTile(level49Grid, 5, 6, "wall");
setTile(level49Grid, 6, 4, "wall");
setTile(level49Grid, 7, 1, "wall");
setTile(level49Grid, 7, 2, "wall");
setTile(level49Grid, 3, 2, "wall");

// Level 50 - Waymark
const level50Grid = makeGrid();
setTile(level50Grid, 0, 0, "start");
setTile(level50Grid, 7, 7, "goal");
setTile(level50Grid, 0, 2, "wall");
setTile(level50Grid, 0, 3, "wall");
setTile(level50Grid, 0, 4, "wall");
setTile(level50Grid, 0, 5, "wall");
setTile(level50Grid, 2, 0, "wall");
setTile(level50Grid, 2, 1, "wall");
setTile(level50Grid, 2, 6, "wall");
setTile(level50Grid, 2, 7, "wall");
setTile(level50Grid, 4, 2, "wall");
setTile(level50Grid, 4, 5, "wall");
setTile(level50Grid, 6, 0, "wall");
setTile(level50Grid, 6, 1, "wall");
setTile(level50Grid, 6, 6, "wall");
setTile(level50Grid, 6, 7, "wall");

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
  {
    id: "level-6",
    name: "Side Step",
    grid: level6Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-7",
    name: "Zig Zag",
    grid: level7Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-8",
    name: "The Gap",
    grid: level8Grid,
    startDir: "right",
    inventory: [
      { direction: "down", count: 2 },
      { direction: "up", count: 1 },
    ],
  },
  {
    id: "level-9",
    name: "Corner Shot",
    grid: level9Grid,
    startDir: "up",
    inventory: [
      { direction: "up", count: 2 },
      { direction: "right", count: 2 },
    ],
  },
  {
    id: "level-10",
    name: "Double Bend",
    grid: level10Grid,
    startDir: "down",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 1 },
    ],
  },
  {
    id: "level-11",
    name: "The Spiral",
    grid: level11Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-12",
    name: "Cross Roads",
    grid: level12Grid,
    startDir: "down",
    inventory: [
      { direction: "down", count: 2 },
      { direction: "left", count: 1 },
      { direction: "right", count: 1 },
    ],
  },
  {
    id: "level-13",
    name: "Switchback",
    grid: level13Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-14",
    name: "Narrow Pass",
    grid: level14Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-15",
    name: "Bounce House",
    grid: level15Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 1 },
      { direction: "up", count: 1 },
    ],
  },
  {
    id: "level-16",
    name: "The Hook",
    grid: level16Grid,
    startDir: "down",
    inventory: [
      { direction: "down", count: 2 },
      { direction: "left", count: 2 },
    ],
  },
  {
    id: "level-17",
    name: "Staircase",
    grid: level17Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-18",
    name: "Mirror Run",
    grid: level18Grid,
    startDir: "down",
    inventory: [
      { direction: "down", count: 2 },
      { direction: "right", count: 1 },
      { direction: "left", count: 1 },
    ],
  },
  {
    id: "level-19",
    name: "The Gauntlet",
    grid: level19Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-20",
    name: "Slalom",
    grid: level20Grid,
    startDir: "down",
    inventory: [
      { direction: "down", count: 2 },
      { direction: "right", count: 2 },
    ],
  },
  {
    id: "level-21",
    name: "Barricade",
    grid: level21Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-22",
    name: "Pinball",
    grid: level22Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 1 },
      { direction: "up", count: 1 },
    ],
  },
  {
    id: "level-23",
    name: "The T-Junction",
    grid: level23Grid,
    startDir: "down",
    inventory: [
      { direction: "down", count: 2 },
      { direction: "right", count: 1 },
      { direction: "left", count: 1 },
    ],
  },
  {
    id: "level-24",
    name: "Labyrinth I",
    grid: level24Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-25",
    name: "Obstacle Course",
    grid: level25Grid,
    startDir: "up",
    inventory: [
      { direction: "up", count: 2 },
      { direction: "right", count: 2 },
    ],
  },
  {
    id: "level-26",
    name: "The Maze",
    grid: level26Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-27",
    name: "Fortress",
    grid: level27Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-28",
    name: "Alley",
    grid: level28Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-29",
    name: "Checkpoint",
    grid: level29Grid,
    startDir: "down",
    inventory: [
      { direction: "down", count: 2 },
      { direction: "right", count: 1 },
      { direction: "left", count: 1 },
    ],
  },
  {
    id: "level-30",
    name: "The Bend II",
    grid: level30Grid,
    startDir: "down",
    inventory: [
      { direction: "down", count: 2 },
      { direction: "right", count: 2 },
    ],
  },
  {
    id: "level-31",
    name: "Dead Ends",
    grid: level31Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-32",
    name: "The Pincer",
    grid: level32Grid,
    startDir: "right",
    inventory: [
      { direction: "down", count: 2 },
      { direction: "up", count: 1 },
      { direction: "right", count: 1 },
    ],
  },
  {
    id: "level-33",
    name: "Spiral II",
    grid: level33Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-34",
    name: "Bottleneck",
    grid: level34Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-35",
    name: "Bridge",
    grid: level35Grid,
    startDir: "down",
    inventory: [
      { direction: "down", count: 2 },
      { direction: "right", count: 1 },
      { direction: "left", count: 1 },
    ],
  },
  {
    id: "level-36",
    name: "The Void",
    grid: level36Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-37",
    name: "Zigzag II",
    grid: level37Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-38",
    name: "Crossfire",
    grid: level38Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-39",
    name: "The Snake",
    grid: level39Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-40",
    name: "Finale I",
    grid: level40Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-41",
    name: "Master Path",
    grid: level41Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-42",
    name: "The Corridor",
    grid: level42Grid,
    startDir: "down",
    inventory: [
      { direction: "down", count: 2 },
      { direction: "right", count: 2 },
    ],
  },
  {
    id: "level-43",
    name: "Labyrinth II",
    grid: level43Grid,
    startDir: "up",
    inventory: [
      { direction: "up", count: 2 },
      { direction: "right", count: 2 },
    ],
  },
  {
    id: "level-44",
    name: "The Grid",
    grid: level44Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-45",
    name: "Pressure Test",
    grid: level45Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-46",
    name: "Deep Maze",
    grid: level46Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-47",
    name: "Final Approach",
    grid: level47Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-48",
    name: "The Summit",
    grid: level48Grid,
    startDir: "up",
    inventory: [
      { direction: "up", count: 2 },
      { direction: "right", count: 2 },
    ],
  },
  {
    id: "level-49",
    name: "Grand Design",
    grid: level49Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
    ],
  },
  {
    id: "level-50",
    name: "Waymark",
    grid: level50Grid,
    startDir: "right",
    inventory: [
      { direction: "right", count: 2 },
      { direction: "down", count: 2 },
      { direction: "up", count: 1 },
    ],
  },
];
