import { Health } from "@weaver/docker";
import { Node, NodeProps } from "@xyflow/react";
import { Button, Card, Typography } from "antd";
import { useState } from "react";
import { LuChevronDown, LuChevronUp, LuContainer } from "react-icons/lu";
import { StateCircle } from "../../utils";
import styles from './container-node.module.scss';
import { Status } from "@weaver/docker/src/api/models";

type ContainerNodeData = {
    name: string;
    state: Status;
    onClick?: () => void;
};

export const containerNode = 'containerNode';
export type ContainerNode = Node<ContainerNodeData, 'containerNode'>;

export const ContainerNode = (props: NodeProps<ContainerNode>) => {
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
        <div className={styles['container-node-outer-body']} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Card className={styles['container-node-detail-container']}>
                <Card onClick={handleClick} className={styles['container-node-main-container']} hoverable>
                    <LuContainer className={styles['container-node-icon']} />
                    <Typography.Title level={5} style={{ margin: 0, padding: 0 }}>{name}</Typography.Title>
                    <StateCircle state={state} />
                </Card>
                {expanded && (
                    <div>

                    </div>
                )}
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