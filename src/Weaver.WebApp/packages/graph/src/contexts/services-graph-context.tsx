import { Node } from '@xyflow/react';
import { createContext } from 'react';

export interface IServiceGraphContext<TNode extends Node> {
  nodes: readonly TNode[];
  tryAddNode: (node: TNode) => boolean;
  tryRemoveNode: (node: TNode) => boolean;
}

export function createServiceGraphContext<TNode extends Node>() {
  return createContext<IServiceGraphContext<TNode>>({
    nodes: [],
    tryAddNode: (): boolean => false,
    tryRemoveNode: (): boolean => false,
  });
}
