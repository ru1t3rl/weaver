import { useContainer, useContainerLogs } from "@weaver/docker";
import { ClickAwayListener } from "@weaver/graph";
import { CodeBlock } from "@weaver/shared";
import { Card, Flex, Input, Spin, Tooltip, Typography } from "antd";
import { ChangeEvent, useState } from "react";
import styles from './container-log-modal.module.scss';
import { Backdrop } from "../backdrop/backdrop";

export const ContainerLogModal = () => {
    const containerId = '8803a75db1a5936f06efbc152d1b8e0b55d26e4c0cac2cef4510815b5121f75f';
    const { dataIsLoading, data } = useContainer(containerId);

    const [linesToShow, setLinesToShow] = useState<string>('100');
    const [linesToShowActive, setLinesToShowActive] = useState<string>(linesToShow);

    const [linesError, setLinesError] = useState<boolean>(false);

    const { lines } = useContainerLogs(containerId, { tail: linesToShowActive });

    function handleTailChanged(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        const input = e.target.value;
        setLinesToShow(input);

        if (!input.match(/(^\d+$)|(^all$)/)) {
            setLinesError(true);
            return;
        }

        setLinesError(false);
        setLinesToShowActive(input);
    }

    return (
        <Backdrop>
            <ClickAwayListener onClickAway={() => { }}>
                <Card className={styles['modal-container']}>
                    <Flex vertical gap={10}>
                        {dataIsLoading && <Spin />}
                        {!dataIsLoading && <CodeBlock
                            title={data?.names[0] ?? 'Log'}
                            content={lines.join('\n')}
                            tools={[
                                <Flex align={'center'} gap={5}>
                                    <Typography.Paragraph style={{ marginBottom: 0 }}>
                                        Tail:
                                    </Typography.Paragraph>
                                    <Tooltip title={'Options: all, 100, 500, 1000, etc. '}>
                                        <Input
                                            title={'tail'}
                                            size={'small'}
                                            onChange={handleTailChanged}
                                            value={linesToShow}
                                            status={linesError ? 'error' : 'success'}
                                            style={{ width: '100px', height: '25px' }} />
                                    </Tooltip>
                                </Flex>
                            ]}
                        />}
                    </Flex>
                </Card>
            </ClickAwayListener>
        </Backdrop>
    )
}