import { applyEdgeChanges, applyNodeChanges, Edge, EdgeAddChange, EdgeChange, EdgeRemoveChange, Node, NodeAddChange, NodeChange, NodeRemoveChange } from "@xyflow/react";
import { PropsWithChildren, useCallback, useState } from "react";
import { GraphContext, IGraphContext } from "../contexts/graph-context";

export const GraphProvider = (props: PropsWithChildren) => {
    const { children } = props;
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    // console.log('rerender provider')

    const addNodes = useCallback(<TNodeType extends Node>(newNodes: TNodeType[], totalNodesCount?: number) => {
        const changes = newNodes.map((node, index) => ({
            item: node,
            index: (totalNodesCount ?? 0) + index
        }) as NodeAddChange<TNodeType>);

        if (changes.length > 0)
            setNodes(snapshot => applyNodeChanges(changes, snapshot));
    }, []);

    function removeNodes<TNodeType extends Node>(newNodes: TNodeType[]) {
        const changes = newNodes.map(node => ({
            id: node.id,
        }) as NodeRemoveChange);

        if (changes.length > 0)
            setNodes(snapshot => applyNodeChanges(changes, snapshot));
    }

    function addEdges(newEdges: Edge[]) {
        const changes = newEdges.map((edge, index) => ({
            item: edge,
            index: edges.length + index
        }) as EdgeAddChange);

        if (changes.length > 0)
            setEdges(snapshot => applyEdgeChanges(changes, snapshot));
    }

    function removeEdges(newEdges: Edge[]) {
        const changes = newEdges.map((edge) => ({
            id: edge.id
        }) as EdgeRemoveChange);

        if (changes.length > 0)
            setEdges(snapshot => applyEdgeChanges(changes, snapshot));
    }

    const clear = useCallback(() => {
        const nodesChanges = nodes.map(node => ({ id: node.id }) as NodeRemoveChange);
        const edgesChanges = edges.map(edge => ({ id: edge.id }) as EdgeRemoveChange);
        setNodes(snapshot => applyNodeChanges(nodesChanges, snapshot));
        setEdges(snapshot => applyEdgeChanges(edgesChanges, snapshot));
    }, [edges, nodes]);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        const filtered = changes.filter(c => c.type !== 'add' && c.type !== 'remove');
        console.log('nodes changed | filtered: ' + filtered.length);
        if (filtered.length > 0)
            setNodes(snapshot => applyNodeChanges(filtered, snapshot));
    }, []);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        const filtered = changes.filter(c => c.type !== 'add' && c.type !== 'remove');

        if (filtered.length > 0)
            setEdges(snapshot => applyEdgeChanges(filtered, snapshot));
    }, []);

    const value: IGraphContext = {
        nodes,
        addNodes,
        removeNodes,
        edges,
        addEdges,
        removeEdges,
        clear,
        onNodesChange,
        onEdgesChange
    }

    return <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
}