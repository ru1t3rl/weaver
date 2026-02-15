import { useContext } from 'react';
import { DockerContext } from '../contexts';
import { ComposeModel, ContainerListItemModel } from '../api/models';
import { useGetContainer } from '../api/endpoints/container';
import { AxiosConfig } from '../utils';
import { useGetCompose } from '../api/endpoints/compose';

export interface useDocker {
  dockerApiAddress: string;
  Containers: ContainerListItemModel[];
  Stacks: ComposeModel[];
}

export const useDocker = (): useDocker => {
  const { dockerApiAddress } = useContext(DockerContext);
  const { data: containers } = useGetContainer(AxiosConfig(dockerApiAddress, 'get'));
  const { data: stacks } = useGetCompose(AxiosConfig(dockerApiAddress, 'get'));

  return {
    dockerApiAddress,
    Containers: containers?.data ?? [],
    Stacks: stacks?.data ?? []
  }
};
