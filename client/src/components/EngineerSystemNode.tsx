import { Direction, SubSystem } from "../../../shared/enums.mts";

type Props = {
    id: number,
    group: Direction,
    system: SubSystem,
    isBroken: boolean,
    circuit: number | null,
    onClick: (dir: Direction, id: number) => void,
};

const EngineerSystemNode = ({ id, group, system, isBroken, circuit = null, onClick }: Props) => {
    const text = !isBroken ? <>{system + " " + circuit}</> : <s>{system + " " + circuit}</s>;

    let buttonClass = "";
    switch (circuit) {
        case 1:
            buttonClass = "circuit-1";
            break;
        case 2:
            buttonClass = "circuit-2";
            break;
        case 3:
            buttonClass = "circuit-3";
            break;
    }

    return (
        <button
            className={buttonClass}
            onClick={() => onClick(group, id)}
        >
            {text}
        </button>
    );
};

export default EngineerSystemNode;
