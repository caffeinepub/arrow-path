import { motion } from "motion/react";
import type { ArrowDir, InventoryItem } from "../../types/game";
import { ArrowIcon } from "./ArrowIcon";

const DIRECTION_LABELS: Record<ArrowDir, string> = {
  up: "Up",
  down: "Down",
  left: "Left",
  right: "Right",
};

interface InventoryItemCardProps {
  item: InventoryItem;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: (dir: ArrowDir) => void;
}

function InventoryItemCard({
  item,
  isEditing,
  isSelected,
  onSelect,
}: InventoryItemCardProps) {
  const isEmpty = item.count === 0;
  const canSelect = isEditing && !isEmpty;

  const handleClick = () => {
    if (!canSelect) return;
    onSelect(item.direction);
  };

  return (
    <motion.div
      whileHover={canSelect ? { y: -4, transition: { duration: 0.15 } } : {}}
      whileTap={canSelect ? { scale: 0.96 } : {}}
    >
      <button
        type="button"
        onClick={handleClick}
        disabled={!canSelect}
        aria-pressed={isSelected}
        aria-label={`Select ${DIRECTION_LABELS[item.direction]} arrow`}
        className={`
          relative flex flex-col items-center justify-center gap-1
          w-16 h-16 sm:w-20 sm:h-20 rounded-md border-2
          transition-all duration-200 select-none
          ${
            isEmpty
              ? "opacity-40 cursor-not-allowed border-border/40 bg-muted/20"
              : isSelected
                ? "cursor-pointer scale-105"
                : "tile-arrow cursor-pointer hover:scale-105 active:scale-95 neon-border-cyan"
          }
        `}
        style={
          isSelected && !isEmpty
            ? {
                background: "oklch(0.76 0.07 210 / 0.25)",
                borderColor: "oklch(0.76 0.07 210)",
                boxShadow:
                  "0 0 0 3px oklch(0.76 0.07 210 / 0.4), 0 0 16px oklch(0.76 0.07 210 / 0.3)",
              }
            : {}
        }
        title={
          isEmpty
            ? `No ${DIRECTION_LABELS[item.direction]} arrows remaining`
            : isSelected
              ? `${DIRECTION_LABELS[item.direction]} selected — tap a grid cell to place`
              : `Tap to select ${DIRECTION_LABELS[item.direction]} arrow`
        }
        data-ocid={`inventory.${item.direction}.select_btn`}
      >
        <ArrowIcon
          direction={item.direction}
          size={26}
          style={
            {
              color: isEmpty
                ? "oklch(0.45 0.02 240)"
                : isSelected
                  ? "oklch(0.88 0.09 210)"
                  : "oklch(0.76 0.07 210)",
              filter:
                isEmpty || !isSelected
                  ? isEmpty
                    ? "none"
                    : "drop-shadow(0 0 3px oklch(0.76 0.07 210 / 0.6))"
                  : "drop-shadow(0 0 6px oklch(0.76 0.07 210 / 0.9))",
            } as React.CSSProperties
          }
        />
        <span
          className="text-xs font-display font-bold"
          style={{
            color: isEmpty
              ? "oklch(0.45 0.02 240)"
              : isSelected
                ? "oklch(0.88 0.09 210)"
                : "oklch(0.76 0.07 210)",
          }}
        >
          {DIRECTION_LABELS[item.direction]}
        </span>

        {/* Count badge */}
        <span
          className={`
            absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center
            text-xs font-display font-bold
            ${isEmpty ? "bg-muted/40 text-muted-foreground" : "text-background"}
          `}
          style={isEmpty ? {} : { backgroundColor: "oklch(0.76 0.07 210)" }}
        >
          {item.count}
        </span>

        {/* Selected indicator ring pulse */}
        {isSelected && !isEmpty && (
          <span
            className="absolute inset-0 rounded-md animate-pulse pointer-events-none"
            style={{
              boxShadow: "inset 0 0 0 2px oklch(0.76 0.07 210 / 0.5)",
            }}
          />
        )}
      </button>
    </motion.div>
  );
}

interface InventoryPanelProps {
  inventory: InventoryItem[];
  isEditing: boolean;
  selectedArrow: ArrowDir | null;
  onSelectArrow: (dir: ArrowDir | null) => void;
}

export function InventoryPanel({
  inventory,
  isEditing,
  selectedArrow,
  onSelectArrow,
}: InventoryPanelProps) {
  const totalRemaining = inventory.reduce((sum, item) => sum + item.count, 0);

  const handleSelect = (dir: ArrowDir) => {
    // Toggle off if same arrow tapped again
    onSelectArrow(selectedArrow === dir ? null : dir);
  };

  return (
    <div
      className="flex flex-col gap-4 p-4 rounded-xl border border-border/60"
      style={{ background: "oklch(var(--panel-bg))" }}
      data-ocid="inventory.panel"
    >
      {/* Header */}
      <div>
        <h2
          className="text-sm font-display font-bold uppercase tracking-widest"
          style={{ color: "oklch(0.76 0.07 210)" }}
        >
          Inventory
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isEditing
            ? selectedArrow
              ? `${selectedArrow.charAt(0).toUpperCase() + selectedArrow.slice(1)} selected — tap grid cell`
              : "Tap an arrow, then tap the grid"
            : "Run in progress..."}
        </p>
      </div>

      {/* Arrow tiles grid */}
      <div className="grid grid-cols-2 gap-3">
        {inventory.map((item) => (
          <InventoryItemCard
            key={item.direction}
            item={item}
            isEditing={isEditing}
            isSelected={selectedArrow === item.direction}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Total count */}
      <div className="border-t border-border/40 pt-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-display">
            Remaining
          </span>
          <span
            className="text-lg font-display font-bold"
            style={{
              color:
                totalRemaining > 0
                  ? "oklch(0.76 0.07 210)"
                  : "oklch(0.55 0.02 240)",
            }}
          >
            {totalRemaining}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-1.5 border-t border-border/40 pt-3">
        <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
          Legend
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-sm border border-border/60"
            style={{ background: "oklch(var(--grid-empty))" }}
          />
          <span className="text-xs text-muted-foreground">Empty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm tile-wall" />
          <span className="text-xs text-muted-foreground">Wall</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-sm tile-start"
            style={{ border: "1px solid oklch(0.76 0.07 210 / 0.4)" }}
          />
          <span className="text-xs text-muted-foreground">Start (S)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm tile-goal" />
          <span className="text-xs text-muted-foreground">Goal</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground italic">
            Tap placed arrow to remove
          </span>
        </div>
      </div>
    </div>
  );
}
