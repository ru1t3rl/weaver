import { Node, NodeProps } from '@xyflow/react';
import { ServiceListItemModel } from 'packages/shared';
import { ServiceInfoCard } from '../../service-info-card/service-info-card';

type ServiceNodeData = {
  serviceInfo: ServiceListItemModel;
  onClick?: () => void;
};

export type ServiceNode = Node<ServiceNodeData, 'service-node'>;

export function ServiceNode(props: NodeProps<ServiceNode>) {
  const { data } = props;
  const serviceInfo = data.serviceInfo;

  function handleClick() {
    if (data.onClick) {
      data.onClick();
    }
  }

  return <ServiceInfoCard name={serviceInfo.name} onClick={handleClick} />;
}

export default ServiceNode;
