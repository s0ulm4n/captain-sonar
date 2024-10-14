type Props = {
    isSurfaced: boolean,
    onSurfaceClick: () => void,
    onSubmergeClick: () => void,
};

const SurfacingControls = ({ isSurfaced, onSurfaceClick, onSubmergeClick }: Props) => {
    return isSurfaced ? (
        <button onClick={onSubmergeClick}>
            Submerge
        </button>
    ) : (
        <button onClick={onSurfaceClick}>
            Surface
        </button>
    );
};

export default SurfacingControls;
