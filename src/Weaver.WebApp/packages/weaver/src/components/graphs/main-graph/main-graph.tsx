import { GraphContextMenu, GraphProviderRef, NodeTypes, EdgeTypes, StyledGraph, useGraphRef } from '@weaver/graph';
import { Background, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MenuProps } from 'antd';
import { LuPlus } from 'react-icons/lu';
import { Outlet } from 'react-router';
import { useServiceTemplateSearchModal } from '../../../hooks';
import { NotificationProvider } from '../../../providers';
import styles from './main-graph.module.scss';
import { useReducer, useRef } from 'react';

export function InternalMainGraph() {
  const { show: showServiceModal } = useServiceTemplateSearchModal();
  const [, render] = useReducer(x => !x, false);
  const _render = useRef(render);

  const { nodes, edges, resolveCollision, onNodesChange, onEdgesChange } = useGraphRef([
    {
      key: { type: 'edge', change: 'any' },
      callback: () => _render.current()
    },
    {
      key: { type: 'node', change: 'any' },
      callback: () => _render.current()
    }
  ]);

  const items: MenuProps['items'] = [
    {
      label: 'Add service',
      icon: <LuPlus />,
      key: 'add-service',
      onClick: showServiceModal,
    },
  ];

  return (
    <NotificationProvider>
      {/* <ModalsProvider> */}
      <Outlet />
      <GraphContextMenu items={items}>
        <StyledGraph
          nodes={nodes.current}
          edges={edges.current}
          nodeTypes={NodeTypes}
          edgeTypes={EdgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={resolveCollision}
          snapToGrid
          multiSelectionKeyCode={'Ctrl'}
          selectionKeyCode={'Shift'}
        >
          <Background />
        </StyledGraph>
      </GraphContextMenu>
      {/* </ModalsProvider> */}
    </NotificationProvider>
  )
}

export const MainGraph = () => {
  return (
    <div style={{ width: '100%', height: '100%' }} className={styles['main-graph-container']}>
      <GraphProviderRef>
        <ReactFlowProvider>
          <InternalMainGraph />
        </ReactFlowProvider>
      </GraphProviderRef>
    </div>
  )
}

export default MainGraph;
