import { useState } from "react";
import type { ArrowDir, TileType } from "../../types/game";
import { ArrowIcon } from "./ArrowIcon";

interface GridCellProps {
  row: number;
  col: number;
  tile: TileType;
  isEditing: boolean;
  onDrop: (row: number, col: number, direction: ArrowDir) => void;
  onRemove: (row: number, col: number) => void;
}

export function GridCell({
  row,
  col,
  tile,
  isEditing,
  onDrop,
  onRemove,
}: GridCellProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const isArrow = tile.startsWith("arrow_");
  const arrowDir = isArrow ? (tile.replace("arrow_", "") as ArrowDir) : null;
  const isDroppable =
    isEditing && (tile === "empty" || tile === "start" || isArrow);

  const handleDragOver = (e: React.DragEvent) => {
    if (!isDroppable) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isDroppable) return;
    const direction = e.dataTransfer.getData("arrow-direction") as ArrowDir;
    if (direction) onDrop(row, col, direction);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isEditing || !isArrow) return;
    e.preventDefault();
    onRemove(row, col);
  };

  const handleClick = () => {
    if (!isEditing || !isArrow) return;
    onRemove(row, col);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isEditing || !isArrow) return;
    if (
      e.key === "Enter" ||
      e.key === " " ||
      e.key === "Backspace" ||
      e.key === "Delete"
    ) {
      e.preventDefault();
      onRemove(row, col);
    }
  };

  // Also: drag placed arrow FROM grid back to inventory
  const handleDragStart = (e: React.DragEvent) => {
    if (!isEditing || !isArrow || !arrowDir) return;
    e.dataTransfer.setData("arrow-direction", arrowDir);
    e.dataTransfer.setData("from-grid", `${row},${col}`);
    e.dataTransfer.effectAllowed = "move";
  };

  let cellClass = "";
  let content: React.ReactNode = null;

  if (tile === "wall") {
    cellClass = "tile-wall cursor-not-allowed";
  } else if (tile === "goal") {
    cellClass = "tile-goal animate-pulse-goal cursor-default";
    content = (
      <span
        className="text-xs font-display font-bold select-none"
        style={{ color: "oklch(0.20 0.02 255)" }}
      >
        GOAL
      </span>
    );
  } else if (tile === "start") {
    cellClass = "tile-start cursor-default";
    content = (
      <span
        className="text-xs font-display font-bold select-none"
        style={{ color: "oklch(0.76 0.07 210)" }}
      >
        S
      </span>
    );
  } else if (isArrow && arrowDir) {
    cellClass = `tile-arrow-placed cursor-pointer select-none ${
      isEditing ? "hover:opacity-80" : ""
    }`;
    content = (
      <ArrowIcon
        direction={arrowDir}
        size={28}
        className=""
        style={
          {
            color: "oklch(0.76 0.07 210)",
            filter: "drop-shadow(0 0 4px oklch(0.76 0.07 210 / 0.6))",
          } as React.CSSProperties
        }
      />
    );
  } else {
    // empty
    cellClass = "tile-empty cursor-default";
  }

  if (isDragOver && isDroppable) {
    cellClass += " drop-target-hover";
  }

  return (
    <div
      className={`
        relative border flex items-center justify-center
        transition-all duration-150 rounded-sm
        ${cellClass}
      `}
      style={{ width: "100%", height: "100%" }}
      role={isArrow && isEditing ? "button" : undefined}
      tabIndex={isArrow && isEditing ? 0 : undefined}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      draggable={isEditing && isArrow}
      onDragStart={handleDragStart}
      title={
        isArrow && isEditing
          ? "Click or press Enter/Delete to remove"
          : undefined
      }
      aria-label={
        isArrow && arrowDir
          ? `${arrowDir} arrow at row ${row + 1}, col ${col + 1}`
          : undefined
      }
      data-row={row}
      data-col={col}
    >
      {content}
    </div>
  );
}
