import { Direction, SubSystem } from "../../../../shared/enums.mts";

type Props = {
    id: number,
    group: Direction,
    system: SubSystem,
    isBroken: boolean,
    circuit: number | null,
    onClick: (dir: Direction, id: number) => void,
};

const EngineerSystemNode = ({ id, group, system, isBroken, circuit = null, onClick }: Props) => {
    const text = !isBroken ? <>{system}</> : <s>{system}</s>;

    let circuitClass = "";
    switch (circuit) {
        case 1:
            circuitClass = "circuit-1";
            break;
        case 2:
            circuitClass = "circuit-2";
            break;
        case 3:
            circuitClass = "circuit-3";
            break;
        default:
            circuitClass = "circuit-none";
    }

    return (
        <button
            className={"animated-button eng-board-button " + circuitClass}
            onClick={() => onClick(group, id)}
        >
            {text}
        </button>
    );
};

export default EngineerSystemNode;
