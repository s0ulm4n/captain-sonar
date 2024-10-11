import PropTypes from "prop-types";

import { GRID_SIZE } from "../../../shared/constants.mjs";

const Grid = ({ grid, subPosition, subRoute }) => {
    let output = [];

    // console.log("Rendering grid");
    // console.log(grid);
    // console.log(subPosition);

    if (grid && subPosition) {
        for (let y = 0; y < GRID_SIZE; y++) {
            let line = [];

            for (let x = 0; x < GRID_SIZE; x++) {
                {
                    if (grid[y][x]) {
                        line.push('^');
                    } else {
                        line.push('.');
                    }
                }
            }

            output.push(line);
        }

        subRoute.forEach(cell => {
            output[cell.y][cell.x] = 'x';
        });

        output[subPosition.y][subPosition.x] = '@';
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
    subRoute: PropTypes.array,
}

export default Grid;
