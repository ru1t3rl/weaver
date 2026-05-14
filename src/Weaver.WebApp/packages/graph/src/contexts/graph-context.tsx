import { Edge, EdgeChange, Node, NodeChange } from "@xyflow/react";
import { createContext } from "react";
import { ChangeCallbackFunction, ChangeEvent } from "../providers/graph-provider-ref";

export interface IGraphContext {
    nodes: Node[];
    addNodes: (nodes: Node[], nodesCount?: number) => void;
    replaceNodes: (nodes: Node[]) => void;
    updateNode: (id: string, nodeUpdate: Partial<Node> | ((node: Node) => Partial<Node>)) => void;
    removeNodes: (nodes: Node[]) => void;
    edges: Edge[];
    addEdges: (edges: Edge[]) => void;
    replaceEdges: (edges: Edge[]) => void;
    removeEdges: (edges: Edge[]) => void;
    clear: () => void;
    resolveCollision: () => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    addChangeListener: (event: ChangeEvent, callback: ChangeCallbackFunction) => void,
    removeChangeListener: (event: ChangeEvent, callback: ChangeCallbackFunction) => void,
}

export const GraphContext = createContext<IGraphContext>({
    nodes: [],
    addNodes: (): void => undefined,
    updateNode: (): void => undefined,
    replaceNodes: (): void => undefined,
    removeNodes: (): void => undefined,
    edges: [],
    addEdges: (): void => undefined,
    replaceEdges: (): void => undefined,
    removeEdges: (): void => undefined,
    clear: (): void => undefined,
    resolveCollision: (): void => undefined,
    onNodesChange: (): void => undefined,
    onEdgesChange: (): void => undefined,
    addChangeListener: (): void => undefined,
    removeChangeListener: (): void => undefined
})