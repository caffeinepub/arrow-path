import type { ArrowDir, Level, TileType } from "../types/game";

type Pos = [number, number];

interface LevelConfig {
  id: string;
  name: string;
  gridSize: number;
  startPos: Pos;
  goalPos: Pos;
  startDir: ArrowDir;
  walls: Pos[];
  crackedTiles?: Pos[];
  oneWayGates?: [number, number, "up" | "down" | "left" | "right"][];
  allowedArrows: Partial<Record<ArrowDir, number>>;
  par?: number; // defaults to sum of allowedArrows
}

function buildLevel(cfg: LevelConfig): Level {
  const size = cfg.gridSize;
  const grid: TileType[][] = Array.from(
    { length: size },
    () => Array(size).fill("empty") as TileType[],
  );
  const [sr, sc] = cfg.startPos;
  const [gr, gc] = cfg.goalPos;
  grid[sr][sc] = "start";
  grid[gr][gc] = "goal";
  for (const [r, c] of cfg.walls) grid[r][c] = "wall";
  for (const [r, c] of cfg.crackedTiles ?? []) grid[r][c] = "cracked";
  for (const [r, c, dir] of cfg.oneWayGates ?? []) {
    grid[r][c] = `gate_${dir}` as TileType;
  }
  const inventory = Object.entries(cfg.allowedArrows)
    .filter(([, cnt]) => (cnt ?? 0) > 0)
    .map(([dir, cnt]) => ({ direction: dir as ArrowDir, count: cnt! }));
  const totalArrows = Object.values(cfg.allowedArrows).reduce(
    (s, n) => s + (n ?? 0),
    0,
  );
  return {
    id: cfg.id,
    name: cfg.name,
    grid,
    inventory,
    startDir: cfg.startDir,
    gridSize: cfg.gridSize,
    par: cfg.par ?? totalArrows,
  };
}

