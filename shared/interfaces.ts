import { GridCell } from "./enums";
import { Point } from "./types";

export interface IGameState {
    grid: GridCell[][],
    teams: IClientState[],
}

export interface IClientState {
    isSurfaced: boolean,
    subPosition: Point,
    subRoute: Point[],
}
