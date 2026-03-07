import { createContext } from 'react';

export interface IDockerContext {
  dockerApiAddress: string;
}

export const DockerContext = createContext<IDockerContext>({
  dockerApiAddress: 'N/A',
});

export default DockerContext;
