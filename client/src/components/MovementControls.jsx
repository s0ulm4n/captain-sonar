import PropTypes from "prop-types";

const MovementControls = ({ onClick }) => {
    return (
        <>
            <div>
                <button onClick={() => onClick(0, -1)}>
                    N
                </button>
            </div>
            <div>
                <button onClick={() => onClick(-1, 0)}>
                    W
                </button>
                <button onClick={() => onClick(1, 0)}>
                    E
                </button>
            </div>
            <div>
                <button onClick={() => onClick(0, 1)}>
                    S
                </button>
            </div>
        </>
    );
};

MovementControls.propTypes = {
    onClick: PropTypes.func.isRequired,
}

export default MovementControls;
