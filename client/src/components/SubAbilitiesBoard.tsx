import { Ability } from "../../../shared/enums.mts";
import { ISubAbility } from "../../../shared/interfaces.mts";
import SubAbilityControls from "./SubAbilityControls";

type Props = {
    abilities: {[id: string]: ISubAbility };
    systemBreakages: { [id: string]: number };
    onChargeClick: (ability: Ability) => void;
    onActivateClick: (ability: Ability) => void;
};

const SubAbilitiesBoard = ({abilities, systemBreakages, onChargeClick, onActivateClick}: Props) => {
    const components = [];

    for (const ability in Ability) {
        const abilityInfo = abilities[ability];
        components.push(
            <SubAbilityControls
                // TODO: use guid?
                key={ability}
                name={ability}
                threshold={abilityInfo.readinessThreshold}
                readiness={abilityInfo.readiness}
                isBroken={systemBreakages[abilityInfo.system] > 0}
                onChargeClick={() => onChargeClick(ability as Ability)}
                onActivateClick={() => onActivateClick(ability as Ability)}
            />
        );
    }

    return (
        <>
            {components}
        </>
    );
};

export default SubAbilitiesBoard;
