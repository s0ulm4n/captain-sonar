import Point from "./Point.js";

/**
 * Object representing the state of one of the teams.
 * 
 * @property {Point} subPosition - current sub position {x: number, y: number}
 * @property {boolean} isSurfaced - is the sub surfaced
 * @property {Point[]} subRoute - the route of the submarine so far: [{x, y}]
 */
class ClientState {
    isSurfaced: boolean;
    subPosition: Point;
    subRoute: Point[];

    constructor(xPos: number, yPos: number) {
        this.isSurfaced = false;

        this.subPosition = {
            x: xPos,
            y: yPos,
        };

        this.subRoute = [];
    }
};

export default ClientState;
