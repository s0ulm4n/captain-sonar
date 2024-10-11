/**
 * Object representing the state of one of the teams.
 * 
 * @property {Object} subPosition - current sub position {x: number, y: number}
 * @property {boolean} isSurfaced - is the sub surfaced
 * @property {Array} subRoute - the route of the submarine so far: [{x, y}]
 */
class TeamData {
    constructor(xPos, yPos) {
        this.isSurfaced = false;

        this.subPosition = {
            x: xPos,
            y: yPos,
        };

        this.subRoute = [];
    }
};

export default TeamData;
