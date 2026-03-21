import { useContainer, useContainerLogs } from "@weaver/docker";
import { ClickAwayListener } from "@weaver/graph";
import { CodeBlock } from "@weaver/shared";
import { Card, Checkbox, CheckboxChangeEvent, Flex, Input, Spin, Tooltip, Typography } from "antd";
import { ChangeEvent, useState } from "react";
import styles from './container-log-modal.module.scss';
import { Backdrop } from "../backdrop/backdrop";

export const ContainerLogModal = () => {
    const containerId = '8803a75db1a5936f06efbc152d1b8e0b55d26e4c0cac2cef4510815b5121f75f';
    const { dataIsLoading, data } = useContainer(containerId);

    const [linesToShow, setLinesToShow] = useState<string>('100');
    const [linesToShowActive, setLinesToShowActive] = useState<string>(linesToShow);
    const [linesError, setLinesError] = useState<boolean>(false);

    const [live, setLive] = useState<boolean>(true);

    const { lines } = useContainerLogs(containerId, { follow: live, tail: linesToShowActive });

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

    function handleLiveToggle(e: CheckboxChangeEvent) {
        setLive(e.target.checked);
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
                                <Flex align={'center'} gap={4} key={'live-toggle'}>
                                    <Typography.Paragraph className={styles['text']}>
                                        Live:
                                    </Typography.Paragraph>
                                    <Checkbox onChange={handleLiveToggle} checked={live} />
                                </Flex>,
                                <Flex align={'center'} gap={5} key={'tail-amount'}>
                                    <Typography.Paragraph className={styles['text']}>
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