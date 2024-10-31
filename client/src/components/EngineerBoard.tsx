import EngineerSystemNodeGroup from "./EngineerSystemNodesGroup.jsx";
import { Direction } from "../../../shared/enums.mjs";
import { IEngSystemNode } from "../../../shared/interfaces.mjs";

type Props = {
    nodeGroups: {
        [id: string]: IEngSystemNode[],
    };
    onClick: (dir: Direction, id: number) => void,
};

const EngineerBoard = ({ nodeGroups, onClick }: Props) => {
    const components = [];

    for (const dir in Direction) {
        components.push(
            <EngineerSystemNodeGroup
                group={dir as Direction}
                nodes={nodeGroups[dir]}
                onClick={onClick}
            />
        );
    }

    return (
        <>
            {components}
        </>
    );
};

export default EngineerBoard;
