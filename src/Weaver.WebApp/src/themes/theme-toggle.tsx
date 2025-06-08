import { IconButton, SvgIcon, useColorScheme } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import { HiMoon, HiSun } from 'react-icons/hi2';

interface ThemeToggleProps {
  sx?: SxProps;
  className?: string;
}

export function ThemeToggle(props: ThemeToggleProps) {
  const { mode, setMode } = useColorScheme();

  function handleClick() {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }

  return (
    <IconButton
      onClick={handleClick}
      sx={props.sx}
      className={props.className}
      variant='soft'
    >
      <SvgIcon>
        {mode === 'dark' && <HiSun />}
        {mode === 'light' && <HiMoon />}
      </SvgIcon>
    </IconButton>
  );
}

export default ThemeToggle;
