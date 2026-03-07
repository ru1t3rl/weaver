import { Status } from '@weaver/docker';
import { Flex, theme, Typography } from "antd";
import { useMemo } from "react";
import styles from './state-heart.module.scss';
import { LuHeart } from 'react-icons/lu';

interface StateHeartProps {
    state: Status;
    size?: string;
    showLabel?: boolean;
}

export function StateHeart(props: StateHeartProps) {
    const { state, size = '10px', showLabel } = props;

    const { Text } = Typography;
    const { useToken } = theme;
    const { token } = useToken();

    const color = useMemo<string>(() => {
        switch (state) {
            case Status.Exited:
                return token.colorError;
            case Status.Paused:
            case Status.Removing:
            case Status.Restarting:
                return token.colorWarning;
            case Status.Running:
                return token.colorSuccess;
            case Status.Dead:
            case Status.Created:
            default:
                return token.colorBgContainerDisabled;
        }
    }, [state])

    return (
        <Flex vertical={false} align='center' gap={'small'}>
            <LuHeart
                className={styles['dot']}
                style={{ color: color, height: size }}
            />            

            {showLabel && <Text>{Status[state]}</Text>}
        </Flex>
    );
}
