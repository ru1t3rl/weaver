import {styled} from "@mui/joy";
import {ReactFlow, ReactFlowProps} from "@xyflow/react";

export const JoyGraph = styled(ReactFlow, {name: 'JoyGraph'})<ReactFlowProps>(({theme}) => ({
    background: theme.palette.background.body,
    '.react-flow__node': {
        background: theme.palette.background.surface,
    }
}));

export default JoyGraph;