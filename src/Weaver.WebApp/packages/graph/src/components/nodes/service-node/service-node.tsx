import { Node, NodeProps } from '@xyflow/react';
import { ServiceListItemModel } from 'packages/shared';
import { ServiceInfoCard } from '../../service-info-card/service-info-card';

type ServiceNodeData = {
  serviceInfo: ServiceListItemModel;
  onClick?: () => void;
};

export type ServiceNode = Node<ServiceNodeData, 'serviceNode'>;

export function ServiceNode(props: NodeProps<ServiceNode>) {
  const { data } = props;
  const serviceInfo = data.serviceInfo;

  function handleClick() {
    console.log('Clicked');

    if (data.onClick) {
      data.onClick();
    }
  }

  return (
    <ServiceInfoCard
      name={serviceInfo.name}
      onClick={handleClick}
      type={serviceInfo.type}
    />
  );
}

export default ServiceNode;
