type Props = {
    name: string,
    threshold: number,
    readiness: number,
    isBroken: boolean,
    onChargeClick: () => void,
    onActivateClick: () => void,
};

const SubAbilityControls = ({name, threshold, readiness, isBroken, onChargeClick, onActivateClick}: Props) => {
    return (
    <div className="ability-controls-div">
        <span>{name + ": " + readiness + "/" + threshold}</span>
        <button 
            className="animated-button charge-ability-button" 
            disabled={readiness === threshold}
            onClick={onChargeClick}>
            Charge
        </button>
        <button 
            className="animated-button activate-ability-button"
            // TODO: clearly indicate when the button is disabled
            disabled={isBroken || readiness < threshold}
            onClick={onActivateClick}>
            Activate
        </button>
    </div>
    );
}

export default SubAbilityControls;
