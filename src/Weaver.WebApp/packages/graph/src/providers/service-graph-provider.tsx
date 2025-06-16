import { NodeProps } from '@xyflow/react';
import { PropsWithChildren, useRef } from 'react';
import { createServiceGraphContext, IServiceGraphContext } from '../contexts';
import { useNodeEvents } from '../events';

export const ServiceGraphContext = createServiceGraphContext<NodeProps>();
export function ServiceGraphProvider<TNode extends NodeProps>({
  children,
}: PropsWithChildren) {
  const nodes = useRef<Map<string, TNode>>(new Map());

  const events = useNodeEvents();

  function tryAddNode(node: TNode): boolean {
    if (nodes.current.has(node.id)) {
      return false;
    }

    nodes.current.set(node.id, node);
    events.onAddNode(node);
    events.onAllNodeUpdates(Array.from(nodes.current.values()));
    return true;
  }

  function tryRemoveNode(node: TNode): boolean {
    if (!nodes.current.has(node.id)) {
      return false;
    }

    nodes.current.delete(node.id);
    events.onRemoveNode(node);
    events.onAllNodeUpdates(Array.from(nodes.current.values()));
    return true;
  }

  const contextValue: IServiceGraphContext<TNode> = {
    tryAddNode,
    tryRemoveNode,
    nodes: Array.from(nodes.current.values()),
  };

  return (
    <ServiceGraphContext.Provider value={contextValue}>
      {children}
    </ServiceGraphContext.Provider>
  );
}
