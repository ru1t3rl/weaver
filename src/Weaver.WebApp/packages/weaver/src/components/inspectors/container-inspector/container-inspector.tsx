import { useContainer } from '@weaver/docker';
import { StateHeart, useInspector } from '@weaver/graph';
import { Button, Card, Flex, Spin, Tooltip, Typography } from 'antd';
import { ReactNode, useMemo } from 'react';
import { LuFile, LuFolder, LuHardDrive, LuLogs, LuPlay, LuSquare } from 'react-icons/lu';
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
        <Flex vertical gap={16} style={{ paddingBottom: '1.5rem' }}>
            <Flex vertical gap={8}>
                <Typography.Title level={2} className={styles['text-fix']}>{data.names[0]}</Typography.Title>
                <Typography.Paragraph>
                    <StateHeart state={data.status} /> {data.status} | Created: {data.created}
                </Typography.Paragraph>
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
            </Flex>
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
                    <col style={{ width: '50%' }} />
                    <col style={{ width: '50%' }} />
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
            <Flex vertical>
                <Typography.Title level={3}>Mounts</Typography.Title>
                <Flex wrap gap={'small'}>
                    {data.mounts?.map(mount => {
                        const isFile: boolean = (mount.Source?.match(/.*\.(\d|\w){1,4}$/)?.length ?? 0) > 0;
                        const isDirectory: boolean = !isFile && !mount.Name;

                        const iconSize = '3rem';
                        const tooltipText: ReactNode = (
                            <Flex vertical className={styles['mount-tooltip']}>
                                <Typography.Paragraph><strong>Source:</strong> {mount.Source}</Typography.Paragraph>
                                <Typography.Paragraph><strong>Destination:</strong> {mount.Destination}</Typography.Paragraph>
                                <Typography.Paragraph><strong>Permissions:</strong> {mount.Mode}</Typography.Paragraph>
                            </Flex>
                        );

                        return (
                            <Tooltip title={tooltipText}>
                                <Card className={styles['mount-card']}>
                                    <Flex gap='medium'>
                                        <Flex vertical align='center' justify='center'>
                                            {!isFile && !isDirectory && <LuHardDrive size={iconSize} />}
                                            {isFile && <LuFile size={iconSize} />}
                                            {isDirectory && <LuFolder size={iconSize} />}
                                            <Typography.Text>{mount.Name ?? mount.Source}</Typography.Text>
                                        </Flex>
                                    </Flex>
                                </Card>
                            </Tooltip>
                        )
                    })}
                </Flex>
            </Flex>
        </Flex>
    );
}