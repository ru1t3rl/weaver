import { Box, CssBaseline, CssVarsProvider } from '@mui/joy';
import { FunctionCreator, MethodProvider } from '@remote-code/node-editor';
import styles from './App.module.scss';
import { theme } from './themes/theme';
import ThemeToggle from './themes/theme-toggle';

function App() {
  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <MethodProvider>
        <Box className={styles['app-container']}>
          <FunctionCreator />
        </Box>
      </MethodProvider>
      <ThemeToggle className={styles['theme-toggle']} />
    </CssVarsProvider>
  );
}

export default App;
