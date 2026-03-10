import { ContainerListItemModel } from "@weaver/docker/src/api/models";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Button, Card, Typography } from "antd";
import { useState } from "react";
import { LuChevronDown, LuChevronUp, LuCircleStop, LuContainer, LuPlay } from "react-icons/lu";
import { StateCircle } from "../../utils";
import { ContainerDetails } from "./container-detail";
import styles from './container-node.module.scss';
import { useTheme } from "@weaver/styling";
import { useContextMenu } from "../../../hooks/use-context-menu";
import { useContainer } from "@weaver/docker";

type ContainerNodeData = {
    model: ContainerListItemModel;
    onClick?: () => void;
};

export const containerNode = 'containerNode';
export type ContainerNode = Node<ContainerNodeData, 'containerNode'>;

export const ContainerNode = (props: NodeProps<ContainerNode>) => {
    const { data, selected } = props;
    const { model, onClick } = data;
    const { theme } = useTheme();
    const [hover, setHover] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<boolean>(false);
    const { start, stop } = useContainer(model.id);

    const { show } = useContextMenu([
        {
            label: model.status == 'Running' ? 'Stop' : 'Play',
            icon: model.status === 'Running' ? <LuCircleStop /> : <LuPlay />,
            onClick: () => {
                if (model.status === 'Running') {
                    stop();
                } else if (model.status === 'Exited' || model.status === 'Paused') {
                    start();
                }
            }
        }
    ]);

    function handleClick() {
        if (onClick) {
            onClick();
        }
    }

    function handleOpenContextMenu(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        
        show(e.clientX, e.clientY)
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
            <Card className={styles['container-node-detail-container']} style={{ backgroundColor: theme.token?.colorBgElevated }}>
                <Card
                    hoverable
                    onClick={handleClick}
                    onContextMenuCapture={handleOpenContextMenu}
                    className={styles['container-node-main-container']}
                    style={{
                        backgroundColor: theme.token?.colorBgElevated,
                        borderColor: selected ? theme.token?.colorPrimary : theme.token?.colorBorder,
                        boxShadow: selected ? `0 0 5px 2px ${theme.token?.colorPrimary}20` : 'initial'
                    }}>
                    <LuContainer className={styles['container-node-icon']} />
                    <Typography.Title level={5} style={{ margin: 0, padding: 0 }}>{model?.name.replace(`/`, '') ?? 'N/A'}</Typography.Title>
                    <StateCircle state={model?.status} />
                </Card>
                {expanded && (
                    <ContainerDetails containerId={model.id} />
                )}
                <Handle type="target" position={Position.Top} />
                <Handle type="source" position={Position.Top} />
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