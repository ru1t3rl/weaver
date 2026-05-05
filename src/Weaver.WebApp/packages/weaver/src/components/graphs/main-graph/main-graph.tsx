import { containerNode, ContextMenuItem, ContextMenuProvider, EdgeTypes, GraphProvider, NodeTypes, StyledGraph, useContextMenu, useGraph, useInspector } from '@weaver/graph';
import { Background, MiniMap, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMemo } from 'react';
import { LuPlus } from 'react-icons/lu';
import { Outlet } from 'react-router';
import { useServiceTemplateSearchModal } from '../../../hooks';
import { NotificationProvider } from '../../../providers';
import { ContainerInspector } from '../../inspectors/container-inspector/container-inspector';
import styles from './main-graph.module.scss';

export function InternalMainGraph() {
  const { show: showServiceModal } = useServiceTemplateSearchModal();

  const { close, show } = useContextMenu();
  const { nodes, edges, resolveCollision, onNodesChange, onEdgesChange } = useGraph();

  const items = useMemo<ContextMenuItem[]>(() => [
    {
      label: 'Add service',
      onClick: () => showServiceModal,
      icon: <LuPlus />,
    },
  ], []);

  const { registerPersistent } = useContextMenu();
  const { tryRegister: tryRegisterInspector } = useInspector();

  useMemo(() => {
    registerPersistent(items);
    tryRegisterInspector(containerNode, <ContainerInspector />);
  }, [items])

  function showContext(e: React.MouseEvent) {
    e.preventDefault();
    show(e.clientX, e.clientY);
  }

  return (
    <NotificationProvider>
      {/* <ModalsProvider> */}
      <Outlet />
      <StyledGraph
        nodes={nodes}
        edges={edges}
        nodeTypes={NodeTypes}
        edgeTypes={EdgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={resolveCollision}
        onPaneClick={close}
        onNodeClick={close}
        onContextMenu={showContext}
        snapToGrid
        multiSelectionKeyCode={'Ctrl'}
        selectionKeyCode={'Shift'}
      >
        <Background />
      </StyledGraph>
      {/* </ModalsProvider> */}
    </NotificationProvider>
  )
}

export const MainGraph = () => {
  return (
    <div style={{ width: '100%', height: '100%' }} className={styles['main-graph-container']}>
      <ReactFlowProvider>
        <GraphProvider collisionOptions={{
          maxIterations: 10,
          overlapThreshold: 0.5,
          repulsionStrength: .25,
          damping: 1,
          margin: 0,
          layerSeparation: 0,
          noiseScale: 10000,
        }}>
          <ContextMenuProvider>
            <InternalMainGraph />
          </ContextMenuProvider>
        </GraphProvider>
      </ReactFlowProvider>
    </div>
  )
}

export default MainGraph;
