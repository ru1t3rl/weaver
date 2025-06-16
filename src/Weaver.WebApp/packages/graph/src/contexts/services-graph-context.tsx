import { NodeProps } from '@xyflow/react';
import { createContext } from 'react';

export interface IServiceGraphContext<TNode extends NodeProps> {
  nodes: readonly TNode[];
  tryAddNode: (node: TNode) => boolean;
  tryRemoveNode: (node: TNode) => boolean;
}

export function createServiceGraphContext<TNode extends NodeProps>() {
  return createContext<IServiceGraphContext<TNode>>({
    nodes: [],
    tryAddNode: (): boolean => false,
    tryRemoveNode: (): boolean => false,
  });
}
