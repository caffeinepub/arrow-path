import { motion } from "motion/react";
import React from "react";
import type { TileType } from "../../types/game";

interface LevelEditorPanelProps {
  grid: TileType[][];
  onClose: () => void;
  onReset: () => void;
  accentColor: string;
}

export function LevelEditorPanel({
  grid,
  onClose,
  onReset,
  accentColor,
}: LevelEditorPanelProps) {
  const [copied, setCopied] = React.useState(false);

  const handleExport = () => {
    const walls: [number, number][] = [];
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < (grid[r]?.length ?? 0); c++) {
        if (grid[r][c] === "wall") walls.push([r, c]);
      }
    }
    const snippet = `walls: [\n${walls.map(([r, c]) => `  [${r}, ${c}]`).join(",\n")}\n]`;
    navigator.clipboard
      .writeText(snippet)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Fallback for environments without clipboard API
        const el = document.createElement("textarea");
        el.value = snippet;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  const wallCount = grid.flat().filter((t) => t === "wall").length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.96 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed top-16 right-4 z-50 w-64 rounded-xl border p-4 shadow-2xl"
      style={{
        background: "oklch(0.14 0.025 255)",
        borderColor: `${accentColor.replace(")", " / 0.5)")}`,
        boxShadow: `0 0 24px ${accentColor.replace(")", " / 0.15)")}, 0 8px 32px oklch(0 0 0 / 0.6)`,
      }}
      data-ocid="editor.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "1rem" }}>⚙️</span>
          <span
            className="font-display font-bold text-sm uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            Level Editor
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 rounded-md flex items-center justify-center text-xs transition-colors hover:opacity-80"
          style={{
            background: "oklch(0.25 0.025 255)",
            color: "oklch(0.60 0.03 240)",
          }}
          data-ocid="editor.close_button"
        >
          ✕
        </button>
      </div>

      {/* Mode indicator */}
      <div
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-3"
        style={{
          background: "oklch(0.55 0.18 25 / 0.12)",
          border: "1px solid oklch(0.55 0.18 25 / 0.4)",
        }}
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: "oklch(0.65 0.18 25)" }}
        />
        <span
          className="font-display text-xs font-bold uppercase tracking-wider"
          style={{ color: "oklch(0.65 0.18 25)" }}
        >
          Wall Toggle Active
        </span>
      </div>

      {/* Instructions */}
      <div
        className="rounded-lg px-3 py-2 mb-3 text-xs leading-relaxed"
        style={{
          background: "oklch(0.19 0.02 255)",
          color: "oklch(0.58 0.04 240)",
        }}
      >
        <p className="mb-1">
          <span style={{ color: "oklch(0.70 0.06 240)" }}>
            Click empty cell
          </span>{" "}
          → Wall
        </p>
        <p className="mb-1">
          <span style={{ color: "oklch(0.65 0.18 25)" }}>Click wall</span> →
          Empty
        </p>
        <p>Click export to copy walls array.</p>
      </div>

      {/* Wall count */}
      <div className="text-xs mb-3" style={{ color: "oklch(0.52 0.04 240)" }}>
        <span style={{ color: accentColor }} className="font-display font-bold">
          {wallCount}
        </span>{" "}
        walls currently placed
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleExport}
          className="w-full px-3 py-2 rounded-lg font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            background: copied
              ? "oklch(0.55 0.14 145 / 0.25)"
              : `${accentColor.replace(")", " / 0.15)")}`,
            color: copied ? "oklch(0.72 0.13 145)" : accentColor,
            border: `1px solid ${
              copied
                ? "oklch(0.55 0.14 145 / 0.45)"
                : accentColor.replace(")", " / 0.4)")
            }`,
          }}
          data-ocid="editor.secondary_button"
        >
          {copied ? "✓ Copied!" : "📋 Export Walls"}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full px-3 py-2 rounded-lg font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            background: "oklch(0.25 0.025 255)",
            color: "oklch(0.62 0.05 240)",
            border: "1px solid oklch(0.32 0.03 255 / 0.6)",
          }}
          data-ocid="editor.delete_button"
        >
          ↺ Reset Level
        </button>
      </div>
    </motion.div>
  );
}
