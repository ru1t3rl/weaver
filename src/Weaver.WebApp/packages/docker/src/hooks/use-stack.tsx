import {
    ComposeDetailModel,
    useGetComposeIdentifier,
    usePutComposeIdentifierStart,
    usePutComposeIdentifierStop
} from '../api';
import {AxiosConfig} from '../utils';
import useDocker from './use-docker';

interface useStack {
    isLoading: boolean;
    data: ComposeDetailModel | null;
    start: () => Promise<void>;
    stop: () => Promise<void>;
}

export const useStack = (stackId: string): useStack => {
    const { dockerApiAddress } = useDocker();
    const { data: containersResponse, isLoading } = useGetComposeIdentifier(stackId, AxiosConfig(dockerApiAddress, 'get'));
    const { mutateAsync: startStackAsync } = usePutComposeIdentifierStart(AxiosConfig(dockerApiAddress, 'put'));
    const { mutateAsync: stopStackAsync } = usePutComposeIdentifierStop(AxiosConfig(dockerApiAddress, 'put'));

    const response: ComposeDetailModel | undefined = containersResponse?.data;

    async function start(): Promise<void> {
        await startStackAsync({ identifier: stackId });
    }

    async function stop(): Promise<void> {
        await stopStackAsync({ identifier: stackId });
    }

    return {
        data: response ?? null,
        isLoading,
        start,
        stop
    }
}