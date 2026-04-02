import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { GameGrid } from "./components/game/GameGrid";
import { InventoryPanel } from "./components/game/InventoryPanel";
import { LevelSelector } from "./components/game/LevelSelector";
import { SplashScreen } from "./components/game/SplashScreen";
import { WinModal } from "./components/game/WinModal";
import { LEVELS } from "./data/levels";
import { useGameState } from "./hooks/useGameState";
import {
  useHighestLevelReached,
  useMarkLevelCompleted,
} from "./hooks/useQueries";
import type { ArrowDir } from "./types/game";

function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [selectedArrow, setSelectedArrow] = React.useState<ArrowDir | null>(
    null,
  );

  const { mutate: markCompleted } = useMarkLevelCompleted();
  const { data: highestLevel } = useHighestLevelReached();

  const { state, play, reset, nextLevel, goToLevel, placeArrow, removeArrow } =
    useGameState((levelId: string, moveCount: number) => {
      markCompleted({ levelId, moveCount });
    });

  const isEditing = state.gamePhase === "editing";
  const isPlaying = state.gamePhase === "playing";
  const isWon = state.gamePhase === "won";
  const isFailed = state.gamePhase === "failed";
  const currentLevel = LEVELS[state.currentLevelIndex];
  const highestReached = highestLevel !== undefined ? Number(highestLevel) : 0;

  // Clear selected arrow when leaving editing phase
  React.useEffect(() => {
    if (!isEditing) setSelectedArrow(null);
  }, [isEditing]);

  const handleSelectArrow = (dir: ArrowDir | null) => {
    setSelectedArrow(dir);
  };

  const handlePlaceOnGrid = (row: number, col: number) => {
    if (!selectedArrow) return;
    placeArrow(row, col, selectedArrow);
    // Check if inventory still has this arrow after placing
    const item = state.inventory.find((i) => i.direction === selectedArrow);
    if (!item || item.count <= 1) {
      // Used the last one — deselect
      setSelectedArrow(null);
    }
    // Otherwise keep selected so user can keep placing same arrow type
  };

  const handleNextLevel = () => {
    if (state.currentLevelIndex < LEVELS.length - 1) {
      nextLevel();
    } else {
      reset();
    }
  };

  const handleReset = () => {
    setSelectedArrow(null);
    reset();
  };

  const handleGoToLevel = (idx: number) => {
    setSelectedArrow(null);
    goToLevel(idx);
  };

  if (showSplash) {
    return <SplashScreen onStart={() => setShowSplash(false)} />;
  }

  return (
    <div
      className="min-h-screen bg-streak flex flex-col"
      style={{ background: "oklch(0.27 0.025 255)" }}
    >
      {/* Header */}
      <motion.header
        animate={{ opacity: isPlaying ? 0.4 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 border-b border-border/40 px-4 py-3 sm:py-4"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center"
              style={{
                background: "oklch(0.76 0.07 210)",
                boxShadow: "0 0 10px oklch(0.76 0.07 210 / 0.35)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="oklch(0.20 0.02 255)"
                aria-hidden="true"
              >
                <path d="M20 12l-8 8v-5H4V9h8V4z" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl font-display font-bold uppercase tracking-widest neon-text-cyan">
              Waymark
            </h1>
          </div>

          {/* Level name badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-display uppercase">
              Level {state.currentLevelIndex + 1}:
            </span>
            <span
              className="text-xs font-display font-bold"
              style={{ color: "oklch(0.73 0.1 130)" }}
            >
              {currentLevel.name}
            </span>
          </div>

          {/* Phase indicator */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {isPlaying && (
                <motion.div
                  key="playing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display uppercase font-bold"
                  style={{
                    background: "oklch(0.76 0.07 210 / 0.12)",
                    color: "oklch(0.76 0.07 210)",
                    border: "1px solid oklch(0.76 0.07 210 / 0.35)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "oklch(0.76 0.07 210)" }}
                  />
                  Running
                </motion.div>
              )}
              {isFailed && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display uppercase font-bold"
                  style={{
                    background: "oklch(0.65 0.18 25 / 0.12)",
                    color: "oklch(0.65 0.18 25)",
                    border: "1px solid oklch(0.65 0.18 25 / 0.35)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "oklch(0.65 0.18 25)" }}
                  />
                  Failed
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 flex-1 px-3 py-4 sm:py-6">
        <div className="max-w-5xl mx-auto">
          {/* Game area */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start justify-center">
            {/* Grid section */}
            <div className="flex-1 flex flex-col items-center gap-4 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                {/* Grid wrapper - overflow-x scroll on mobile */}
                <div className="overflow-x-auto pb-2">
                  <div
                    className="relative rounded-lg"
                    style={{ minWidth: "min-content" }}
                  >
                    <GameGrid
                      grid={state.grid}
                      ballPos={state.ballPos}
                      gamePhase={state.gamePhase}
                      ballFail={state.ballFail}
                      levelIndex={state.currentLevelIndex}
                      selectedArrow={isEditing ? selectedArrow : null}
                      onPlace={handlePlaceOnGrid}
                      onRemoveArrow={removeArrow}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Hint text during editing */}
              <AnimatePresence>
                {isEditing && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-muted-foreground text-center font-display hidden sm:block"
                  >
                    {selectedArrow
                      ? `${selectedArrow.charAt(0).toUpperCase() + selectedArrow.slice(1)} selected — tap any grid cell to place`
                      : "Tap an arrow in the inventory, then tap a grid cell to place it"}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Inventory sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isPlaying ? 0.4 : 1, x: 0 }}
              transition={{
                duration: isPlaying ? 0.3 : 0.4,
                delay: isPlaying ? 0 : 0.1,
              }}
              className="w-full lg:w-52 xl:w-56 flex-shrink-0"
            >
              <InventoryPanel
                inventory={state.inventory}
                isEditing={isEditing}
                selectedArrow={selectedArrow}
                onSelectArrow={handleSelectArrow}
              />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer controls */}
      <motion.footer
        animate={{ opacity: isPlaying ? 0.4 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 border-t border-border/40 px-4 py-3"
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {/* Left: Level selector + action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <LevelSelector
              currentLevel={state.currentLevelIndex}
              onSelect={handleGoToLevel}
              highestReached={highestReached}
            />

            <div className="h-5 w-px bg-border/40 hidden sm:block" />

            {/* Play button */}
            <button
              type="button"
              onClick={play}
              disabled={!isEditing}
              className="px-6 py-2.5 rounded-lg font-display font-bold text-sm uppercase tracking-wider
                transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              style={
                isEditing
                  ? {
                      background: "oklch(0.76 0.07 210)",
                      color: "oklch(0.20 0.02 255)",
                      boxShadow: "0 0 14px oklch(0.76 0.07 210 / 0.4)",
                    }
                  : {
                      background: "oklch(0.31 0.025 255)",
                      color: "oklch(0.45 0.02 240)",
                    }
              }
              data-ocid="game.primary_button"
            >
              ▶ Play
            </button>

            {/* Reset button */}
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg font-display font-bold text-sm uppercase tracking-wider
                transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "oklch(0.29 0.025 255)",
                color: "oklch(0.70 0.02 240)",
                border: "1px solid oklch(0.38 0.03 255 / 0.6)",
              }}
              data-ocid="game.secondary_button"
            >
              ↺ Reset
            </button>
          </div>

          {/* Right: Stats */}
          <div className="flex items-center gap-4">
            <div className="text-xs">
              <span className="text-muted-foreground font-display uppercase tracking-wider">
                Steps{" "}
              </span>
              <span
                className="font-display font-bold"
                style={{ color: "oklch(0.76 0.07 210)" }}
              >
                {state.moveCount}
              </span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground font-display uppercase tracking-wider">
                Level{" "}
              </span>
              <span
                className="font-display font-bold"
                style={{ color: "oklch(0.73 0.1 130)" }}
              >
                {state.currentLevelIndex + 1}/{LEVELS.length}
              </span>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Win modal */}
      <WinModal
        isVisible={isWon}
        levelIndex={state.currentLevelIndex}
        moveCount={state.moveCount}
        onNextLevel={handleNextLevel}
        onReset={handleReset}
      />
    </div>
  );
}

export default App;
