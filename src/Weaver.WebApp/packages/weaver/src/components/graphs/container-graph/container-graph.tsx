import { useStack } from "@weaver/docker";
import { containerNode, useGraphRef } from "@weaver/graph";
import { Edge, Node, useReactFlow } from '@xyflow/react';
import { Flex, Typography } from "antd";
import { useEffect, useMemo, useReducer } from "react";
import { useParams } from "react-router";
import styles from './container-graph.module.scss';

export const ContainerGraph = () => {
    const { stackId = '' } = useParams();

    const { name, containers, isLoading } = useStack(stackId);
    const { nodes, addNodes, addEdges, clear, resolveCollision } = useGraphRef();
    const { fitView, getEdges } = useReactFlow();

    const [, render] = useReducer(x => !x, false);

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
        const i = 0;
        return containers.flatMap((c) => c.dependsOn.map(dependencyId => {
            console.log("i:" + c.id);
            console.log("d:" + dependencyId);
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

        async function addEdgesDelayed() {
            await new Promise(r => setTimeout(r, 500));
            addEdges(containerEdges);
            await new Promise(r => setTimeout(r, 500));
            console.log(getEdges());
            render();
        }
        addEdgesDelayed();
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