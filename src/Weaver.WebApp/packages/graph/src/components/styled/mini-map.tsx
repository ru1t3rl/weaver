import {MiniMap} from "@xyflow/react";
import {styled} from "@mui/joy";

export const JoyMiniMap = styled(MiniMap, {
    name: 'JoyMiniMap',
    slot: 'Root',
})(({theme}) => ({
    backgroundColor: theme.vars.palette.background.surface,
}));

export default JoyMiniMap;