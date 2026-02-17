import { Button, Card, Divider, Flex, Spin, Typography } from 'antd';
import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import styles from './node-info-panel.module.scss';

export function NodeInfoPanel() {
  const [isLoading] = useState<boolean>(true);

  return (
    <Card className={styles['container']}>
      {isLoading && (
        <Flex className={styles['container-loading']} justify='center' align='center'>
          <Spin />
        </Flex>
      )}
      {!isLoading && (
        <Flex vertical gap={10}>
          <Typography.Title level={2} style={{ margin: 0, marginBottom: 5 }}>
            Inspector
          </Typography.Title>
          <Divider size='small' />
          <Divider />
          <Button icon={<LuPlus />}>Add Extra</Button>
        </Flex>
      )}
    </Card>
  );
}
