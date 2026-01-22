import { useContext } from 'react';
import { DockerContext } from '../contexts';
import { ContainerListItemModel } from '../api/models';
import { useGetContainer } from '../api/endpoints/container';
import { AxiosConfig } from '../utils';

export interface useDocker {
  dockerApiAddress: string;
  Containers: ContainerListItemModel[];
}

export const useDocker = (): useDocker => {
  const { dockerApiAddress } = useContext(DockerContext);
  const {data: containers} = useGetContainer(AxiosConfig(dockerApiAddress, 'get'))

  return {
    dockerApiAddress,    
    Containers: containers?.data ?? []
  }
};
