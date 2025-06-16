import { Box, Card, CardContent, SvgIcon, Typography } from '@mui/joy';
import { NodeProps } from '@xyflow/react';
import { ServiceListItemModel } from 'packages/shared';
import { LuBoxes } from 'react-icons/lu';
import { State, StateCircle } from '../../state-circle/state-circle';

export interface ServiceNodeProps extends NodeProps {
  serviceInfo: ServiceListItemModel;
  onClick?: () => void;
}

export function ServiceNode(props: ServiceNodeProps) {
  const { data, onClick } = props;

  function handleClick() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <Card variant='soft' onClick={handleClick}>
      <CardContent orientation='horizontal'>
        <Box>
          <SvgIcon>
            <LuBoxes />
          </SvgIcon>
        </Box>
        <Box>
          <Typography>{data.name}</Typography>
          <StateCircle state={State.Offline} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default ServiceNode;
