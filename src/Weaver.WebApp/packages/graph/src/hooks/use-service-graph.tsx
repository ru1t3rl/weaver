import { useContext } from 'react';
import { GroupNode } from '../components/nodes/group-node/group-node';
import { ServiceNode } from '../components/nodes/service-node/service-node';
import { IServiceGraphContext } from '../contexts';
import { ServiceGraphContext } from '../providers';

export function useServiceGraph() {
  return useContext<IServiceGraphContext<ServiceNode | GroupNode>>(ServiceGraphContext);
}
