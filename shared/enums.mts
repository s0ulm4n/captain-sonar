// Possible grid cell values.
export const enum GridCell {
    Water,
    Land,
};

// Note: this is a "computed" enum, because I want to be able to iterate over
// its values, which is impossible for const enums (since they don't exist
// at runtime).
export enum Direction {
    West = "West",
    North = "North",
    South = "South",
    East = "East",
};

export const enum SubSystem {
    Weapons = "Weapons",
    Sonar = "Sonar",
    Silence = "Silence",
    Reactor = "Reactor",
}

// Note: this is a "computed" enum, see above for the reason.
export enum Ability {
    Mines = "Mines",
    Torpedo = "Torpedo",
    Drones = "Drones",
    Sonar = "Sonar",
    Silence = "Silence",
}

// List of socket communication events
export const enum SocketEvents {
    updateTeamId = "updateTeamId",
    updateGameState = "updateGameState",
    tryMoveSub = "tryMoveSub",
    surface = "surface",
    submerge = "submerge",
    breakSystemNode = "breakSystemNode",
    chargeAbility = "chargeAbility",
    activateAbility = "activateAbility",
};
