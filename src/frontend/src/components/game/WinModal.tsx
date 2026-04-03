import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { LEVELS } from "../../data/levels";
import type { StarCount } from "../../utils/starRating";

interface WinModalProps {
  isVisible: boolean;
  levelIndex: number;
  moveCount: number;
  stars: StarCount;
  chapterAccent: string;
  onNextLevel: () => void;
  onReset: () => void;
}

function playDing(frequency: number) {
  try {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch {
    // Audio not available
  }
}

function StarDisplay({
  stars,
  isVisible,
}: {
  stars: StarCount;
  isVisible: boolean;
}) {
  useEffect(() => {
    if (!isVisible) return;
    const pitches = [523, 659, 784]; // C5, E5, G5
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < stars; i++) {
      const t = setTimeout(() => playDing(pitches[i]), 400 + i * 250);
      timeouts.push(t);
    }
    return () => {
      for (const t of timeouts) clearTimeout(t);
    };
  }, [isVisible, stars]);

  return (
    <div className="flex flex-col items-center gap-3 my-6">
      <div className="flex items-center gap-3">
        {[1, 2, 3].map((i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, opacity: 0, y: 10 }}
            animate={
              isVisible
                ? {
                    scale: i <= stars ? [0, 1.5, 1] : [0, 0.7, 0.85],
                    opacity: 1,
                    y: 0,
                  }
                : { scale: 0, opacity: 0 }
            }
            transition={{
              delay: 0.35 + (i - 1) * 0.25,
              duration: 0.45,
              type: "spring",
              stiffness: 300,
              damping: 16,
            }}
            style={{
              fontSize: "2.5rem",
              lineHeight: 1,
              display: "inline-block",
              color:
                i <= stars ? "oklch(0.85 0.18 80)" : "oklch(0.30 0.02 240)",
              filter:
                i <= stars
                  ? "drop-shadow(0 0 8px oklch(0.85 0.18 80 / 0.85)) drop-shadow(0 0 16px oklch(0.85 0.18 80 / 0.4))"
                  : "none",
            }}
          >
            ★
          </motion.span>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.3 }}
        className="text-xs font-display uppercase tracking-widest"
        style={{
          color: "oklch(0.85 0.18 80)",
          textShadow: "0 0 8px oklch(0.85 0.18 80 / 0.5)",
        }}
      >
        {stars === 3
          ? "Perfect! — Par Score!"
          : stars === 2
            ? "Great!"
            : "Solved!"}{" "}
        {stars}/3 ★
      </motion.p>
    </div>
  );
}

export function WinModal({
  isVisible,
  levelIndex,
  moveCount,
  stars,
  chapterAccent,
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
              background: "oklch(0.22 0.025 255)",
              borderColor: `${chapterAccent.replace(")", " / 0.5)")}`,
              boxShadow: `0 0 32px ${chapterAccent.replace(")", " / 0.2)")}, 0 0 64px ${chapterAccent.replace(")", " / 0.08)")}`,
            }}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Subtle background gradient — chapter-tinted */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${chapterAccent.replace(")", " / 0.06)")} 0%, transparent 70%)`,
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
                color: chapterAccent,
                textShadow: `0 0 12px ${chapterAccent.replace(")", " / 0.4)")}`,
              }}
              animate={{ opacity: [1, 0.75, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.5 }}
            >
              {isLastLevel ? "You Win!" : "Level Complete!"}
            </motion.h2>

            <p className="text-muted-foreground text-sm mb-1 font-display uppercase tracking-widest">
              {level.name}
            </p>

            {/* Star rating */}
            <StarDisplay stars={stars} isVisible={isVisible} />

            <div
              className="my-4 p-4 rounded-lg"
              style={{ background: "oklch(0.26 0.025 255)" }}
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
                  borderColor: `${chapterAccent.replace(")", " / 0.4)")}`,
                  color: chapterAccent,
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
                    background: chapterAccent,
                    color: "oklch(0.15 0.02 255)",
                    boxShadow: `0 0 12px ${chapterAccent.replace(")", " / 0.4)")}`,
                  }}
                  data-ocid="win.confirm_button"
                >
                  Next Level →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onReset}
                  className="flex-1 py-3 px-4 rounded-lg font-display font-bold text-sm uppercase tracking-wider
                    transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: chapterAccent,
                    color: "oklch(0.15 0.02 255)",
                    boxShadow: `0 0 12px ${chapterAccent.replace(")", " / 0.4)")}`,
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
