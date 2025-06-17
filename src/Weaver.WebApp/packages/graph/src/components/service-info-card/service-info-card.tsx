import {
  Box,
  Card,
  CardContent,
  SvgIcon,
  Typography,
  VariantProp,
} from '@mui/joy';
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
  variant?: VariantProp;
}

export function ServiceInfoCard(props: ServiceInfoCardProps) {
  const { name, type, state, icon, onClick, variant } = props;

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
    <Card
      variant={variant ?? 'soft'}
      onClick={handleClick}
      sx={{
        padding: '.5rem',
        '&:hover': {
          boxShadow: 'sm',
          borderColor: 'neutral.outlinedHoverBorder',
        },
      }}
    >
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
