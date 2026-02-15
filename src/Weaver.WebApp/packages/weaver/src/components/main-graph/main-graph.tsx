import { useDocker } from '@weaver/docker';
import { Background, Node, ReactFlowProvider, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Flex, MenuProps, Typography } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { NotificationProvider } from '../../providers';
import { ModalsProvider } from '../../providers/modals-provider';
import { NodeTypes, stackNode, containerNode, StyledGraph, GraphContextMenu, NodeInfoPanel, resolveCollisions } from '@weaver/graph';
import styles from './main-graph.module.scss';
import { useServiceTemplateSearchModal } from '../../hooks';
import { LuPlus } from 'react-icons/lu';

export function MainGraph() {
  const { Containers, Stacks } = useDocker();
  const { show: showServiceModal } = useServiceTemplateSearchModal();

  const items: MenuProps['items'] = [
    {
      label: 'Add service',
      icon: <LuPlus />,
      key: 'add-service',
      onClick: showServiceModal,
    },
  ];


  const containerNodes = useMemo(() => {
    return Containers.map((c) => ({
      id: c.id,
      type: containerNode,
      position: { x: 0, y: 0 },
      data: {
        name: c.name,
        state: c.status
      }
    }) as unknown as Node);
  }, [Containers]);

  const stackNodes = useMemo(() => {
    return Stacks.map((c) => ({
      id: c.id,
      type: stackNode,
      position: { x: 0, y: 0 },
      data: {
        name: c.name,
        // state: c.
      }
    }) as unknown as Node);
  }, [Stacks])

  const [nodes, setNodes, onNodesChange] = useNodesState([...stackNodes, ...containerNodes]);

  useEffect(() => {
    if (nodes.length !== [...stackNodes, ...containerNodes].length) {
      setNodes(resolveCollisions([...stackNodes, ...containerNodes], {
        maxIterations: Infinity,
        overlapThreshold: 0.5,
        margin: 15,
      })
      )
    }
  }, [containerNodes, stackNodes])

  const fixCollisions = useCallback(() => {
    setNodes((nds) =>
      resolveCollisions(nds, {
        maxIterations: Infinity,
        overlapThreshold: 0.5,
        margin: 15,
      }),
    );
  }, [setNodes]);

  return (
    <div style={{ width: '100%', height: '100%' }} className={styles['main-graph-container']}>
      <ReactFlowProvider>
        <NotificationProvider>
          <ModalsProvider>
            <Flex vertical className={styles['overlay-ui']}>
              <Typography.Title style={{ margin: 0 }}>Weaver</Typography.Title>
              {/* <Toolbar /> */}
              {/* <NodeInfoPanel /> */}
            </Flex>
            <GraphContextMenu items={items}>
              <StyledGraph
                nodes={nodes}
                nodeTypes={NodeTypes}
                onNodesChange={onNodesChange}
                onNodeDragStop={fixCollisions}
                edges={[]}
                snapToGrid
                multiSelectionKeyCode={'Ctrl'}
                selectionKeyCode={'Shift'}
              >
                <Background />
              </StyledGraph>
            </GraphContextMenu>
          </ModalsProvider>
        </NotificationProvider>
      </ReactFlowProvider>
    </div>
  );
}

export default MainGraph;
