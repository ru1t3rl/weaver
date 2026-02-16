import { PortMapping, Status } from "@weaver/docker";
import { Node, NodeProps } from "@xyflow/react";
import { Button, Card, Flex, List, Typography } from "antd";
import { memo, useState } from "react";
import { LuBoxes, LuChevronDown, LuChevronUp } from "react-icons/lu";
import { StateCircle, StateHeart } from "../../utils";
import styles from './stack-node.module.scss';
import { useTheme } from "@weaver/styling";

type StackNodeData = {
    name: string;
    state: Status;
    containerNames: string[];
    ports: PortMapping[];
    onClick?: () => void;
};

export const stackNode = 'stackNode';
export type StackNode = Node<StackNodeData, 'stackNode'>;

export const StackNode = memo((props: NodeProps<StackNode>) => {
    const { id, data, selected } = props;
    const { name, state, onClick, containerNames, ports } = data;
    const { theme } = useTheme();
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
            <Card className={styles['stack-node-detail-container']} style={{ backgroundColor: theme.token?.colorBgElevated }}>
                <Card onClick={handleClick} className={styles['stack-node-main-container']} hoverable style={{ backgroundColor: theme.token?.colorBgElevated }}>
                    <Flex gap={'small'} align='center'>
                        <LuBoxes className={styles['stack-node-icon']} />
                        <Typography.Title level={5} style={{ margin: 0, padding: 0 }}>{name}</Typography.Title>
                    </Flex>
                    <StateCircle state={state} />
                </Card>
                {expanded && (
                    <Flex vertical={true} className={styles['stack-node-detail-list']}>
                        <Flex vertical={true} style={{ width: '200px' }}>
                            <Typography.Text strong>Containers:</Typography.Text>
                            <Typography.Paragraph>{containerNames.map(c => c.replace(`/${name}-`, '').replace('-1', '')).join(', ')}</Typography.Paragraph>
                        </Flex>
                        <Flex vertical={true}>
                            <Typography.Text strong>State:</Typography.Text>
                            <StateHeart state={state} size={'20px'} showLabel />
                        </Flex>
                        <Flex vertical={true}>
                            <Typography.Text strong>Ports:</Typography.Text>
                            {
                                ports.filter(p => p.hostPort).map((mapping, index) => (
                                    <Typography.Text key={`${mapping.hostPort}${index}`}>{mapping.hostPort} : {mapping.containerPort}</Typography.Text>
                                ))
                            }
                            {
                                ports.filter(p => !p.hostPort).map((mapping, index) => (
                                    <Typography.Text key={index}>{mapping.hostPort} : {mapping.containerPort}</Typography.Text>
                                ))
                            }
                        </Flex>
                    </Flex>
                )}
            </Card>
            {hover && (
                <Button
                    className={styles['stack-node-details-chevron']}
                    icon={expanded ? <LuChevronUp /> : <LuChevronDown />}
                    onClick={handleExpandClicked}
                />
            )}
        </div>
    )
});