import { useStack } from "@weaver/docker";
import { containerNode, useGraphRef } from "@weaver/graph";
import { Edge, Node, useReactFlow } from '@xyflow/react';
import { Flex, Typography } from "antd";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import styles from './container-graph.module.scss';

export const ContainerGraph = () => {
    const { stackId = '' } = useParams();

    const { name, containers } = useStack(stackId);
    const { nodes, addNodes, addEdges, clear, resolveCollision } = useGraphRef();
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

    const containerEdges = useMemo(() => {
        return containers.flatMap((c) => c.dependsOn.map(dependencyId => {
            const edge: Edge = {
                id: c.id + dependencyId,
                type: 'smoothstep',
                source: c.id,
                target: dependencyId,
            }
            return edge;
        }));
    }, [containers]);

    useEffect(() => {
        clear();
        addNodes(containerNodes, nodes.current?.length);
        addEdges(containerEdges);
    }, [containerNodes, containerEdges])

    useEffect(() => {
        async function refreshAfter(timeInMillis: number) {
            await new Promise(resolve => setTimeout(resolve, timeInMillis))
            resolveCollision();
            await new Promise(resolve => setTimeout(resolve, timeInMillis))
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