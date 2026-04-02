import { AnimatePresence, motion } from "motion/react";
import { LEVELS } from "../../data/levels";

interface WinModalProps {
  isVisible: boolean;
  levelIndex: number;
  moveCount: number;
  onNextLevel: () => void;
  onReset: () => void;
}

export function WinModal({
  isVisible,
  levelIndex,
  moveCount,
  onNextLevel,
  onReset,
}: WinModalProps) {
  const isLastLevel = levelIndex >= LEVELS.length - 1;
  const level = LEVELS[levelIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "oklch(0 0 0 / 0.7)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-ocid="win.modal"
        >
          <motion.div
            className="relative mx-4 w-full max-w-md rounded-2xl border p-8 text-center overflow-hidden"
            style={{
              background: "oklch(0.29 0.025 255)",
              borderColor: "oklch(0.76 0.07 210 / 0.5)",
              boxShadow:
                "0 0 32px oklch(0.76 0.07 210 / 0.2), 0 0 64px oklch(0.76 0.07 210 / 0.08)",
            }}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Subtle background gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, oklch(0.76 0.07 210 / 0.05) 0%, transparent 70%)",
              }}
            />

            {/* Trophy icon */}
            <motion.div
              className="text-5xl mb-4"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2.5,
                ease: "easeInOut",
              }}
            >
              {isLastLevel ? "\uD83C\uDFC6" : "\u2728"}
            </motion.div>

            <motion.h2
              className="text-2xl font-display font-bold uppercase mb-1"
              style={{
                color: "oklch(0.76 0.07 210)",
                textShadow: "0 0 12px oklch(0.76 0.07 210 / 0.4)",
              }}
              animate={{ opacity: [1, 0.75, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.5 }}
            >
              {isLastLevel ? "You Win!" : "Level Complete!"}
            </motion.h2>

            <p className="text-muted-foreground text-sm mb-1 font-display uppercase tracking-widest">
              {level.name}
            </p>

            <div
              className="my-6 p-4 rounded-lg"
              style={{ background: "oklch(0.31 0.025 255)" }}
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-display mb-1">
                Steps Taken
              </p>
              <p
                className="text-3xl font-display font-bold"
                style={{ color: "oklch(0.73 0.1 130)" }}
              >
                {moveCount}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onReset}
                className="flex-1 py-3 px-4 rounded-lg border font-display font-bold text-sm uppercase tracking-wider
                  transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  borderColor: "oklch(0.76 0.07 210 / 0.4)",
                  color: "oklch(0.76 0.07 210)",
                  background: "transparent",
                }}
                data-ocid="win.cancel_button"
              >
                Replay
              </button>

              {!isLastLevel ? (
                <button
                  type="button"
                  onClick={onNextLevel}
                  className="flex-1 py-3 px-4 rounded-lg font-display font-bold text-sm uppercase tracking-wider
                    transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: "oklch(0.76 0.07 210)",
                    color: "oklch(0.20 0.02 255)",
                    boxShadow: "0 0 12px oklch(0.76 0.07 210 / 0.4)",
                  }}
                  data-ocid="win.confirm_button"
                >
                  Next Level \u2192
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onReset}
                  className="flex-1 py-3 px-4 rounded-lg font-display font-bold text-sm uppercase tracking-wider
                    transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: "oklch(0.76 0.07 210)",
                    color: "oklch(0.20 0.02 255)",
                    boxShadow: "0 0 12px oklch(0.76 0.07 210 / 0.4)",
                  }}
                  data-ocid="win.confirm_button"
                >
                  Play Again
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
