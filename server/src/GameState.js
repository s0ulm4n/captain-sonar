import { GRID_SIZE } from "../../shared/constants.mjs";
import TeamData from "./TeamData.js";

/**
 * Object representing the state of the game.
 * @typedef {Object} GameState
 * @property {Array} grid - two-dimensional grid representing the game area.
 *                          Individual cells hold `false` for water or `true`
 *                          for land.
 * @property {Array} teams - array with two elements holding data about the teams.
 */
class GameState {
    constructor() {
        // The game area
        this.grid = Array.from({ length: GRID_SIZE }, () =>
            new Array(GRID_SIZE).fill(false));

        // Initialize both teams, put their subs on the opposite sides of the grid.
        this.teams = [
            new TeamData(2, 7),
            new TeamData(12, 7),
        ];

        // Sprinkle in some random islands, staying away from the edges of the grid
        for (let y = 2; y < GRID_SIZE - 2; y++) {
            for (let x = 2; x < GRID_SIZE - 2; x++) {
                if (
                    // Make sure to not put an island on top of a sub!
                    // !(this.subPosition.y === y && this.subPosition.x === x)
                    !(this.teams[0].subPosition.x === x && this.teams[1].subPosition.y === y)
                    && !(this.teams[0].subPosition.x === x && this.teams[1].subPosition.y === y)
                    && (Math.floor(Math.random() * 10) <= 1)
                ) {
                    // this.grid[y][x] = GridCell.LAND;
                    this.grid[y][x] = true;
                }
            }
        }
    }

    /**
     * @typedef {Object} TryMoveSubResponse
     * @property {boolean} success - whether the sub moved successfully
     * @property {Object} newSubPos - new position of the sub (null in case the sub failed to move)
     * @property {string} message - diagnostic message (empty in case the sub moved successfully)
     */

    /**
     * Attempt to move the sub.
     * 
     * @param {number} dx - movement along X axis. Must be an integer between -1 and 1.
     * @param {number} dy - movement along Y asix. Must be an integer between -1 and 1.
     * @returns {TryMoveSubResponse}
     */
    tryMoveSub = (teamId, dx, dy) => {
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
            }
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
            }
        }
        if (Math.abs(dx) + Math.abs(dy) > 1) {
            return {
                success: false,
                newSubPosition: null,
                message: "The sub can't move diagonally!"
            }
        }
        if (dx === 0 && dy === 0) {
            return {
                success: false,
                newSubPosition: null,
                message: "New destination is the same as the original sub position!"
            }
        }

        const oldSubPos = team.subPosition;
        const newSubPos = {
            x: oldSubPos.x + dx,
            y: oldSubPos.y + dy,
        }

        // Don't fall off the map
        if (
            newSubPos.x < 0 || newSubPos.x >= GRID_SIZE
            || newSubPos.y < 0 || newSubPos.y >= GRID_SIZE
        ) {
            return {
                success: false,
                newSubPosition: null,
                message: "Can't move beyond the edge of the grid!",
            }
        }

        // Can't move into cells that aren't water
        if (this.grid[newSubPos.y][newSubPos.x]) {
            return {
                success: false,
                newSubPosition: null,
                message: "Destination cell is land: ("
                    + newSubPos.x + ", " + newSubPos.y + ")",
            }
        }

        // Can't cross own route
        team.subRoute.forEach((cell) => {
            if (cell.x === newSubPos.x && cell.y === newSubPos.y) {
                return {
                    success: false,
                    newSubPosition: null,
                    message: "Sub can't cross its route: ("
                        + newSubPos.x + ", " + newSubPos.y + ")",
                };
            }
        })

        // If we can move, mark the route of the sub
        team.subRoute.push(oldSubPos);

        team.subPosition = newSubPos;
        return {
            success: true,
            newSubPosition: newSubPos,
            message: "",
        }
    }

    /**
     * Surface the sub
     * 
     * @returns {boolean}
     */
    surface = (teamId) => {
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
    }

    /**
     * Submerge the sub
     * 
     * @returns {boolean}
     */
    submerge = (teamId) => {
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
    }
}

export default GameState;
