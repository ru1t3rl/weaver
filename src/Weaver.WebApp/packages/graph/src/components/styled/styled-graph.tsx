import { ReactFlow, ReactFlowProps } from '@xyflow/react';
import { theme } from 'antd';
import { useMemo } from 'react';

export function StyledGraph(props: ReactFlowProps) {
  const { useToken } = theme;
  const { token } = useToken();

  const style = useMemo(
    () => ({
      background: token.colorBgContainer,
      borderRadius: token.borderRadius,
      reactFlow__node: {
        background: token.colorBgElevated,
      },
    }),
    [token],
  );

  return <ReactFlow style={style} {...props} />;
}

export default StyledGraph;
