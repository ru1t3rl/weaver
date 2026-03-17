import { useContainer } from '@weaver/docker';
import { StateCircle, useInspector } from '@weaver/graph';
import { Button, Flex, Space, Spin, Typography } from 'antd';
import { useMemo } from 'react';
import { LuLogs, LuPlay, LuSquare } from 'react-icons/lu';
import styles from './container-inspector.module.scss';

export const ContainerInspector = () => {
    const { activeId } = useInspector();
    const { dataIsLoading, data } = useContainer(activeId ?? '');
    const networks = useMemo(() => data?.networkSettingsSummary.Networks, [data])

    if (dataIsLoading || !data) {
        return (
            <Flex align='center' justify='center' className={styles['loading-container']}>
                {dataIsLoading && <Spin />}
                {!data && <Typography>No Data Available...</Typography>}
            </Flex>
        )
    }

    function prefixLenToSubnetMask(prefixLen: number): string {
        const mask = prefixLen === 0 ? 0 : (~0 << (32 - prefixLen)) >>> 0;
        return [
            (mask >>> 24) & 0xff,
            (mask >>> 16) & 0xff,
            (mask >>> 8) & 0xff,
            mask & 0xff,
        ].join(".");
    }

    return (
        <Flex vertical gap={16}>
            <Flex gap={32} align='center'>
                <StateCircle state={data.status ?? 'Dead'} />
                <Typography.Title className={styles['text-fix']}>{data.names[0]}</Typography.Title>
            </Flex>
            <Typography.Paragraph>
                {data.created}
            </Typography.Paragraph>
            <Space />
            <div className={styles['container-actions']}>
                <Button
                    icon={<LuPlay />}
                    disabled={data.status === 'Running' || data.status == 'Restarting' || data.status === 'Removing'}>
                    Start
                </Button>
                <Button
                    icon={<LuSquare />}
                    disabled={data.status !== 'Running' && data.status !== 'Restarting' && data.status !== 'Removing'}>
                    Stop
                </Button>
                <Button icon={<LuLogs />}>Logs</Button>
            </div>
            <Flex vertical>
                <Typography.Title level={3}>Networks</Typography.Title>
                <table className={styles['table']}>
                    <tr>
                        <th><Typography.Text>IPv4</Typography.Text></th>
                        <th><Typography.Text>Gateway</Typography.Text></th>
                        <th><Typography.Text>Subnet</Typography.Text></th>
                    </tr>
                    {networks && Object.keys(networks).map(network => (
                        <tr>
                            <td><Typography.Text>{networks[network].IPAddress}</Typography.Text></td>
                            <td><Typography.Text>{networks[network].Gateway}</Typography.Text></td>
                            <td><Typography.Text>{prefixLenToSubnetMask(Number(networks[network].IPPrefixLen))}</Typography.Text></td>
                        </tr>
                    ))}
                </table>
            </Flex>
            <Flex vertical>
                <Typography.Title level={3}>Environment Variables</Typography.Title>
                <table className={[styles['table'], styles['table-environment']].join(' ')}>
                    <tr>
                        <th><Typography.Text>Variable</Typography.Text></th>
                        <th><Typography.Text>Value</Typography.Text></th>
                    </tr>
                    {data.environmentVariables && data.environmentVariables.map(variable => (
                        <tr>
                            <td><Typography.Text>{variable.name}</Typography.Text></td>
                            <td><Typography.Text>{variable.value}</Typography.Text></td>
                        </tr>
                    ))}
                </table>
            </Flex>
        </Flex>
    );
}