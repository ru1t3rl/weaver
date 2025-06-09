import { Box, CssBaseline, CssVarsProvider } from '@mui/joy';
import styles from './App.module.scss';
import { theme } from './themes/theme';
import ThemeToggle from './themes/theme-toggle';

function App() {
  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
        <Box className={styles['app-container']}>
        </Box>
      <ThemeToggle className={styles['theme-toggle']} />
    </CssVarsProvider>
  );
}

export default App;
