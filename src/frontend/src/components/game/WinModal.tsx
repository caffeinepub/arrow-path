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
          style={{ background: "oklch(0 0 0 / 0.75)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-ocid="win.modal"
        >
          <motion.div
            className="relative mx-4 w-full max-w-md rounded-2xl border p-8 text-center overflow-hidden"
            style={{
              background: "oklch(0.10 0.03 255)",
              borderColor: "oklch(0.78 0.18 192 / 0.6)",
              boxShadow:
                "0 0 40px oklch(0.78 0.18 192 / 0.3), 0 0 80px oklch(0.78 0.18 192 / 0.1)",
            }}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Background glow effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, oklch(0.78 0.18 192 / 0.08) 0%, transparent 70%)",
              }}
            />

            {/* Trophy icon */}
            <motion.div
              className="text-5xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              {isLastLevel ? "\uD83C\uDFC6" : "\u2728"}
            </motion.div>

            <motion.h2
              className="text-2xl font-display font-bold uppercase mb-1"
              style={{
                color: "oklch(0.78 0.18 192)",
                textShadow:
                  "0 0 20px oklch(0.78 0.18 192 / 0.6), 0 0 40px oklch(0.78 0.18 192 / 0.3)",
              }}
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            >
              {isLastLevel ? "You Win!" : "Level Complete!"}
            </motion.h2>

            <p className="text-muted-foreground text-sm mb-1 font-display uppercase tracking-widest">
              {level.name}
            </p>

            <div
              className="my-6 p-4 rounded-lg"
              style={{ background: "oklch(0.14 0.03 250)" }}
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-display mb-1">
                Steps Taken
              </p>
              <p
                className="text-3xl font-display font-bold"
                style={{ color: "oklch(0.82 0.22 130)" }}
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
                  borderColor: "oklch(0.78 0.18 192 / 0.4)",
                  color: "oklch(0.78 0.18 192)",
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
                    background: "oklch(0.78 0.18 192)",
                    color: "oklch(0.09 0.02 260)",
                    boxShadow: "0 0 16px oklch(0.78 0.18 192 / 0.5)",
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
                    background: "oklch(0.78 0.18 192)",
                    color: "oklch(0.09 0.02 260)",
                    boxShadow: "0 0 16px oklch(0.78 0.18 192 / 0.5)",
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
