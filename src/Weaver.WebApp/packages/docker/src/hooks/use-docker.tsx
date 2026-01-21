import {
  Container,
  ContainerCreateOptions,
  ContainerInfo,
  DockerVersion,
  ImageInfo,
  NetworkInspectInfo,
} from 'dockerode';
import { useContext } from 'react';
import { DockerContext } from '../contexts';

export interface useDocker {
  getContainers: () => Promise<ContainerInfo[]>;
  getNetworks: () => Promise<NetworkInspectInfo[]>;
  getImages: () => Promise<ImageInfo[]>;
  startContainer: (options: ContainerCreateOptions) => Promise<void>;
  stopContainer: (containerId: string) => Promise<void>;
  version: () => Promise<DockerVersion | undefined>;
}

export const useDocker = (): useDocker => {
  const { docker } = useContext(DockerContext);

  async function getContainers(): Promise<ContainerInfo[]> {
    return (await docker?.listContainers()) ?? [];
  }

  async function getNetworks(): Promise<NetworkInspectInfo[]> {
    return (await docker?.listNetworks()) ?? [];
  }

  async function getImages(): Promise<ImageInfo[]> {
    return (await docker?.listImages()) ?? [];
  }

  async function startContainer(options: ContainerCreateOptions): Promise<void> {
    let container: Container | undefined = undefined;
    await docker?.createContainer(options, (c: Container) => (container = c));

    if (!container) return;

    (container as Container).start();
  }

  async function stopContainer(containerId: string): Promise<void> {
    const container = docker?.getContainer(containerId);
    await container?.stop();
  }

  // async function getDockerInfo() {
  //   await docker?.info();
  // }

  async function getDockerVersion() {
    return await docker?.version();
  }

  return {
    getContainers,
    getNetworks,
    getImages,
    startContainer,
    stopContainer,
    version: getDockerVersion,
  };
};
