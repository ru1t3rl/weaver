import { useDocker } from "@weaver/docker";
import { stackNode, useGraphRef } from "@weaver/graph";
import { Node, useReactFlow } from "@xyflow/react";
import { Flex, Typography } from "antd";
import { useEffect, useMemo } from "react";
import styles from './stack-graph.module.scss';

export const StackGraph = () => {
    const { Stacks } = useDocker();
    const { nodes, addNodes, clear, resolveCollision } = useGraphRef();
    const { fitView } = useReactFlow();

    const stackNodes = useMemo(() => {
        return Stacks.map((c, index) => ({
            id: c.id,
            type: stackNode,
            position: { x: index * 100, y: 0 },
            data: {
                name: c.name,
                state: c.status,
                containerNames: c.containers?.map(c => c.name) ?? [],
                ports: c.ports ?? []
            }
        }) as Node);
    }, [Stacks])

    useEffect(() => {
        clear();
        addNodes(stackNodes, nodes.current?.length);
    }, [stackNodes])

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
            <Typography.Title style={{ margin: 0 }}>Weaver</Typography.Title>
            {/* <Toolbar /> */}
            {/* <NodeInfoPanel /> */}
        </Flex>
    );
}