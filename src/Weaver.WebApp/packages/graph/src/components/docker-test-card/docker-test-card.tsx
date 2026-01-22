import { useDocker } from '@weaver/docker';
import { Button, Card, Divider, Flex, Spin, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import styles from './docker-test-card.module.scss';

export function DockerTestCard() {
  const [isLoading, setIsLoading] = useState(true);
  const { Containers: containers } = useDocker();

  useEffect(() => {
    setIsLoading(containers.length <= 0);
  }, [containers]);

  return (
    <Card className={styles['container']}>
      {isLoading && (
        <Flex className={styles['container-loading']} justify='center' align='center'>
          <Spin />
        </Flex>
      )}
      {!isLoading && (
        <Flex vertical gap={10}>
          {containers.map(c =>
          (<><Typography.Title level={2} style={{ margin: 0, marginBottom: 5 }}>
            {c.name}
          </Typography.Title>
            <Flex vertical gap={5}>
              <Typography.Text>
                Type: <Tag color={'cyan'}>Docker</Tag>
              </Typography.Text>
            </Flex></>)
          )}
          <Divider size='small' />
          <Flex vertical></Flex>
          <Divider />
          <Button icon={<LuPlus />}>Add Extra</Button>
        </Flex>
      )}
    </Card>
  );
}
