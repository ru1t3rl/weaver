import { useGetComposeIdentifier } from '../api/endpoints/compose';
import { ComposeDetailModel } from '../api/models';
import { ContainerListItemModel } from '../api/models/container-list-item-model';
import { AxiosConfig } from '../utils';
import useDocker from './use-docker';

interface useStack {
    name: string;
    containers: ContainerListItemModel[];
    isLoading: boolean;
}

export const useStack = (stackId: string): useStack => {
    const { dockerApiAddress } = useDocker();
    const { data: containersResponse, isLoading } = useGetComposeIdentifier(stackId, AxiosConfig(dockerApiAddress, 'get'));

    const response: ComposeDetailModel | undefined = containersResponse?.data;

    return {
        name: response?.name ?? '',
        containers: response?.containers ?? [],
        isLoading
    }
}