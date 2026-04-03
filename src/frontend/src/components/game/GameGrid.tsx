import { type Variants, motion } from "motion/react";
import React from "react";
import type { ArrowDir, BallPos, GamePhase, TileType } from "../../types/game";
import { GridCell } from "./GridCell";

const ARROW_SYMBOLS: Record<ArrowDir, string> = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

interface GameGridProps {
  grid: TileType[][];
  ballPos: BallPos | null;
  gamePhase: GamePhase;
  ballFail: boolean;
  levelIndex: number;
  selectedArrow: ArrowDir | null;
  onPlace: (row: number, col: number) => void;
  onRemoveArrow: (row: number, col: number) => void;
  brokenTiles?: Set<string>;
  hintTile?: { row: number; col: number; dir: ArrowDir } | null;
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.012 } },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.18, ease: "easeOut" as const },
  },
};

const TRAIL_KEYS = ["trail-ghost-1", "trail-ghost-2"];

// CSS transition duration (sync with MOVE_INTERVAL_MS in useGameState)
const MOVE_INTERVAL_MS_CSS = 0.2;

export function GameGrid({
  grid,
  ballPos,
  gamePhase,
  ballFail,
  levelIndex,
  selectedArrow,
  onPlace,
  onRemoveArrow,
  hintTile,
}: GameGridProps) {
  const isEditing = gamePhase === "editing";

  const GRID_ROWS = grid.length;
  const GRID_COLS = grid[0]?.length ?? 8;

  // Dynamic cell size based on grid dimensions
  const CELL_SIZE = GRID_ROWS <= 6 ? 72 : GRID_ROWS <= 8 ? 60 : 52;

  const cellCoords = React.useMemo(() => {
    const coords: { row: number; col: number; key: string }[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        coords.push({ row: r, col: c, key: `r${r}c${c}` });
      }
    }
    return coords;
  }, [GRID_ROWS, GRID_COLS]);

  // Track last 2 ball positions for blur trail
  const [trail, setTrail] = React.useState<Array<{ row: number; col: number }>>(
    [],
  );

  React.useEffect(() => {
    if (ballPos) {
      setTrail((prev) => [ballPos, ...prev].slice(0, 3));
    } else {
      setTrail([]);
    }
  }, [ballPos]);

  const transitionDuration = `${MOVE_INTERVAL_MS_CSS}s`;

  const ballStyle: React.CSSProperties = ballPos
    ? {
        top: `calc(${ballPos.row} * var(--cell-size) + var(--cell-size) / 2 - 16px)`,
        left: `calc(${ballPos.col} * var(--cell-size) + var(--cell-size) / 2 - 16px)`,
        transition: `top ${transitionDuration} cubic-bezier(0.4, 0, 0.2, 1), left ${transitionDuration} cubic-bezier(0.4, 0, 0.2, 1)`,
      }
    : { display: "none" };

  const trailGhosts = trail.slice(1);

  return (
    <div
      className="relative w-full flex flex-col items-center"
      data-ocid="game.canvas_target"
    >
      <motion.div
        key={`grid-${levelIndex}-${GRID_ROWS}x${GRID_COLS}-${gamePhase === "editing" ? "edit" : "play"}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative rounded-lg overflow-hidden border border-border/60"
        style={
          {
            "--cell-size": `${CELL_SIZE}px`,
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_COLS}, var(--cell-size))`,
            gridTemplateRows: `repeat(${GRID_ROWS}, var(--cell-size))`,
            boxShadow:
              "0 0 0 1px oklch(0.38 0.03 255 / 0.4), 0 8px 40px oklch(0 0 0 / 0.5)",
          } as React.CSSProperties
        }
      >
        {cellCoords.map(({ row, col, key }) => (
          <motion.div key={key} variants={tileVariants}>
            <GridCell
              row={row}
              col={col}
              tile={grid[row]?.[col] ?? "empty"}
              isEditing={isEditing}
              selectedArrow={selectedArrow}
              onPlace={onPlace}
              onRemove={onRemoveArrow}
            />
          </motion.div>
        ))}

        {TRAIL_KEYS.map((trailKey, i) => {
          const pos = trailGhosts[i];
          if (!pos) return null;
          return (
            <div
              key={trailKey}
              className="absolute rounded-full pointer-events-none z-10"
              style={{
                top: `calc(${pos.row} * var(--cell-size) + var(--cell-size) / 2 - ${10 - i * 2}px)`,
                left: `calc(${pos.col} * var(--cell-size) + var(--cell-size) / 2 - ${10 - i * 2}px)`,
                width: `${20 - i * 4}px`,
                height: `${20 - i * 4}px`,
                opacity: 0.4 - i * 0.15,
                filter: `blur(${(i + 1) * 3}px)`,
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0.3))",
                transition: `top ${transitionDuration} cubic-bezier(0.4,0,0.2,1), left ${transitionDuration} cubic-bezier(0.4,0,0.2,1)`,
              }}
            />
          );
        })}

        {ballPos && (
          <div
            className={`
              absolute z-20 w-8 h-8 rounded-full pointer-events-none
              ${ballFail ? "animate-ball-fail" : "neon-glow-ball"}
            `}
            style={{
              ...ballStyle,
              background: ballFail
                ? "radial-gradient(circle at 35% 35%, #ff6b6b, #cc0000)"
                : "radial-gradient(circle at 35% 35%, #ffffff, #e0e0e0)",
            }}
          />
        )}

        {/* Hint tile overlay */}
        {hintTile && (
          <div
            className="absolute z-30 pointer-events-none flex items-center justify-center"
            style={{
              top: `calc(${hintTile.row} * var(--cell-size))`,
              left: `calc(${hintTile.col} * var(--cell-size))`,
              width: "var(--cell-size)",
              height: "var(--cell-size)",
            }}
          >
            <motion.div
              className="flex items-center justify-center rounded-md"
              style={{
                width: "calc(var(--cell-size) - 8px)",
                height: "calc(var(--cell-size) - 8px)",
                background: "oklch(0.85 0.18 80 / 0.12)",
                border: "2px solid oklch(0.85 0.18 80 / 0.6)",
                color: "oklch(0.85 0.18 80 / 0.85)",
                fontSize: "calc(var(--cell-size) * 0.45)",
                fontWeight: "bold",
                boxShadow:
                  "0 0 12px oklch(0.85 0.18 80 / 0.5), inset 0 0 8px oklch(0.85 0.18 80 / 0.1)",
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [0.94, 1.02, 0.94],
                boxShadow: [
                  "0 0 8px oklch(0.85 0.18 80 / 0.35), inset 0 0 6px oklch(0.85 0.18 80 / 0.08)",
                  "0 0 20px oklch(0.85 0.18 80 / 0.7), inset 0 0 12px oklch(0.85 0.18 80 / 0.15)",
                  "0 0 8px oklch(0.85 0.18 80 / 0.35), inset 0 0 6px oklch(0.85 0.18 80 / 0.08)",
                ],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.8,
                ease: "easeInOut",
              }}
            >
              {ARROW_SYMBOLS[hintTile.dir]}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
