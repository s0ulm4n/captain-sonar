// Size of the game area in cells.
export const GRID_SIZE = 15;

// List of socket communication events
export const SocketEvents = Object.freeze({
    updateTeamId: "updateTeamId",
    updateGameState: "updateGameState",
    tryMoveSub: "tryMoveSub",
    surface: "surface",
    submerge: "submerge",
});
