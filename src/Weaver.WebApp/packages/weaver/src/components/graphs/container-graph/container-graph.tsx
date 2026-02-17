import { useStack } from "@weaver/docker";
import { containerNode, useGraphRef } from "@weaver/graph";
import { Node, useReactFlow } from '@xyflow/react';
import { Button, Flex, Typography } from "antd";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import styles from './container-graph.module.scss';
import { LuChevronLeft } from "react-icons/lu";

export const ContainerGraph = () => {
    const { stackId = '' } = useParams();

    const { name, containers, isLoading } = useStack(stackId);
    const { nodes, addNodes, clear, resolveCollision } = useGraphRef();
    const { fitView } = useReactFlow();

    const containerNodes = useMemo(() => {
        return containers.map((c, index) => ({
            id: c.id,
            type: containerNode,
            position: { x: index, y: index },
            data: {
                model: c
            }
        }) as Node);
    }, [containers]);

    useEffect(() => {
        clear();
        addNodes(containerNodes, nodes.current?.length);
    }, [containerNodes])

    useEffect(() => {
        async function refreshAfter(timeInMillis: number) {
            await new Promise(resolve => setTimeout(resolve, timeInMillis))
            resolveCollision();
            fitView();
        }

        refreshAfter(250);
    }, [])

    return (
        <Flex vertical className={styles['overlay-ui']}>
            <Flex align="center">
                <Typography.Title style={{ margin: 0 }}>{name}</Typography.Title>
            </Flex>
            {/* <Toolbar /> */}
            {/* <NodeInfoPanel /> */}
        </Flex>
    )
}