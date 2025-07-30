import {MiniMap, MiniMapProps} from "@xyflow/react";
import {theme} from "antd";
import {useMemo} from "react";

export function StyledMiniMap(props: MiniMapProps) {
    const {useToken} = theme;
    const {token} = useToken();

    const style = useMemo(() => ({
        background: token.colorBgElevated,
    }), [token])
    
    return <MiniMap style={style} {...props} />
}

export default StyledMiniMap;