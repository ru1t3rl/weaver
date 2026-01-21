import Docker from 'dockerode';
import { createContext } from 'react';

export interface IDockerContext {
  docker: Docker | undefined;
}

export const DockerContext = createContext<IDockerContext>({
  docker: undefined,
});

export default DockerContext;
