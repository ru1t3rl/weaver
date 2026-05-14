import { applyEdgeChanges, applyNodeChanges, Edge, EdgeAddChange, EdgeChange, EdgeRemoveChange, EdgeReplaceChange, Node, NodeAddChange, NodeChange, NodePositionChange, NodeRemoveChange, NodeReplaceChange } from "@xyflow/react";
import { debounce } from 'lodash';
import { PropsWithChildren, useCallback, useMemo, useRef, useState } from "react";
import { resolveCollisionsVoronoi, VoronoiCollisionOptions } from "../components";
import { GraphContext, IGraphContext } from "../contexts/graph-context";
import { InspectorProvider } from "./inspector-provider";

export type ChangeType = 'add' | 'remove' | 'replace' | 'select' | 'position' | 'dimensions' | 'any';
export type EventType = 'node' | 'edge'

export type ChangeEvent = { type: EventType, change: ChangeType }
export type ChangeCallbackFunction = (item: NodeChange | EdgeChange) => void;
export type ChangeCallback = {
    key: ChangeEvent,
    callback: ChangeCallbackFunction;
};

interface GraphProviderProps {
    collisionOptions?: VoronoiCollisionOptions
}

export const GraphProvider = (props: GraphProviderProps & PropsWithChildren) => {
    const { children, collisionOptions } = props;
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const initialized = useRef<boolean>(false);

    const _collisionOptions: VoronoiCollisionOptions = useMemo(() => ({
        maxIterations: 10,
        overlapThreshold: 0.5,
        margin: 0,
        noiseScale: 5000,
        ...collisionOptions
    }), [collisionOptions]);

    const listeners = useRef<Record<string, ChangeCallbackFunction[]>>({});

    const _resolveCollision = useCallback(() => {
        const parentIds = [...new Set(nodes.map(n => n.parentId))];
        const groupedNodes = parentIds.map(id => nodes.filter(n => n.parentId === id));

        const updateNodes = groupedNodes.flatMap(group => resolveCollisionsVoronoi(
            group,
            edges,
            _collisionOptions
        ));

        const changes: NodePositionChange[] = updateNodes.map(n => ({
            id: n.id,
            type: 'position',
            position: n.position
        }) as NodePositionChange);

        setNodes(old => applyNodeChanges(changes, old));
        setEdges(old => applyEdgeChanges([], old));
    }, [nodes, edges, _collisionOptions]);

    const resolveCollision = debounce(_resolveCollision, 0, { leading: true, trailing: false });

    function addNodes<TNodeType extends Node>(newNodes: TNodeType[], totalNodesCount?: number) {
        const changes = newNodes.map((node, index) => ({
            item: node,
            index: (totalNodesCount ?? 0) + index,
            type: 'add'
        }) as NodeAddChange<TNodeType>);

        if (changes.length > 0) {
            setNodes(old => applyNodeChanges(changes, old));
        }
    }

    function replaceNodes<TNodeType extends Node>(newNodes: TNodeType[]) {
        const changes = newNodes.map((node): NodeReplaceChange => ({
            id: node.id,
            item: node,
            type: 'replace',
        }));

        if (changes.length > 0) {
            setNodes(old => applyNodeChanges(changes, old));
        }
    }

    function updateNode(id: string, nodeUpdate: Partial<Node> | ((node: Node) => Partial<Node>)) {
        const node = nodes.find(n => n.id === id);
        if (!node) return;

        if (typeof nodeUpdate === 'function') {
            nodeUpdate = nodeUpdate(node);
        }

        const merged: Node = { ...node, ...nodeUpdate };
        const changes: NodeChange<Node>[] = [];

        if ('position' in nodeUpdate) {
            const change: NodePositionChange = {
                id,
                type: 'position',
                position: merged.position,
            }
            changes.push(change);
        }

        if ('width' in nodeUpdate || 'height' in nodeUpdate) {
            changes.push({
                id,
                type: 'dimensions',
                dimensions: {
                    width: merged.width ?? 0,
                    height: merged.height ?? 0,
                },
                setAttributes: true
            });
        }

        const dimensionAndPositionKeys = new Set(['position', 'width', 'height']);
        const remainingKeys = Object.keys(nodeUpdate).filter(k => !dimensionAndPositionKeys.has(k));

        if (remainingKeys.length > 0) {
            changes.push({
                id,
                type: 'replace',
                item: merged,
            });
        }

        if (changes.length === 0) return;

        setNodes(old => applyNodeChanges(changes, old));
    }

    function removeNodes<TNodeType extends Node>(newNodes: TNodeType[]) {
        const changes = newNodes.map(node => ({
            id: node.id,
            type: 'remove'
        }) as NodeRemoveChange);

        if (changes.length > 0) {
            setNodes(old => applyNodeChanges(changes, old));
        }
    }

    function addEdges(newEdges: Edge[]) {
        const changes = newEdges.map((edge): EdgeAddChange => ({
            item: edge,
            type: "add"
        }));

        if (changes.length > 0) {
            setEdges(old => applyEdgeChanges(changes, old));
        }
    }

    function replaceEdges(newEdges: Edge[]) {
        const changes = newEdges.map((edge): EdgeReplaceChange => ({
            id: edge.id,
            item: edge,
            type: 'replace',
        }));

        if (changes.length > 0) {
            setEdges(old => applyEdgeChanges(changes, old));
        }
    }

    function removeEdges(newEdges: Edge[]) {
        const changes = newEdges.map((edge) => ({
            id: edge.id,
            type: 'remove'
        }) as EdgeRemoveChange);

        if (changes.length > 0) {
            setEdges(old => applyEdgeChanges(changes, old));
        }
    }

    const clear = useCallback(() => {
        const nodesChanges = nodes.map(node => ({ id: node.id, type: 'remove' }) as NodeRemoveChange);
        const edgesChanges = edges.map(edge => ({ id: edge.id, type: 'remove' }) as EdgeRemoveChange);

        setNodes(old => applyNodeChanges(nodesChanges, old));
        setEdges(old => applyEdgeChanges(edgesChanges, old));
    }, [nodes, edges]);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        const filtered = changes.filter(c => c.type !== 'add' && c.type !== 'remove');

        if (changes.find(c => c.type === 'position' || c.type === 'add' || (c.type === 'dimensions'))) {
            resolveCollision();
            initialized.current = true;
        }

        setNodes(old => applyNodeChanges(filtered, old));

        changes.forEach(c => {
            listeners.current[`node:${c.type}`]?.forEach(l => l(c));
            listeners.current[`node:any`]?.forEach(l => l(c));
        });
    }, [resolveCollision]);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        const filtered = changes.filter(c => c.type !== 'add' && c.type !== 'remove');

        if (filtered.length > 0)
            setEdges(old => applyEdgeChanges(filtered, old));

        changes.forEach(c => {
            listeners.current[`edge:${c.type}`]?.forEach(l => l(c));
            listeners.current[`edge:any`]?.forEach(l => l(c));
        });
    }, []);

    function addChangeListener(event: ChangeEvent, callback: ChangeCallbackFunction) {
        const key = `${event.type}:${event.change}`;
        if (listeners.current[key]) {
            listeners.current[key].push(callback);
        } else {
            listeners.current[key] = [callback];
        }
    }

    function removeChangeListener(event: ChangeEvent, callback: ChangeCallbackFunction) {
        const key = `${event.type}:${event.change}`;
        const index = listeners.current[key].findIndex(c => c === callback);
        if (index >= 0) {
            delete listeners.current[key][index]
        }
    }

    const value: IGraphContext = {
        nodes: nodes,
        addNodes,
        replaceNodes,
        updateNode,
        removeNodes,
        edges: edges,
        addEdges,
        replaceEdges,
        removeEdges,
        clear,
        resolveCollision,
        onNodesChange,
        onEdgesChange,
        addChangeListener,
        removeChangeListener
    }

    return (
        <GraphContext.Provider value={value}>
            <InspectorProvider>
                {children}
            </InspectorProvider>
        </GraphContext.Provider>
    );
}