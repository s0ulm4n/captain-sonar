import { Direction } from "../../../shared/enums.mts";
import { IEngSystemNode } from "../../../shared/interfaces.mts";
import EngineerSystemNode from "./EngineerSystemNode";

type Props = {
    group: Direction,
    nodes: IEngSystemNode[],
    onClick: (dir: Direction, id: number) => void,
};

const EngineerSystemNodeGroup = ({ group, nodes, onClick }: Props) => {
    const row1 = [];
    const row2 = [];
    for (let i = 0; i <= 2; i++) {
        row1.push(
            <td>
                <EngineerSystemNode
                    // TODO: use guid?
                    key={group + "_" + nodes[i].id}
                    id={nodes[i].id}
                    group={group}
                    system={nodes[i].system}
                    isBroken={nodes[i].isBroken}
                    circuit={nodes[i].circuit}
                    onClick={onClick}
                />
            </td>
        );
        row2.push(
            <td>
                <EngineerSystemNode
                    // TODO: use guid?
                    key={group + "_" + nodes[i + 3].id}
                    id={nodes[i + 3].id}
                    group={group}
                    system={nodes[i + 3].system}
                    isBroken={nodes[i + 3].isBroken}
                    circuit={nodes[i + 3].circuit}
                    onClick={onClick}
                />
            </td>
        );
    }


    // Expecting to have 6 nodes total
    return (
        <table>
            <tbody>
                <tr>
                    <th>{group}</th>
                </tr>
                <tr>
                    {row1}
                </tr>
                <tr>
                    {row2}
                </tr>
            </tbody>
        </table>
    );
};

export default EngineerSystemNodeGroup;
