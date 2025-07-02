import styles from './state-cricle.module.scss';
import {Flex, theme, Typography} from "antd";
import {useMemo} from "react";

interface StateCircleProps {
    state: State;
}

export enum State {
    Offline,
    Loading,
    Unknown,
    Online,
}

export function StateCircle(props: StateCircleProps) {
    const {state} = props;

    const {Text} = Typography;
    const {useToken} = theme;
    const {token} = useToken();

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
        <Flex>
            <div
                className={styles['dot']}
                style={{backgroundColor: color}}
            ></div>
            <Text>{State[state]}</Text>
        </Flex>
    );
}
