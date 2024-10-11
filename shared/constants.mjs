/**
 * Constants shared between the server and the client.
 */

// Size of the game area in cells.
export const GRID_SIZE = 15;

// Possible grid cell values.
export const GridCell = Object.freeze({
    EMPTY: 0,
    LAND: 1,
    PATH: 2,
    MINE: 3,
});

// List of socket communication events
export const SocketEvents = Object.freeze({
    updateTeamId: "updateTeamId",
    updateGameState: "updateGameState",
    tryMoveSub: "tryMoveSub",
    surface: "surface",
    submerge: "submerge",
});
