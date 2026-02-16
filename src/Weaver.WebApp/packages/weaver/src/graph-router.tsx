import { createBrowserRouter } from 'react-router-dom';
import { ContainerGraph, MainGraph, StackGraph } from './components/graphs';

export const GraphRouter = createBrowserRouter([
    {
        path: '/',
        Component: MainGraph,
        children: [
            { index: true, Component: StackGraph },
            { path: 'stack/:stackId', Component: ContainerGraph }
        ]
    }
]);