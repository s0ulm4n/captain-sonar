import { Ability, Direction, CellType, PlayerRole, SubSystem } from "./enums.mjs";
import { Point } from "./types.mjs";

export interface IGameState {
    grid: CellType[][],
    teams: IClientState[],
}

export interface IPlayerState {
    id: string,
    teamId: number,
    role: PlayerRole,
}

export interface IClientState {
    // The ID of the team this state belongs to
    teamId: number,
    // Whether the submarine is surfaced or submerged. Surfaced submarines can't move!
    isSurfaced: boolean,
    // The position of the submarine on the grid.
    subPosition: Point,
    // Previous route of the submarine. Surfacing and submerging erases the route.
    subRoute: Point[],
    // Engineering nodes grouped by the corresponding directions.
    // The nodes are grouped this way on the Engineer board, so that the engineer
    // can break a node corresponding to the move ordered by the captain.
    engSystemNodeGroups: { [id: string]: IEngSystemNode[]; },
    // Number of nodes of a particular subsystem that are currently broken.
    // If this number is >0, any corresponding abilities can't be used.
    systemBreakages: { [id: string]: number; },
    // Number of nodes in a particular circuit that are currently broken.
    // Once every node in a circuit is broken, all of the nodes in that circuit
    // are automatically fixed.
    circuitBreakages: number[],
    // Current submarine health. The game ends when one of the subs reaches 0 health.
    subHealth: number,
    // The most recent move ordered by the captain that HASN'T BEEN RESOLVED
    // yet. If this isn't `null`, that means the team is waiting on the engineer
    // and weapons specialist to "enable" the more by completing the actions
    // required by their roles.
    pendingMove: {
        coord: Point;
        dir: Direction;
    } | null,
    // Submarine's abilities, including their corresponsing subsystem and the
    // ability's readiness threshold and current readiness. Readiness can't go
    // over the threshold, and once the threshold is reached the ability can be
    // used.
    abilities: { [id: string]: ISubAbility; },
    // List of mines deployed by this team.
    mines: Point[],
}

export interface IEngSystemNode {
    id: number,
    system: SubSystem,
    circuit: number | null,
    isBroken: boolean,
}

export interface ISubAbility {
    ability: Ability,
    system: SubSystem,
    readinessThreshold: number,
    readiness: number,
}
