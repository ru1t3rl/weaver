import { Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useServiceGraph } from '../../hooks/use-service-graph';
import ServiceNode from '../nodes/service-node/service-node';
import JoyGraph from '../styled/joy-graph';
import JoyMiniMap from '../styled/mini-map';

interface MainGraphProps {}

const nodeTypes = {
  serviceNode: ServiceNode,
};

export function MainGraph(props: MainGraphProps) {
  const g = useServiceGraph();

  return (
    <JoyGraph nodes={[...g.nodes]} edges={[]} nodeTypes={nodeTypes}>
      <JoyMiniMap />
      <Background />
    </JoyGraph>
  );
}

export default MainGraph;
