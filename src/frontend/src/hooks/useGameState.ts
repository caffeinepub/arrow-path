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

const MOVE_INTERVAL_MS = 380;
const MAX_STEPS = 200; // prevent infinite loops

function cloneGrid(grid: TileType[][]): TileType[][] {
  return grid.map((row) => [...row]);
}

function findStart(grid: TileType[][]): BallPos | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
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
  };
}

export function useGameState(
  onLevelComplete?: (levelId: string, moves: number) => void,
) {
  const [state, setState] = useState<GameState>(() => buildInitialState(0));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepsRef = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopInterval();
  }, [stopInterval]);

  const getNextPos = useCallback((pos: BallPos, dir: Direction): BallPos => {
    const deltas: Record<Direction, [number, number]> = {
      up: [-1, 0],
      down: [1, 0],
      left: [0, -1],
      right: [0, 1],
    };
    const [dr, dc] = deltas[dir];
    return { row: pos.row + dr, col: pos.col + dc };
  }, []);

  const tickBall = useCallback(() => {
    const current = stateRef.current;
    if (current.gamePhase !== "playing" || !current.ballPos || !current.ballDir)
      return;

    stepsRef.current += 1;
    if (stepsRef.current > MAX_STEPS) {
      // Infinite loop protection - treat as fail
      stopInterval();
      setState((prev) => ({ ...prev, gamePhase: "failed", ballFail: true }));
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          ballFail: false,
          gamePhase: "editing",
          ballPos: findStart(prev.grid),
          ballDir: LEVELS[prev.currentLevelIndex].startDir,
        }));
      }, 1000);
      return;
    }

    const nextPos = getNextPos(current.ballPos, current.ballDir);

    // Out of bounds
    if (
      nextPos.row < 0 ||
      nextPos.row >= 8 ||
      nextPos.col < 0 ||
      nextPos.col >= 8
    ) {
      stopInterval();
      setState((prev) => ({ ...prev, gamePhase: "failed", ballFail: true }));
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          ballFail: false,
          gamePhase: "editing",
          ballPos: findStart(prev.grid),
          ballDir: LEVELS[prev.currentLevelIndex].startDir,
        }));
      }, 1000);
      return;
    }

    const nextTile = current.grid[nextPos.row][nextPos.col];

    if (nextTile === "wall") {
      // Hit a wall - fail
      stopInterval();
      setState((prev) => ({ ...prev, gamePhase: "failed", ballFail: true }));
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          ballFail: false,
          gamePhase: "editing",
          ballPos: findStart(prev.grid),
          ballDir: LEVELS[prev.currentLevelIndex].startDir,
        }));
      }, 1000);
      return;
    }

    if (nextTile === "goal") {
      stopInterval();
      setState((prev) => ({
        ...prev,
        ballPos: nextPos,
        gamePhase: "won",
        moveCount: prev.moveCount + 1,
      }));
      if (onLevelComplete) {
        const levelId = LEVELS[current.currentLevelIndex].id;
        onLevelComplete(levelId, current.moveCount + 1);
      }
      return;
    }

    // Determine new direction based on tile
    let newDir = current.ballDir;
    if (nextTile === "arrow_up") newDir = "up";
    else if (nextTile === "arrow_down") newDir = "down";
    else if (nextTile === "arrow_left") newDir = "left";
    else if (nextTile === "arrow_right") newDir = "right";

    setState((prev) => ({
      ...prev,
      ballPos: nextPos,
      ballDir: newDir,
      moveCount: prev.moveCount + 1,
    }));
  }, [getNextPos, stopInterval, onLevelComplete]);

  const play = useCallback(() => {
    if (stateRef.current.gamePhase !== "editing") return;
    stepsRef.current = 0;
    setState((prev) => ({ ...prev, gamePhase: "playing", moveCount: 0 }));
    intervalRef.current = setInterval(tickBall, MOVE_INTERVAL_MS);
  }, [tickBall]);

  const reset = useCallback(() => {
    stopInterval();
    setState((prev) => {
      const level = LEVELS[prev.currentLevelIndex];
      const grid = cloneGrid(level.grid);
      const startPos = findStart(grid);
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
      };
    });
  }, [stopInterval]);

  const nextLevel = useCallback(() => {
    stopInterval();
    setState((prev) => {
      const nextIdx = Math.min(prev.currentLevelIndex + 1, LEVELS.length - 1);
      return buildInitialState(nextIdx);
    });
  }, [stopInterval]);

  const goToLevel = useCallback(
    (idx: number) => {
      stopInterval();
      setState(buildInitialState(idx));
    },
    [stopInterval],
  );

  const placeArrow = useCallback(
    (row: number, col: number, direction: ArrowDir) => {
      setState((prev) => {
        if (prev.gamePhase !== "editing") return prev;
        const tile = prev.grid[row][col];
        // Only allow placing on empty, start tiles, and already-placed arrows
        if (tile === "wall" || tile === "goal") return prev;

        const key = `${row},${col}`;
        const newPlacedArrows = new Map(prev.placedArrows);
        const newInventory = prev.inventory.map((item) => ({ ...item }));
        const newGrid = cloneGrid(prev.grid);

        // If cell has an existing placed arrow, return it to inventory
        const existingDir = newPlacedArrows.get(key);
        if (existingDir) {
          const existingItem = newInventory.find(
            (i) => i.direction === existingDir,
          );
          if (existingItem) existingItem.count += 1;
        }

        // Decrement the new arrow from inventory
        const inventoryItem = newInventory.find(
          (i) => i.direction === direction,
        );
        if (!inventoryItem || inventoryItem.count <= 0) return prev;
        inventoryItem.count -= 1;

        // Place the arrow
        newPlacedArrows.set(key, direction);
        newGrid[row][col] = `arrow_${direction}` as TileType;

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
      // Restore original tile from level definition
      newGrid[row][col] = level.grid[row][col];

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
