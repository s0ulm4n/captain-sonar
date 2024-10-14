import Point from "./Point.js";

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
