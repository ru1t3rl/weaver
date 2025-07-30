import { NodeChange } from '@xyflow/react';
import { PropsWithChildren, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { GroupNode } from '../components/nodes/group-node/group-node';
import { ServiceNode, nodeName as serviceNodeName } from '../components/nodes/service-node/service-node';
import { createServiceGraphContext, IServiceGraphContext } from '../contexts';
import { useNodeEvents } from '../events';

export const ServiceGraphContext = createServiceGraphContext<ServiceNode | GroupNode>();

export function ServiceGraphProvider<T extends ServiceNode | GroupNode>({ children }: PropsWithChildren) {
  const nodes = useRef<Map<string, T>>(new Map());

  const defaultNode: ServiceNode = {
    deletable: true,
    draggable: true,
    dragging: false,
    selectable: true,
    selected: false,
    zIndex: 0,
    connectable: true,
    type: serviceNodeName,
    id: uuid(),
    position: {
      x: 0,
      y: 0,
    },
    data: {
      serviceInfo: {
        name: 'Unknown',
        type: 'Reference',
      },
    },
  };

  const events = useNodeEvents();

  function tryAddNode(node: T): boolean {
    if (nodes.current.has(node.id)) {
      return false;
    }

    nodes.current.set(node.id, node);
    events.onAddNode(node);
    events.onAllNodeUpdates(Array.from(nodes.current.values()));
    return true;
  }

  function tryAddServiceNode(node: Partial<ServiceNode>): boolean {
    const newNode: ServiceNode = {
      ...defaultNode,
      id: uuid(),
      ...node,
    };

    return tryAddNode(newNode as T);
  }

  function tryRemoveNode(node: T): boolean {
    if (!nodes.current.has(node.id)) {
      return false;
    }

    nodes.current.delete(node.id);
    events.onRemoveNode(node);
    events.onAllNodeUpdates(Array.from(nodes.current.values()));
    return true;
  }

  function tryUpdateNodes(changes: NodeChange<T>[]): boolean {
    const amountSelected = changes.filter(change => change.type === 'select').length;

    for (const change of changes) {
      let node: T | undefined;
      if (change.type === 'select' && (node = nodes.current.get(change.id))) {
        if (node.selected !== change.selected) {
          node.selected = change.selected;
          nodes.current.set(node.id, node);
          events.onUpdateNode(node);

          events.onSelectionChanged(node.selected && amountSelected == 1 ? node : undefined);
        }
      }

      if (change.type === 'position' && (node = nodes.current.get(change.id))) {
        node.dragging = change.dragging ?? false;
        node.position = change.position ?? node.position;

        nodes.current.set(node.id, node);
        events.onUpdateNode(node);
      }
    }

    events.onAllNodeUpdates(Array.from(nodes.current.values()));
    return true;
  }

  const contextValue: IServiceGraphContext<T> = {
    tryAddNode,
    tryAddServiceNode,
    tryRemoveNode,
    tryUpdateNodes,
    nodes: Array.from(nodes.current.values()),
  };

  return (
    <ServiceGraphContext.Provider value={contextValue as unknown as IServiceGraphContext<ServiceNode | GroupNode>}>
      {children}
    </ServiceGraphContext.Provider>
  );
}
