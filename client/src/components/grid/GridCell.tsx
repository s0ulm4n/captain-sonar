import "./GridCell.css";
import { CellType } from "../../../../shared/enums.mts";
import { Point } from "../../../../shared/types.mts";

type Props = {
    // Class name will be used to highlight certain cells, etc.
    className: string,
    // Land or water
    cellType: CellType,
    // An SVG to display in the cell, such as a mine, a submarine, etc.
    contentSrc: string | null,
    // Method called to set the highlighted cell.
    // setHighlightedCell: (x: number, y: number) => void,
    setHighlightedCell: (cell: Point) => void,
    // Position of this cell within the grid.
    gridCoords: Point,
};

const NO_HIGHLIGHT = new Point(-1, -1);

const GridCell = (
    { className, cellType, contentSrc, setHighlightedCell, gridCoords }: Props
) => {
    let path = null;

    if (contentSrc) {
        path = contentSrc;
    } else if (cellType === CellType.Land) {
        path = "/src/assets/land.svg";
    }

    return (
        <td
            className={className}
            // onMouseEnter={() => {setHighlightedCell(gridCoords.x, gridCoords.y)}}
            // onMouseLeave={() => {setHighlightedCell(-1, -1)}}
            onMouseEnter={() => {setHighlightedCell(gridCoords)}}
            onMouseLeave={() => {setHighlightedCell(NO_HIGHLIGHT)}}
        >
            {path ? <img className="svg" src={path} /> : null}
        </td>
    );
}

export default GridCell;
