import "./MovementControls.css";
import { Direction } from "../../../../shared/enums.mts";
import DebugUtils from "../../DebugUtils";

type Props = {
    isDebugModeOn: boolean,
    teamId: number,
    onClick: (dir: Direction) => void,
    isMovementEnabled: boolean,
    pendingMoveDirection: Direction | null,
    pendingMoveEngAck: boolean,
    pendingMoveFirstMateAck: boolean,
};

const MovementControls = ({ 
    isDebugModeOn, 
    teamId, 
    onClick, 
    isMovementEnabled,
    pendingMoveDirection,
    pendingMoveEngAck,
    pendingMoveFirstMateAck,
}: Props) => {
    const className = 
        `direction-button animated-button ${
            isMovementEnabled ? "light-button-theme" : ""
        }`;

    return (
        <>
            <div>
                <button 
                    className={className}
                    disabled={!isMovementEnabled}
                    onClick={() => onClick(Direction.North)}
                >
                    N
                </button>
            </div>
            <div>
                <button 
                    className={className}
                    disabled={!isMovementEnabled}
                    onClick={() => onClick(Direction.West)}
                >
                    W
                </button>
                <button 
                    className={className}
                    disabled={!isMovementEnabled}
                    onClick={() => onClick(Direction.East)}
                >
                    E
                </button>
            </div>
            <div>
                <button 
                    className={className}
                    disabled={!isMovementEnabled}
                    onClick={() => onClick(Direction.South)}
                >
                    S
                </button>
            </div>
            <div hidden={!isDebugModeOn}>
                <button onClick={() => DebugUtils.resolveMove(teamId)}>
                    DEBUG: Resolve Move
                </button>
            </div>
            <div>
                <span>Move ordered: {pendingMoveDirection ?? "None"}</span>
                {
                    pendingMoveDirection 
                    ? <>
                        <div>
                            <span>First Mate ack: {pendingMoveFirstMateAck ? "[x]" : "[]"}</span>
                        </div>
                        <div>
                            <span>Engineer ack: {pendingMoveEngAck ? "[x]" : "[]"}</span>
                        </div>
                    </> 
                    : null
                }
            </div>
        </>
    );
};

export default MovementControls;
