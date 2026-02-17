import { applyEdgeChanges, applyNodeChanges, Edge, EdgeAddChange, EdgeChange, EdgeRemoveChange, Node, NodeAddChange, NodeChange, NodePositionChange, NodeRemoveChange } from "@xyflow/react";
import { PropsWithChildren, useCallback, useReducer, useRef } from "react";
import { resolveCollisionsVoronoi } from "../components";
import { GraphContextRef, IGraphContextRef } from "../contexts/graph-context-ref";
import { debounce } from 'lodash';

export const GraphProviderRef = (props: PropsWithChildren) => {
    const { children } = props;
    const nodes = useRef<Node[]>([]);
    const edges = useRef<Edge[]>([]);
    const initialized = useRef<boolean>(false);

    const [, render] = useReducer(x => !x, false);
    const resolveCollision = debounce(_resolveCollision, 0, { leading: true, trailing: false });

    function _resolveCollision() {
        const updateNodes: Node[] = resolveCollisionsVoronoi(nodes.current, {
            maxIterations: 10,
            overlapThreshold: 0.5,
            margin: 0,
            noiseScale: 100
        });

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

        if (filtered.length > 0)
            nodes.current = applyNodeChanges(filtered, nodes.current);
    }, []);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        const filtered = changes.filter(c => c.type !== 'add' && c.type !== 'remove');

        if (filtered.length > 0)
            edges.current = applyEdgeChanges(filtered, edges.current);

        render();
    }, []);

    const value: IGraphContextRef = {
        nodes: nodes,
        addNodes,
        removeNodes,
        edges: edges,
        addEdges,
        removeEdges,
        clear,
        resolveCollision,
        onNodesChange,
        onEdgesChange
    }

    return <GraphContextRef.Provider value={value}>{children}</GraphContextRef.Provider>
}