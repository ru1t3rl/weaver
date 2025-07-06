import { Node, NodeChange } from '@xyflow/react';
import { createContext } from 'react';

export interface IServiceGraphContext<TNode extends Node> {
  nodes: readonly TNode[];
  tryAddNode: (node: Partial<TNode>) => boolean;
  tryRemoveNode: (node: TNode) => boolean;
  tryUpdateNodes: (changes: NodeChange<TNode>[]) => boolean;
}

export function createServiceGraphContext<TNode extends Node>() {
  return createContext<IServiceGraphContext<TNode>>({
    nodes: [],
    tryAddNode: (): boolean => false,
    tryRemoveNode: (): boolean => false,
    tryUpdateNodes: (): boolean => false,
  });
}
