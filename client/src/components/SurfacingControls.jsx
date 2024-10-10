import PropTypes from "prop-types";

const SurfacingControls = ({ isSurfaced, onSurfaceClick, onSubmergeClick }) => {
    return isSurfaced ? (
        <button onClick={onSubmergeClick}>
            Submerge
        </button>
    ) : (
        <button onClick={onSurfaceClick}>
            Surface
        </button>
    );
}

SurfacingControls.propTypes = {
    isSurfaced: PropTypes.bool.isRequired,
    onSurfaceClick: PropTypes.func.isRequired,
    onSubmergeClick: PropTypes.func.isRequired,
}

export default SurfacingControls;
