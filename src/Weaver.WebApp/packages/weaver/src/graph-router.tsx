import { createBrowserRouter } from 'react-router-dom';
import { ContainerGraph, MainGraph, StackGraph } from './components/graphs';
import { routes } from '@weaver/shared';

export const GraphRouter = createBrowserRouter([
    {
        path: routes.home,
        Component: MainGraph,
        children: [
            { index: true, Component: StackGraph },
            { path: routes.stack(':stackId'), Component: ContainerGraph }
        ]
    }
]);