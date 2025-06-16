import { useContext } from 'react';
import { ServiceNodeProps } from '../components/nodes/service-node/service-node';
import { IServiceGraphContext } from '../contexts';
import { ServiceGraphContext } from '../providers';

export function useServiceGraph() {
  return useContext<IServiceGraphContext<ServiceNodeProps>>(
    ServiceGraphContext,
  );
}
