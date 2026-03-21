import { GraphProviderRef, NodeTypes, EdgeTypes, StyledGraph, useGraphRef, ContextMenuProvider, useContextMenu, ContextMenuItem, useInspector, containerNode } from '@weaver/graph';
import { Background, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LuPlus } from 'react-icons/lu';
import { Outlet } from 'react-router';
import { useServiceTemplateSearchModal } from '../../../hooks';
import { NotificationProvider } from '../../../providers';
import styles from './main-graph.module.scss';
import { useMemo, useReducer, useRef } from 'react';
import { ContainerInspector } from '../../inspectors/container-inspector/container-inspector';
import { ContainerLogModal } from '../../modals/container-log-modal/container-log-modal';

export function InternalMainGraph() {
  const { show: showServiceModal } = useServiceTemplateSearchModal();
  const [, render] = useReducer(x => !x, false);
  const _render = useRef(render);


  const { close, show } = useContextMenu();
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
        nodes={nodes.current}
        edges={edges.current}
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
      <GraphProviderRef>
        <ContextMenuProvider>
          <ReactFlowProvider>
            <InternalMainGraph />
          </ReactFlowProvider>
        </ContextMenuProvider>
      </GraphProviderRef>
    </div>
  )
}

export default MainGraph;
