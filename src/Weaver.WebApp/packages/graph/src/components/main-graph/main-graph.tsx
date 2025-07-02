import {Background} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {useReducer, useRef} from 'react';
import {useNodeEventListener} from '../../events';
import {useServiceGraph} from '../../hooks/use-service-graph';
import ServiceNode from '../nodes/service-node/service-node';
import StyledGraph from "../styled/styled-graph";
import StyledMiniMap from "../styled/mini-map";
import {Toolbar} from "../toolbar/toolbar";
import {Flex} from "antd";
import styles from './main-graph.module.scss';

interface MainGraphProps {
}

const nodeTypes = {
    serviceNode: ServiceNode,
};

export function MainGraph(props: MainGraphProps) {
    const [, forceRender] = useReducer(x => !x, false);
    const forceRenderRef = useRef(() => {
        forceRender();
    });

    const {nodes} = useServiceGraph();
    useNodeEventListener({
        onAllNodeUpdates: () => forceRenderRef.current(),
    });

    return (
        <div style={{width: '100%', height: '100%'}} className={styles['main-graph-container']}>
            <Flex vertical className={styles['overlay-ui']}>
                <Toolbar/>
            </Flex>
            <StyledGraph nodes={[...nodes]} edges={[]} nodeTypes={nodeTypes}>
                <StyledMiniMap/>
                <Background/>
            </StyledGraph>
        </div>
    );
}

export default MainGraph;
