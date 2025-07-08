import {
  axiosGetRequestConfig,
  ServiceDetailModel,
  ServiceListItemModel,
  ServiceType,
  useGetServiceUuid,
} from '@weaver/shared';
import { Node } from '@xyflow/react';
import { Card, Divider, Flex, Input, Spin, Tag, Typography } from 'antd';
import { PresetColorType, PresetStatusColorType } from 'antd/es/_util/colors';
import { LiteralUnion } from 'antd/es/_util/type';
import { useRef, useState } from 'react';
import { useNodeEventListener } from '../../events';
import ServiceNode, { nodeName as serviceNodeName } from '../nodes/service-node/service-node';
import { ServiceOption } from '../service-option/service-option';
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

  function getServiceTypeColor(serviceType: ServiceType): LiteralUnion<PresetColorType | PresetStatusColorType> {
    switch (serviceType) {
      case 'Custom':
        return 'lime';
      case 'Reference':
        return 'cyan';
      default:
        return '';
    }
  }

  return (
    nodeListItemModel && (
      <Card className={styles['container']}>
        {isLoading && (
          <Flex className={styles['container-loading']} justify='center' align='center'>
            <Spin />
          </Flex>
        )}
        {!isLoading && nodeDetail && (
          <Flex vertical gap={10}>
            <Typography.Title level={2} style={{ margin: 0, marginBottom: 5 }}>
              Inspector
            </Typography.Title>
            <Flex vertical gap={5}>
              <Input value={nodeDetail.name} readOnly variant={'filled'} />
              <Typography.Text>
                Type: <Tag color={getServiceTypeColor(nodeDetail.type)}>{nodeDetail.type}</Tag>
              </Typography.Text>
            </Flex>
            <Divider size='small' />
            <Flex vertical>
              {nodeDetail.config &&
                nodeDetail.config.map((serviceOption, index) => <ServiceOption key={index} value={serviceOption} />)}
            </Flex>
          </Flex>
        )}
      </Card>
    )
  );
}
