import { extendTheme } from '@mui/joy';
import darkThemeColors from './dark-theme';
import lightThemeColors from './light-theme';

export const theme = extendTheme({
  colorSchemes: {
    light: lightThemeColors,
    dark: darkThemeColors,
  },
});
