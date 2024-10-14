type Props = {
    onClick: (dx: number, dy: number) => void,
};

const MovementControls = ({ onClick }: Props) => {
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

export default MovementControls;
