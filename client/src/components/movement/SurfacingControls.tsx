import "./SurfacingControls.css";

type Props = {
    isSurfaced: boolean,
    isEnabled: boolean,
    onSurfaceClick: () => void,
    onSubmergeClick: () => void,
};

const SurfacingControls = ({ isSurfaced, isEnabled, onSurfaceClick, onSubmergeClick }: Props) => {
    const surfaceClassName = 
        `animated-button surface-submerge-button ${isEnabled ? "red-button-theme" : ""}`
    const submergeClassName = surfaceClassName + " submerge-button-pulse";

    return isSurfaced ? (
        <button className={submergeClassName} onClick={onSubmergeClick}>
            Submerge
        </button>
    ) : (
        <button className={surfaceClassName} disabled={!isEnabled} onClick={onSurfaceClick}>
            Surface
        </button>
    );
};

export default SurfacingControls;
