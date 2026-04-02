import { LEVELS } from "../../data/levels";

interface LevelSelectorProps {
  currentLevel: number;
  onSelect: (idx: number) => void;
  highestReached?: number;
}

export function LevelSelector({
  currentLevel,
  onSelect,
  highestReached = 0,
}: LevelSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground uppercase tracking-wider font-display mr-1 hidden sm:block">
        Level:
      </span>
      {LEVELS.map((level, idx) => {
        const isUnlocked = idx <= highestReached || idx === 0;
        const isCurrent = idx === currentLevel;

        return (
          <button
            type="button"
            key={level.id}
            onClick={() => (isUnlocked ? onSelect(idx) : undefined)}
            className={`
              w-8 h-8 rounded-md text-sm font-display font-bold
              transition-all duration-200
              ${isCurrent ? "scale-110" : "hover:scale-105"}
              ${!isUnlocked ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
            `}
            style={
              isCurrent
                ? {
                    background: "oklch(0.76 0.07 210)",
                    color: "oklch(0.20 0.02 255)",
                    boxShadow: "0 0 10px oklch(0.76 0.07 210 / 0.45)",
                  }
                : {
                    background: "oklch(0.31 0.025 255)",
                    color: "oklch(0.70 0.02 240)",
                    border: "1px solid oklch(0.38 0.03 255 / 0.6)",
                  }
            }
            title={level.name}
            data-ocid="level.tab"
          >
            {idx + 1}
          </button>
        );
      })}
    </div>
  );
}
