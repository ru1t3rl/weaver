import { useContext } from 'react';
import { useGetCompose } from '../api/endpoints/compose';
import { useGetContainer } from '../api/endpoints/container';
import { ComposeListItemModel, ContainerListItemModel } from '../api/models';
import { DockerContext } from '../contexts';
import { AxiosConfig } from '../utils';

export interface useDocker {
  dockerApiAddress: string;
  Containers: ContainerListItemModel[];
  Stacks: ComposeListItemModel[];
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

export default useDocker;