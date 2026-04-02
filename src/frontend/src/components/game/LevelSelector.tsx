import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const currentLevelName = LEVELS[currentLevel]?.name ?? "";

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-ocid="level.toggle"
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-display font-semibold transition-all duration-200 hover:scale-105"
        style={{
          background: "oklch(0.31 0.025 255)",
          color: "oklch(0.76 0.07 210)",
          border: "1px solid oklch(0.38 0.03 255 / 0.7)",
          boxShadow: open ? "0 0 12px oklch(0.76 0.07 210 / 0.25)" : undefined,
        }}
      >
        <span style={{ color: "oklch(0.70 0.02 240)" }} className="text-xs">
          LVL
        </span>
        <span>
          {currentLevel + 1}
          <span style={{ color: "oklch(0.50 0.02 240)" }}>/50</span>
        </span>
        <span
          className="text-xs hidden sm:inline truncate max-w-[80px]"
          style={{ color: "oklch(0.60 0.04 210)" }}
        >
          {currentLevelName}
        </span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          aria-label={
            open ? "Collapse level selector" : "Expand level selector"
          }
          role="img"
          className="transition-transform duration-200"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: "oklch(0.55 0.04 210)",
          }}
          fill="currentColor"
        >
          <path d="M0 0l5 6 5-6H0z" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          data-ocid="level.panel"
          className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-xl p-3"
          style={{
            background: "oklch(0.18 0.02 255)",
            border: "1px solid oklch(0.32 0.03 255 / 0.8)",
            boxShadow:
              "0 -8px 32px oklch(0.10 0.02 255 / 0.8), 0 0 0 1px oklch(0.76 0.07 210 / 0.08)",
            width: "clamp(200px, 80vw, 280px)",
          }}
        >
          {/* Header */}
          <div
            className="text-xs font-display font-semibold uppercase tracking-widest mb-2.5 text-center"
            style={{ color: "oklch(0.55 0.05 210)" }}
          >
            Select Level
          </div>

          {/* Progress bar */}
          <div
            className="h-1 rounded-full mb-3 overflow-hidden"
            style={{ background: "oklch(0.28 0.025 255)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((highestReached + 1) / LEVELS.length) * 100}%`,
                background:
                  "linear-gradient(90deg, oklch(0.76 0.07 210), oklch(0.73 0.10 130))",
              }}
            />
          </div>

          {/* Scrollable grid */}
          <div
            className="overflow-y-auto pr-0.5"
            style={{ maxHeight: "192px" }}
          >
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
            >
              {LEVELS.map((level, idx) => {
                const isUnlocked = idx <= highestReached || idx === 0;
                const isCurrent = idx === currentLevel;
                const isCompleted =
                  idx < currentLevel ||
                  (idx <= highestReached && idx !== currentLevel);

                let bg = "oklch(0.25 0.02 255)";
                let color = "oklch(0.45 0.02 240)";
                let shadow: string | undefined;
                let border = "1px solid oklch(0.32 0.025 255 / 0.5)";

                if (isCurrent) {
                  bg = "oklch(0.76 0.07 210)";
                  color = "oklch(0.18 0.02 255)";
                  shadow = "0 0 8px oklch(0.76 0.07 210 / 0.5)";
                  border = "none";
                } else if (isCompleted) {
                  bg = "oklch(0.28 0.06 130)";
                  color = "oklch(0.73 0.10 130)";
                  border = "1px solid oklch(0.40 0.08 130 / 0.4)";
                } else if (!isUnlocked) {
                  bg = "oklch(0.22 0.015 255)";
                  color = "oklch(0.35 0.015 240)";
                  border = "1px solid oklch(0.26 0.015 255 / 0.3)";
                }

                return (
                  <button
                    type="button"
                    key={level.id}
                    onClick={() => {
                      if (!isUnlocked) return;
                      onSelect(idx);
                      setOpen(false);
                    }}
                    title={
                      isUnlocked
                        ? level.name
                        : "🔒 Complete previous level to unlock"
                    }
                    className="relative flex items-center justify-center rounded-md text-xs font-display font-bold transition-all duration-150"
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      background: bg,
                      color,
                      boxShadow: shadow,
                      border,
                      cursor: isUnlocked ? "pointer" : "not-allowed",
                      opacity: !isUnlocked ? 0.4 : 1,
                      transform: isCurrent ? "scale(1.08)" : undefined,
                    }}
                    data-ocid={`level.item.${idx + 1}`}
                  >
                    {!isUnlocked ? (
                      <span style={{ fontSize: "9px" }}>🔒</span>
                    ) : (
                      idx + 1
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer hint */}
          <div
            className="mt-2.5 text-center text-xs"
            style={{ color: "oklch(0.40 0.02 240)" }}
          >
            {highestReached + 1} / {LEVELS.length} unlocked
          </div>
        </div>
      )}
    </div>
  );
}
