type Dir = "up" | "down" | "left" | "right";

interface LevelConfigForValidation {
  id: string;
  gridSize: number;
  startPos: [number, number];
  goalPos: [number, number];
  startDir: Dir;
  walls: [number, number][];
  crackedTiles?: [number, number][];
  oneWayGates?: [number, number, Dir][];
  allowedArrows: Partial<Record<Dir, number>>;
}

const DELTAS: Record<Dir, [number, number]> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

const DIR_INDEX: Record<Dir, number> = { up: 0, down: 1, left: 2, right: 3 };
const ALL_DIRS: Dir[] = ["up", "down", "left", "right"];

/**
 * BFS-based level validator.
 *
 * State: (row, col, dir, arrowsRemaining_per_dir[], brokenCrackedSet)
 *
 * For performance, arrows remaining are encoded as a small tuple of counts (max 9 per dir).
 * Cracked tiles are tracked as a bitmask over the list of cracked tile indices.
 *
 * The ball's path is deterministic given placed arrows.  We simulate lazily:
 * when the ball lands on an empty cell we branch:
 *   (a) pass through with current direction
 *   (b) for each direction that still has arrows remaining, place that arrow here
 *
 * Hard cap: 50,000 states to avoid hanging the browser.
 */
export function validateLevel(cfg: LevelConfigForValidation): {
  valid: boolean;
  reason: string;
} {
  const {
    gridSize,
    startPos,
    goalPos,
    startDir,
    walls,
    crackedTiles = [],
    oneWayGates = [],
    allowedArrows,
  } = cfg;

  // Build wall/gate lookup sets
  const wallSet = new Set<string>(walls.map(([r, c]) => `${r},${c}`));
  const crackedSet = new Set<string>(crackedTiles.map(([r, c]) => `${r},${c}`));
  const gateMap = new Map<string, Dir>();
  for (const [r, c, d] of oneWayGates) gateMap.set(`${r},${c}`, d);

  const goalKey = `${goalPos[0]},${goalPos[1]}`;

  // Arrow counts available per direction
  const initCounts: [number, number, number, number] = [
    allowedArrows.up ?? 0,
    allowedArrows.down ?? 0,
    allowedArrows.left ?? 0,
    allowedArrows.right ?? 0,
  ];

  const totalArrows = initCounts.reduce((s, n) => s + n, 0);
  if (totalArrows === 0) {
    // No arrows — just check if ball reaches goal from start without any
    const reachable = simulateDirect(
      startPos[0],
      startPos[1],
      startDir,
      wallSet,
      crackedSet,
      gateMap,
      goalKey,
      gridSize,
      new Set(),
    );
    return reachable
      ? { valid: true, reason: "" }
      : { valid: false, reason: "Ball cannot reach goal without any arrows" };
  }

  // Encode counts as a single number (base-10 packed, each digit 0-9)
  function encodeCounts(c: [number, number, number, number]): number {
    return c[0] * 1000 + c[1] * 100 + c[2] * 10 + c[3];
  }

  // State: row * G + col, dir index, arrow counts encoded, broken cracked bitmask
  // We represent state as a string key
  type State = {
    row: number;
    col: number;
    dir: Dir;
    counts: [number, number, number, number];
    brokenMask: number; // bitmask over crackedTiles array indices
    placedArrows: Map<string, Dir>; // placed arrows so far in this branch
  };

  const visited = new Set<string>();
  const queue: State[] = [
    {
      row: startPos[0],
      col: startPos[1],
      dir: startDir,
      counts: [...initCounts] as [number, number, number, number],
      brokenMask: 0,
      placedArrows: new Map(),
    },
  ];

  let iterations = 0;
  const MAX_ITER = 50000;

  while (queue.length > 0) {
    if (iterations++ > MAX_ITER) {
      return { valid: true, reason: "Hit iteration cap — assuming solvable" };
    }

    const state = queue.shift()!;
    const { row, col, dir, counts, brokenMask, placedArrows } = state;

    // Move ball one step
    const [dr, dc] = DELTAS[dir];
    const nr = row + dr;
    const nc = col + dc;

    // Out of bounds → dead end
    if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) continue;

    const cellKey = `${nr},${nc}`;

    // Wall collision → dead end
    if (wallSet.has(cellKey)) continue;

    // Goal → success!
    if (cellKey === goalKey) return { valid: true, reason: "" };

    // Cracked tile handling
    const crackedIdx = crackedTiles.findIndex(([r, c]) => r === nr && c === nc);
    let newBrokenMask = brokenMask;
    if (crackedIdx >= 0) {
      const bit = 1 << crackedIdx;
      if (brokenMask & bit) continue; // already broken → fail
      newBrokenMask = brokenMask | bit;
    }

    // One-way gate handling
    if (gateMap.has(cellKey)) {
      const gateDir = gateMap.get(cellKey)!;
      if (dir !== gateDir) continue; // wrong direction → fail
    }

    // Determine tile at (nr, nc)
    // Check if we placed an arrow here
    const existingArrow = placedArrows.get(cellKey);
    if (existingArrow) {
      // Ball hits our placed arrow — change direction, continue
      const newDir = existingArrow;
      const stateKey = `${nr},${nc},${newDir},${encodeCounts(counts)},${newBrokenMask}`;
      if (!visited.has(stateKey)) {
        visited.add(stateKey);
        queue.push({
          row: nr,
          col: nc,
          dir: newDir,
          counts,
          brokenMask: newBrokenMask,
          placedArrows,
        });
      }
      continue;
    }

    // Empty cell — branch: pass through OR place an arrow
    // Option A: pass through (no arrow placed here)
    const passThroughKey = `${nr},${nc},${dir},${encodeCounts(counts)},${newBrokenMask}`;
    if (!visited.has(passThroughKey)) {
      visited.add(passThroughKey);
      queue.push({
        row: nr,
        col: nc,
        dir,
        counts,
        brokenMask: newBrokenMask,
        placedArrows,
      });
    }

    // Option B: place each available arrow direction here
    for (const d of ALL_DIRS) {
      const di = DIR_INDEX[d];
      if (counts[di] <= 0) continue;

      const newCounts = [...counts] as [number, number, number, number];
      newCounts[di] -= 1;

      const newDir = d; // ball immediately changes direction
      const stateKey = `${nr},${nc},${newDir},${encodeCounts(newCounts)},${newBrokenMask}`;
      if (!visited.has(stateKey)) {
        visited.add(stateKey);
        const newPlaced = new Map(placedArrows);
        newPlaced.set(cellKey, d);
        queue.push({
          row: nr,
          col: nc,
          dir: newDir,
          counts: newCounts,
          brokenMask: newBrokenMask,
          placedArrows: newPlaced,
        });
      }
    }
  }

  return {
    valid: false,
    reason: "No valid arrow placement found that reaches the goal",
  };
}

