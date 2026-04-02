export type TileType =
  | "empty"
  | "wall"
  | "start"
  | "goal"
  | "arrow_up"
  | "arrow_down"
  | "arrow_left"
  | "arrow_right";

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
}
