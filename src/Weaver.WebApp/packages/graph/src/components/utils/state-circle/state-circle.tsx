import styles from './state-cricle.module.scss';
import { Flex, theme, Typography } from "antd";
import { useMemo } from "react";

interface StateCircleProps {
    state: State;
    size?: string;
    showLabel?: boolean;
}

export enum State {
    Offline,
    Loading,
    Unknown,
    Online,
}

export function StateCircle(props: StateCircleProps) {
    const { state, size = '10px', showLabel } = props;

    const { Text } = Typography;
    const { useToken } = theme;
    const { token } = useToken();

    const color = useMemo<string>(() => {
        switch (state) {
            case State.Loading:
                return token.colorWarning;
            case State.Online:
                return token.colorSuccess;
            case State.Offline:
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
            {showLabel && <Text>{State[state]}</Text>}
        </Flex>
    );
}
