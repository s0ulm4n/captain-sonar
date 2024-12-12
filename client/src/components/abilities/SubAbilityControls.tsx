import "./SubAbilityControls.css"

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
        <span className={isBroken ? "ability-name-broken" : ""}>
            {`${name}: ${readiness}/${threshold}`}
        </span>
        <button 
            className="animated-button charge-ability-button" 
            disabled={readiness === threshold}
            onClick={onChargeClick}>
            Charge
        </button>
        <button 
            className="animated-button red-button-theme activate-ability-button"
            disabled={isBroken || readiness < threshold}
            onClick={onActivateClick}>
            Activate
        </button>
    </div>
    );
}

export default SubAbilityControls;
