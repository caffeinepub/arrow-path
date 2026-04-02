import type { ArrowDir, BallPos, GamePhase, TileType } from "../../types/game";
import { GridCell } from "./GridCell";

interface GameGridProps {
  grid: TileType[][];
  ballPos: BallPos | null;
  gamePhase: GamePhase;
  ballFail: boolean;
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

export function GameGrid({
  grid,
  ballPos,
  gamePhase,
  ballFail,
  onDrop,
  onRemoveArrow,
}: GameGridProps) {
  const isEditing = gamePhase === "editing";

  const ballStyle: React.CSSProperties = ballPos
    ? {
        top: `calc(${ballPos.row} * var(--cell-size) + var(--cell-size) / 2 - 16px)`,
        left: `calc(${ballPos.col} * var(--cell-size) + var(--cell-size) / 2 - 16px)`,
        transition:
          "top 0.32s cubic-bezier(0.4, 0, 0.2, 1), left 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
      }
    : { display: "none" };

  return (
    <div
      className="relative w-full flex flex-col items-center"
      data-ocid="game.canvas_target"
    >
      {/* Grid container */}
      <div
        className="relative rounded-lg overflow-hidden border border-border/60"
        style={
          {
            "--cell-size": `${CELL_SIZE_DESKTOP}px`,
            display: "grid",
            gridTemplateColumns: "repeat(8, var(--cell-size))",
            gridTemplateRows: "repeat(8, var(--cell-size))",
            boxShadow:
              "0 0 0 1px oklch(0.22 0.04 255 / 0.4), 0 8px 40px oklch(0 0 0 / 0.6)",
          } as React.CSSProperties
        }
      >
        {CELL_COORDS.map(({ row, col, key }) => (
          <GridCell
            key={key}
            row={row}
            col={col}
            tile={grid[row][col]}
            isEditing={isEditing}
            onDrop={onDrop}
            onRemove={onRemoveArrow}
          />
        ))}

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
                : "radial-gradient(circle at 35% 35%, #ffffff, #cccccc)",
            }}
          />
        )}
      </div>
    </div>
  );
}
