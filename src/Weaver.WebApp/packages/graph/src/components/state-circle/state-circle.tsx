import { Box, Typography, useTheme } from '@mui/joy';
import styles from './state-cricle.module.scss';

interface StateCircleProps {
  state: State;
}

export enum State {
  Offline,
  Loading,
  Unknown,
  Online,
}

export function StateCircle(props: StateCircleProps) {
  const { state } = props;
  const theme = useTheme();

  const color = theme.palette.primary.softDisabledColor;

  return (
    <Box>
      <Box
        className={styles['dot']}
        sx={{ backgroundColor: color, height: theme.typography['body-xs'] }}
      ></Box>
      <Typography level='body-xs'>{State[state]}</Typography>
    </Box>
  );
}
