import { useDeleteContainerIdentifier, useGetContainerIdentifier, usePutContainerIdentifierStart, usePutContainerIdentifierStop } from '../api/endpoints/container';
import { ContainerDetailModel } from '../api/models';
import { AxiosConfig } from '../utils';
import { useDocker } from './use-docker';

interface useContainer {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  down: () => Promise<void>;
  logs: () => Promise<string>;
  refetch: () => Promise<void>;
  dataIsLoading: boolean;
  data: ContainerDetailModel | null;
}

export const useContainer = (containerid: string): useContainer => {
  const { dockerApiAddress } = useDocker();
  const { data, isLoading, refetch: internalRefetch } = useGetContainerIdentifier(containerid, AxiosConfig(dockerApiAddress, 'get'));
  const { mutateAsync: startContainerAsync } = usePutContainerIdentifierStart(AxiosConfig(dockerApiAddress, 'put'));
  const { mutateAsync: stopContainerAsync } = usePutContainerIdentifierStop(AxiosConfig(dockerApiAddress, 'put'));
  const { mutateAsync: downContainerAsync } = useDeleteContainerIdentifier(AxiosConfig(dockerApiAddress, 'delete'));

  async function start(): Promise<void> {
    await startContainerAsync({ identifier: containerid });
  }

  async function stop(): Promise<void> {
    await stopContainerAsync({ identifier: containerid });
  }

  async function down(): Promise<void> {
    await downContainerAsync({ identifier: containerid });
  }

  async function logs(): Promise<string> {
    while (isLoading) {
      await new Promise(r => { setTimeout(r, 500) });
    }

    return data?.data.log ?? '';
  }

  async function refetch() {
    internalRefetch();
  }

  return {
    start,
    stop,
    down,
    logs,
    refetch,
    dataIsLoading: isLoading,
    data: data?.data ?? null
  };
};
