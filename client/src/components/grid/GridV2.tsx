import "./GridV2.css";
import { GRID_SIZE } from "../../../../shared/constants.mts";
import { CellType } from "../../../../shared/enums.mts";
import { Point } from "../../../../shared/types.mts";
import GridCell from "./GridCell";
import { useState } from "react";

type Props = {
    grid: CellType[][],
    subPosition: Point,
    subRoute: Point[],
    mines: Point[],
};

const GridV2 = ({ grid, subPosition, subRoute, mines }: Props) => {
    const [highlightedCell, setHighlightedCell] = useState<Point | null>(null);
    
    const rows: React.ReactNode[] = [];
    const abcRow: React.ReactNode[] = [<td></td>];

    for (let i = 0; i < GRID_SIZE; i++) {
        const char = String.fromCharCode(65 + i);
        abcRow.push(<td>{char}</td>);
    }
    rows.push(<tr>{abcRow}</tr>);

    for (let y = 0; y < GRID_SIZE; y++) {
        const row = [];
        row.push(<td className="row-number">{y}</td>)

        for (let x = 0; x < GRID_SIZE; x++) {
            let className: string = "";
            
            if (highlightedCell) {
                if (highlightedCell.equalsCoord(x, y)) {
                    className = "strong-highlight";
                } else if (highlightedCell.x === x || highlightedCell.y === y) {
                    className = "weak-highlight";
                }
            }

            let contentSrc: string | null = null;

            // TODO: for some reason, I can't use Point.equalsCoord here.
            // I suspect that's because after transporting the data over a socket,
            // any class information is lost. So my original idea of making
            // Point a simple type was actually better.
            if (subPosition.x === x && subPosition.y === y) {
                contentSrc = "/src/assets/submarine.svg";
            } else if (mines.find((mine: Point) => mine.x === x && mine.y === y)) {
                contentSrc = "/src/assets/mine.svg";
            } else if (subRoute.find((point: Point) => point.x === x && point.y === y)) {
                contentSrc = "/src/assets/route.svg";
            }

            const cell = (
                <GridCell
                    className={className}
                    gridCoords={new Point(x,y)}
                    setHighlightedCell={
                        (cell: Point) => setHighlightedCell(cell)
                    }
                    cellType={grid[y][x]} 
                    contentSrc={contentSrc} 
                />
            );
            row.push(cell);
        }

        rows.push(<tr>{row}</tr>);
    }

    return (
        <div>
            <table className="grid-table">
                {rows}
            </table>
        </div>
    );
};

export default GridV2;
