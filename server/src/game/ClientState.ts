import { CIRCUIT_SELF_HEAL_THRESHOLD, GRID_SIZE, STARTING_SUB_HEALTH } from "../../../shared/constants.mjs";
import { Direction, GridCell, SubSystem } from "../../../shared/enums.mjs";
import { Point } from "../../../shared/types.js";
import EngSystemNode from "./EngSystemNode.js";
import { IClientState } from "../../../shared/interfaces.mjs";

class ClientState implements IClientState {
    teamId: number;
    isSurfaced: boolean;
    subPosition: Point;
    subRoute: Point[];
    engSystemNodeGroups: { [id: string]: EngSystemNode[]; };
    systemBreakages: { [id: string]: number; };
    circuitBreakages: number[];
    subHealth: number;
    pendingMove: {
        coord: Point,
        dir: Direction,
    } | null;

    constructor(teamId: number, xPos: number, yPos: number) {
        this.teamId = teamId;
        this.subPosition = {
            x: xPos,
            y: yPos,
        };

        this.isSurfaced = false;
        this.subRoute = [];
        this.subHealth = STARTING_SUB_HEALTH;
        this.systemBreakages = {};
        this.pendingMove = null;

        this.initEngSystemNodeGroups();
        this.resetSystemBreakages();
    }

    /** Game actions **/

    /**
     * Attemt to move the submarine
     */
    tryMoveSub(grid: GridCell[][], dir: Direction): {
        success: boolean,
        message: string,
    } {
        let response;
        console.log("tryMoveSub called: teamId=", this.teamId, "; dir: ", dir);

        // Can't move if surfaced
        if (this.isSurfaced) {
            response = {
                success: false,
                message: "Can't move when surfaced!",
            };
            console.log(response);
            return response;
        }

        let dx = 0;
        let dy = 0;
        switch (dir) {
            case Direction.West:
                dx = -1;
                break;
            case Direction.East:
                dx = 1;
                break;
            case Direction.North:
                dy = -1;
                break;
            case Direction.South:
                dy = 1;
                break;
        }

        const oldSubPos = this.subPosition;
        const newSubPos = {
            x: oldSubPos.x + dx,
            y: oldSubPos.y + dy,
        };

        // Don't fall off the map
        if (
            newSubPos.x < 0 || newSubPos.x >= GRID_SIZE
            || newSubPos.y < 0 || newSubPos.y >= GRID_SIZE
        ) {
            response = {
                success: false,
                message: "Can't move beyond the edge of the grid!",
            };
            console.log(response);
            return response;
        }

        const { isValid, message } = this.isValidMove(grid, newSubPos);

        if (isValid) {
            this.queueMove(newSubPos, dir);

            response = {
                success: true,
                message: "",
            };
        } else {
            response = {
                success: false,
                message: message,
            };
        }
        console.log(response);
        return response;
    };

    queueMove(newSubPos: Point, dir: Direction): void {
        this.pendingMove = {
            coord: newSubPos,
            dir: dir
        };
        console.log("New pending move: ", this.pendingMove);
    }

    // Actually move the sub.
    moveSub(): void {
        if (this.pendingMove != null) {
            this.subRoute.push(this.subPosition);
            this.subPosition = this.pendingMove.coord;
            this.pendingMove = null;
        }
    };

    /**
     * Surface the sub. Note that the sub route and breakages are reset
     * when the sub RE-SUBMERGES, not when it surfaces.
     */
    surface(): boolean {
        // Can't do this if already surfaced
        if (this.isSurfaced) {
            return false;
        }

        this.isSurfaced = true;
        return true;
    };

    /**
     * Submerge the sub. Erases the sur route and resets breakages.
     */
    submerge(): boolean {
        // Can't submerge if the sub is already submerged
        if (!this.isSurfaced) {
            return false;
        }

        // Erase the sub route
        this.subRoute = [];

        // Reset all the breakages
        for (const dir in Direction) {
            this.engSystemNodeGroups[dir].forEach((node) => {
                node.isBroken = false;
            });
        }
        this.resetSystemBreakages();

        this.isSurfaced = false;
        return true;
    };

