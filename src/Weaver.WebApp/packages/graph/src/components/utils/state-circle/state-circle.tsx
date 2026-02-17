import { Status } from '@weaver/docker';
import { Flex, theme, Typography } from "antd";
import { useMemo } from "react";
import styles from './state-cricle.module.scss';

interface StateCircleProps {
    state: Status;
    size?: string;
    showLabel?: boolean;
}

export function StateCircle(props: StateCircleProps) {
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
        <Flex vertical={false} align='center'>
            <div
                className={styles['dot']}
                style={{ backgroundColor: color, height: size }}
            ></div>
            {showLabel && <Text>{Status[state]}</Text>}
        </Flex>
    );
}
