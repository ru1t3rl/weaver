import { Node } from '@xyflow/react';
import { useCallback, useMemo } from 'react';

enum NodeEvents {
  Add = 'add-node',
  Update = 'update-node',
  Remove = 'remove-node',
  AllUpdates = 'all-node-updates',
  Selection = 'select-node',
}

export interface INodeEvents<TNode extends Node> {
  onAddNode: (node: TNode) => void;
  onUpdateNode: (node: TNode) => void;
  onRemoveNode: (node: TNode) => void;
  onAllNodeUpdates: (nodes: TNode[]) => void;
  onSelectionChanged: (node: TNode | undefined) => void;
}

export function useNodeEvents<TNode extends Node>(): INodeEvents<TNode> {
  function onAddNode(node: TNode) {
    const event = new CustomEvent<TNode>(NodeEvents.Add, { detail: node });
    window.dispatchEvent(event);
  }

  function onRemoveNode(node: TNode) {
    const event = new CustomEvent<TNode>(NodeEvents.Remove, { detail: node });
    window.dispatchEvent(event);
  }

  function onUpdateNode(node: TNode) {
    const event = new CustomEvent<TNode>(NodeEvents.Update, { detail: node });
    window.dispatchEvent(event);
  }

  function onAllNodeUpdates(node: TNode[]) {
    const event = new CustomEvent<TNode[]>(NodeEvents.AllUpdates, {
      detail: node,
    });
    window.dispatchEvent(event);
  }

  function onSelectionChanged(node: TNode | undefined) {
    const event = new CustomEvent<TNode | undefined>(NodeEvents.Selection, {
      detail: node,
    });
    window.dispatchEvent(event);
  }

  return {
    onAddNode,
    onUpdateNode,
    onRemoveNode,
    onAllNodeUpdates,
    onSelectionChanged,
  };
}

interface UseNodeEventListener<TNode extends Node> {
  onAddNode?: (e: TNode) => void;
  onUpdateNode?: (node: TNode) => void;
  onRemoveNode?: (node: TNode) => void;
  onAllNodeUpdates?: (nodes: TNode[]) => void;
  onSelectionChanged?: (node: TNode | undefined) => void;
}

export function useNodeEventListener<TNode extends Node>(callbacks: UseNodeEventListener<TNode>) {
  const { onAddNode, onUpdateNode, onRemoveNode, onAllNodeUpdates, onSelectionChanged } = callbacks;

  const handleOnAddNode = useCallback(
    (e: Event) => {
      if (onAddNode) {
        const { detail } = e as CustomEvent<TNode>;
        onAddNode(detail);
      }
    },
    [onAddNode],
  );

  const handleOnRemoveNode = useCallback(
    (e: Event) => {
      if (onRemoveNode) {
        const { detail } = e as CustomEvent<TNode>;
        onRemoveNode(detail);
      }
    },
    [onRemoveNode],
  );

  const handleOnUpdateNode = useCallback(
    (e: Event) => {
      if (onUpdateNode) {
        const { detail } = e as CustomEvent<TNode>;
        onUpdateNode(detail);
      }
    },
    [onUpdateNode],
  );

  const handleOnAllNodeUpdates = useCallback(
    (e: Event) => {
      if (onAllNodeUpdates) {
        const { detail } = e as CustomEvent<TNode[]>;
        onAllNodeUpdates(detail);
      }
    },
    [onAllNodeUpdates],
  );

  const handleOnSelectionChanged = useCallback(
    (e: Event) => {
      if (onSelectionChanged) {
        const { detail } = e as CustomEvent<TNode | undefined>;
        onSelectionChanged(detail);
      }
    },
    [onSelectionChanged],
  );

  useMemo(() => {
    window.addEventListener(NodeEvents.Add, handleOnAddNode);
    window.addEventListener(NodeEvents.Remove, handleOnRemoveNode);
    window.addEventListener(NodeEvents.Update, handleOnUpdateNode);
    window.addEventListener(NodeEvents.AllUpdates, handleOnAllNodeUpdates);
    window.addEventListener(NodeEvents.Selection, handleOnSelectionChanged);

    return () => {
      window.removeEventListener(NodeEvents.Add, handleOnAddNode);
      window.removeEventListener(NodeEvents.Remove, handleOnRemoveNode);
      window.removeEventListener(NodeEvents.Update, handleOnUpdateNode);
      window.removeEventListener(NodeEvents.AllUpdates, handleOnAllNodeUpdates);
      window.removeEventListener(NodeEvents.Selection, handleOnSelectionChanged);
    };
  }, [handleOnAddNode, handleOnAllNodeUpdates, handleOnRemoveNode, handleOnSelectionChanged, handleOnUpdateNode]);
}
