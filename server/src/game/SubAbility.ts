import { Ability, SubSystem } from "../../../shared/enums.mjs";
import { ISubAbility } from "../../../shared/interfaces.mjs";

class SubAbility implements ISubAbility {
    ability: Ability;
    system: SubSystem;
    readinessThreshold: number;
    readiness: number;

    constructor(ability: Ability, system: SubSystem, threshold: number) {
        this.ability = ability;
        this.system = system;
        this.readinessThreshold = threshold;

        this.readiness = 0;
    }
}

export default SubAbility;
