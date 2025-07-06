import { Background, Node, NodeChange, ReactFlowProvider, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Flex } from 'antd';
import { useCallback, useRef } from 'react';
import { useNodeEventListener } from '../../events';
import { useServiceGraph } from '../../hooks/use-service-graph';
import { ServiceSearchModalProvider } from '../../providers/service-search-modal-provider';
import { NodeInfoPanel } from '../node-info-panel/node-info-panel';
import ServiceNode from '../nodes/service-node/service-node';
import StyledGraph from '../styled/styled-graph';
import { Toolbar } from '../toolbar/toolbar';
import styles from './main-graph.module.scss';

interface MainGraphProps {}

const nodeTypes = {
  serviceNode: ServiceNode,
};

export function MainGraph(props: MainGraphProps) {
  const [nodes, _setNodes, onNodesChange] = useNodesState([] as Node[]);
  const { tryUpdateNodes } = useServiceGraph();

  const setNodes = useRef((nodes: Node[]) => {
    _setNodes(nodes);
  });

  useNodeEventListener({
    onAllNodeUpdates: value => setNodes.current(value),
  });

  const customOnNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      tryUpdateNodes(changes as NodeChange<ServiceNode>[]);
      onNodesChange(changes);
    },
    [onNodesChange, tryUpdateNodes],
  );

  return (
    <div style={{ width: '100%', height: '100%' }} className={styles['main-graph-container']}>
      <ReactFlowProvider>
        <ServiceSearchModalProvider
          keybinding={{
            key: ' ',
            ctrl: true,
          }}
        >
          <Flex vertical className={styles['overlay-ui']}>
            <Toolbar />
            <NodeInfoPanel />
          </Flex>
          <StyledGraph nodes={nodes} edges={[]} nodeTypes={nodeTypes} snapToGrid onNodesChange={customOnNodesChange}>
            <Background />
          </StyledGraph>
        </ServiceSearchModalProvider>
      </ReactFlowProvider>
    </div>
  );
}

export default MainGraph;
