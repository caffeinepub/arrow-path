import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { LEVELS } from "../../data/levels";
import type { ArrowDir } from "../../types/game";
import { AdScreen } from "./AdScreen";

interface HintModalProps {
  chapterAccent: string;
  currentLevelIndex: number;
  placedArrows: Map<string, ArrowDir>;
  onRevealHint: (row: number, col: number, dir: ArrowDir) => void;
  onClose: () => void;
}

type HintStep = "confirm" | "watching" | "done";

function findHintTile(
  currentLevelIndex: number,
  placedArrows: Map<string, ArrowDir>,
): { row: number; col: number; dir: ArrowDir } | null {
  const level = LEVELS[currentLevelIndex];
  if (!level) return null;

  const grid = level.grid;
  const inventory = level.inventory;
  if (!inventory.length) return null;

  // Pick first available arrow direction from inventory
  const dir = inventory[0].direction;

  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r]?.[c];
      if (cell !== "empty" && cell !== "start") continue;
      const key = `${r},${c}`;
      if (placedArrows.has(key)) continue;
      return { row: r, col: c, dir };
    }
  }
  return null;
}

export function HintModal({
  chapterAccent,
  currentLevelIndex,
  placedArrows,
  onRevealHint,
  onClose,
}: HintModalProps) {
  const [step, setStep] = React.useState<HintStep>("confirm");

  const handleWatch = () => {
    setStep("watching");
  };

  const handleAdClose = () => {
    const hint = findHintTile(currentLevelIndex, placedArrows);
    if (!hint) {
      onClose();
      return;
    }
    onRevealHint(hint.row, hint.col, hint.dir);
    onClose();
  };

  if (step === "watching") {
    return (
      <AnimatePresence>
        <AdScreen onClose={handleAdClose} accentColor={chapterAccent} />
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: "oklch(0 0 0 / 0.75)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      data-ocid="hint.modal"
    >
      <motion.div
        className="relative w-full max-w-sm rounded-2xl border p-8 flex flex-col items-center gap-6 text-center overflow-hidden"
        style={{
          background: "oklch(0.14 0.02 255)",
          borderColor: `${chapterAccent.replace(")", " / 0.4)")}`,
          boxShadow: `0 0 40px ${chapterAccent.replace(")", " / 0.12)")}, 0 0 80px oklch(0 0 0 / 0.4)`,
        }}
        initial={{ scale: 0.88, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 12 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
      >
        {/* Subtle gradient top wash */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${chapterAccent.replace(")", " / 0.07)")} 0%, transparent 65%)`,
          }}
        />

        {/* Lightbulb icon */}
        <div
          style={{
            fontSize: "2.8rem",
            lineHeight: 1,
            filter: `drop-shadow(0 0 10px ${chapterAccent.replace(")", " / 0.45)")})`,
          }}
        >
          💡
        </div>

        <div className="flex flex-col gap-2">
          <h2
            className="text-xl font-display font-bold uppercase tracking-widest"
            style={{
              color: chapterAccent,
              textShadow: `0 0 12px ${chapterAccent.replace(")", " / 0.35)")}`,
            }}
          >
            Need a Hint?
          </h2>
          <p
            className="text-sm font-sans leading-relaxed"
            style={{ color: "oklch(0.58 0.03 240)" }}
          >
            Watch a short video ad to reveal one arrow placement.
          </p>
        </div>

        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-lg border font-display font-bold text-sm uppercase tracking-wider
              transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              borderColor: "oklch(0.30 0.02 240)",
              color: "oklch(0.50 0.03 240)",
              background: "transparent",
            }}
            data-ocid="hint.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleWatch}
            className="flex-1 py-3 px-4 rounded-lg font-display font-bold text-sm uppercase tracking-wider
              transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: chapterAccent,
              color: "oklch(0.15 0.02 255)",
              boxShadow: `0 0 12px ${chapterAccent.replace(")", " / 0.35)")}`,
            }}
            data-ocid="hint.confirm_button"
          >
            Watch Ad
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
