import { Container } from 'dockerode';
import { useContext, useState } from 'react';
import { DockerContext } from '../contexts';

interface useContainer {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  logs: () => Promise<string>;
}

export const useContainer = (containerid: string): useContainer => {
  const { docker } = useContext(DockerContext);
  const [container] = useState<Container | undefined>(docker?.getContainer(containerid));

  async function start(): Promise<void> {
    await container?.start();
  }

  async function stop(): Promise<void> {
    await container?.stop();
  }

  async function logs(): Promise<string> {
    if (!container) return '';

    const inspectData = await container.inspect();
    const startTime = new Date(inspectData?.State.StartedAt || '').getTime() / 1000;

    const log: Buffer = await container.logs({
      since: startTime,
      stdout: true,
      stderr: true,
      timestamps: true,
      follow: false,
    });

    return log.toString('utf-8');
  }

  return {
    start,
    stop,
    logs,
  };
};
