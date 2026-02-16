import { useDocker } from "@weaver/docker";
import { containerNode, useGraph } from "@weaver/graph";
import { Node } from '@xyflow/react'
import { Flex, Typography } from "antd";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";

export const ContainerGraph = () => {
    const { Containers } = useDocker();
    const { clear, addNodes } = useGraph();

    const { stackId: _stackId = '' } = useParams();
    const stackId = +_stackId;

    const containerNodes = useMemo(() => {
        return Containers.map((c) => ({
            id: c.id,
            type: containerNode,
            position: { x: 0, y: 0 },
            data: {
                name: c.name,
                state: c.state
            }
        }) as Node);
        return [];
    }, [Containers]);

    useEffect(() => {
        clear();
        addNodes(containerNodes);
    }, [containerNodes, addNodes, clear])

    return (
        <Flex vertical className={styles['overlay-ui']}>
            <Typography.Title style={{ margin: 0 }}>Weaver</Typography.Title>
            {/* <Toolbar /> */}
            {/* <NodeInfoPanel /> */}
        </Flex>
    )
}