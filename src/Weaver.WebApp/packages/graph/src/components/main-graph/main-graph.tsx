import { Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useReducer, useRef } from 'react';
import { useNodeEventListener } from '../../events';
import { useServiceGraph } from '../../hooks/use-service-graph';
import ServiceNode from '../nodes/service-node/service-node';
import { ServiceModal } from '../service-search-modal/service-search-modal';
import JoyGraph from '../styled/joy-graph';
import JoyMiniMap from '../styled/mini-map';

interface MainGraphProps {}

const nodeTypes = {
  serviceNode: ServiceNode,
};

export function MainGraph(props: MainGraphProps) {
  const [, forceRender] = useReducer(x => !x, false);
  const forceRenderRef = useRef(() => {
    forceRender();
  });

  const { nodes } = useServiceGraph();
  useNodeEventListener({
    onAllNodeUpdates: () => forceRenderRef.current(),
  });

  return (
    <>
      <ServiceModal />
      <JoyGraph nodes={[...nodes]} edges={[]} nodeTypes={nodeTypes}>
        <JoyMiniMap />
        <Background />
      </JoyGraph>
    </>
  );
}

export default MainGraph;
