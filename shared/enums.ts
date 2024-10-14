// Possible grid cell values.
export const enum GridCell {
    Water,
    Land,
};

export const enum Direction {
    West = "West",
    North = "North",
    South = "South",
    East = "East",
};

// List of socket communication events
export const enum SocketEvents {
    updateTeamId = "updateTeamId",
    updateGameState = "updateGameState",
    tryMoveSub = "tryMoveSub",
    surface = "surface",
    submerge = "submerge",
};
