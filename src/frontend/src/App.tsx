import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { AdScreen } from "./components/game/AdScreen";
import { GameGrid } from "./components/game/GameGrid";
import { HintModal } from "./components/game/HintModal";
import { InventoryPanel } from "./components/game/InventoryPanel";
import { LevelEditorPanel } from "./components/game/LevelEditorPanel";
import { LevelSelector } from "./components/game/LevelSelector";
import { SplashScreen } from "./components/game/SplashScreen";
import { WinModal } from "./components/game/WinModal";
import { LEVELS } from "./data/levels";
import { useGameState } from "./hooks/useGameState";
import {
  useHighestLevelReached,
  useMarkLevelCompleted,
} from "./hooks/useQueries";
import type { ArrowDir, TileType } from "./types/game";
import { getChapterForLevel } from "./utils/chapterThemes";
import { calcStars, loadStars, saveStar } from "./utils/starRating";
import type { StarCount } from "./utils/starRating";

function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [selectedArrow, setSelectedArrow] = React.useState<ArrowDir | null>(
    null,
  );
  const [starsMap, setStarsMap] = React.useState<Record<string, StarCount>>(
    () => loadStars(),
  );
  const [winStars, setWinStars] = React.useState<StarCount>(1);

  // Ad / monetisation state
  const [showBetweenLevelAd, setShowBetweenLevelAd] = React.useState(false);
  const [adsRemoved] = React.useState(
    () => localStorage.getItem("waymark_ads_removed") === "true",
  );
  const [showHintModal, setShowHintModal] = React.useState(false);
  const [hintTile, setHintTile] = React.useState<{
    row: number;
    col: number;
    dir: ArrowDir;
  } | null>(null);

  // Admin mode — activated via ?admin=1 URL param
  const [adminMode] = React.useState(
    () => new URLSearchParams(window.location.search).get("admin") === "1",
  );
  const [showEditorPanel, setShowEditorPanel] = React.useState(false);
  // Admin grid override — separate from real game state so edits don't corrupt it
  const [adminGrid, setAdminGrid] = React.useState<TileType[][] | null>(null);

  const { mutate: markCompleted } = useMarkLevelCompleted();
  const { data: highestLevel } = useHighestLevelReached();

  const { state, play, reset, nextLevel, goToLevel, placeArrow, removeArrow } =
    useGameState(
      (levelId: string, moveCount: number, arrowsUsed: number, par: number) => {
        markCompleted({ levelId, moveCount });
        const stars = calcStars(arrowsUsed, par);
        saveStar(levelId, stars);
        setWinStars(stars);
        setStarsMap(loadStars());
      },
    );

  const isEditing = state.gamePhase === "editing";
  const isPlaying = state.gamePhase === "playing";
  const isWon = state.gamePhase === "won";
  const currentLevel = LEVELS[state.currentLevelIndex];
  const highestReached = highestLevel !== undefined ? Number(highestLevel) : 0;

  const chapter = getChapterForLevel(state.currentLevelIndex);

  // The grid shown to the user: admin override takes precedence
  const displayGrid = adminGrid ?? state.grid;

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
    const item = state.inventory.find((i) => i.direction === selectedArrow);
    if (!item || item.count <= 1) {
      setSelectedArrow(null);
    }
  };

  // Admin cell toggle: flip empty ↔ wall on the admin grid overlay
  const handleAdminToggle = (row: number, col: number) => {
    const sourceGrid = adminGrid ?? state.grid;
    const newGrid = sourceGrid.map((r) => [...r]);
    const tile = newGrid[row][col];
    if (tile === "wall") {
      newGrid[row][col] = "empty";
    } else if (
      tile === "empty" ||
      tile === "arrow_up" ||
      tile === "arrow_down" ||
      tile === "arrow_left" ||
      tile === "arrow_right" ||
      tile === "cracked" ||
      tile === "cracked_broken"
    ) {
      newGrid[row][col] = "wall";
    }
    // Don't toggle start/goal/gates
    setAdminGrid(newGrid);
  };

  const handleNextLevel = () => {
    if (state.currentLevelIndex < LEVELS.length - 1) {
      // Show ad every 3 levels (when next level number is divisible by 3)
      const nextLevelNum = state.currentLevelIndex + 1; // 0-indexed, so next level number = currentIndex + 1
      if (!adsRemoved && nextLevelNum % 3 === 0) {
        setShowBetweenLevelAd(true);
      } else {
        nextLevel();
        setAdminGrid(null);
      }
    } else {
      reset();
      setAdminGrid(null);
    }
  };

  const handleAdClose = () => {
    setShowBetweenLevelAd(false);
    nextLevel();
    setAdminGrid(null);
  };

  const handlePlay = () => {
    setHintTile(null);
    play();
  };

  const handleReset = () => {
    setSelectedArrow(null);
    setHintTile(null);
    setAdminGrid(null);
    reset();
  };

  const handleGoToLevel = (idx: number) => {
    setSelectedArrow(null);
    setHintTile(null);
    setAdminGrid(null);
    goToLevel(idx);
  };

  const handleRevealHint = (row: number, col: number, dir: ArrowDir) => {
    setHintTile({ row, col, dir });
    setShowHintModal(false);
  };

  if (showSplash) {
    return <SplashScreen onStart={() => setShowSplash(false)} />;
  }

  return (
    <div
      className="min-h-screen bg-streak flex flex-col"
      style={
        {
          background: chapter.bg,
          transition: "background 0.8s ease",
          "--chapter-bg": chapter.bg,
          "--chapter-accent": chapter.accent,
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <motion.header
        animate={{ opacity: isPlaying ? 0.4 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 border-b border-border/40 px-4 py-3 sm:py-4"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center transition-all duration-700"
              style={{
                background: chapter.accent,
                boxShadow: `0 0 10px ${chapter.accent.replace(")", " / 0.35)")}`,
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

          {/* Center: chapter label + level name */}
          <div className="hidden sm:flex flex-col items-center gap-0.5">
            <span
              className="text-xs font-display uppercase tracking-widest px-2.5 py-0.5 rounded-full"
              style={{
                color: chapter.accent,
                background: `${chapter.accent.replace("oklch(", "oklch(").replace(")", " / 0.12)")}`,
                border: `1px solid ${chapter.accent.replace(")", " / 0.3)")}`,
                opacity: 0.85,
              }}
              data-ocid="chapter.badge"
            >
              {chapter.label}
            </span>
            <span
              className="text-xs font-display font-bold"
              style={{ color: "oklch(0.73 0.1 130)" }}
            >
              {currentLevel.name}
            </span>
          </div>

          {/* Phase indicator + Hint button + Admin button */}
          <div className="flex items-center gap-2">
            {/* Hint button — only visible during editing phase */}
            <AnimatePresence>
              {isEditing && (
                <motion.button
                  key="hint-btn"
                  type="button"
                  onClick={() => setShowHintModal(true)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  title="Get a hint (watch ad)"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display text-xs uppercase tracking-wider border transition-colors duration-200"
                  style={{
                    borderColor: `${chapter.accent.replace(")", " / 0.45)")}`,
                    color: chapter.accent,
                    background: `${chapter.accent.replace(")", " / 0.07)")}`,
                  }}
                  data-ocid="hint.open_modal_button"
                >
                  <span style={{ fontSize: "1rem", lineHeight: 1 }}>💡</span>
                  <span className="hidden sm:inline">Hint</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Admin mode gear button */}
            <AnimatePresence>
              {adminMode && isEditing && (
                <motion.button
                  key="admin-btn"
                  type="button"
                  onClick={() => setShowEditorPanel((v) => !v)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  title="Toggle Level Editor"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display text-xs uppercase tracking-wider border transition-colors duration-200"
                  style={{
                    borderColor: showEditorPanel
                      ? "oklch(0.65 0.18 25 / 0.6)"
                      : "oklch(0.65 0.18 25 / 0.35)",
                    color: "oklch(0.65 0.18 25)",
                    background: showEditorPanel
                      ? "oklch(0.65 0.18 25 / 0.15)"
                      : "oklch(0.65 0.18 25 / 0.07)",
                  }}
                  data-ocid="editor.open_modal_button"
                >
                  <span style={{ fontSize: "1rem", lineHeight: 1 }}>⚙</span>
                  <span className="hidden sm:inline">Editor</span>
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isPlaying && (
                <motion.div
                  key="playing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display uppercase font-bold"
                  style={{
                    background: `${chapter.accent.replace(")", " / 0.12)")}`,
                    color: chapter.accent,
                    border: `1px solid ${chapter.accent.replace(")", " / 0.35)")}`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: chapter.accent }}
                  />
                  Running
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 flex-1 px-3 py-4 sm:py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start justify-center">
            {/* Grid section */}
            <div className="flex-1 flex flex-col items-center gap-4 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <div className="overflow-x-auto pb-2">
                  <div
                    className="relative rounded-lg"
                    style={{ minWidth: "min-content" }}
                  >
                    <GameGrid
                      grid={displayGrid}
                      ballPos={state.ballPos}
                      gamePhase={state.gamePhase}
                      ballFail={state.ballFail}
                      levelIndex={state.currentLevelIndex}
                      selectedArrow={
                        isEditing && !adminMode ? selectedArrow : null
                      }
                      onPlace={handlePlaceOnGrid}
                      onRemoveArrow={removeArrow}
                      brokenTiles={state.brokenTiles}
                      hintTile={hintTile}
                      adminMode={adminMode}
                      onAdminToggle={handleAdminToggle}
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
                    {adminMode
                      ? "Admin mode active — click cells to toggle walls · Use ⚙ to export"
                      : selectedArrow
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
              starsMap={starsMap}
              chapterAccent={chapter.accent}
            />

            <div className="h-5 w-px bg-border/40 hidden sm:block" />

            {/* Play button */}
            <button
              type="button"
              onClick={handlePlay}
              disabled={!isEditing}
              className="px-6 py-2.5 rounded-lg font-display font-bold text-sm uppercase tracking-wider
                transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              style={
                isEditing
                  ? {
                      background: chapter.accent,
                      color: "oklch(0.20 0.02 255)",
                      boxShadow: `0 0 14px ${chapter.accent.replace(")", " / 0.4)")}`,
                      transition: "background 0.7s ease, box-shadow 0.7s ease",
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
            {adminMode && (
              <span
                className="text-xs font-display font-bold uppercase tracking-wider px-2 py-1 rounded"
                style={{
                  color: "oklch(0.65 0.18 25)",
                  background: "oklch(0.55 0.18 25 / 0.1)",
                  border: "1px solid oklch(0.65 0.18 25 / 0.3)",
                }}
              >
                ⚙ Admin
              </span>
            )}
            <div className="text-xs">
              <span className="text-muted-foreground font-display uppercase tracking-wider">
                Steps{" "}
              </span>
              <span
                className="font-display font-bold"
                style={{ color: chapter.accent, transition: "color 0.7s ease" }}
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
        stars={winStars}
        chapterAccent={chapter.accent}
        onNextLevel={handleNextLevel}
        onReset={handleReset}
      />

      {/* Between-level ad overlay */}
      <AnimatePresence>
        {showBetweenLevelAd && (
          <AdScreen onClose={handleAdClose} accentColor={chapter.accent} />
        )}
      </AnimatePresence>

      {/* Hint modal */}
      <AnimatePresence>
        {showHintModal && (
          <HintModal
            chapterAccent={chapter.accent}
            currentLevelIndex={state.currentLevelIndex}
            placedArrows={state.placedArrows}
            onRevealHint={handleRevealHint}
            onClose={() => setShowHintModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Level Editor Panel (admin mode) */}
      <AnimatePresence>
        {adminMode && showEditorPanel && (
          <LevelEditorPanel
            grid={displayGrid}
            onClose={() => setShowEditorPanel(false)}
            onReset={handleReset}
            accentColor={chapter.accent}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
