import { Background, Node, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Flex } from 'antd';
import { useState } from 'react';
import { useNodeEventListener } from '../../events';
import { ServiceSearchModalProvider } from '../../providers/service-search-modal-provider';
import ServiceNode from '../nodes/service-node/service-node';
import StyledMiniMap from '../styled/mini-map';
import StyledGraph from '../styled/styled-graph';
import { Toolbar } from '../toolbar/toolbar';
import styles from './main-graph.module.scss';

interface MainGraphProps {}

const nodeTypes = {
  serviceNode: ServiceNode,
};

export function MainGraph(props: MainGraphProps) {
  const [nodes, _setNodes] = useState<Node[]>([]);

  useNodeEventListener({
    onAllNodeUpdates: value => _setNodes(value),
  });

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      className={styles['main-graph-container']}
    >
      <ReactFlowProvider>
        <ServiceSearchModalProvider
          keybinding={{
            key: ' ',
            ctrl: true,
          }}
        >
          <Flex vertical className={styles['overlay-ui']}>
            <Toolbar />
          </Flex>
          <StyledGraph nodes={[...nodes]} edges={[]} nodeTypes={nodeTypes}>
            <StyledMiniMap />
            <Background />
          </StyledGraph>
        </ServiceSearchModalProvider>
      </ReactFlowProvider>
    </div>
  );
}

export default MainGraph;
