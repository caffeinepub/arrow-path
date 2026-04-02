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
}

function InventoryItemCard({ item, isEditing }: InventoryItemCardProps) {
  const isEmpty = item.count === 0;

  const handleDragStart = (e: React.DragEvent) => {
    if (!isEditing || isEmpty) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("arrow-direction", item.direction);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center gap-1
        w-16 h-16 sm:w-20 sm:h-20 rounded-md border-2 cursor-grab
        transition-all duration-200 select-none
        ${
          isEmpty
            ? "opacity-40 cursor-not-allowed border-border/40 bg-muted/20"
            : "tile-arrow hover:scale-105 active:scale-95 neon-border-cyan"
        }
      `}
      draggable={isEditing && !isEmpty}
      onDragStart={handleDragStart}
      title={
        isEmpty
          ? `No ${DIRECTION_LABELS[item.direction]} arrows remaining`
          : `Drag to place ${DIRECTION_LABELS[item.direction]} arrow`
      }
      data-ocid={`inventory.${item.direction}.drag_handle`}
    >
      <ArrowIcon
        direction={item.direction}
        size={26}
        style={
          {
            color: isEmpty ? "oklch(0.45 0.02 240)" : "oklch(0.78 0.18 192)",
            filter: isEmpty
              ? "none"
              : "drop-shadow(0 0 4px oklch(0.78 0.18 192 / 0.8))",
          } as React.CSSProperties
        }
      />
      <span
        className="text-xs font-display font-bold"
        style={{
          color: isEmpty ? "oklch(0.45 0.02 240)" : "oklch(0.78 0.18 192)",
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
        style={isEmpty ? {} : { backgroundColor: "oklch(0.78 0.18 192)" }}
      >
        {item.count}
      </span>
    </div>
  );
}

interface InventoryPanelProps {
  inventory: InventoryItem[];
  isEditing: boolean;
}

export function InventoryPanel({ inventory, isEditing }: InventoryPanelProps) {
  const totalRemaining = inventory.reduce((sum, item) => sum + item.count, 0);

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
          style={{ color: "oklch(0.78 0.18 192)" }}
        >
          Inventory
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isEditing ? "Drag arrows onto the grid" : "Run in progress..."}
        </p>
      </div>

      {/* Arrow tiles grid */}
      <div className="grid grid-cols-2 gap-3">
        {inventory.map((item) => (
          <InventoryItemCard
            key={item.direction}
            item={item}
            isEditing={isEditing}
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
                  ? "oklch(0.78 0.18 192)"
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
            style={{ border: "1px solid oklch(0.78 0.18 192 / 0.4)" }}
          />
          <span className="text-xs text-muted-foreground">Start (S)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm tile-goal" />
          <span className="text-xs text-muted-foreground">Goal</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground italic">
            Right-click arrow to remove
          </span>
        </div>
      </div>
    </div>
  );
}
