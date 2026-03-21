import { ClickAwayListener } from "@weaver/graph";
import { Card, Flex, Spin } from "antd";
import styles from './container-log-modal.module.scss'
import { CodeBlock } from "@weaver/shared";
import { useContainer } from "@weaver/docker";
import { useContainerLogs } from "@weaver/docker";

export const ContainerLogModal = () => {
    const containerId = '8803a75db1a5936f06efbc152d1b8e0b55d26e4c0cac2cef4510815b5121f75f';
    const { dataIsLoading, data } = useContainer(containerId);
    const { lines } = useContainerLogs(containerId);

    return (
        <ClickAwayListener onClickAway={() => { }}>
            <Card className={styles['modal-container']}>
                <Flex vertical gap={10}>
                    {dataIsLoading && <Spin />}
                    {!dataIsLoading && <CodeBlock title={data?.names[0] ?? 'Log'} content={lines.join('\n')} />}
                </Flex>
            </Card>
        </ClickAwayListener>
    )
}