    /**
     * Break a single engineering system node
     */
    breakSystemNode(dir: Direction, systemNodeId: number) {
        // Movement direction tells us which node group to look at
        const systemNodeGroup = this.engSystemNodeGroups[dir];

        // let nodeToBreak = null;
        // systemNodeGroup.forEach(systemNode => {
        //     if (systemNode.id === systemNodeId && !systemNode.isBroken) {
        //         nodeToBreak = systemNode;
        //     }
        // });
        const nodeToBreak = systemNodeGroup.find((node) => node.id === systemNodeId);

        // If we found the node with the correct id (and it wasn't already broken): 
        // 1) Break it;
        // 2) Increase the breakage counter for the corresponding system;
        // 3) If the node is a part of the circuit, increate the breakage
        //    count for the circuit.
        // 4) If all of the nodes within a threshold are broken, fix them all!
        if (nodeToBreak && !nodeToBreak.isBroken) {
            nodeToBreak.isBroken = true;

            this.systemBreakages[nodeToBreak.system]++;
            if (nodeToBreak.circuit) {
                this.circuitBreakages[nodeToBreak.circuit]++;
                if (this.circuitBreakages[nodeToBreak.circuit] === CIRCUIT_SELF_HEAL_THRESHOLD) {
                    this.fixCircuit(nodeToBreak.circuit);
                }
            }

            if (this.pendingMove != null) {
                this.moveSub();
            }

            return {
                success: true,
                message: "",
            };
        } else {
            return {
                success: false,
                message: "Couldn't find a non-broken node with id " + systemNodeId,
            };
        }
    };

    /** Private helpers **/

    private initEngSystemNodeGroups(): void {
        this.engSystemNodeGroups = {};
        this.engSystemNodeGroups[Direction.West] = [
            new EngSystemNode(0, SubSystem.Weapons, 1),
            new EngSystemNode(1, SubSystem.Silence, 1),
            new EngSystemNode(2, SubSystem.Sonar, 1),
            new EngSystemNode(3, SubSystem.Sonar),
            new EngSystemNode(4, SubSystem.Reactor),
            new EngSystemNode(5, SubSystem.Reactor),
        ];
        this.engSystemNodeGroups[Direction.North] = [
            new EngSystemNode(10, SubSystem.Silence, 2),
            new EngSystemNode(11, SubSystem.Weapons, 2),
            new EngSystemNode(12, SubSystem.Silence, 2),
            new EngSystemNode(13, SubSystem.Sonar),
            new EngSystemNode(14, SubSystem.Weapons),
            new EngSystemNode(15, SubSystem.Reactor),
        ];
        this.engSystemNodeGroups[Direction.South] = [
            new EngSystemNode(20, SubSystem.Sonar, 3),
            new EngSystemNode(21, SubSystem.Silence, 3),
            new EngSystemNode(22, SubSystem.Weapons, 3),
            new EngSystemNode(23, SubSystem.Weapons),
            new EngSystemNode(24, SubSystem.Reactor),
            new EngSystemNode(25, SubSystem.Silence),
        ];
        this.engSystemNodeGroups[Direction.East] = [
            new EngSystemNode(30, SubSystem.Sonar, 2),
            new EngSystemNode(31, SubSystem.Silence, 3),
            new EngSystemNode(32, SubSystem.Weapons, 1),
            new EngSystemNode(33, SubSystem.Reactor),
            new EngSystemNode(34, SubSystem.Sonar),
            new EngSystemNode(35, SubSystem.Reactor),
        ];
    }

    private resetSystemBreakages(): void {
        this.systemBreakages[SubSystem.Reactor] = 0;
        this.systemBreakages[SubSystem.Silence] = 0;
        this.systemBreakages[SubSystem.Sonar] = 0;
        this.systemBreakages[SubSystem.Weapons] = 0;

        this.circuitBreakages = [0, 0, 0];
    }

    private isValidMove(grid: GridCell[][], newSubPos: Point): {
        isValid: boolean,
        message: string,
    } {
        // Can't move if surfaced
        if (this.isSurfaced) {
            return {
                isValid: false,
                message: "Can't move when surfaced!",
            };
        }

        let { x, y } = newSubPos;

        const debugCoords = "(" + + x + ", " + y + ")";

        // Can't move into cells that aren't water
        if (grid[y][x] != GridCell.Water) {
            return {
                isValid: false,
                message: "Destination cell is land " + debugCoords,
            };
        }

        // Don't fall off the map
        if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
            return {
                isValid: false,
                message: "Can't move beyond the edge of the grid! " + debugCoords,
            };
        }

        // Can't cross own route
        for (const cell of this.subRoute) {
            if (cell.x === x && cell.y === y) {
                return {
                    isValid: false,
                    message: "Sub can't cross its route " + debugCoords,
                };
            }
        };

        return {
            isValid: true,
            message: "",
        };
    }

    /**
     * Fix every node in a specific circuit.
     */
    private fixCircuit(circuit: number): void {
        for (const dir in Direction) {
            this.engSystemNodeGroups[dir].forEach((node) => {
                if (node.circuit === circuit) {
                    node.isBroken = false;
                    this.systemBreakages[node.system]--;
                }
            });
        }

        this.circuitBreakages[circuit] = 0;
    };
};

export default ClientState;
