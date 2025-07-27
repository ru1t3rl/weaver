import { Node, NodeProps } from '@xyflow/react';
import { useMemo } from 'react';
import { ServiceNode } from '../service-node/service-node';

type GroupNodeData = {
  name: string;
  serviceNodes: ServiceNode[];
  color?: string;
  onClick?: () => void;
};

export const nodeName = 'groupNode';
export type GroupNode = Node<GroupNodeData, 'groupNode'>;

export function GroupNode(props: NodeProps<GroupNode>) {
  const { data, selected } = props;
  const { name, serviceNodes, color = '#e6f3ff' } = data;

  function handleClick() {
    if (data.onClick) {
      data.onClick();
    }
  }

  // Calculate the bounding box that encompasses all service nodes
  const boundingBox = useMemo(() => {
    if (serviceNodes.length === 0) {
      return { x: 0, y: 0, width: 200, height: 100 };
    }

    const positions = serviceNodes.map(node => node.position);
    const minX = Math.min(...positions.map(p => p.x)) - 20;
    const maxX = Math.max(...positions.map(p => p.x)) + 200; // Assuming node width ~180
    const minY = Math.min(...positions.map(p => p.y)) - 20;
    const maxY = Math.max(...positions.map(p => p.y)) + 100; // Assuming node height ~80

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }, [serviceNodes]);

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute',
        left: boundingBox.x,
        top: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height,
        backgroundColor: color,
        border: selected ? '2px solid #1890ff' : '2px dashed #d9d9d9',
        borderRadius: '8px',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      {/* Group label */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          left: 10,
          backgroundColor: color,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#666',
          border: '1px solid #d9d9d9',
          pointerEvents: 'auto',
        }}
      >
        {name} ({serviceNodes.length} services)
      </div>
    </div>
  );
}
