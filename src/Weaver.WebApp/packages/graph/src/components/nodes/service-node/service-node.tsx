import { ServiceListItemModel } from '@weaver/shared';
import { Node, NodeChange, NodeProps } from '@xyflow/react';
import { useServiceGraph } from '../../../hooks/use-service-graph';
import { ServiceInfoCard } from '../../service-info-card/service-info-card';

type ServiceNodeData = {
  serviceInfo: ServiceListItemModel;
  onClick?: () => void;
};

export type ServiceNode = Node<ServiceNodeData, 'serviceNode'>;

export function ServiceNode(props: NodeProps<ServiceNode>) {
  const { id, data, selected } = props;
  const serviceInfo = data.serviceInfo;
  const { tryUpdateNodes } = useServiceGraph();

  function handleClick() {
    updateSelection(!selected);

    if (data.onClick) {
      data.onClick();
    }
  }

  function updateSelection(selected: boolean) {
    const change: NodeChange<ServiceNode> = {
      id: id,
      type: 'select',
      selected: selected,
    };

    tryUpdateNodes([change]);
  }

  console.log(`In node selected (${id}): ${selected}`);
  return (
    <div>
      <ServiceInfoCard name={serviceInfo.name} onClick={handleClick} type={serviceInfo.type} selected={selected} />;
    </div>
  );
}

export default ServiceNode;
