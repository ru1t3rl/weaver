import { createBrowserRouter } from 'react-router-dom';
import { ContainerGraph, MainGraph, StackGraph } from './components/graphs';
import { Layout, routes } from '@weaver/shared';
import { ErrorPage } from './components/pages/error-page/error-page';

export const AppRouter = createBrowserRouter([
  {
    path: routes.home,
    errorElement: <ErrorPage />,
    Component: Layout,
    children: [
      {
        Component: MainGraph,
        children: [
          { index: true, Component: StackGraph },
          { path: routes.stack(':stackId'), Component: ContainerGraph },
        ],
      },
    ],
  },
]);
