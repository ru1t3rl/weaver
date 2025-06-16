import { PropsWithChildren, useRef } from 'react';
import { ServiceNodeProps } from '../components/nodes/service-node/service-node';
import { createServiceGraphContext, IServiceGraphContext } from '../contexts';
import { useNodeEvents } from '../events';

export const ServiceGraphContext =
  createServiceGraphContext<ServiceNodeProps>();
export function ServiceGraphProvider({ children }: PropsWithChildren) {
  const nodes = useRef<Map<string, ServiceNodeProps>>(new Map());

  const events = useNodeEvents();

  function tryAddNode(node: ServiceNodeProps): boolean {
    if (nodes.current.has(node.id)) {
      return false;
    }

    nodes.current.set(node.id, node);
    events.onAddNode(node);
    events.onAllNodeUpdates(Array.from(nodes.current.values()));
    return true;
  }

  function tryRemoveNode(node: ServiceNodeProps): boolean {
    if (!nodes.current.has(node.id)) {
      return false;
    }

    nodes.current.delete(node.id);
    events.onRemoveNode(node);
    events.onAllNodeUpdates(Array.from(nodes.current.values()));
    return true;
  }

  const contextValue: IServiceGraphContext<ServiceNodeProps> = {
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
