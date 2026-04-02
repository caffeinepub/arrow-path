import { type Variants, motion } from "motion/react";
import React from "react";
import type { ArrowDir, BallPos, GamePhase, TileType } from "../../types/game";
import { GridCell } from "./GridCell";

interface GameGridProps {
  grid: TileType[][];
  ballPos: BallPos | null;
  gamePhase: GamePhase;
  ballFail: boolean;
  levelIndex: number;
  onDrop: (row: number, col: number, direction: ArrowDir) => void;
  onRemoveArrow: (row: number, col: number) => void;
}

const CELL_SIZE_DESKTOP = 64;
const GRID_SIZE = 8;

// Pre-generate stable coordinate pairs for the fixed 8x8 grid
const CELL_COORDS: Array<{ row: number; col: number; key: string }> = [];
for (let r = 0; r < GRID_SIZE; r++) {
  for (let c = 0; c < GRID_SIZE; c++) {
    CELL_COORDS.push({ row: r, col: c, key: `grid-cell-${r * GRID_SIZE + c}` });
  }
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.015 } },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
};

// Stable trail keys — always 2 ghost slots
const TRAIL_KEYS = ["trail-ghost-1", "trail-ghost-2"];

export function GameGrid({
  grid,
  ballPos,
  gamePhase,
  ballFail,
  levelIndex,
  onDrop,
  onRemoveArrow,
}: GameGridProps) {
  const isEditing = gamePhase === "editing";

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

  const ballStyle: React.CSSProperties = ballPos
    ? {
        top: `calc(${ballPos.row} * var(--cell-size) + var(--cell-size) / 2 - 16px)`,
        left: `calc(${ballPos.col} * var(--cell-size) + var(--cell-size) / 2 - 16px)`,
        transition:
          "top 0.32s cubic-bezier(0.4, 0, 0.2, 1), left 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
      }
    : { display: "none" };

  const trailGhosts = trail.slice(1);

  return (
    <div
      className="relative w-full flex flex-col items-center"
      data-ocid="game.canvas_target"
    >
      {/* Grid container */}
      <motion.div
        key={`grid-${levelIndex}-${gamePhase === "editing" ? "edit" : "play"}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative rounded-lg overflow-hidden border border-border/60"
        style={
          {
            "--cell-size": `${CELL_SIZE_DESKTOP}px`,
            display: "grid",
            gridTemplateColumns: "repeat(8, var(--cell-size))",
            gridTemplateRows: "repeat(8, var(--cell-size))",
            boxShadow:
              "0 0 0 1px oklch(0.38 0.03 255 / 0.4), 0 8px 40px oklch(0 0 0 / 0.5)",
          } as React.CSSProperties
        }
      >
        {CELL_COORDS.map(({ row, col, key }) => (
          <motion.div key={key} variants={tileVariants}>
            <GridCell
              row={row}
              col={col}
              tile={grid[row][col]}
              isEditing={isEditing}
              onDrop={onDrop}
              onRemove={onRemoveArrow}
            />
          </motion.div>
        ))}

        {/* Ball trail ghosts — 2 fixed slots with stable keys */}
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
                transition:
                  "top 0.32s cubic-bezier(0.4,0,0.2,1), left 0.32s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          );
        })}

        {/* Ball overlay */}
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
      </motion.div>
    </div>
  );
}
