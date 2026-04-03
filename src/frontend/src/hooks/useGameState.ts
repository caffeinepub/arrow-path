import { useCallback, useEffect, useRef, useState } from "react";
import { LEVELS } from "../data/levels";
import type {
  ArrowDir,
  BallPos,
  Direction,
  GamePhase,
  GameState,
  InventoryItem,
  TileType,
} from "../types/game";

const MOVE_INTERVAL_MS = 220;
const MAX_STEPS = 300;

function cloneGrid(grid: TileType[][]): TileType[][] {
  return grid.map((row) => [...row]);
}

function findStart(grid: TileType[][]): BallPos | null {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === "start") return { row: r, col: c };
    }
  }
  return null;
}

function buildInitialInventory(level: (typeof LEVELS)[0]): InventoryItem[] {
  const ALL_DIRS: ArrowDir[] = ["up", "down", "left", "right"];
  return ALL_DIRS.map((dir) => {
    const found = level.inventory.find((i) => i.direction === dir);
    return {
      direction: dir,
      count: found ? found.count : 0,
      total: found ? found.count : 0,
    };
  }).filter((i) => i.total > 0);
}

function buildInitialState(levelIndex: number): GameState {
  const level = LEVELS[levelIndex];
  const grid = cloneGrid(level.grid);
  const startPos = findStart(grid);
  return {
    currentLevelIndex: levelIndex,
    grid,
    inventory: buildInitialInventory(level),
    placedArrows: new Map(),
    gamePhase: "editing",
    ballPos: startPos,
    ballDir: level.startDir,
    moveCount: 0,
    ballFail: false,
    brokenTiles: new Set<string>(),
  };
}

