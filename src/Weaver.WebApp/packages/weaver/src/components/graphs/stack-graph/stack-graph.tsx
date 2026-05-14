import { useDocker } from "@weaver/docker";
import { stackNode, useGraph } from "@weaver/graph";
import { Node, useNodesInitialized, useReactFlow } from "@xyflow/react";
import { Flex, Typography } from "antd";
import { useEffect, useMemo } from "react";
import styles from './stack-graph.module.scss';

export const StackGraph = () => {
    const { Stacks } = useDocker();
    const { nodes, addNodes, clear, resolveCollision } = useGraph();

    const { fitView } = useReactFlow();
    const initialized = useNodesInitialized();

    const stackNodes = useMemo(() => {
        return Stacks.map((c, index) => ({
            id: c.id,
            type: stackNode,
            position: { x: index * 10, y: 0 },
            data: {
                name: c.name,
                state: c.status,
                containerNames: c.containerNames ?? [],
                ports: c.ports ?? []
            }
        }) as Node);
    }, [Stacks])

    useEffect(() => {
        if (nodes.length > 0)
            clear();

        addNodes(stackNodes, nodes.length);
    }, [stackNodes])

    useEffect(() => {
        if (!initialized) return;

        async function refreshAfter(timeInMillis: number) {
            await new Promise(resolve => setTimeout(resolve, timeInMillis));
            resolveCollision();
            fitView();
        }

        refreshAfter(500);
    }, [initialized])

    return (
        <Flex vertical className={styles['overlay-ui']}>
            <Typography.Title style={{ margin: 0 }}>Weaver</Typography.Title>
            {/* <Toolbar /> */}
            {/* <NodeInfoPanel /> */}
        </Flex>
    );
}