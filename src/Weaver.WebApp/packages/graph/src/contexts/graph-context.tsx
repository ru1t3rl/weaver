import { Edge, EdgeChange, Node, NodeChange } from "@xyflow/react";
import { createContext } from "react";

export interface IGraphContext {
    nodes: Node[];
    addNodes: (nodes: Node[], nodesCount?: number) => void;
    removeNodes: (nodes: Node[]) => void;
    edges: Edge[];
    addEdges: (edges: Edge[]) => void;
    removeEdges: (edges: Edge[]) => void;
    clear: () => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
}

export const GraphContext = createContext<IGraphContext>({
    nodes: [],
    addNodes: (): void => undefined,
    removeNodes: (): void => undefined,
    edges: [],
    addEdges: (): void => undefined,
    removeEdges: (): void => undefined,
    clear: (): void => undefined,
    onNodesChange: (): void => undefined,
    onEdgesChange: (): void => undefined
})