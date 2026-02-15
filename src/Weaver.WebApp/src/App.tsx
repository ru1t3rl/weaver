import { MainGraph } from '@weaver/app';
import { ThemeProvider, ThemeToggle } from '@weaver/styling';
import { QueryClient, QueryClientProvider } from 'react-query';
import styles from './App.module.scss';
import { DockerProvider } from '@weaver/docker';
import { environment, Layout } from '@weaver/shared';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DockerProvider dockerApiAddress={environment.dockerApiAddress}>
          {/* <div className={styles['app-container']}> */}
          <Layout iconPath={'/weaver_logo.svg'}>
            <MainGraph />
          </Layout>
          {/* </div> */}
        </DockerProvider>        
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