export function useGameState(
  onLevelComplete?: (
    levelId: string,
    moves: number,
    arrowsUsed: number,
    par: number,
  ) => void,
) {
  const [state, setState] = useState<GameState>(() => buildInitialState(0));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepsRef = useRef(0);

  // Authoritative refs for ball simulation
  const ballPosRef = useRef<BallPos | null>(state.ballPos);
  const ballDirRef = useRef<Direction | null>(state.ballDir);
  const gridRef = useRef<TileType[][]>(state.grid);
  const levelIndexRef = useRef<number>(state.currentLevelIndex);
  const gamePhaseRef = useRef<GamePhase>(state.gamePhase);
  const brokenTilesRef = useRef<Set<string>>(new Set<string>());

  // Keep refs in sync with state on every render
  ballPosRef.current = state.ballPos;
  ballDirRef.current = state.ballDir;
  gridRef.current = state.grid;
  levelIndexRef.current = state.currentLevelIndex;
  gamePhaseRef.current = state.gamePhase;

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopInterval();
  }, [stopInterval]);

  const instantFail = useCallback(() => {
    stopInterval();
    const level = LEVELS[levelIndexRef.current];
    const startPos = findStart(level.grid);

    ballPosRef.current = startPos;
    ballDirRef.current = level.startDir;
    gamePhaseRef.current = "editing";
    brokenTilesRef.current = new Set<string>();

    // Keep placed arrows, just reset ball + broken tiles
    setState((prev) => ({
      ...prev,
      gamePhase: "editing",
      ballPos: startPos,
      ballDir: level.startDir,
      ballFail: true,
      brokenTiles: new Set<string>(),
    }));

    // Clear ballFail after animation — short delay just for visual
    setTimeout(() => {
      setState((prev) => ({ ...prev, ballFail: false }));
    }, 400);
  }, [stopInterval]);

  const tickBall = useCallback(() => {
    const pos = ballPosRef.current;
    const dir = ballDirRef.current;
    const grid = gridRef.current;
    const phase = gamePhaseRef.current;
    const levelIndex = levelIndexRef.current;

    if (phase !== "playing" || !pos || !dir) return;

    stepsRef.current += 1;
    if (stepsRef.current > MAX_STEPS) {
      instantFail();
      return;
    }

    const deltas: Record<Direction, [number, number]> = {
      up: [-1, 0],
      down: [1, 0],
      left: [0, -1],
      right: [0, 1],
    };
    const [dr, dc] = deltas[dir];
    const nextPos: BallPos = { row: pos.row + dr, col: pos.col + dc };

    // Out of bounds → instant fail
    if (
      nextPos.row < 0 ||
      nextPos.row >= grid.length ||
      nextPos.col < 0 ||
      nextPos.col >= (grid[0]?.length ?? 8)
    ) {
      instantFail();
      return;
    }

    const nextTile = grid[nextPos.row][nextPos.col];

    // Wall → instant fail
    if (nextTile === "wall") {
      instantFail();
      return;
    }

    // Cracked tile logic
    if (nextTile === "cracked") {
      const key = `${nextPos.row},${nextPos.col}`;
      if (brokenTilesRef.current.has(key)) {
        // Already broken from this run — fail
        instantFail();
        return;
      }
      // First visit: mark broken, update grid visually, continue movement
      brokenTilesRef.current.add(key);
      const newGrid = cloneGrid(grid);
      newGrid[nextPos.row][nextPos.col] = "cracked_broken";
      gridRef.current = newGrid;

      ballPosRef.current = nextPos;
      setState((prev) => ({
        ...prev,
        ballPos: nextPos,
        grid: newGrid,
        moveCount: prev.moveCount + 1,
      }));
      return;
    }

    if (nextTile === "cracked_broken") {
      instantFail();
      return;
    }

    // One-way gate logic
    if (nextTile.startsWith("gate_")) {
      const gateDir = nextTile.replace("gate_", "") as Direction;
      if (dir !== gateDir) {
        instantFail();
        return;
      }
      // Passes through
      ballPosRef.current = nextPos;
      setState((prev) => ({
        ...prev,
        ballPos: nextPos,
        moveCount: prev.moveCount + 1,
      }));
      return;
    }

    // Goal → win
    if (nextTile === "goal") {
      stopInterval();
      gamePhaseRef.current = "won";
      ballPosRef.current = nextPos;
      setState((prev) => {
        const arrowsUsed = prev.placedArrows.size;
        if (onLevelComplete) {
          onLevelComplete(
            LEVELS[levelIndex].id,
            stepsRef.current,
            arrowsUsed,
            LEVELS[levelIndex].par,
          );
        }
        return {
          ...prev,
          ballPos: nextPos,
          gamePhase: "won",
          moveCount: prev.moveCount + 1,
        };
      });
      return;
    }

    // Arrow tile — change direction
    let newDir: Direction = dir;
    if (nextTile === "arrow_up") newDir = "up";
    else if (nextTile === "arrow_down") newDir = "down";
    else if (nextTile === "arrow_left") newDir = "left";
    else if (nextTile === "arrow_right") newDir = "right";

    ballPosRef.current = nextPos;
    ballDirRef.current = newDir;

    setState((prev) => ({
      ...prev,
      ballPos: nextPos,
      ballDir: newDir,
      moveCount: prev.moveCount + 1,
    }));
  }, [stopInterval, instantFail, onLevelComplete]);

  const play = useCallback(() => {
    if (gamePhaseRef.current !== "editing") return;
    stepsRef.current = 0;
    gamePhaseRef.current = "playing";
    setState((prev) => ({ ...prev, gamePhase: "playing", moveCount: 0 }));
    intervalRef.current = setInterval(tickBall, MOVE_INTERVAL_MS);
  }, [tickBall]);

  const reset = useCallback(() => {
    stopInterval();
    brokenTilesRef.current = new Set<string>();
    setState((prev) => {
      const level = LEVELS[prev.currentLevelIndex];
      const grid = cloneGrid(level.grid);
      const startPos = findStart(grid);
      ballPosRef.current = startPos;
      ballDirRef.current = level.startDir;
      gridRef.current = grid;
      gamePhaseRef.current = "editing";
      return {
        ...prev,
        grid,
        inventory: buildInitialInventory(level),
        placedArrows: new Map(),
        gamePhase: "editing",
        ballPos: startPos,
        ballDir: level.startDir,
        moveCount: 0,
        ballFail: false,
        brokenTiles: new Set<string>(),
      };
    });
  }, [stopInterval]);

  const nextLevel = useCallback(() => {
    stopInterval();
    brokenTilesRef.current = new Set<string>();
    setState((prev) => {
      const nextIdx = Math.min(prev.currentLevelIndex + 1, LEVELS.length - 1);
      const newState = buildInitialState(nextIdx);
      ballPosRef.current = newState.ballPos;
      ballDirRef.current = newState.ballDir;
      gridRef.current = newState.grid;
      levelIndexRef.current = nextIdx;
      gamePhaseRef.current = "editing";
      return newState;
    });
  }, [stopInterval]);

  const goToLevel = useCallback(
    (idx: number) => {
      stopInterval();
      brokenTilesRef.current = new Set<string>();
      const newState = buildInitialState(idx);
      ballPosRef.current = newState.ballPos;
      ballDirRef.current = newState.ballDir;
      gridRef.current = newState.grid;
      levelIndexRef.current = idx;
      gamePhaseRef.current = "editing";
      setState(newState);
    },
    [stopInterval],
  );

  const placeArrow = useCallback(
    (row: number, col: number, direction: ArrowDir) => {
      setState((prev) => {
        if (prev.gamePhase !== "editing") return prev;
        const tile = prev.grid[row][col];
        // Only allow placing on empty or start tiles, and already-placed arrows
        // Not on walls, goals, cracked tiles, or gates
        if (
          tile === "wall" ||
          tile === "goal" ||
          tile === "cracked" ||
          tile === "cracked_broken" ||
          tile.startsWith("gate_")
        )
          return prev;

        const key = `${row},${col}`;
        const newPlacedArrows = new Map(prev.placedArrows);
        const newInventory = prev.inventory.map((item) => ({ ...item }));
        const newGrid = cloneGrid(prev.grid);

        const existingDir = newPlacedArrows.get(key);
        if (existingDir) {
          const existingItem = newInventory.find(
            (i) => i.direction === existingDir,
          );
          if (existingItem) existingItem.count += 1;
        }

        const inventoryItem = newInventory.find(
          (i) => i.direction === direction,
        );
        if (!inventoryItem || inventoryItem.count <= 0) return prev;
        inventoryItem.count -= 1;

        newPlacedArrows.set(key, direction);
        newGrid[row][col] = `arrow_${direction}` as TileType;

        gridRef.current = newGrid;

        return {
          ...prev,
          grid: newGrid,
          inventory: newInventory,
          placedArrows: newPlacedArrows,
        };
      });
    },
    [],
  );

  const removeArrow = useCallback((row: number, col: number) => {
    setState((prev) => {
      if (prev.gamePhase !== "editing") return prev;
      const key = `${row},${col}`;
      const existingDir = prev.placedArrows.get(key);
      if (!existingDir) return prev;

      const newPlacedArrows = new Map(prev.placedArrows);
      newPlacedArrows.delete(key);

      const newInventory = prev.inventory.map((item) => ({ ...item }));
      const inventoryItem = newInventory.find(
        (i) => i.direction === existingDir,
      );
      if (inventoryItem) inventoryItem.count += 1;

      const level = LEVELS[prev.currentLevelIndex];
      const newGrid = cloneGrid(prev.grid);
      newGrid[row][col] = level.grid[row][col];

      gridRef.current = newGrid;

      return {
        ...prev,
        grid: newGrid,
        inventory: newInventory,
        placedArrows: newPlacedArrows,
      };
    });
  }, []);

  return {
    state,
    play,
    reset,
    nextLevel,
    goToLevel,
    placeArrow,
    removeArrow,
  };
}
