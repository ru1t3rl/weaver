import { AppRouter } from '@weaver/app';
import { DockerProvider } from '@weaver/docker';
import { environment, Layout } from '@weaver/shared';
import { ThemeProvider } from '@weaver/styling';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RouterProvider } from 'react-router-dom';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DockerProvider dockerApiAddress={environment.dockerApiAddress}>          
            <RouterProvider router={AppRouter} />
        </DockerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
