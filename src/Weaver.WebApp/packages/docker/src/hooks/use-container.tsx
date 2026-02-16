import { useDeleteContainerIdentifier, useGetContainerIdentifier, usePutContainerIdentifierStart, usePutContainerIdentifierStop } from '../api/endpoints/container';
import { useDocker } from './use-docker';
import { AxiosConfig } from '../utils';

interface useContainer {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  down: () => Promise<void>;
  logs: () => Promise<string>;
}

export const useContainer = (containerid: string): useContainer => {
  const { dockerApiAddress } = useDocker();
  const { data, isLoading } = useGetContainerIdentifier(containerid, AxiosConfig(dockerApiAddress, 'get'));
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

    return data?.data.logs ?? '';
  }

  return {
    start,
    stop,
    down,
    logs,
  };
};
