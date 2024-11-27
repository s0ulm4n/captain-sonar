import { Direction } from "../../../../shared/enums.mts";

type Props = {
    onClick: (dir: Direction) => void,
};

const MovementControls = ({ onClick }: Props) => {
    return (
        <>
            <div>
                <button 
                    className="animated-button direction-button" 
                    onClick={() => onClick(Direction.North)}
                >
                    N
                </button>
            </div>
            <div>
                <button 
                    className="animated-button direction-button" 
                    onClick={() => onClick(Direction.West)}
                >
                    W
                </button>
                <button 
                    className="animated-button direction-button" 
                    onClick={() => onClick(Direction.East)}
                >
                    E
                </button>
            </div>
            <div>
                <button 
                    className="animated-button direction-button" 
                    onClick={() => onClick(Direction.South)}
                >
                    S
                </button>
            </div>
        </>
    );
};

export default MovementControls;
