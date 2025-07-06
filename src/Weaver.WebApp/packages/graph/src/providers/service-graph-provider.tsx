import { NodeChange } from '@xyflow/react';
import { PropsWithChildren, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { ServiceNode } from '../components/nodes/service-node/service-node';
import { createServiceGraphContext, IServiceGraphContext } from '../contexts';
import { useNodeEvents } from '../events';

export const ServiceGraphContext = createServiceGraphContext<ServiceNode>();
export function ServiceGraphProvider({ children }: PropsWithChildren) {
  const nodes = useRef<Map<string, ServiceNode>>(new Map());

  const defaultNode: ServiceNode = {
    deletable: true,
    draggable: true,
    dragging: false,
    selectable: true,
    selected: false,
    zIndex: 0,
    connectable: true,
    type: 'serviceNode',
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

  function tryAddNode(node: Partial<ServiceNode>): boolean {
    const newNode: ServiceNode = {
      ...defaultNode,
      id: uuid(),
      ...node,
    };

    if (nodes.current.has(newNode.id)) {
      console.log('id exists');
      return false;
    }

    nodes.current.set(newNode.id, newNode);
    events.onAddNode(newNode);
    events.onAllNodeUpdates(Array.from(nodes.current.values()));
    return true;
  }

  function tryRemoveNode(node: ServiceNode): boolean {
    if (!nodes.current.has(node.id)) {
      return false;
    }

    nodes.current.delete(node.id);
    events.onRemoveNode(node);
    events.onAllNodeUpdates(Array.from(nodes.current.values()));
    return true;
  }

  function tryUpdateNodes(changes: NodeChange<ServiceNode>[]): boolean {
    for (const change of changes) {
      let node: ServiceNode | undefined;
      if (change.type === 'select' && (node = nodes.current.get(change.id))) {
        nodes.current.forEach(n => {
          if (n.selected) {
            events.onUpdateNode(n);
            n.selected = false;
            console.log(n.selected);
          }
        });

        node.selected = change.selected;
        nodes.current.set(node.id, node);
        events.onUpdateNode(node);

        console.log('selected: ' + node.selected);
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

  const contextValue: IServiceGraphContext<ServiceNode> = {
    tryAddNode,
    tryRemoveNode,
    tryUpdateNodes,
    nodes: Array.from(nodes.current.values()),
  };

  return <ServiceGraphContext.Provider value={contextValue}>{children}</ServiceGraphContext.Provider>;
}
