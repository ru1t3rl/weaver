import { Box, Card, CardContent, SvgIcon, Typography } from '@mui/joy';
import { ServiceType } from '@weaver/shared';
import { ReactNode } from 'react';
import { LuBoxes, LuGlobe } from 'react-icons/lu';
import { State, StateCircle } from '../state-circle/state-circle';
import styles from './service-info-card.module.scss';

interface ServiceInfoCardProps {
  name: string;
  type: ServiceType;
  state?: State;
  icon?: ReactNode;
  onClick?: () => void;
}

export function ServiceInfoCard(props: ServiceInfoCardProps) {
  const { name, type, state, icon, onClick } = props;

  function handleClick() {
    if (onClick) {
      onClick();
    }
  }

  function renderIcon(): ReactNode {
    if (icon) {
      return icon;
    }

    let node: ReactNode;
    switch (type) {
      case ServiceType.Reference:
        node = <LuGlobe />;
        break;
      case ServiceType.Custom:
      default:
        node = <LuBoxes />;
    }

    return node;
  }

  return (
    <Card variant='soft' onClick={handleClick}>
      <CardContent orientation='horizontal' className={styles['card-content']}>
        <SvgIcon>{renderIcon()}</SvgIcon>
        <Box>
          <Typography>{name}</Typography>
          {state && <StateCircle state={state} />}
        </Box>
      </CardContent>
    </Card>
  );
}
