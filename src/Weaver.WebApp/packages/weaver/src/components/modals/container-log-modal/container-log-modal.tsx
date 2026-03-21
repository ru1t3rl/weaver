import { useContainer, useContainerLogs } from "@weaver/docker";
import { ClickAwayListener } from "@weaver/graph";
import { CodeBlock } from "@weaver/shared";
import { Button, Card, Checkbox, CheckboxChangeEvent, Flex, Input, Spin, Tooltip, Typography } from "antd";
import { ChangeEvent, useState } from "react";
import styles from './container-log-modal.module.scss';
import { Backdrop } from "../backdrop/backdrop";
import { LuCross, LuX } from "react-icons/lu";

interface ContainerLogModalProps {
    containerId: string;
    show: boolean;
    hide: () => void;
}

export const ContainerLogModal = (props: ContainerLogModalProps) => {
    const { containerId, show, hide } = props;
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
        show && (
            <Backdrop>
                <ClickAwayListener onClickAway={hide}>
                    <Card className={styles['modal-container']}>
                        <Button icon={<LuX />} onClick={hide} className={styles['close-button']} />
                        <Flex vertical gap={10}>
                            {dataIsLoading && <Spin />}
                            {!dataIsLoading && <CodeBlock
                                title={data?.names[0] ?? 'Log'}
                                content={lines.join('\n')}
                                maxWidth={'1200px'}
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
    )
}