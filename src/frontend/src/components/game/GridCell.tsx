import { useState } from "react";
import type { ArrowDir, TileType } from "../../types/game";
import { ArrowIcon } from "./ArrowIcon";

interface GridCellProps {
  row: number;
  col: number;
  tile: TileType;
  isEditing: boolean;
  selectedArrow: ArrowDir | null;
  onPlace: (row: number, col: number) => void;
  onRemove: (row: number, col: number) => void;
}

export function GridCell({
  row,
  col,
  tile,
  isEditing,
  selectedArrow,
  onPlace,
  onRemove,
}: GridCellProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isArrow = tile.startsWith("arrow_");
  const arrowDir = isArrow ? (tile.replace("arrow_", "") as ArrowDir) : null;
  const isPlaceable =
    isEditing &&
    selectedArrow !== null &&
    (tile === "empty" || tile === "start" || isArrow);

  const handleClick = () => {
    if (!isEditing) return;
    // If there's a selected arrow, place it here
    if (
      selectedArrow !== null &&
      (tile === "empty" || tile === "start" || isArrow)
    ) {
      onPlace(row, col);
      return;
    }
    // If no arrow selected and this cell has a placed arrow, remove it
    if (isArrow) {
      onRemove(row, col);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isEditing) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
    if ((e.key === "Backspace" || e.key === "Delete") && isArrow) {
      e.preventDefault();
      onRemove(row, col);
    }
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
    cellClass = `tile-start ${
      isPlaceable ? "cursor-pointer" : "cursor-default"
    }`;
    content = (
      <span
        className="text-xs font-display font-bold select-none"
        style={{ color: "oklch(0.76 0.07 210)" }}
      >
        S
      </span>
    );
  } else if (isArrow && arrowDir) {
    cellClass = `tile-arrow-placed select-none ${
      isEditing ? "cursor-pointer hover:opacity-80" : ""
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
    cellClass = `tile-empty ${
      isPlaceable ? "cursor-pointer" : "cursor-default"
    }`;
  }

  // Highlight placeable cells when an arrow is selected
  const showPlaceHover = isPlaceable && isHovered;

  return (
    <div
      className={`
        relative border flex items-center justify-center
        transition-all duration-150 rounded-sm
        ${cellClass}
        ${showPlaceHover ? "drop-target-hover" : ""}
      `}
      style={{ width: "100%", height: "100%" }}
      role={isEditing ? "button" : undefined}
      tabIndex={isEditing ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={
        isEditing
          ? isArrow
            ? selectedArrow
              ? `Replace arrow at (${row + 1}, ${col + 1})`
              : "Tap to remove arrow"
            : isPlaceable
              ? `Place ${selectedArrow} arrow here`
              : undefined
          : undefined
      }
      aria-label={
        isArrow && arrowDir
          ? `${arrowDir} arrow at row ${row + 1}, col ${col + 1}`
          : `Cell row ${row + 1}, col ${col + 1}`
      }
      data-row={row}
      data-col={col}
    >
      {content}
      {/* Ghost preview when hovering a placeable cell with arrow selected */}
      {isPlaceable && isHovered && selectedArrow && !isArrow && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <ArrowIcon
            direction={selectedArrow}
            size={28}
            style={{ color: "oklch(0.76 0.07 210)" } as React.CSSProperties}
          />
        </div>
      )}
    </div>
  );
}
