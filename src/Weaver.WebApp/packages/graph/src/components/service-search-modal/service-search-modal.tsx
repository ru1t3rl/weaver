import {
    axiosGetRequestConfig,
    ServiceListItemModel,
    useGetService,
} from '@weaver/shared';
import {Card, Flex, Input, Skeleton} from 'antd';
import {ReactNode, useMemo, useState} from 'react';
import {useServiceGraph} from '../../hooks/use-service-graph';
import {useServiceSearchModal} from '../../hooks/use-service-search-modal';
import ClickAwayListener from '../click-away-listener/click-away-listener';
import {ServiceInfoCard} from '../service-info-card/service-info-card';
import styles from './service-search-modal.module.scss';

export function ServiceSearchModal() {
    const {hide} = useServiceSearchModal();

    const {tryAddNode} = useServiceGraph();
    const {data: response, isLoading} = useGetService({
        axios: axiosGetRequestConfig,
    });

    const [filter, setFilter] = useState<string>('');
    const dataFiltered = useMemo<ServiceListItemModel[]>(() => {
        if (!response || isLoading) {
            return [];
        }

        if (filter.length <= 0) {
            return response.data;
        }

        return response.data.filter(service => service.name.includes(filter));
    }, [response, filter]);

    function drawSkeletons(amount: number): ReactNode[] {
        const nodes: ReactNode[] = [];
        for (let i = 0; i < amount; i++) {
            nodes.push(<Skeleton key={i}/>);
        }
        return nodes;
    }

    function handleAddService(service: ServiceListItemModel) {
        if (
            tryAddNode({
                deletable: true,
                draggable: true,
                dragging: false,
                selectable: true,
                selected: false,
                zIndex: 0,
                connectable: true,
                type: 'service-node',
                id: service.id ?? service.name,
                data: {
                    serviceInfo: {
                        id: service.id,
                        name: service.name,
                        type: service.type,
                    },
                },
                position: {
                    x: 0,
                    y: 0,
                },
            })
        ) {
            hide();
        }
    }

    return (
        <ClickAwayListener onClickAway={() => hide()}>
            <Card className={styles['modal-container']}>
                <Flex vertical gap={10}>
                    <Input
                        placeholder='Service Name...'
                        onChange={e => {
                            setFilter(e.currentTarget.value);
                        }}
                    />
                    <Flex className={styles['services-container']} vertical gap={5}>
                        {isLoading && drawSkeletons(5)}
                        {!isLoading &&
                            response &&
                            dataFiltered?.map(service => (
                                <ServiceInfoCard
                                    key={service.name}
                                    name={service.name}
                                    type={service.type}
                                    onClick={() => handleAddService(service)}
                                />
                            ))}
                    </Flex>
                </Flex>
            </Card>
        </ClickAwayListener>
    );
}
