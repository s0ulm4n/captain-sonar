import { GRID_SIZE, GridCell } from "../../shared/constants.mjs";

/**
 * Object representing the state of the game.
 * @typedef {Object} GameState
 * @property {Array} grid - two-dimensional grid representing the game area
 * @property {Object} subPosition - current sub position {x: number, y: number}
 * @property {boolean} isSurfaced - is the sub surfaced
 */
class GameState {
    constructor() {
        // Whether the sub is submerged or surfaced
        this.isSurfaced = false;

        // The game area
        this.grid = Array.from({ length: GRID_SIZE }, () =>
            new Array(GRID_SIZE).fill(GridCell.EMPTY));

        // Position of the sub on the grid
        this.subPosition = {
            x: 7,
            y: 7,
        };

        // Sprinkle in some random islands, staying away from the edges of the grid
        for (let y = 2; y < GRID_SIZE - 2; y++) {
            for (let x = 2; x < GRID_SIZE - 2; x++) {
                if (
                    // Make sure to not put an island on top of the sub!
                    !(this.subPosition.y === y && this.subPosition.x === x)
                    && (Math.floor(Math.random() * 10) <= 1)
                ) {
                    this.grid[y][x] = GridCell.LAND;
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
    tryMoveSub = (dx, dy) => {
        // Can't move if surfaced
        if (this.isSurfaced) {
            // throw?
            return {
                success: false,
                newSubPosition: null,
                message: "Can't move when surfaced!"
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

        const oldSubPos = this.subPosition;
        const newSubPos = {
            x: oldSubPos.x + dx,
            y: oldSubPos.y + dy,
        }

        // Don't fall off the map
        if (newSubPos.x < 0 || newSubPos.x >= GRID_SIZE || newSubPos.y < 0 || newSubPos.y >= GRID_SIZE) {
            return {
                success: false,
                newSubPosition: null,
                message: "Can't move beyond the edge of the grid!",
            }
        }

        // Can't move into cells that aren't empty
        if (this.grid[newSubPos.y][newSubPos.x] !== GridCell.EMPTY) {
            return {
                success: false,
                newSubPosition: null,
                message: "Destination cell is not empty: " + this.grid[newSubPos.y][newSubPos.x],
            }
        }

        // If we can move, mark the path of the sub
        this.grid[oldSubPos.y][oldSubPos.x] = GridCell.PATH;

        this.subPosition = newSubPos;
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
    surface = () => {
        // Can't do this if already surfaced
        if (this.isSurfaced) {
            return false;
        }

        this.isSurfaced = true;

        // Erase the sub path
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (this.grid[i][j] === GridCell.PATH) {
                    this.grid[i][j] = GridCell.EMPTY;
                }
            }
        }

        return true;
    }

    /**
     * Submerge the sub
     * 
     * @returns {boolean}
     */
    submerge = () => {
        // Can't submerge if the sub is already submerged
        if (!this.isSurfaced) {
            return false;
        }

        this.isSurfaced = false;
        return true;
    }
}

export default GameState;
