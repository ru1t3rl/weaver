import { Button, Card, Typography } from "antd";
import { State, StateCircle } from "../../utils";
import { Node, NodeProps } from "@xyflow/react";
import { LuBoxes, LuChevronDown, LuChevronUp } from "react-icons/lu";
import styles from './stack-node.module.scss';
import { useState } from "react";

type StackNodeData = {
    name: string;
    state: State;
    onClick?: () => void;
};

export const stackNode = 'stackNode';
export type StackNode = Node<StackNodeData, 'stackNode'>;

export const StackNode = (props: NodeProps<StackNode>) => {
    const { id, data, selected } = props;
    const { name, state, onClick } = data;
    const [hover, setHover] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<boolean>(false);

    function handleClick() {
        if (onClick) {
            onClick();
        }
    }

    function handleExpandClicked() {
        setExpanded(e => !e);
    }

    function handleMouseEnter() {
        setHover(true);
    }

    function handleMouseLeave() {
        setHover(false);
    }

    return (
        <div className={styles['stack-node-outer-body']} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Card className={styles['stack-node-detail-container']}>
                <Card onClick={handleClick} className={styles['stack-node-main-container']} hoverable>
                    <LuBoxes className={styles['stack-node-icon']} />
                    <Typography.Title level={5} style={{ margin: 0, padding: 0 }}>{name}</Typography.Title>
                    <StateCircle state={state} />
                </Card>
                {expanded && (<div></div>)}
            </Card>
            {hover && (
                <Button
                    icon={expanded ? <LuChevronUp /> : <LuChevronDown />}
                    onClick={handleExpandClicked}
                />
            )}
        </div>
    )
}