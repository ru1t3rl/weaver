import { PropsWithChildren, useMemo } from 'react';
import { DockerContext, IDockerContext } from '../contexts';

import Docker, { DockerOptions } from 'dockerode';

interface DockerProviderProps {}

export const DockerProvider = (options: DockerOptions, props: DockerProviderProps & PropsWithChildren) => {
  const { children } = props;
  const docker = useMemo(() => new Docker(options), [options]);

  const value: IDockerContext = {
    docker: docker,
  };

  return <DockerContext.Provider value={value}>{children}</DockerContext.Provider>;
};
