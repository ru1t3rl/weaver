import { useContainer } from "@weaver/docker";
import { Flex, Spin, Typography } from "antd";
import { StateHeart } from "../../utils";
import styles from './container-detail.module.scss';

interface ContainerDetailsProps {
    containerId: string;
}

export const ContainerDetails = (props: ContainerDetailsProps) => {
    const { containerId } = props;
    const { dataIsLoading, data } = useContainer(containerId);

    return (
        <Flex vertical={true} className={styles['container-detail-list']}>
            {dataIsLoading && <Spin />}
            {!dataIsLoading && !data && (
                <Flex align="center" style={{ width: '100%' }}>
                    <Typography.Text>No Data</Typography.Text>
                </Flex>
            )}
            {!dataIsLoading && data && (
                <>
                    <Flex vertical={true}>
                        <Typography.Text strong>State:</Typography.Text>
                        <StateHeart state={data.status} size={'20px'} showLabel />
                    </Flex>
                    <Flex vertical={true}>
                        <Typography.Text strong>Ports:</Typography.Text>
                        {
                            data.ports.filter(p => p.PublicPort).map((mapping, index) => (
                                <Typography.Text key={`${mapping.PublicPort}${index}`}>{mapping.PublicPort} : {mapping.PrivatePort}</Typography.Text>
                            ))
                        }
                        {
                            data.ports.filter(p => !p.PublicPort).map((mapping, index) => (
                                <Typography.Text key={index}>{mapping.PublicPort} : {mapping.PrivatePort}</Typography.Text>
                            ))
                        }
                    </Flex>
                </>
            )}
        </Flex>
    )

}