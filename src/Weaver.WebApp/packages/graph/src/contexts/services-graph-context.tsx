import { Node, NodeChange } from '@xyflow/react';
import { createContext } from 'react';
import ServiceNode from '../components/nodes/service-node/service-node';

export interface IServiceGraphContext<TNode extends Node> {
  nodes: readonly TNode[];
  tryAddNode: (node: TNode) => boolean;
  tryAddServiceNode: (node: Partial<ServiceNode>) => boolean;
  tryRemoveNode: (node: TNode) => boolean;
  tryUpdateNodes: (changes: NodeChange<TNode>[]) => boolean;
}

export function createServiceGraphContext<TNode extends Node>() {
  return createContext<IServiceGraphContext<TNode>>({
    nodes: [],
    tryAddNode: (): boolean => false,
    tryAddServiceNode: (): boolean => false,
    tryRemoveNode: (): boolean => false,
    tryUpdateNodes: (): boolean => false,
  });
}
