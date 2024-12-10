import { GRID_SIZE } from "../../../../shared/constants.mts";
import type { Point } from "../../../../shared/types.mts";
import { GridCell } from "../../../../shared/enums.mts";

type Props = {
    grid: GridCell[][],
    subPosition: Point,
    subRoute: Point[],
    mines: Point[],
};

const Grid = ({ grid, subPosition, subRoute, mines }: Props) => {
    const output: string[][] = [];

    if (grid && subPosition) {
        for (let y = 0; y < GRID_SIZE; y++) {
            const line: string[] = [];

            for (let x = 0; x < GRID_SIZE; x++) {
                {
                    if (grid[y][x] === GridCell.Land) {
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

        mines.forEach(cell => {
            output[cell.y][cell.x] = 'M';
        })

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

export default Grid;
