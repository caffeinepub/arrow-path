import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LEVELS } from "../../data/levels";
import { getChapterForLevel } from "../../utils/chapterThemes";
import type { StarCount } from "../../utils/starRating";

interface LevelSelectorProps {
  currentLevel: number;
  onSelect: (idx: number) => void;
  highestReached?: number;
  starsMap?: Record<string, StarCount>;
  chapterAccent?: string;
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width="12"
      height="12"
      aria-hidden="true"
    >
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="M3 3h8v8H3zm0 10h8v8H3zm10-10h8v8h-8zm0 10h8v8h-8z" />
    </svg>
  );
}

function StarIcons({ stars }: { stars: StarCount | undefined }) {
  return (
    <div
      className="flex items-center justify-center gap-0.5"
      style={{ lineHeight: 1, marginTop: "2px" }}
    >
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            fontSize: "8px",
            color:
              stars && i <= stars
                ? "oklch(0.85 0.18 80)"
                : "oklch(0.32 0.02 240)",
            filter:
              stars && i <= stars
                ? "drop-shadow(0 0 3px oklch(0.85 0.18 80 / 0.8))"
                : "none",
            display: "inline-block",
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

const CHAPTER_RANGES = [
  { start: 0, end: 9, label: "Chapter 1 \u00b7 Arctic" },
  { start: 10, end: 19, label: "Chapter 2 \u00b7 Ember" },
  { start: 20, end: 29, label: "Chapter 3 \u00b7 Forest" },
  { start: 30, end: 39, label: "Chapter 4 \u00b7 Dusk" },
  { start: 40, end: 49, label: "Chapter 5 \u00b7 Crimson" },
];

export function LevelSelector({
  currentLevel,
  onSelect,
  highestReached = 0,
  starsMap = {},
  chapterAccent = "oklch(0.76 0.07 210)",
}: LevelSelectorProps) {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentLevelName = LEVELS[currentLevel]?.name ?? "";

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-ocid="level.toggle"
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-display font-semibold transition-all duration-200 hover:scale-105"
        style={{
          background: "oklch(0.31 0.025 255)",
          color: chapterAccent,
          border: `1px solid ${chapterAccent.replace(")", " / 0.4)")}`,
          transition: "color 0.7s ease, border-color 0.7s ease",
        }}
      >
        <GridIcon />
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
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="level-selector-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "oklch(0.08 0.015 255 / 0.92)" }}
            onClick={(e) => {
              if (e.target === overlayRef.current) setOpen(false);
            }}
          >
            <motion.div
              key="level-selector-panel"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              ref={panelRef}
              data-ocid="level.panel"
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "oklch(0.18 0.025 255)",
                border: "1px solid oklch(0.32 0.03 255 / 0.8)",
                boxShadow:
                  "0 24px 80px oklch(0 0 0 / 0.7), 0 0 0 1px oklch(0.76 0.07 210 / 0.1)",
                width: "clamp(320px, 90vw, 640px)",
                maxHeight: "88vh",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: "oklch(0.28 0.025 255)" }}
              >
                <div>
                  <h2
                    className="font-display font-bold text-base uppercase tracking-widest"
                    style={{ color: "oklch(0.88 0.04 240)" }}
                  >
                    Select Level
                  </h2>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "oklch(0.50 0.02 240)" }}
                  >
                    {Math.min(highestReached + 1, 50)} / 50 levels unlocked
                  </p>
                </div>

                {/* Progress bar */}
                <div className="flex-1 mx-6">
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "oklch(0.26 0.025 255)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${((highestReached + 1) / LEVELS.length) * 100}%`,
                        background: `linear-gradient(90deg, ${chapterAccent}, oklch(0.73 0.10 130))`,
                      }}
                    />
                  </div>
                  <div
                    className="text-right text-xs mt-0.5 font-display"
                    style={{ color: "oklch(0.45 0.02 240)" }}
                  >
                    {Math.round(((highestReached + 1) / 50) * 100)}%
                  </div>
                </div>

                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  data-ocid="level.close_button"
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                  style={{
                    color: "oklch(0.55 0.03 240)",
                    background: "oklch(0.25 0.02 255)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="16"
                    height="16"
                    aria-hidden="true"
                  >
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </button>
              </div>

              {/* Chapter sections */}
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "calc(88vh - 90px)" }}
              >
                {CHAPTER_RANGES.map((chapter, chIdx) => {
                  const chapterLevels = LEVELS.slice(
                    chapter.start,
                    chapter.end + 1,
                  );
                  const chTheme = getChapterForLevel(chapter.start);
                  return (
                    <div key={chapter.label}>
                      {/* Chapter label row */}
                      <div
                        className="px-5 py-2.5 flex items-center gap-3"
                        style={{ background: "oklch(0.15 0.02 255 / 0.5)" }}
                      >
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            background: chTheme.accent,
                            boxShadow: `0 0 6px ${chTheme.accent.replace(")", " / 0.5)")}`,
                          }}
                        />
                        <span
                          className="text-xs font-display font-bold uppercase tracking-widest"
                          style={{ color: chTheme.accent, opacity: 0.85 }}
                        >
                          {chapter.label}
                        </span>
                        <div
                          className="flex-1 h-px"
                          style={{
                            background: `${chTheme.accent.replace(")", " / 0.15)")}`,
                          }}
                        />
                      </div>

                      {/* Level grid — 5 per row */}
                      <div
                        className="grid gap-2 px-5 py-3"
                        style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
                      >
                        {chapterLevels.map((level, i) => {
                          const idx = chapter.start + i;
                          const isUnlocked = idx <= highestReached || idx === 0;
                          const isCurrent = idx === currentLevel;
                          const isCompleted =
                            idx < highestReached ||
                            starsMap[level.id] !== undefined;
                          const levelStars = starsMap[level.id];

                          let bg = "oklch(0.23 0.02 255)";
                          let color = "oklch(0.48 0.02 240)";
                          let shadow: string | undefined;
                          let border = "1px solid oklch(0.30 0.025 255 / 0.5)";

                          if (isCurrent) {
                            bg = chTheme.accent;
                            color = "oklch(0.13 0.02 255)";
                            shadow = `0 0 12px ${chTheme.accent.replace(")", " / 0.6)")}`;
                            border = "none";
                          } else if (isCompleted && isUnlocked) {
                            bg = `${chTheme.accent.replace(")", " / 0.15)")}`;
                            color = chTheme.accent;
                            border = `1px solid ${chTheme.accent.replace(")", " / 0.35)")}`;
                          } else if (!isUnlocked) {
                            bg = "oklch(0.19 0.015 255)";
                            color = "oklch(0.32 0.015 240)";
                            border = "1px solid oklch(0.24 0.015 255 / 0.3)";
                          }

                          return (
                            <motion.button
                              type="button"
                              key={level.id}
                              whileHover={isUnlocked ? { scale: 1.08 } : {}}
                              whileTap={isUnlocked ? { scale: 0.95 } : {}}
                              onClick={() => {
                                if (!isUnlocked) return;
                                onSelect(idx);
                                setOpen(false);
                              }}
                              title={
                                isUnlocked
                                  ? level.name
                                  : "Complete previous level to unlock"
                              }
                              className="relative flex flex-col items-center justify-center rounded-xl py-2 px-1 font-display font-bold text-xs transition-all duration-150"
                              style={{
                                background: bg,
                                color,
                                boxShadow: shadow,
                                border,
                                cursor: isUnlocked ? "pointer" : "not-allowed",
                                opacity: !isUnlocked ? 0.45 : 1,
                                minHeight: "56px",
                              }}
                              data-ocid={`level.item.${idx + 1}`}
                            >
                              <span className="text-sm font-bold leading-none mb-1">
                                {!isUnlocked ? (
                                  <span
                                    style={{ color: "oklch(0.35 0.02 240)" }}
                                  >
                                    <LockIcon />
                                  </span>
                                ) : (
                                  idx + 1
                                )}
                              </span>

                              {isUnlocked && !isCurrent && (
                                <StarIcons stars={levelStars} />
                              )}

                              {isCurrent && (
                                <span
                                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                                  style={{ background: "oklch(0.13 0.02 255)" }}
                                />
                              )}

                              {isUnlocked && (
                                <span
                                  className="absolute top-1 right-1 text-center leading-none"
                                  style={{
                                    fontSize: "7px",
                                    opacity: 0.55,
                                    fontFamily: "Montserrat, sans-serif",
                                  }}
                                >
                                  {idx < 10 ? "6" : idx < 30 ? "8" : "10"}
                                </span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>

                      {chIdx < CHAPTER_RANGES.length - 1 && (
                        <div
                          className="mx-5 mb-1"
                          style={{
                            height: "1px",
                            background: "oklch(0.26 0.025 255 / 0.6)",
                          }}
                        />
                      )}
                    </div>
                  );
                })}

                <div style={{ height: "12px" }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