/** Simulate the ball with no user-placed arrows, just the fixed tile layout */
function simulateDirect(
  startRow: number,
  startCol: number,
  dir: Dir,
  wallSet: Set<string>,
  crackedSet: Set<string>,
  gateMap: Map<string, Dir>,
  goalKey: string,
  gridSize: number,
  brokenSet: Set<string>,
  maxSteps = 500,
): boolean {
  let row = startRow;
  let col = startCol;
  let curDir = dir;
  const broken = new Set(brokenSet);

  for (let step = 0; step < maxSteps; step++) {
    const [dr, dc] = DELTAS[curDir];
    row += dr;
    col += dc;

    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return false;
    const key = `${row},${col}`;
    if (wallSet.has(key)) return false;
    if (key === goalKey) return true;
    if (crackedSet.has(key)) {
      if (broken.has(key)) return false;
      broken.add(key);
    }
    if (gateMap.has(key)) {
      if (curDir !== gateMap.get(key)) return false;
    }
  }
  return false;
}

/**
 * Check if any walls violate the "clear buffer" rule:
 * - No wall in the same column as startPos (startPos[1])
 * - No wall in the same row as goalPos (goalPos[0])
 * Only warns about walls within 2 cells of the start/goal to avoid false positives.
 */
export function checkClearBuffer(cfg: LevelConfigForValidation): string[] {
  const warnings: string[] = [];
  const [startRow, startCol] = cfg.startPos;
  const [goalRow, goalCol] = cfg.goalPos;

  for (const [r, c] of cfg.walls) {
    // Wall in same column as start AND within 2 rows of start
    if (c === startCol && Math.abs(r - startRow) <= 2) {
      warnings.push(
        `Wall [${r},${c}] is in the same column as start [${startRow},${startCol}] and within 2 rows — may block first move`,
      );
    }
    // Wall in same row as goal AND within 2 cols of goal
    if (r === goalRow && Math.abs(c - goalCol) <= 2) {
      warnings.push(
        `Wall [${r},${c}] is in the same row as goal [${goalRow},${goalCol}] and within 2 cols — may block final approach`,
      );
    }
  }

  return warnings;
}
