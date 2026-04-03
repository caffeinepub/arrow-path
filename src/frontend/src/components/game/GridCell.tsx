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
  adminMode?: boolean;
  onAdminToggle?: (row: number, col: number) => void;
}

const GATE_ARROWS: Record<string, ArrowDir> = {
  gate_up: "up",
  gate_down: "down",
  gate_left: "left",
  gate_right: "right",
};

export function GridCell({
  row,
  col,
  tile,
  isEditing,
  selectedArrow,
  onPlace,
  onRemove,
  adminMode,
  onAdminToggle,
}: GridCellProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isArrow = tile.startsWith("arrow_");
  const isGate = tile.startsWith("gate_");
  const arrowDir = isArrow ? (tile.replace("arrow_", "") as ArrowDir) : null;
  const gateDir = isGate ? GATE_ARROWS[tile] : null;

  const isSpecialTile =
    tile === "wall" ||
    tile === "cracked" ||
    tile === "cracked_broken" ||
    isGate;

  const isPlaceable =
    isEditing &&
    !adminMode &&
    selectedArrow !== null &&
    (tile === "empty" || tile === "start" || isArrow);

  const handleClick = () => {
    // Admin mode: toggle wall/empty on any non-fixed tile
    if (adminMode && onAdminToggle) {
      if (tile !== "start" && tile !== "goal" && !isGate) {
        onAdminToggle(row, col);
      }
      return;
    }

    if (!isEditing) return;
    if (
      selectedArrow !== null &&
      (tile === "empty" || tile === "start" || isArrow)
    ) {
      onPlace(row, col);
      return;
    }
    if (isArrow) {
      onRemove(row, col);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (adminMode) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
      return;
    }
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
    // In admin mode: walls show red tint
    cellClass = adminMode
      ? "tile-wall cursor-pointer"
      : "tile-wall cursor-not-allowed";
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
  } else if (tile === "cracked") {
    cellClass = `tile-cracked ${adminMode ? "cursor-pointer" : "cursor-not-allowed"}`;
    content = (
      <svg
        role="img"
        aria-label="Cracked tile"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        className="pointer-events-none select-none"
      >
        <line
          x1="12"
          y1="2"
          x2="8"
          y2="10"
          stroke="oklch(0.65 0.08 50)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="10"
          x2="14"
          y2="14"
          stroke="oklch(0.65 0.08 50)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="14"
          y1="14"
          x2="10"
          y2="22"
          stroke="oklch(0.65 0.08 50)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="12"
          y1="2"
          x2="16"
          y2="7"
          stroke="oklch(0.65 0.08 50)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="14"
          y1="14"
          x2="18"
          y2="17"
          stroke="oklch(0.65 0.08 50)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    );
  } else if (tile === "cracked_broken") {
    cellClass = `tile-cracked-broken ${adminMode ? "cursor-pointer" : "cursor-not-allowed"}`;
    content = (
      <svg
        role="img"
        aria-label="Broken tile"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        className="pointer-events-none select-none"
      >
        <line
          x1="4"
          y1="4"
          x2="20"
          y2="20"
          stroke="oklch(0.65 0.18 25)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="4"
          x2="4"
          y2="20"
          stroke="oklch(0.65 0.18 25)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="12"
          y1="2"
          x2="8"
          y2="10"
          stroke="oklch(0.65 0.18 25 / 0.6)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="12"
          y1="2"
          x2="16"
          y2="7"
          stroke="oklch(0.65 0.18 25 / 0.6)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="12"
          y1="22"
          x2="15"
          y2="16"
          stroke="oklch(0.65 0.18 25 / 0.6)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    );
  } else if (isGate && gateDir) {
    cellClass = "tile-gate cursor-not-allowed";
    content = (
      <div className="flex flex-col items-center gap-0.5">
        <ArrowIcon
          direction={gateDir}
          size={22}
          style={
            {
              color: "oklch(0.82 0.15 80)",
              filter: "drop-shadow(0 0 4px oklch(0.82 0.15 80 / 0.7))",
            } as React.CSSProperties
          }
        />
        <span
          className="text-center select-none"
          style={{
            fontSize: "7px",
            color: "oklch(0.82 0.15 80 / 0.7)",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          ONLY
        </span>
      </div>
    );
  } else if (isArrow && arrowDir) {
    cellClass = `tile-arrow-placed select-none ${
      isEditing && !adminMode ? "cursor-pointer hover:opacity-80" : ""
    } ${adminMode ? "cursor-pointer" : ""}`;
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
    cellClass = `tile-empty ${
      isPlaceable
        ? "cursor-pointer"
        : adminMode
          ? "cursor-pointer"
          : "cursor-default"
    }`;
  }

  const showPlaceHover = isPlaceable && isHovered;

  // Admin mode wall tint overlay
  const adminWallTint =
    adminMode && tile === "wall" ? (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "oklch(0.55 0.18 25 / 0.18)",
          borderRadius: "inherit",
        }}
      />
    ) : null;

  // Admin mode hover indicator for toggleable cells
  const adminHoverIndicator =
    adminMode && isHovered && tile !== "start" && tile !== "goal" && !isGate ? (
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        style={{
          background:
            tile === "wall"
              ? "oklch(0.55 0.18 25 / 0.22)"
              : "oklch(0.55 0.18 25 / 0.1)",
          border: `1px solid oklch(0.65 0.18 25 / ${
            tile === "wall" ? "0.6" : "0.35"
          })`,
          borderRadius: "inherit",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            color: "oklch(0.65 0.18 25 / 0.8)",
            fontWeight: 700,
          }}
        >
          {tile === "wall" ? "-" : "+"}
        </span>
      </div>
    ) : null;

  const isInteractive = adminMode
    ? tile !== "start" && tile !== "goal" && !isGate
    : isEditing && !isSpecialTile;

  return (
    <div
      className={`
        relative border flex items-center justify-center
        transition-all duration-150 rounded-sm
        ${cellClass}
        ${showPlaceHover ? "drop-target-hover" : ""}
      `}
      style={{ width: "100%", height: "100%" }}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={
        isArrow && arrowDir
          ? `${arrowDir} arrow at row ${row + 1}, col ${col + 1}`
          : `Cell row ${row + 1}, col ${col + 1}`
      }
      data-row={row}
      data-col={col}
    >
      {adminWallTint}
      {content}
      {adminHoverIndicator}
      {showPlaceHover && selectedArrow && !isArrow && (
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
