import { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useServiceGraph } from '.';
import { GroupNode, nodeName } from '../components/nodes/group-node/group-node';
import ServiceNode from '../components/nodes/service-node/service-node';
import { useNodeEventListener } from '../events';

export function useGroupNodeCreation() {
  const { nodes, tryAddNode, tryUpdateNodes } = useServiceGraph();
  const [selectedNodes, setSelectedNodes] = useState<ServiceNode[]>([]);

  // Listen for selection changes
  useNodeEventListener<ServiceNode>({
    onSelectionChanged: () => {
      // Update selected nodes based on all nodes
      const currentSelected = nodes.filter(n => n.selected);
      setSelectedNodes(currentSelected);
    },
    onAllNodeUpdates: updatedNodes => {
      const currentSelected = updatedNodes.filter(n => n.selected);
      setSelectedNodes(currentSelected);
    },
  });

  const createGroupFromSelected = useCallback(
    (groupName: string = 'New Group') => {
      if (selectedNodes.length < 2) {
        console.warn('Need at least 2 selected nodes to create a group');
        return false;
      }

      // Create a new group node
      const groupNode: Partial<GroupNode> = {
        id: uuid(),
        type: nodeName,
        position: { x: 0, y: 0 }, // Position will be calculated by the component
        data: {
          name: groupName,
          serviceNodes: [...selectedNodes],
          color: '#e6f3ff',
        },
        selectable: true,
        draggable: true,
        deletable: true,
        zIndex: -1, // Place behind service nodes
      };

      // Add the group node
      const success = tryAddNode(groupNode);

      if (success) {
        // Optionally deselect the service nodes after grouping
        const deselectChanges = selectedNodes.map(node => ({
          id: node.id,
          type: 'select' as const,
          selected: false,
        }));
        tryUpdateNodes(deselectChanges);
      }

      return success;
    },
    [selectedNodes, tryAddNode, tryUpdateNodes],
  );

  return {
    selectedNodes,
    createGroupFromSelected,
    canCreateGroup: selectedNodes.length >= 2,
  };
}
