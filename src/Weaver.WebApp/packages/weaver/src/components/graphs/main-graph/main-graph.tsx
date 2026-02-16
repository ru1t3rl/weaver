import { GraphContextMenu, GraphProviderRef, NodeTypes, StyledGraph, useGraphRef } from '@weaver/graph';
import { Background, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MenuProps } from 'antd';
import { LuPlus } from 'react-icons/lu';
import { Outlet } from 'react-router';
import { useServiceTemplateSearchModal } from '../../../hooks';
import { NotificationProvider } from '../../../providers';
import styles from './main-graph.module.scss';

export function InternalMainGraph() {
  const { show: showServiceModal } = useServiceTemplateSearchModal();
  const { nodes, edges, resolveCollision, onNodesChange, onEdgesChange } = useGraphRef();

  const items: MenuProps['items'] = [
    {
      label: 'Add service',
      icon: <LuPlus />,
      key: 'add-service',
      onClick: showServiceModal,
    },
  ];

  // useEffect(() => {
  //   if (nodes.length !== [...stackNodes, ...containerNodes].length) {
  //     setNodes(resolveCollisionsVoronoi([...stackNodes, ...containerNodes], {
  //       maxIterations: Infinity,
  //       overlapThreshold: 0.5,
  //       margin: 15,
  //     })
  //     )
  //   }
  // }, [containerNodes, stackNodes])

  return (
    <NotificationProvider>
      {/* <ModalsProvider> */}
      <Outlet />
      <GraphContextMenu items={items}>
        <StyledGraph
          nodes={nodes.current}
          edges={edges.current}
          nodeTypes={NodeTypes}
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
