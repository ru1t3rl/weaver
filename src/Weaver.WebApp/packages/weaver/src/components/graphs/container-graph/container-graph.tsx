import { useStack } from "@weaver/docker";
import { ChangeCallback, ContainerNode, containerNode, DashedEdge, dashedEdge, dockerNetworkNode, DockerNetworkNode, useGraph } from "@weaver/graph";
import { useTheme } from "@weaver/styling";
import type { Edge, EdgeChange, Node, NodeChange, NodeSelectionChange } from '@xyflow/react';
import { useReactFlow } from '@xyflow/react';
import { Flex, Typography } from "antd";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router";
import styles from './container-graph.module.scss';

function instanceOf<TObject>(item: unknown): item is TObject {
    return item !== undefined && item !== null && typeof item === "object";
}

export const ContainerGraph = () => {
    const { stackId = '' } = useParams();

    const { data: stackData } = useStack(stackId);
    const { name, containers } = stackData ?? {};

    const theme = useTheme();
    const { fitView } = useReactFlow();

    const networkNodes = useMemo(() => {
        if (!containers) return [];

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
        if (!containers) return [];

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
        if (!containers) return [];

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
    }, [containers, theme]);

    const edgesRef = useRef<DashedEdge[]>(containerDependencyEdges);
    useEffect(() => {
        edgesRef.current = containerDependencyEdges;
    }, [containerDependencyEdges]);
    
    const replaceEdgesRef = useRef<((edges: Edge[]) => void) | null>(null);
    const onNodeSelectionChange = useCallback((change: NodeChange | EdgeChange) => {
        if (!instanceOf<NodeSelectionChange>(change)) {
            return;
        }

        const updatedEdges = edgesRef.current
            .filter(e => e.source == change.id || e.target == change.id)
            .map((e): DashedEdge => ({ ...e, selected: true }));

        replaceEdgesRef.current?.(updatedEdges);
    }, []);

    const callbacks = useMemo((): ChangeCallback[] => [
        {
            key: { type: 'node', change: 'select' },
            callback: onNodeSelectionChange
        }
    ], [onNodeSelectionChange]);

    const graph = useGraph(callbacks);

    const graphRef = useRef(graph);
    useEffect(() => {
        graphRef.current = graph;
        replaceEdgesRef.current = graph.replaceEdges;
    });

    useEffect(() => {
        const { addNodes, addEdges, clear } = graphRef.current;

        clear();

        const combinedNodes: Node[] = [...networkNodes, ...containerNodes];
        if (combinedNodes.length > 0) {
            addNodes(combinedNodes, combinedNodes.length);
        }
        if (containerDependencyEdges.length > 0) {
            addEdges(containerDependencyEdges);
        }
    }, [networkNodes, containerNodes, containerDependencyEdges]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fitView();
        }, 250);

        return () => clearTimeout(timeoutId);
    }, [fitView]);

    return (
        <Flex vertical className={styles['overlay-ui']}>
            <Flex align="center">
                <Typography.Title className={styles['title']}>{name}</Typography.Title>
            </Flex>
        </Flex>
    )
}

export default ContainerGraph;