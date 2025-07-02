import {ServiceType} from '@weaver/shared';
import {ReactNode} from 'react';
import {LuBlocks, LuGlobe} from 'react-icons/lu';
import {State, StateCircle} from '../state-circle/state-circle';
import {Card, Flex, theme, Typography} from "antd";
import styles from './service-info-card.module.scss';

interface ServiceInfoCardProps {
    name: string;
    type: ServiceType;
    state?: State;
    icon?: ReactNode;
    onClick?: () => void;
}

export function ServiceInfoCard(props: ServiceInfoCardProps) {
    const {name, type, state, icon, onClick} = props;
    const {Text} = Typography;
    
    const {useToken} = theme;
    const {token} = useToken();

    function handleClick() {
        if (onClick) {
            onClick();
        }
    }

    function renderIcon(): ReactNode {
        if (icon) {
            return icon;
        }

        let node: ReactNode;
        switch (type) {
            case ServiceType.Reference:
                node = <LuGlobe/>;
                break;
            case ServiceType.Custom:
            default:
                node = <LuBlocks/>;
        }

        return node;
    }

    return (
        <Card onClick={handleClick} className={styles['container']} >
            <Flex align={'center'} gap={10} style={{padding: 0}}>
                <Text>{renderIcon()}</Text>
                <Flex justify={'center'} gap={5}>
                    <Text>{name}</Text>
                    {state && <StateCircle state={state}/>}
                </Flex>
            </Flex>
        </Card>
    );
}
