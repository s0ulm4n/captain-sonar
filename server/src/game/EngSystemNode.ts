import { SubSystem } from "../../../shared/enums.mjs";
import { IEngSystemNode } from "../../../shared/interfaces.mjs";

class EngSystemNode implements IEngSystemNode {
    id: number;
    system: SubSystem;
    circuit: number | null;
    isBroken: boolean;

    constructor(id: number, system: SubSystem, circuit: number | null = null) {
        this.id = id;
        this.system = system;
        this.circuit = circuit;

        this.isBroken = false;
    }
}

export default EngSystemNode;
