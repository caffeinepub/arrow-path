import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Progress {
    levelId: string;
    bestMoveCount: bigint;
}
export interface backendInterface {
    getAllProgress(): Promise<Array<Progress>>;
    getBestMoveCount(levelId: string): Promise<bigint | null>;
    getHighestLevelReached(): Promise<bigint>;
    markLevelCompleted(levelId: string, moveCount: bigint): Promise<void>;
    resetProgress(): Promise<void>;
}
