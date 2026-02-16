import { Edge, EdgeChange, Node, NodeChange } from "@xyflow/react";
import { createContext, RefObject } from "react";

export interface IGraphContextRef {
    addNodes: (nodes: Node[], nodesCount?: number) => void;
    nodes: RefObject<Node[]>;
    removeNodes: (nodes: Node[]) => void;
    edges: RefObject<Edge[]>;
    addEdges: (edges: Edge[]) => void;
    removeEdges: (edges: Edge[]) => void;
    clear: () => void;
    resolveCollision: () => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
}

export const GraphContextRef = createContext<IGraphContextRef>({
    nodes: { current: [] },
    addNodes: (): void => undefined,
    removeNodes: (): void => undefined,
    edges: { current: [] },
    addEdges: (): void => undefined,
    removeEdges: (): void => undefined,
    clear: (): void => undefined,
    resolveCollision: (): void => undefined,
    onNodesChange: (): void => undefined,
    onEdgesChange: (): void => undefined
})