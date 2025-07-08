import { axiosGetRequestConfig, ServiceDetailModel, ServiceListItemModel, useGetServiceUuid } from '@weaver/shared';
import { Node } from '@xyflow/react';
import { Card, Flex, Input, Spin } from 'antd';
import { useRef, useState } from 'react';
import { useNodeEventListener } from '../../events';
import ServiceNode, { nodeName as serviceNodeName } from '../nodes/service-node/service-node';
import styles from './node-info-panel.module.scss';

export function NodeInfoPanel() {
  const [nodeListItemModel, _setNodeListItemModel] = useState<ServiceListItemModel | undefined>(undefined);
  const setNodeListItemModel = useRef((node: ServiceListItemModel | undefined) => {
    _setNodeListItemModel(node);
  });

  const { data, isLoading } = useGetServiceUuid(nodeListItemModel?.id ?? '', {
    query: { queryKey: [nodeListItemModel?.name] },
    axios: axiosGetRequestConfig,
  });
  const nodeDetail: ServiceDetailModel | undefined = data?.data;

  useNodeEventListener({
    onSelectionChanged: handleSelectionChanged,
  });

  function handleSelectionChanged(node: Node | undefined) {
    if (!node) {
      setNodeListItemModel.current(undefined);
      return;
    }

    if (!isServiceNode(node)) {
      return;
    }

    setNodeListItemModel.current(node.data.serviceInfo);
  }

  function isServiceNode(node: Node): node is ServiceNode {
    return node.type === serviceNodeName;
  }

  return (
    nodeListItemModel && (
      <Card className={styles['container']}>
        {isLoading && (
          <Flex className={styles['container-loading']} justify='center' align='center'>
            <Spin />
          </Flex>
        )}
        {!isLoading && nodeDetail && <Input value={nodeDetail.name} readOnly />}
      </Card>
    )
  );
}
