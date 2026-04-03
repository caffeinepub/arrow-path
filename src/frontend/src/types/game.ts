export type TileType =
  | "empty"
  | "wall"
  | "start"
  | "goal"
  | "arrow_up"
  | "arrow_down"
  | "arrow_left"
  | "arrow_right"
  | "cracked" // intact cracked tile (breaks on first pass)
  | "cracked_broken" // already broken (ball fails if it hits this)
  | "gate_right" // one-way gate: only allows rightward passage
  | "gate_left" // only allows leftward passage
  | "gate_up" // only allows upward passage
  | "gate_down"; // only allows downward passage

export type ArrowDir = "up" | "down" | "left" | "right";

export type Direction = ArrowDir;

export type GamePhase = "editing" | "playing" | "won" | "failed";

export interface BallPos {
  row: number;
  col: number;
}

export interface InventoryItem {
  direction: ArrowDir;
  count: number;
  total: number;
}

export interface Level {
  id: string;
  name: string;
  grid: TileType[][];
  inventory: { direction: ArrowDir; count: number }[];
  startDir: Direction;
  gridSize: number;
  par: number;
}

export interface GameState {
  currentLevelIndex: number;
  grid: TileType[][];
  inventory: InventoryItem[];
  placedArrows: Map<string, ArrowDir>;
  gamePhase: GamePhase;
  ballPos: BallPos | null;
  ballDir: Direction | null;
  moveCount: number;
  ballFail: boolean;
  brokenTiles: Set<string>;
}
