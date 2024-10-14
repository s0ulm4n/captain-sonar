// import { GRID_SIZE, GridCell } from "../../../shared/constants.js";
import { GRID_SIZE } from "../../../shared/constants.mjs";
import { GridCell } from "../../../shared/enums.js";
import ClientState from "./ClientState.js";
import Point from "./Point.js";

class GameState {
    grid: GridCell[][];
    teams: ClientState[];

    constructor() {
        // The game area
        this.grid = Array.from({ length: GRID_SIZE }, () =>
            new Array(GRID_SIZE).fill(GridCell.Water));

        // Initialize both teams, put their subs on the opposite sides of the grid.
        this.teams = [
            new ClientState(2, 7),
            new ClientState(12, 7),
        ];

        // Sprinkle in some random islands, staying away from the edges of the grid
        for (let y = 2; y < GRID_SIZE - 2; y++) {
            for (let x = 2; x < GRID_SIZE - 2; x++) {
                if (
                    // Make sure to not put an island on top of a sub!
                    !(this.teams[0].subPosition.x === x && this.teams[1].subPosition.y === y)
                    && !(this.teams[0].subPosition.x === x && this.teams[1].subPosition.y === y)
                    && (Math.floor(Math.random() * 10) <= 1)
                ) {
                    this.grid[y][x] = GridCell.Land;
                }
            }
        }
    }

    /**
     * Attemt to move the submarine
     */
    tryMoveSub(teamId: number, dx: number, dy: number): {
        success: boolean,
        newSubPosition: Point,
        message: string,
    } {
        console.log("tryMoveSub called: teamId=", teamId, "; dx: ", dx, "; dy: ", dy);
        const team = this.teams[teamId];

        if (!team) {
            return {
                success: false,
                newSubPosition: null,
                message: "Invalid team id: " + teamId,
            };
        }

        // Can't move if surfaced
        if (team.isSurfaced) {
            return {
                success: false,
                newSubPosition: null,
                message: "Can't move when surfaced!",
            };
        }

        // Truncate the input just in case
        dx = Math.trunc(dx);
        dy = Math.trunc(dy);

        // We should only move the sub orthogonally,
        // no more and no less than one cell at a time.
        if (dx < -1 || dx > 1 || dy < -1 || dy > 1) {
            return {
                success: false,
                newSubPosition: null,
                message: "The sub can only move one cell at a time!"
            };
        }
        if (Math.abs(dx) + Math.abs(dy) > 1) {
            return {
                success: false,
                newSubPosition: null,
                message: "The sub can't move diagonally!"
            };
        }
        if (dx === 0 && dy === 0) {
            return {
                success: false,
                newSubPosition: null,
                message: "New destination is the same as the original sub position!"
            };
        }

        const oldSubPos = team.subPosition;
        const newSubPos = {
            x: oldSubPos.x + dx,
            y: oldSubPos.y + dy,
        };

        // Don't fall off the map
        if (
            newSubPos.x < 0 || newSubPos.x >= GRID_SIZE
            || newSubPos.y < 0 || newSubPos.y >= GRID_SIZE
        ) {
            return {
                success: false,
                newSubPosition: null,
                message: "Can't move beyond the edge of the grid!",
            };
        }

        // Can't move into cells that aren't water
        if (this.grid[newSubPos.y][newSubPos.x]) {
            return {
                success: false,
                newSubPosition: null,
                message: "Destination cell is land: ("
                    + newSubPos.x + ", " + newSubPos.y + ")",
            };
        }

        // Can't cross own route
        for (const cell of team.subRoute) {
            if (cell.x === newSubPos.x && cell.y === newSubPos.y) {
                return {
                    success: false,
                    newSubPosition: null,
                    message: "Sub can't cross its route: ("
                        + newSubPos.x + ", " + newSubPos.y + ")",
                };
            }
        }

        // If we can move, mark the route of the sub
        team.subRoute.push(oldSubPos);

        team.subPosition = newSubPos;
        return {
            success: true,
            newSubPosition: newSubPos,
            message: "",
        };
    };

    /**
     * Surface the sub
     */
    surface(teamId: number): boolean {
        const team = this.teams[teamId];
        if (!team) {
            return false;
        }

        // Can't do this if already surfaced
        if (team.isSurfaced) {
            return false;
        }

        // Erase the sub route
        team.subRoute = [];

        team.isSurfaced = true;
        return true;
    };

    /**
     * Submerge the sub
     */
    submerge(teamId: number): boolean {
        const team = this.teams[teamId];
        if (!team) {
            return false;
        }

        // Can't submerge if the sub is already submerged
        if (!team.isSurfaced) {
            return false;
        }

        team.isSurfaced = false;
        return true;
    };
}

export default GameState;
