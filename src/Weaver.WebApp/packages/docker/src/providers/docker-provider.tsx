import { PropsWithChildren } from 'react';
import { DockerContext, IDockerContext } from '../contexts';

interface DockerProviderProps {
  dockerApiAddress: string
}

export const DockerProvider = (props: DockerProviderProps & PropsWithChildren) => {
  const { dockerApiAddress, children } = props;

  const value: IDockerContext = {
    dockerApiAddress
  };

  return <DockerContext.Provider value={value}>{children}</DockerContext.Provider>;
};
