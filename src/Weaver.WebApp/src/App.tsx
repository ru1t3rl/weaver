import { MainGraph, ServiceGraphProvider } from '@weaver/graph';
import { ThemeProvider, ThemeToggle } from '@weaver/styling';
import { QueryClient, QueryClientProvider } from 'react-query';
import styles from './App.module.scss';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className={styles['app-container']}>
          <ServiceGraphProvider>
            <MainGraph />
          </ServiceGraphProvider>
        </div>
        <ThemeToggle className={styles['theme-toggle']} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
