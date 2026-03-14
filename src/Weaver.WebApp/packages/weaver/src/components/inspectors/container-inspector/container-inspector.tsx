import { useContainer } from '@weaver/docker';
import { useInspector } from '@weaver/graph';
import { Flex, Spin, Typography } from 'antd';
import styles from './container-inspector.module.scss';

export const ContainerInspector = () => {
    const { activeId } = useInspector();
    const { dataIsLoading, data } = useContainer(activeId ?? '');

    if (dataIsLoading) {
        return (
            <Flex align='center' justify='center' className={styles['loading-container']}>
                <Spin />
            </Flex>
        )
    }

    return (
        <Flex>
            <Typography.Title>{data?.names[0]}</Typography.Title>
        </Flex>
    );
}