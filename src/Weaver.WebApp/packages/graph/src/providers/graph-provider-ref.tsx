import { applyEdgeChanges, applyNodeChanges, Edge, EdgeAddChange, EdgeChange, EdgeRemoveChange, EdgeReplaceChange, Node, NodeAddChange, NodeChange, NodePositionChange, NodeRemoveChange, NodeReplaceChange } from "@xyflow/react";
import { debounce } from 'lodash';
import { PropsWithChildren, useCallback, useReducer, useRef } from "react";
import { resolveCollisionsVoronoi } from "../components";
import { GraphContextRef, IGraphContextRef } from "../contexts/graph-context-ref";
import { InspectorProvider } from "./inspector-provider";

export type ChangeType = 'add' | 'remove' | 'replace' | 'select' | 'position' | 'dimensions' | 'any';
export type EventType = 'node' | 'edge'

export type ChangeEvent = { type: EventType, change: ChangeType }
export type ChangeCallbackFunction = (item: NodeChange | EdgeChange) => void;
export type ChangeCallback = {
    key: ChangeEvent,
    callback: ChangeCallbackFunction;
};

export const GraphProviderRef = (props: PropsWithChildren) => {
    const { children } = props;
    const nodes = useRef<Node[]>([]);
    const edges = useRef<Edge[]>([]);
    const initialized = useRef<boolean>(false);

    const [, render] = useReducer(x => !x, false);

    const resolveCollision = debounce(_resolveCollision, 0, { leading: true, trailing: false });

    const listeners = useRef<Record<string, ChangeCallbackFunction[]>>({});

    function _resolveCollision() {
        const parentIds = [...new Set(nodes.current.map(n => n.parentId))];
        const groupedNodes = parentIds.map(id => nodes.current.filter(n => n.parentId === id));

        const updateNodes = groupedNodes.flatMap(group => resolveCollisionsVoronoi(
            group,
            edges.current,
            {
                maxIterations: 10,
                overlapThreshold: 0.5,
                margin: 0,
                noiseScale: 5000,
            }
        ));

        const changes: NodePositionChange[] = updateNodes.map(n => ({
            id: n.id,
            type: 'position',
            position: n.position
        }) as NodePositionChange);

        nodes.current = applyNodeChanges(changes, nodes.current);
        edges.current = applyEdgeChanges([], edges.current);
        render();
    }

    function addNodes<TNodeType extends Node>(newNodes: TNodeType[], totalNodesCount?: number) {
        const changes = newNodes.map((node, index) => ({
            item: node,
            index: (totalNodesCount ?? 0) + index,
            type: 'add'
        }) as NodeAddChange<TNodeType>);

        if (changes.length > 0) {
            nodes.current = applyNodeChanges(changes, nodes.current);
            render();
        }
    }

    function replaceNodes<TNodeType extends Node>(newNodes: TNodeType[]) {
        const changes = newNodes.map((node): NodeReplaceChange => ({
            id: node.id,
            item: node,
            type: 'replace',
        }));

        if (changes.length > 0) {
            nodes.current = applyNodeChanges(changes, nodes.current);
            render();
        }
    }

    function updateNode(id: string, nodeUpdate: Partial<Node> | ((node: Node) => Partial<Node>)) {
        const node = nodes.current.find(n => n.id === id);
        if (!node) return;

        if (typeof nodeUpdate === 'function') {
            nodeUpdate = nodeUpdate(node);
        }

        const merged: Node = { ...node, ...nodeUpdate };
        const changes: NodeChange<Node>[] = [];

        if ('position' in nodeUpdate) {
            changes.push({
                id,
                type: 'position',
                position: merged.position,
            });
        }

        if ('width' in nodeUpdate || 'height' in nodeUpdate) {
            changes.push({
                id,
                type: 'dimensions',
                dimensions: {
                    width: merged.width ?? 0,
                    height: merged.height ?? 0,
                },
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

        nodes.current = applyNodeChanges(changes, nodes.current);
        render();
    }

    function removeNodes<TNodeType extends Node>(newNodes: TNodeType[]) {
        const changes = newNodes.map(node => ({
            id: node.id,
            type: 'remove'
        }) as NodeRemoveChange);

        if (changes.length > 0) {
            nodes.current = applyNodeChanges(changes, nodes.current);
            render();
        }
    }

    function addEdges(newEdges: Edge[]) {
        const changes = newEdges.map((edge): EdgeAddChange => ({
            item: edge,
            type: "add"
        }));

        if (changes.length > 0) {
            edges.current = applyEdgeChanges(changes, edges.current);
            render();
        }
    }

    function replaceEdges(newEdges: Edge[]) {
        const changes = newEdges.map((edge): EdgeReplaceChange => ({
            id: edge.id,
            item: edge,
            type: 'replace',
        }));

        if (changes.length > 0) {
            edges.current = applyEdgeChanges(changes, edges.current);
            render();
        }
    }

    function removeEdges(newEdges: Edge[]) {
        const changes = newEdges.map((edge) => ({
            id: edge.id,
            type: 'remove'
        }) as EdgeRemoveChange);

        if (changes.length > 0) {
            edges.current = applyEdgeChanges(changes, edges.current);
            render();
        }
    }

    const clear = useCallback(() => {
        const nodesChanges = nodes.current.map(node => ({ id: node.id, type: 'remove' }) as NodeRemoveChange);
        const edgesChanges = edges.current.map(edge => ({ id: edge.id, type: 'remove' }) as EdgeRemoveChange);
        nodes.current = applyNodeChanges(nodesChanges, nodes.current);
        edges.current = applyEdgeChanges(edgesChanges, edges.current);
    }, []);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        const filtered = changes.filter(c => c.type !== 'add' && c.type !== 'remove');

        if (changes.find(c => c.type === 'position' || c.type === 'add' || (c.type === 'dimensions' && !initialized.current))) {
            resolveCollision();
            initialized.current = true;
        }

        if (filtered.length > 0) {
            nodes.current = applyNodeChanges(filtered, nodes.current);
        }

        changes.forEach(c => {
            listeners.current[`node:${c.type}`]?.forEach(l => l(c));
            listeners.current[`node:any`]?.forEach(l => l(c));
        });

        if (changes.find(c => c.type === 'select')) {
            render();
        }
    }, []);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        const filtered = changes.filter(c => c.type !== 'add' && c.type !== 'remove');

        if (filtered.length > 0)
            edges.current = applyEdgeChanges(filtered, edges.current);

        changes.forEach(c => {
            listeners.current[`edge:${c.type}`]?.forEach(l => l(c));
            listeners.current[`edge:any`]?.forEach(l => l(c));
        });

        render();
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

    const value: IGraphContextRef = {
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
        <GraphContextRef.Provider value={value}>
            <InspectorProvider>
                {children}
            </InspectorProvider>
        </GraphContextRef.Provider>
    );
}