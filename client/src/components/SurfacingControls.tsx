type Props = {
    isSurfaced: boolean,
    onSurfaceClick: () => void,
    onSubmergeClick: () => void,
};

const SurfacingControls = ({ isSurfaced, onSurfaceClick, onSubmergeClick }: Props) => {
    return isSurfaced ? (
        <button className="animated-button surface-button" onClick={onSubmergeClick}>
            Submerge
        </button>
    ) : (
        <button className="animated-button surface-button" onClick={onSurfaceClick}>
            Surface
        </button>
    );
};

export default SurfacingControls;
