import { MainGraph, ServiceGraphProvider } from '@weaver/graph';
import { ThemeProvider, ThemeToggle } from '@weaver/styling';
import { QueryClient, QueryClientProvider } from 'react-query';
import styles from './App.module.scss';
import { DockerProvider } from '@weaver/docker';
import { environment } from '@weaver/shared';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DockerProvider dockerApiAddress={environment.dockerApiAddress}>
          <div className={styles['app-container']}>
            <ServiceGraphProvider>
              <MainGraph />
            </ServiceGraphProvider>
          </div>
        </DockerProvider>
        <ThemeToggle className={styles['theme-toggle']} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
