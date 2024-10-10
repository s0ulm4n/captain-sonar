import PropTypes from "prop-types";

import { GRID_SIZE, GridCell } from "../../../shared/constants.mjs";

const Grid = ({ grid, subPosition }) => {
    let output = [];

    if (grid && subPosition) {
        for (let y = 0; y < GRID_SIZE; y++) {
            let line = "";

            for (let x = 0; x < GRID_SIZE; x++) {
                if (y === subPosition.y && x === subPosition.x) {
                    line += '@';
                } else {
                    switch (grid[y][x]) {
                        case GridCell.EMPTY:
                            line += '.';
                            break;
                        case GridCell.LAND:
                            line += '^';
                            break;
                        case GridCell.PATH:
                            line += 'x';
                            break;
                        case GridCell.MINE:
                            line += 'M';
                            break;
                        default:
                            line += '?';
                    }
                }
            }

            output.push(line);
        }
    }

    return (
        <div>
            <p>Coords: ({subPosition ? subPosition.x + ", " + subPosition.y : ""})</p>
            {output.map((line, index) =>
                (<div className="grid-line" key={"line_" + index}>{line}</div>))}
        </div>
    );
};

Grid.propTypes = {
    grid: PropTypes.array,
    subPosition: PropTypes.object,
}

export default Grid;
