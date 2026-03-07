import { useStack } from "@weaver/docker";
import { ChangeCallback, ContainerNode, containerNode, DashedEdge, dashedEdge, dockerNetworkNode, DockerNetworkNode, useGraphRef } from "@weaver/graph";
import { useTheme } from "@weaver/styling";
import type { EdgeChange, NodeChange, NodeSelectionChange } from '@xyflow/react';
import { useReactFlow } from '@xyflow/react';
import { Flex, Typography } from "antd";
import { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import styles from './container-graph.module.scss';

export const ContainerGraph = () => {
    const { stackId = '' } = useParams();

    const { name, containers } = useStack(stackId);
    const theme = useTheme();
    const { fitView } = useReactFlow();

    const networkNodes = useMemo(() => {
        // TODO: Handle multiple networks for a single container
        const allNetworks = containers.flatMap(c => c.networks[0] ?? undefined).filter(n => n != undefined);
        const uniqueNetworkIds = [...new Set(allNetworks.map(c => c.id))];
        const uniqueNetworks = uniqueNetworkIds.map(id => allNetworks.find(n => n.id === id)).filter(n => n != undefined);

        return uniqueNetworks.map((network, index): DockerNetworkNode => ({
            id: network.id,
            type: dockerNetworkNode,
            position: { x: index, y: index },            
            data: {
                model: {
                    networkId: network.id,
                    name: network.name,
                    driver: 'bridge',
                    subnet: undefined,
                    gateway: network.gateway,
                    internal: undefined,
                    ipv6: undefined
                }
            }
        }));
    }, [containers]);

    const containerNodes = useMemo(() => {
        return containers.map((c, index): ContainerNode => ({
            id: c.id,
            type: containerNode,
            position: { x: index, y: index },
            parentId: c.networks[0]?.id,
            expandParent: true,
            data: {
                model: c
            }
        }));
    }, [containers]);

    const containerDependencyEdges = useMemo(() => {
        return containers.flatMap((container) => container.dependsOn.map((dependencyId): DashedEdge => ({
            id: container.id + dependencyId,
            source: container.id,
            target: dependencyId,
            type: dashedEdge,
            data: {
                color: theme.theme.token?.colorTextBase ?? '#fff',
                selectedColor: theme.theme.token?.colorPrimary ?? 'rgb(141, 206, 226)'
            }
        })
        ));
    }, [containers]);

    const onNodeSelectionChange = useCallback((change: NodeChange | EdgeChange) => {
        if (!instanceOf<NodeSelectionChange>(change)) {
            return;
        }

        const updatedEdges = containerDependencyEdges
            .filter(e => e.source == change.id || e.target == change.id)
            .map(e => {
                e.selected = true;
                return e;
            });

        replaceEdges(updatedEdges);
    }, [containerDependencyEdges]);

    const callbacks = useMemo((): ChangeCallback[] => [
        {
            key: { type: 'node', change: 'select' },
            callback: onNodeSelectionChange
        }
    ], [onNodeSelectionChange]);
    const { nodes, addNodes, addEdges, replaceEdges, clear, resolveCollision } = useGraphRef(callbacks);


    function instanceOf<TObject>(item: unknown): item is TObject {
        return item !== undefined && item !== null && typeof item === "object";
    }

    useEffect(() => {
        clear();
        addNodes([...networkNodes, ...containerNodes], nodes.current?.length);
        addEdges(containerDependencyEdges);
    }, [networkNodes, containerNodes, containerDependencyEdges])

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
                <Typography.Title className={styles['title']}>{name}</Typography.Title>
            </Flex>
            {/* <Toolbar /> */}
            {/* <NodeInfoPanel /> */}
        </Flex>
    )
}

export default ContainerGraph;