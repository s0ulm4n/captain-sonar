import { GridCell, SubSystem } from "./enums.mjs";
import { Point } from "./types.js";

export interface IGameState {
    grid: GridCell[][],
    teams: IClientState[],
}

export interface IClientState {
    teamId: number;
    isSurfaced: boolean,
    subPosition: Point,
    subRoute: Point[],
    engSystemNodeGroups: { [id: string]: IEngSystemNode[]; };
    systemBreakages: { [id: string]: number; };
    circuitBreakages: number[];
    subHealth: number;
}

export interface IEngSystemNode {
    id: number,
    system: SubSystem,
    circuit: number | null,
    isBroken: boolean,
}