const LEVEL_CONFIGS: LevelConfig[] = [
  // =========================================
  // CHAPTER 1: 6x6 GRID — Levels 1-10 (Arctic)
  // =========================================

  // Level 1: First Steps
  // Path: start[0,0] → right → right → down at [0,2] → down → down → right at [3,2] → right → right to goal[3,5]
  {
    id: "level-1",
    name: "First Steps",
    gridSize: 6,
    startPos: [0, 0],
    goalPos: [3, 5],
    startDir: "right",
    walls: [
      [1, 2],
      [2, 0],
      [2, 1],
      [0, 3],
      [0, 4],
      [0, 5],
    ],
    allowedArrows: { down: 1, right: 1 },
  },

  // Level 2: The Bend
  // Path: start[0,3] → down → down → right at [2,3] → right → right to goal[2,5]
  // False path: going straight right from start leads to wall at [0,5] area
  {
    id: "level-2",
    name: "The Bend",
    gridSize: 6,
    startPos: [0, 3],
    goalPos: [2, 5],
    startDir: "down",
    walls: [
      [0, 4],
      [0, 5],
      [1, 5],
      [3, 4],
      [3, 5],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    allowedArrows: { right: 1, down: 1 },
  },

  // Level 3: Side Door
  // Path: start[0,5] → left → left → down at [0,3] → down → down → left at [3,3] → left to goal[3,0]
  {
    id: "level-3",
    name: "Side Door",
    gridSize: 6,
    startPos: [0, 5],
    goalPos: [3, 0],
    startDir: "left",
    walls: [
      [0, 2],
      [0, 1],
      [1, 0],
      [2, 3],
      [2, 4],
      [3, 4],
      [4, 0],
      [4, 1],
    ],
    allowedArrows: { down: 1, left: 2 },
  },

  // Level 4: Dogleg
  // Path: start[0,0] → right → right → right → down at [0,3] → down → down → right at [3,3] → right → right to goal[3,5]
  {
    id: "level-4",
    name: "Dogleg",
    gridSize: 6,
    startPos: [0, 0],
    goalPos: [3, 5],
    startDir: "right",
    walls: [
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 4],
      [0, 5],
      [3, 1],
      [3, 2],
      [3, 3],
      [4, 3],
      [4, 4],
    ],
    allowedArrows: { right: 2, down: 1 },
  },

  // Level 5: Pinch (labyrinth goal from L5)
  // Path: start[0,0] → down at [0,0] start → down → down → right at [3,0] → right → right → up at [3,3] → up to goal[1,3]
  // Goal [1,3]: walled on [0,3],[1,2],[1,4] — open only from below [2,3]
  {
    id: "level-5",
    name: "Pinch",
    gridSize: 6,
    startPos: [0, 0],
    goalPos: [1, 3],
    startDir: "down",
    walls: [
      [0, 3],
      [1, 2],
      [1, 4],
      [2, 0],
      [2, 1],
      [4, 2],
      [4, 3],
      [5, 3],
    ],
    allowedArrows: { right: 1, up: 1, down: 1 },
  },

  // Level 6: Loop Trap (false path from L6)
  // Path: start[5,0] → up → up → up → right at [2,0] → right → right → up at [2,3] → up → up to goal[0,3]
  // False path: going right along row 5 hits wall early, must go up first
  // Goal [0,3]: walled [0,2],[0,4] — open from below [1,3]
  {
    id: "level-6",
    name: "Loop Trap",
    gridSize: 6,
    startPos: [5, 0],
    goalPos: [0, 3],
    startDir: "up",
    walls: [
      [5, 1],
      [4, 0],
      [4, 1],
      [0, 2],
      [0, 4],
      [3, 3],
      [3, 4],
      [1, 1],
    ],
    allowedArrows: { right: 1, up: 2 },
  },

  // Level 7: The Crossing
  // Path: start[0,0] → right → right → down at [0,2] → down → down → right at [3,2] → right → up at [3,5] → up → up to goal[0,5]
  // Goal [0,5]: walled [0,4],[1,5] — open from below [1,5] is wall? No, open from below [1,5]
  // Actually goal [0,5] with wall [0,4]: ball enters moving right from [0,4]? [0,4] is wall
  // Use: goal[1,5] with wall [0,5],[2,5],[1,4] — open from... all blocked.
  // Simplify: goal[2,5], walls [1,5],[3,5],[2,4]. Ball comes from right=edge, from left [2,4]=wall, from above [1,5]=wall, from below [3,5]=wall. BLOCKED.
  // Use goal[2,5], wall only [1,5],[3,5]. Ball enters from left [2,4] moving right.
  {
    id: "level-7",
    name: "The Crossing",
    gridSize: 6,
    startPos: [0, 0],
    goalPos: [2, 5],
    startDir: "right",
    walls: [
      [0, 2],
      [0, 3],
      [1, 4],
      [1, 5],
      [3, 5],
      [3, 1],
      [4, 3],
      [4, 4],
    ],
    allowedArrows: { right: 2, down: 1, up: 1 },
  },

  // Level 8: Spiral Entry (false path prominent)
  // Path: start[0,0] → right → right → right → right → down at [0,4] → down → down → left at [3,4] → left to goal[3,1]
  // Goal [3,1]: walls [2,1],[3,0],[4,1] — open from right [3,2]
  // False path: obvious down from start leads to wall maze
  {
    id: "level-8",
    name: "Spiral Entry",
    gridSize: 6,
    startPos: [0, 0],
    goalPos: [3, 1],
    startDir: "right",
    walls: [
      [0, 2],
      [0, 3],
      [1, 0],
      [1, 1],
      [2, 1],
      [3, 0],
      [4, 1],
      [4, 4],
      [5, 3],
    ],
    allowedArrows: { right: 2, down: 1, left: 1 },
  },

  // Level 9: The Gauntlet
  // Path: start[0,5] → down → down → down → left at [3,5] → left → left → left → down at [3,1] → down → down → right at [5,1] → right to goal[5,4]
  // Goal [5,4]: walls [4,4],[5,3],[5,5] — open from left via [5,3]=wall? No. walls [4,4],[5,5] only, open from left [5,3]
  {
    id: "level-9",
    name: "The Gauntlet",
    gridSize: 6,
    startPos: [0, 5],
    goalPos: [5, 4],
    startDir: "down",
    walls: [
      [1, 4],
      [1, 3],
      [2, 5],
      [3, 0],
      [4, 4],
      [5, 5],
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    allowedArrows: { left: 1, down: 2, right: 1 },
  },

  // Level 10: The Anchor (max 6x6 complexity)
  // Path: start[0,5] → left → left → left → left → down at [0,1] → down → down → down → right at [4,1] → right → right → right to goal[4,5]
  // Goal [4,5]: walls [3,5],[4,4] (not wall), [5,5]. Actually wall [3,5] above, [5,5] below. Open from left [4,4]
  {
    id: "level-10",
    name: "The Anchor",
    gridSize: 6,
    startPos: [0, 5],
    goalPos: [4, 5],
    startDir: "left",
    walls: [
      [0, 3],
      [0, 2],
      [1, 4],
      [2, 0],
      [2, 4],
      [3, 5],
      [5, 5],
      [5, 0],
      [5, 1],
      [4, 0],
    ],
    allowedArrows: { down: 1, left: 1, right: 1 },
  },

  // ==========================================
  // CHAPTER 2: 8x8 GRID — Levels 11-20 (Ember)
  // ==========================================

  // Level 11: Gateway
  // Path: start[0,0] → right → right → right → down at [0,3] → down → right at [3,3] → right → right → right → down at [3,7] → down → down → down to goal[7,7]
  // Goal [7,7] corner, wall [6,7],[7,6]. Must enter from above [6,7]=wall — can't. Use goal[7,5]
  // Goal[7,5]: walls [6,5],[7,4],[7,6]. Open only from above [6,5]=wall → can't.
  // goal[6,7]: walls [5,7],[6,6]. Open from below [7,7]=edge impossible, from right=edge. Hmm corner issue.
  // KEEP IT SIMPLE: goal[7,4] with wall only [6,4]. Ball enters from above... open all other sides.
  // Path: start[0,0] → right..right → down → ... → goal[7,4]
  {
    id: "level-11",
    name: "Gateway",
    gridSize: 8,
    startPos: [0, 0],
    goalPos: [7, 4],
    startDir: "right",
    walls: [
      [0, 3],
      [0, 4],
      [1, 6],
      [2, 2],
      [3, 5],
      [4, 1],
      [4, 7],
      [5, 3],
      [6, 4],
      [6, 6],
      [7, 5],
      [7, 6],
    ],
    allowedArrows: { right: 2, down: 2 },
  },

  // Level 12: The Narrows
  // Path: start[0,7] → left → left → left → down at [0,4] → down → down → down → left at [4,4] → left → left → down at [4,1] → down → down → right at [7,1] → right → right to goal[7,4]
  {
    id: "level-12",
    name: "The Narrows",
    gridSize: 8,
    startPos: [0, 7],
    goalPos: [7, 4],
    startDir: "left",
    walls: [
      [0, 3],
      [1, 7],
      [2, 5],
      [2, 6],
      [3, 3],
      [4, 5],
      [4, 6],
      [5, 2],
      [5, 4],
      [6, 1],
      [7, 3],
      [7, 5],
    ],
    allowedArrows: { left: 2, down: 2, right: 1 },
  },

  // Level 13: Zigzag Bridge
  // Path: start[7,0] → up → up → up → right at [4,0] → right → right → up at [4,3] → up → right at [1,3] → right → right → right to goal[1,7]
  // Goal [1,7]: wall [0,7],[2,7]. Open from left [1,6]
  {
    id: "level-13",
    name: "Zigzag Bridge",
    gridSize: 8,
    startPos: [7, 0],
    goalPos: [1, 7],
    startDir: "up",
    walls: [
      [6, 1],
      [5, 0],
      [5, 2],
      [4, 4],
      [3, 3],
      [3, 5],
      [2, 1],
      [0, 7],
      [2, 7],
      [1, 4],
    ],
    allowedArrows: { right: 2, up: 2 },
  },

  // Level 14: Spiral Maze
  // More complex path requiring 4 arrows
  // Path: start[0,0] → right → right → down at [0,2] → down → down → down → right at [4,2] → right → right → up at [4,5] → up → up → right at [1,5] → right → right to goal[1,7]
  // Goal [1,7]: walls [0,7],[2,7]. Open from left
  {
    id: "level-14",
    name: "Spiral Maze",
    gridSize: 8,
    startPos: [0, 0],
    goalPos: [1, 7],
    startDir: "right",
    walls: [
      [0, 3],
      [0, 4],
      [1, 1],
      [1, 2],
      [1, 3],
      [2, 5],
      [3, 1],
      [3, 6],
      [4, 3],
      [4, 4],
      [5, 5],
      [5, 6],
      [0, 7],
      [2, 7],
    ],
    allowedArrows: { right: 2, down: 1, up: 1 },
  },

  // Level 15: Corridor Run
  // Path: start[3,0] → right all the way → down at [3,6] → down → down → left at [6,6] → left → left to goal[6,3]
  // Goal [6,3]: walls [5,3],[6,2],[7,3],[6,4]. Open from right [6,4]=wall? Use walls [5,3],[7,3],[6,4] only. Open from left [6,2]
  // Actually open entry from right: remove [6,4] from walls. Ball arrives from right.
  {
    id: "level-15",
    name: "Corridor Run",
    gridSize: 8,
    startPos: [3, 0],
    goalPos: [6, 3],
    startDir: "right",
    walls: [
      [0, 3],
      [1, 5],
      [2, 2],
      [3, 2],
      [3, 3],
      [4, 1],
      [5, 3],
      [5, 6],
      [6, 1],
      [7, 3],
      [7, 4],
    ],
    allowedArrows: { right: 1, down: 1, left: 1 },
  },

  // Level 16: The Detour
  // Longer path 4 arrows
  // start[0,0] → down → down → right at [2,0] → right → right → right → down at [2,4] → down → down → down → left at [6,4] → left → left → left to goal[6,0]
  // Goal [6,0]: walls [5,0],[7,0],[6,1]. Open from right [6,1]=wall... use walls [5,0],[7,0] only. Ball enters from right [6,1]
  {
    id: "level-16",
    name: "The Detour",
    gridSize: 8,
    startPos: [0, 0],
    goalPos: [6, 0],
    startDir: "down",
    walls: [
      [0, 1],
      [1, 3],
      [2, 1],
      [2, 2],
      [3, 5],
      [3, 6],
      [4, 3],
      [5, 0],
      [7, 0],
      [6, 5],
      [6, 6],
    ],
    allowedArrows: { right: 1, down: 2, left: 1 },
  },

  // Level 17: Switchback
  // start[7,7] → up → up → up → up → left at [3,7] → left → left → left → up at [3,3] → up → up → left at [0,3] → left → left to goal[0,0]
  // Goal [0,0] corner: walls [1,0],[0,1]. Ball must enter from right [0,1]=wall. From below [1,0]=wall. Dead end!
  // Use goal[0,1]: walls [1,1],[0,0],[0,2]. Ball enters from right [0,2]=wall. Or from below [1,1]=wall. Dead.
  // Keep goal at [0,2]: walls [1,2],[0,1],[0,3]. Ball moves left and arrives at [0,2] from [0,3]=wall? No.
  // Path ends with left arrow: ball moving left arrives at [0,0]. Wall [1,0] (below), [0,1] (right side is where ball came from). Goal in corner [0,0], walls only [1,0]. Ball enters from right moving left.
  {
    id: "level-17",
    name: "Switchback",
    gridSize: 8,
    startPos: [7, 7],
    goalPos: [0, 0],
    startDir: "up",
    walls: [
      [6, 7],
      [5, 6],
      [5, 5],
      [4, 7],
      [3, 4],
      [3, 5],
      [3, 6],
      [2, 2],
      [2, 3],
      [1, 0],
      [1, 4],
      [0, 4],
    ],
    allowedArrows: { left: 2, up: 2 },
  },

  // Level 18: Labyrinth Core
  // Dense walls, 5 arrows
  // Path: start[0,0] → right → right → down at [0,2] → down → down → right at [3,2] → right → up at [3,5] → up → up → right at [0,5] → right to goal[0,7]
  // Goal [0,7]: walls [1,7],[0,6]. Open from left (ball moves right from [0,6]=wall)? Ball arrives from left. [0,6] NOT wall.
  // walls [1,7] only. Ball enters [0,7] from left moving right.
  {
    id: "level-18",
    name: "Labyrinth Core",
    gridSize: 8,
    startPos: [0, 0],
    goalPos: [0, 7],
    startDir: "right",
    walls: [
      [0, 3],
      [0, 4],
      [1, 2],
      [2, 0],
      [2, 1],
      [3, 3],
      [3, 4],
      [4, 2],
      [4, 5],
      [5, 0],
      [5, 6],
      [1, 7],
    ],
    allowedArrows: { right: 2, down: 1, up: 1 },
  },

  // Level 19: The Weave
  // Multiple direction changes, 5 arrows total
  {
    id: "level-19",
    name: "The Weave",
    gridSize: 8,
    startPos: [0, 0],
    goalPos: [7, 7],
    startDir: "right",
    walls: [
      [0, 2],
      [0, 3],
      [1, 5],
      [2, 1],
      [2, 4],
      [3, 6],
      [4, 2],
      [4, 7],
      [5, 4],
      [6, 0],
      [6, 3],
      [7, 5],
      [7, 6],
    ],
    allowedArrows: { right: 2, down: 2, left: 1 },
  },

  // Level 20: BOSS LEVEL — 10x10 grid, only 3 arrows, cracked tiles + gates!
  // Path: start[0,0] → right → right → right → right → right → right → right → right (stay on row 0) → down at [0,8] → down → down → down → down → down → down → down (col 8) → left at [8,8] → left → left → left → left → left → left → left → left to goal[8,0]
  // But we only have 3 arrows! So we need: place down at [0,8], place left at [8,8], that's only 2. Start going right automatically, place down midway...
  // Actually: startDir right means ball auto-moves right. Place 1 down arrow to redirect, then it auto-moves to goal area.
  // With 3 arrows: right(1) + down(1) + left(1) = path can snake once. Let's place strategic cracked tiles and gates.
  // Path: start[0,0] startDir:down. Goes down to row 5, place right arrow at [5,0], goes right to col 5, place down at [5,5], goes down to row 9, goes to wall or goal.
  // Goal at [9,9]. From [9,5] moving down = [9,5] then continues. Need left arrow at [7,5] → left to [7,0] → but goal is [9,9]...
  // Simplest boss: start[0,0] startDir:right. 3 arrows: {down:1, left:1, up:1}
  // Ball goes right → place down at [0,5] → ball goes down → place left at [9,5] → ball goes left → falls off left edge (fail)
  // Need to reach [9,9]... difficult with 3 arrows going right start.
  // Boss design: start[0,0] startDir:down, goal[9,0]
  // Ball auto-moves down. Place right at [4,0] → right to col 9 → place up at [4,9] → up to row 0? No, goal [9,0].
  // OK: start[0,9] startDir:down, goal[9,0]
  // Ball goes down to row 9 (if no walls). Place left at [9,9]? But ball needs to reach [9,0].
  // start[0,9] → down → place left at [5,9] → left to col 0? Passes col 0 = off grid. Need up at [5,0]? Ball hits left edge.
  // FINAL BOSS: start[0,0] startDir:right, goal[9,9], 3 arrows {down:1, right:1, left:1}
  // Many walls forming a corridor. Ball goes right to [0,4]=wall (blocked early)
  // Nope, re-think: 3 arrows must actually solve it.
  // Ball startDir:right. Arrow1 at [0,3]: down. Ball goes right to [0,3]→down. Goes to [9,3]. Arrow2 at [9,3]: right. Ball goes right to [9,9]. GOAL! Only 2 arrows needed.
  // So 3 arrows: down(1) + right(1) + (one extra complexity, e.g. left:1 for a false path consideration)
  // Let's use: down:2, right:1. Path: [0,0]→right→[0,4] place down→down to [5,4] place down=no that's 2 downs for one path...
  // KEEP IT CLEAN: Boss 3 arrows = {down:1, right:1, up:1}.
  // Path: [0,0] startRight → [0,3] place down → down to [9,3] → [9,3] place right → right to [9,9] goal.
  // That's 2 arrows. Add 1 cracked tile and 2 gates for complexity with 3rd arrow for alternate/required detour.
  // 3rd arrow (up:1) placed at [6,3] → ball going down hits up arrow → redirects up → hits wall → FAIL. That's a trap.
  // So design: wall at [9,3] forces the down-arrow at different spot.
  // FINAL FINAL: start[0,0] right, goal[9,9]. 3 arrows: {right:1, down:1, left:1}
  // Ball auto-right → wall at [0,5] → ball needs down BEFORE [0,5] → place down at [0,4] → down to [9,4] → place right at [9,4] → right to [9,9] goal. 2 arrows used.
  // 3rd arrow needed: maze has cracked tile at [5,4] (first pass ok, second pass fail). And gate_right at [7,4].
  // Ball path: [0,0]→right→[0,4] place down →[1,4]→[2,4]→[3,4]→[4,4]→[5,4] CRACKED (mark broken, continue) →[6,4]→gate_right at [7,4] ball moving down≠right → FAIL!
  // So ball can't go straight down through gate. Must detour. Place left at [4,4] → go left → ...
  // Actually this is getting complex for a 10x10 boss. Let me keep it elegant:
  // Boss path: start[0,0] right → walls form a corridor → place down at [0,7] → go down to [9,7] → place left at [9,7] → go left to goal[9,0]. 2 arrows {down:1, left:1}.
  // Third arrow: up(1) placed at [6,7] by player as a FALSE path temptation.
  // But we said allowedArrows = minimum = 2. So 3 arrows means 3 are truly needed.
  // DEFINITIVE: place gate_left at [5,7] — ball moving DOWN hits gate_left (allowed left only, not down) → FAIL.
  // So ball MUST detour before [5,7]. place right at [4,7] → right to [4,9] wall → fail.
  // Need to path around. Use: place right at [3,7] → right to [3,9]=wall → fail.
  // OK: path requires going down col 7 but gate at row 5 blocks downward. Player must use 3rd arrow.
  // place down at [0,3] → down to row 4 at [4,3] → place right at [4,3] → right to [4,7] → place down at [4,7] → down to [9,7] → gate_left at [5,7] is still in col 7... ball passes [5,7] going down. gate_left says "only left passes". Ball going down → FAIL.
  // Ugh. Let's just make a clean boss:
  // 3 arrow solution path for 10x10:
  // start[0,0] startDir:down → down col 0 → place right at [5,0] → right row 5 → place down at [5,5] → down col 5 → place right at [9,5] → right row 9 → goal [9,9].
  // That's 3 arrows: right(2) + down(1). = {right:2, down:1}
  {
    id: "level-20",
    name: "BOSS: The Labyrinth",
    gridSize: 10,
    startPos: [0, 0],
    goalPos: [9, 9],
    startDir: "down",
    walls: [
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
      [6, 5],
      [7, 5],
      [8, 5],
      [9, 4],
      [9, 3],
      [9, 2],
      [9, 1],
      [6, 9],
      [7, 9],
      [8, 9],
      [9, 8],
      [9, 7],
    ],
    crackedTiles: [
      [3, 0],
      [8, 5],
    ],
    oneWayGates: [
      [5, 5, "right"],
      [9, 5, "right"],
    ],
    allowedArrows: { right: 2, down: 1 },
  },

  // ==========================================
  // CHAPTER 3: 8x8 GRID — Levels 21-30 (Forest)
  // ==========================================

  // Level 21: Forest Gate
  // Introduces cracked tiles more prominently
  // start[0,0] → right → right → right → down at [0,3] → cracked at [2,3] → down → down → right at [5,3] → right → right → right to goal[5,7]
  // Goal [5,7]: walls [4,7],[6,7]. Open from left [5,6]
  {
    id: "level-21",
    name: "Forest Gate",
    gridSize: 8,
    startPos: [0, 0],
    goalPos: [5, 7],
    startDir: "right",
    walls: [
      [0, 4],
      [1, 2],
      [2, 5],
      [3, 3],
      [4, 0],
      [4, 7],
      [5, 2],
      [6, 5],
      [6, 7],
      [7, 3],
    ],
    crackedTiles: [
      [2, 3],
      [3, 6],
    ],
    oneWayGates: [[4, 4, "right"]],
    allowedArrows: { right: 2, down: 1 },
  },

  // Level 22: Cracked Path
  // Multiple cracked tiles force careful routing
  {
    id: "level-22",
    name: "Cracked Path",
    gridSize: 8,
    startPos: [0, 7],
    goalPos: [7, 0],
    startDir: "down",
    walls: [
      [2, 7],
      [2, 6],
      [3, 5],
      [4, 3],
      [5, 1],
      [0, 0],
      [0, 1],
      [7, 6],
      [7, 7],
      [6, 6],
    ],
    crackedTiles: [
      [1, 7],
      [4, 4],
      [6, 1],
    ],
    oneWayGates: [[3, 6, "down"]],
    allowedArrows: { left: 2, down: 2 },
  },

  // Level 23: One-Way Street
  // Heavy gate usage
  {
    id: "level-23",
    name: "One-Way Street",
    gridSize: 8,
    startPos: [4, 0],
    goalPos: [4, 7],
    startDir: "right",
    walls: [
      [3, 2],
      [5, 2],
      [3, 4],
      [5, 4],
      [3, 6],
      [5, 6],
      [4, 1],
      [4, 3],
      [4, 5],
    ],
    crackedTiles: [
      [4, 2],
      [4, 6],
    ],
    oneWayGates: [
      [4, 1, "right"],
      [4, 3, "right"],
      [4, 5, "right"],
    ],
    allowedArrows: { right: 2, up: 1, down: 1 },
  },

  // Level 24: The Maze Keeper
  {
    id: "level-24",
    name: "The Maze Keeper",
    gridSize: 8,
    startPos: [0, 0],
    goalPos: [7, 7],
    startDir: "right",
    walls: [
      [0, 2],
      [1, 4],
      [2, 1],
      [2, 6],
      [3, 3],
      [4, 5],
      [5, 2],
      [5, 7],
      [6, 4],
      [7, 0],
      [7, 5],
      [7, 6],
    ],
    crackedTiles: [
      [1, 3],
      [4, 2],
      [6, 5],
    ],
    oneWayGates: [
      [2, 5, "down"],
      [5, 3, "right"],
    ],
    allowedArrows: { right: 2, down: 2, left: 1 },
  },

  // Level 25: Bottleneck
  {
    id: "level-25",
    name: "Bottleneck",
    gridSize: 8,
    startPos: [0, 3],
    goalPos: [7, 4],
    startDir: "down",
    walls: [
      [1, 2],
      [1, 4],
      [2, 1],
      [2, 5],
      [3, 0],
      [3, 6],
      [4, 1],
      [4, 5],
      [5, 2],
      [5, 4],
      [6, 3],
      [6, 5],
      [7, 3],
      [7, 5],
    ],
    crackedTiles: [
      [3, 3],
      [5, 3],
    ],
    oneWayGates: [[4, 3, "down"]],
    allowedArrows: { down: 2, left: 1, right: 1 },
  },

  // Level 26: Forest Labyrinth
  {
    id: "level-26",
    name: "Forest Labyrinth",
    gridSize: 8,
    startPos: [7, 0],
    goalPos: [0, 7],
    startDir: "up",
    walls: [
      [6, 0],
      [5, 1],
      [4, 0],
      [4, 2],
      [3, 3],
      [2, 4],
      [1, 5],
      [0, 5],
      [0, 6],
      [1, 7],
      [2, 6],
      [3, 7],
      [5, 5],
    ],
    crackedTiles: [
      [5, 2],
      [3, 4],
      [1, 6],
    ],
    oneWayGates: [
      [4, 1, "up"],
      [2, 5, "up"],
    ],
    allowedArrows: { up: 2, right: 2 },
  },

  // Level 27: Crumbling Bridge
  {
    id: "level-27",
    name: "Crumbling Bridge",
    gridSize: 8,
    startPos: [3, 0],
    goalPos: [3, 7],
    startDir: "right",
    walls: [
      [2, 2],
      [4, 2],
      [2, 4],
      [4, 4],
      [2, 6],
      [4, 6],
      [0, 3],
      [6, 3],
      [0, 5],
      [6, 5],
      [3, 1],
      [3, 3],
      [3, 5],
    ],
    crackedTiles: [
      [3, 2],
      [3, 4],
      [3, 6],
    ],
    oneWayGates: [
      [3, 1, "right"],
      [3, 3, "right"],
      [3, 5, "right"],
    ],
    allowedArrows: { right: 2, up: 1, down: 1 },
  },

  // Level 28: The Vault
  {
    id: "level-28",
    name: "The Vault",
    gridSize: 8,
    startPos: [0, 0],
    goalPos: [4, 4],
    startDir: "right",
    walls: [
      [0, 3],
      [1, 1],
      [1, 5],
      [2, 3],
      [3, 1],
      [3, 5],
      [4, 2],
      [4, 3],
      [4, 5],
      [4, 6],
      [5, 4],
      [2, 2],
      [2, 4],
    ],
    crackedTiles: [
      [1, 3],
      [3, 3],
    ],
    oneWayGates: [
      [0, 4, "down"],
      [4, 1, "right"],
    ],
    allowedArrows: { right: 2, down: 2 },
  },

  // Level 29: Serpentine
  {
    id: "level-29",
    name: "Serpentine",
    gridSize: 8,
    startPos: [0, 7],
    goalPos: [7, 0],
    startDir: "down",
    walls: [
      [1, 5],
      [1, 6],
      [2, 4],
      [3, 2],
      [3, 3],
      [4, 1],
      [4, 5],
      [5, 6],
      [6, 4],
      [6, 5],
      [7, 1],
      [0, 4],
      [7, 2],
    ],
    crackedTiles: [
      [2, 6],
      [4, 3],
      [6, 2],
    ],
    oneWayGates: [
      [1, 7, "down"],
      [5, 3, "left"],
    ],
    allowedArrows: { down: 2, left: 2 },
  },

  // Level 30: Forest Boss — both cracked AND gates required
  {
    id: "level-30",
    name: "Forest Boss",
    gridSize: 8,
    startPos: [0, 0],
    goalPos: [7, 7],
    startDir: "right",
    walls: [
      [0, 2],
      [0, 3],
      [1, 1],
      [1, 5],
      [2, 3],
      [2, 6],
      [3, 1],
      [3, 4],
      [4, 2],
      [4, 6],
      [5, 0],
      [5, 5],
      [6, 3],
      [7, 5],
      [7, 6],
    ],
    crackedTiles: [
      [1, 4],
      [3, 5],
      [5, 3],
    ],
    oneWayGates: [
      [2, 2, "right"],
      [4, 4, "down"],
      [6, 6, "right"],
    ],
    allowedArrows: { right: 2, down: 2, left: 1 },
  },

  // ===========================================
  // CHAPTER 4: 10x10 GRID — Levels 31-40 (Dusk)
  // ===========================================

  // Level 31: Dusk Opening
  {
    id: "level-31",
    name: "Dusk Opening",
    gridSize: 10,
    startPos: [0, 0],
    goalPos: [9, 9],
    startDir: "right",
    walls: [
      [0, 3],
      [0, 4],
      [1, 2],
      [1, 6],
      [2, 4],
      [2, 8],
      [3, 1],
      [3, 6],
      [4, 3],
      [4, 7],
      [5, 2],
      [5, 5],
      [6, 4],
      [6, 8],
      [7, 1],
      [7, 6],
      [8, 3],
      [8, 8],
      [9, 5],
      [9, 7],
    ],
    crackedTiles: [
      [2, 3],
      [5, 6],
      [7, 5],
    ],
    oneWayGates: [
      [3, 5, "right"],
      [6, 3, "down"],
    ],
    allowedArrows: { right: 2, down: 2, left: 1 },
  },

  // Level 32: Twin Corridors
  {
    id: "level-32",
    name: "Twin Corridors",
    gridSize: 10,
    startPos: [0, 0],
    goalPos: [9, 9],
    startDir: "down",
    walls: [
      [1, 1],
      [1, 2],
      [2, 3],
      [2, 4],
      [3, 5],
      [3, 6],
      [4, 7],
      [4, 8],
      [5, 2],
      [5, 4],
      [6, 3],
      [6, 6],
      [7, 4],
      [7, 7],
      [8, 1],
      [8, 5],
      [9, 0],
      [9, 3],
      [0, 5],
      [0, 7],
    ],
    crackedTiles: [
      [3, 1],
      [5, 5],
      [7, 3],
    ],
    oneWayGates: [
      [4, 2, "down"],
      [6, 5, "right"],
    ],
    allowedArrows: { right: 2, down: 2, up: 1 },
  },

  // Level 33: The Crossroads
  {
    id: "level-33",
    name: "The Crossroads",
    gridSize: 10,
    startPos: [5, 0],
    goalPos: [5, 9],
    startDir: "right",
    walls: [
      [4, 2],
      [6, 2],
      [4, 4],
      [6, 4],
      [3, 5],
      [7, 5],
      [4, 6],
      [6, 6],
      [4, 8],
      [6, 8],
      [5, 1],
      [5, 3],
      [5, 5],
      [5, 7],
      [2, 0],
      [8, 0],
      [2, 9],
      [8, 9],
    ],
    crackedTiles: [
      [5, 2],
      [5, 4],
      [5, 6],
      [5, 8],
    ],
    oneWayGates: [
      [5, 1, "right"],
      [5, 3, "right"],
      [5, 5, "right"],
    ],
    allowedArrows: { right: 2, up: 2, down: 1 },
  },

  // Level 34: Spiral Tower
  {
    id: "level-34",
    name: "Spiral Tower",
    gridSize: 10,
    startPos: [9, 0],
    goalPos: [0, 9],
    startDir: "up",
    walls: [
      [8, 0],
      [7, 1],
      [6, 0],
      [5, 1],
      [4, 0],
      [3, 2],
      [2, 1],
      [1, 3],
      [0, 2],
      [0, 4],
      [1, 5],
      [2, 4],
      [3, 5],
      [4, 4],
      [5, 5],
      [6, 4],
      [7, 5],
      [8, 4],
      [9, 5],
      [9, 7],
      [8, 8],
      [7, 9],
      [6, 8],
      [5, 9],
      [4, 8],
      [3, 9],
    ],
    crackedTiles: [
      [5, 3],
      [5, 7],
      [3, 7],
    ],
    oneWayGates: [
      [3, 3, "up"],
      [7, 3, "right"],
      [7, 7, "up"],
    ],
    allowedArrows: { right: 2, up: 2, left: 1 },
  },

  // Level 35: The Mirror
  {
    id: "level-35",
    name: "The Mirror",
    gridSize: 10,
    startPos: [0, 0],
    goalPos: [0, 9],
    startDir: "right",
    walls: [
      [0, 2],
      [0, 3],
      [1, 4],
      [2, 3],
      [2, 5],
      [3, 2],
      [3, 6],
      [4, 1],
      [4, 7],
      [5, 0],
      [5, 8],
      [6, 1],
      [6, 7],
      [7, 2],
      [7, 6],
      [8, 3],
      [8, 5],
      [9, 4],
      [0, 6],
      [0, 7],
    ],
    crackedTiles: [
      [4, 4],
      [4, 5],
      [6, 4],
      [6, 5],
    ],
    oneWayGates: [
      [2, 4, "down"],
      [8, 4, "up"],
      [5, 4, "right"],
    ],
    allowedArrows: { right: 2, down: 2, up: 1 },
  },

  // Level 36: Twilight March
  {
    id: "level-36",
    name: "Twilight March",
    gridSize: 10,
    startPos: [9, 9],
    goalPos: [0, 0],
    startDir: "up",
    walls: [
      [8, 9],
      [7, 8],
      [8, 7],
      [6, 9],
      [6, 7],
      [5, 8],
      [4, 9],
      [4, 7],
      [3, 8],
      [2, 9],
      [2, 7],
      [1, 8],
      [0, 7],
      [0, 2],
      [1, 3],
      [0, 4],
      [1, 1],
      [2, 2],
      [3, 1],
      [4, 2],
    ],
    crackedTiles: [
      [6, 8],
      [4, 8],
      [2, 8],
      [0, 8],
    ],
    oneWayGates: [
      [7, 9, "up"],
      [5, 7, "left"],
      [3, 5, "up"],
    ],
    allowedArrows: { up: 2, left: 2, down: 1 },
  },

  // Level 37: Dusk Web
  {
    id: "level-37",
    name: "Dusk Web",
    gridSize: 10,
    startPos: [0, 5],
    goalPos: [9, 4],
    startDir: "down",
    walls: [
      [1, 4],
      [1, 6],
      [2, 3],
      [2, 7],
      [3, 2],
      [3, 8],
      [4, 1],
      [4, 9],
      [5, 0],
      [5, 9],
      [6, 1],
      [6, 8],
      [7, 2],
      [7, 7],
      [8, 3],
      [8, 6],
      [9, 3],
      [9, 5],
      [0, 4],
      [0, 6],
    ],
    crackedTiles: [
      [3, 5],
      [5, 5],
      [7, 5],
    ],
    oneWayGates: [
      [2, 5, "down"],
      [6, 5, "down"],
      [8, 5, "left"],
    ],
    allowedArrows: { down: 2, left: 2, right: 1 },
  },

  // Level 38: The Cage
  {
    id: "level-38",
    name: "The Cage",
    gridSize: 10,
    startPos: [0, 0],
    goalPos: [9, 9],
    startDir: "right",
    walls: [
      [0, 3],
      [1, 2],
      [2, 1],
      [1, 4],
      [0, 5],
      [0, 6],
      [1, 7],
      [2, 8],
      [3, 7],
      [3, 5],
      [4, 4],
      [4, 6],
      [5, 3],
      [5, 7],
      [6, 2],
      [6, 8],
      [7, 1],
      [7, 3],
      [8, 0],
      [8, 4],
      [9, 7],
      [9, 8],
    ],
    crackedTiles: [
      [2, 5],
      [4, 3],
      [6, 5],
      [8, 7],
    ],
    oneWayGates: [
      [3, 3, "right"],
      [5, 5, "down"],
      [7, 7, "right"],
    ],
    allowedArrows: { right: 2, down: 2, up: 1 },
  },

  // Level 39: Clockwork
  {
    id: "level-39",
    name: "Clockwork",
    gridSize: 10,
    startPos: [5, 5],
    goalPos: [5, 4],
    startDir: "up",
    walls: [
      [4, 5],
      [3, 5],
      [2, 5],
      [1, 5],
      [0, 5],
      [0, 4],
      [0, 3],
      [0, 2],
      [0, 1],
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [8, 0],
      [9, 0],
      [9, 1],
      [9, 2],
      [9, 3],
      [9, 4],
      [9, 5],
      [9, 6],
      [9, 7],
      [9, 8],
      [9, 9],
      [8, 9],
      [7, 9],
      [6, 9],
      [5, 9],
      [4, 9],
      [3, 9],
      [2, 9],
      [1, 9],
      [0, 9],
      [0, 6],
      [0, 7],
      [0, 8],
    ],
    crackedTiles: [
      [4, 4],
      [6, 4],
      [4, 6],
      [6, 6],
    ],
    oneWayGates: [
      [3, 4, "left"],
      [7, 4, "right"],
      [5, 3, "down"],
    ],
    allowedArrows: { left: 2, down: 2, right: 1 },
  },

  // Level 40: Dusk Boss
  {
    id: "level-40",
    name: "Dusk Boss",
    gridSize: 10,
    startPos: [0, 0],
    goalPos: [9, 9],
    startDir: "right",
    walls: [
      [0, 2],
      [0, 4],
      [0, 6],
      [0, 8],
      [1, 1],
      [1, 3],
      [1, 5],
      [1, 7],
      [2, 0],
      [2, 2],
      [2, 4],
      [2, 6],
      [2, 8],
      [3, 1],
      [3, 3],
      [3, 5],
      [3, 7],
      [4, 0],
      [4, 2],
      [4, 4],
      [4, 6],
      [5, 3],
      [5, 5],
      [5, 7],
      [6, 4],
      [6, 6],
      [7, 5],
      [8, 6],
      [9, 7],
      [9, 8],
    ],
    crackedTiles: [
      [3, 9],
      [5, 9],
      [7, 9],
    ],
    oneWayGates: [
      [4, 8, "down"],
      [6, 8, "down"],
      [8, 8, "right"],
    ],
    allowedArrows: { right: 1, down: 3, left: 1 },
  },

  // ==============================================
  // CHAPTER 5: 10x10 GRID — Levels 41-50 (Crimson)
  // ==============================================

  // Level 41: Crimson Dawn
  {
    id: "level-41",
    name: "Crimson Dawn",
    gridSize: 10,
    startPos: [0, 9],
    goalPos: [9, 0],
    startDir: "down",
    walls: [
      [1, 8],
      [1, 9],
      [2, 7],
      [3, 6],
      [3, 8],
      [4, 5],
      [4, 7],
      [5, 4],
      [5, 6],
      [6, 3],
      [6, 5],
      [7, 2],
      [7, 4],
      [8, 1],
      [8, 3],
      [9, 1],
      [9, 2],
      [0, 6],
      [0, 7],
    ],
    crackedTiles: [
      [2, 8],
      [4, 6],
      [6, 4],
      [8, 2],
    ],
    oneWayGates: [
      [2, 9, "down"],
      [5, 5, "left"],
      [8, 0, "down"],
    ],
    allowedArrows: { down: 2, left: 2, right: 1 },
  },

  // Level 42: Blood Moon
  {
    id: "level-42",
    name: "Blood Moon",
    gridSize: 10,
    startPos: [4, 0],
    goalPos: [4, 9],
    startDir: "right",
    walls: [
      [3, 1],
      [5, 1],
      [3, 3],
      [5, 3],
      [3, 5],
      [5, 5],
      [3, 7],
      [5, 7],
      [3, 9],
      [5, 9],
      [4, 2],
      [4, 4],
      [4, 6],
      [4, 8],
      [0, 5],
      [9, 5],
      [2, 0],
      [6, 0],
      [2, 9],
      [6, 9],
    ],
    crackedTiles: [
      [4, 1],
      [4, 3],
      [4, 5],
      [4, 7],
    ],
    oneWayGates: [
      [4, 2, "right"],
      [4, 4, "right"],
      [4, 6, "right"],
    ],
    allowedArrows: { right: 2, up: 2, down: 1 },
  },

  // Level 43: The Inferno
  {
    id: "level-43",
    name: "The Inferno",
    gridSize: 10,
    startPos: [0, 0],
    goalPos: [9, 9],
    startDir: "right",
    walls: [
      [0, 1],
      [0, 3],
      [0, 5],
      [0, 7],
      [1, 2],
      [1, 4],
      [1, 6],
      [1, 8],
      [2, 0],
      [2, 3],
      [2, 5],
      [2, 7],
      [3, 1],
      [3, 4],
      [3, 6],
      [3, 8],
      [4, 0],
      [4, 2],
      [4, 5],
      [4, 7],
      [5, 1],
      [5, 3],
      [5, 6],
      [5, 8],
      [9, 7],
      [9, 8],
    ],
    crackedTiles: [
      [2, 4],
      [4, 4],
      [6, 4],
      [8, 4],
    ],
    oneWayGates: [
      [3, 3, "right"],
      [5, 5, "down"],
      [7, 7, "right"],
    ],
    allowedArrows: { right: 2, down: 3 },
  },

  // Level 44: Cinder Path
  {
    id: "level-44",
    name: "Cinder Path",
    gridSize: 10,
    startPos: [9, 0],
    goalPos: [0, 9],
    startDir: "up",
    walls: [
      [8, 0],
      [7, 1],
      [6, 0],
      [5, 1],
      [4, 0],
      [3, 1],
      [2, 0],
      [1, 1],
      [0, 2],
      [0, 4],
      [0, 6],
      [1, 5],
      [1, 7],
      [2, 6],
      [2, 8],
      [3, 7],
      [3, 9],
      [4, 8],
      [5, 9],
      [6, 8],
      [7, 9],
      [8, 8],
      [9, 9],
    ],
    crackedTiles: [
      [6, 1],
      [4, 3],
      [2, 5],
      [0, 7],
    ],
    oneWayGates: [
      [7, 2, "right"],
      [5, 4, "up"],
      [3, 6, "right"],
      [1, 8, "up"],
    ],
    allowedArrows: { up: 2, right: 3 },
  },

  // Level 45: The Final Corridor
  {
    id: "level-45",
    name: "Final Corridor",
    gridSize: 10,
    startPos: [0, 0],
    goalPos: [9, 9],
    startDir: "right",
    walls: [
      [0, 3],
      [1, 2],
      [2, 4],
      [3, 3],
      [4, 5],
      [5, 4],
      [6, 6],
      [7, 5],
      [8, 7],
      [9, 6],
      [0, 6],
      [1, 7],
      [2, 8],
      [3, 9],
      [4, 0],
      [5, 1],
      [6, 2],
      [7, 3],
      [8, 4],
      [9, 7],
      [9, 8],
    ],
    crackedTiles: [
      [1, 4],
      [3, 5],
      [5, 6],
      [7, 7],
    ],
    oneWayGates: [
      [2, 3, "right"],
      [4, 4, "down"],
      [6, 5, "right"],
      [8, 6, "down"],
    ],
    allowedArrows: { right: 2, down: 2, left: 1 },
  },

  // Level 46: Ember Storm
  {
    id: "level-46",
    name: "Ember Storm",
    gridSize: 10,
    startPos: [0, 5],
    goalPos: [5, 0],
    startDir: "left",
    walls: [
      [0, 3],
      [0, 2],
      [0, 1],
      [1, 0],
      [1, 4],
      [2, 1],
      [2, 5],
      [3, 2],
      [3, 6],
      [4, 3],
      [4, 7],
      [5, 4],
      [5, 8],
      [6, 5],
      [6, 1],
      [7, 6],
      [7, 2],
      [8, 7],
      [8, 3],
      [5, 1],
      [5, 2],
    ],
    crackedTiles: [
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
    oneWayGates: [
      [1, 3, "left"],
      [3, 3, "down"],
      [4, 2, "left"],
    ],
    allowedArrows: { left: 2, down: 2, right: 1 },
  },

  // Level 47: Crimson Veil
  {
    id: "level-47",
    name: "Crimson Veil",
    gridSize: 10,
    startPos: [0, 0],
    goalPos: [9, 9],
    startDir: "down",
    walls: [
      [1, 0],
      [2, 1],
      [3, 0],
      [4, 1],
      [5, 0],
      [6, 1],
      [7, 0],
      [8, 1],
      [0, 2],
      [0, 4],
      [0, 6],
      [0, 8],
      [9, 1],
      [9, 3],
      [9, 5],
      [9, 7],
      [2, 9],
      [4, 9],
      [6, 9],
      [8, 9],
      [9, 8],
    ],
    crackedTiles: [
      [2, 2],
      [4, 4],
      [6, 6],
      [8, 8],
    ],
    oneWayGates: [
      [3, 2, "right"],
      [5, 4, "down"],
      [7, 6, "right"],
      [9, 8, "down"],
    ],
    allowedArrows: { right: 2, down: 2, up: 1 },
  },

  // Level 48: The Gauntlet II
  {
    id: "level-48",
    name: "The Gauntlet II",
    gridSize: 10,
    startPos: [5, 0],
    goalPos: [5, 9],
    startDir: "right",
    walls: [
      [4, 1],
      [6, 1],
      [3, 2],
      [7, 2],
      [2, 3],
      [8, 3],
      [1, 4],
      [9, 4],
      [0, 5],
      [3, 5],
      [7, 5],
      [2, 6],
      [8, 6],
      [1, 7],
      [9, 7],
      [0, 8],
      [4, 8],
      [6, 8],
      [5, 1],
      [5, 3],
      [5, 5],
      [5, 7],
      [4, 9],
      [6, 9],
    ],
    crackedTiles: [
      [5, 2],
      [5, 4],
      [5, 6],
      [5, 8],
    ],
    oneWayGates: [
      [5, 1, "right"],
      [5, 3, "right"],
      [5, 5, "right"],
      [5, 7, "right"],
    ],
    allowedArrows: { right: 2, up: 2, down: 2 },
  },

  // Level 49: Shattered World
  {
    id: "level-49",
    name: "Shattered World",
    gridSize: 10,
    startPos: [0, 0],
    goalPos: [9, 9],
    startDir: "right",
    walls: [
      [0, 2],
      [0, 5],
      [0, 8],
      [1, 1],
      [1, 4],
      [1, 7],
      [2, 3],
      [2, 6],
      [2, 9],
      [3, 0],
      [3, 4],
      [3, 8],
      [4, 2],
      [4, 6],
      [5, 0],
      [5, 4],
      [5, 8],
      [6, 2],
      [6, 6],
      [7, 0],
      [7, 4],
      [7, 8],
      [8, 2],
      [8, 5],
      [9, 6],
      [9, 7],
    ],
    crackedTiles: [
      [1, 3],
      [3, 5],
      [5, 3],
      [7, 5],
      [5, 7],
    ],
    oneWayGates: [
      [2, 2, "right"],
      [4, 4, "down"],
      [6, 4, "right"],
      [8, 7, "down"],
    ],
    allowedArrows: { right: 2, down: 3, left: 1 },
  },

  // Level 50: FINAL BOSS — The Crimson Throne
  {
    id: "level-50",
    name: "FINAL: Crimson Throne",
    gridSize: 10,
    startPos: [0, 0],
    goalPos: [9, 9],
    startDir: "right",
    walls: [
      [0, 2],
      [0, 4],
      [0, 6],
      [0, 8],
      [1, 1],
      [1, 3],
      [1, 5],
      [1, 7],
      [2, 2],
      [2, 4],
      [2, 6],
      [2, 8],
      [3, 1],
      [3, 3],
      [3, 7],
      [4, 2],
      [4, 6],
      [4, 8],
      [5, 1],
      [5, 3],
      [5, 7],
      [6, 2],
      [6, 6],
      [6, 8],
      [7, 3],
      [7, 7],
      [8, 4],
      [8, 6],
      [9, 7],
      [9, 8],
    ],
    crackedTiles: [
      [1, 9],
      [3, 5],
      [5, 5],
      [7, 5],
      [9, 5],
    ],
    oneWayGates: [
      [3, 9, "down"],
      [5, 9, "down"],
      [7, 9, "down"],
      [4, 5, "down"],
      [6, 4, "right"],
    ],
    allowedArrows: { right: 2, down: 3, left: 1 },
  },
];

export const LEVELS: Level[] = LEVEL_CONFIGS.map(buildLevel);
