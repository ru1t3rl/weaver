import { Card, Typography } from "antd";
import { State, StateCircle } from "../../utils";
import { Node, NodeProps } from "@xyflow/react";

type ContainerNodeData = {
    name: string;
    state: State;
    onClick?: () => void;
};

export const containerNode = 'containerNode';
export type ContainerNode = Node<ContainerNodeData, 'containerNode'>;

export const ContainerNode = (props: NodeProps<ContainerNode>) => {
    const { id, data, selected } = props;
    const { name, state, onClick } = data;

    function handleClick() {
        if (onClick) {
            onClick();
        }
    }

    return (
        <Card onClick={handleClick}>
            <Typography>{name}</Typography>
            <StateCircle state={state} />
        </Card>
    )
}