import {ServiceType} from '@weaver/shared';
import {ReactNode} from 'react';
import {LuBlocks, LuGlobe} from 'react-icons/lu';
import {State, StateCircle} from '../state-circle/state-circle';
import {Card, Flex, Typography} from "antd";

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
        <Card onClick={handleClick}>
            <Flex>
                {renderIcon()}
                <Flex>
                    <Text>{name}</Text>
                    {state && <StateCircle state={state}/>}
                </Flex>
            </Flex>
        </Card>
    );
}
