import { GRID_SIZE } from "../../../shared/constants.mjs";
import { GridCell } from "../../../shared/enums.mjs";
import { IGameState } from "../../../shared/interfaces.mjs";
import ClientState from "./ClientState.js";

class GameState implements IGameState {
    grid: GridCell[][];
    teams: ClientState[];

    constructor() {
        // The game area
        this.grid = Array.from({ length: GRID_SIZE }, () =>
            new Array(GRID_SIZE).fill(GridCell.Water));

        // Initialize both teams, put their subs on the opposite sides of the grid.
        this.teams = [
            new ClientState(/*teamId*/ 0, /*xPos*/ 2, /*yPos*/ 7),
            new ClientState(/*teamId*/ 1, /*xPos*/ 12, /*yPos*/ 7),
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
}

export default GameState;
