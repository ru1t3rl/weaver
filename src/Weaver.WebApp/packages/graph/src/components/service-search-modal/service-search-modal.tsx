import {axiosGetRequestConfig, ServiceListItemModel, useGetService} from '@weaver/shared';
import {useReactFlow, useStoreApi} from '@xyflow/react';
import {Card, Flex, Input, Skeleton} from 'antd';
import React, {ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import {useServiceGraph} from '../../hooks/use-service-graph';
import {useServiceSearchModal} from '../../hooks/use-service-search-modal';
import ClickAwayListener from '../click-away-listener/click-away-listener';
import {ServiceInfoCard} from '../service-info-card/service-info-card';
import styles from './service-search-modal.module.scss';

type position = {
    x: number;
    y: number;
};

export function ServiceSearchModal() {
    const {hide} = useServiceSearchModal();

    const store = useStoreApi();
    const {screenToFlowPosition} = useReactFlow();

    const {tryAddNode} = useServiceGraph();
    const {data: response, isLoading} = useGetService({
        axios: axiosGetRequestConfig,
    });

    const [selectedNode, setSelectedNode] = useState<ServiceListItemModel | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    const [filter, setFilter] = useState<string>('');
    const dataFiltered = useMemo<ServiceListItemModel[]>(() => {
        if (!response || isLoading) {
            return [];
        }

        if (filter.length <= 0) {
            return response.data;
        }

        const filterLowered = filter.toLowerCase();
        return response.data.filter(service => service.name.toLowerCase().includes(filterLowered));
    }, [response, isLoading, filter]);


    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (dataFiltered.length === 0) return;

        switch (e.key) {
            case 'ArrowDown': {
                e.preventDefault();
                const index = focusedIndex < dataFiltered.length - 1 ? focusedIndex + 1 : focusedIndex;
                setFocusedIndex(index);
                setSelectedNode(dataFiltered[index]);
                break;
            }
            case 'ArrowUp': {
                e.preventDefault();
                const index = focusedIndex > 0 ? focusedIndex - 1 : focusedIndex;
                setFocusedIndex(index);
                setSelectedNode(dataFiltered[index]);
                break;
            }
            case 'Enter':
                if (focusedIndex >= 0 && focusedIndex < dataFiltered.length) {
                    handleAddService(dataFiltered[focusedIndex]);
                }
                break;
            case 'Escape':
                hide();
                break;
            default:
                break;
        }
    }, [dataFiltered, selectedNode, focusedIndex]);

    useEffect(() => {
        setFocusedIndex(dataFiltered.length > 0 ? 0 : -1);
    }, [dataFiltered]);

    useEffect(() => {

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [dataFiltered, focusedIndex, hide]);


    function drawSkeletons(amount: number): ReactNode[] {
        const nodes: ReactNode[] = [];
        for (let i = 0; i < amount; i++) {
            nodes.push(<Skeleton key={i}/>);
        }
        return nodes;
    }

    function getViewportCenter(): position {
        const {domNode} = store.getState();
        const boundingRect = domNode?.getBoundingClientRect();

        let position: position = {x: 0, y: 0};

        if (boundingRect) {
            const cneter = screenToFlowPosition({
                x: boundingRect.x + boundingRect.width / 2,
                y: boundingRect.y + boundingRect.height / 2,
            });

            position = {
                x: cneter.x,
                y: cneter.y,
            };
        }

        return position;
    }

    function handleAddService(service: ServiceListItemModel) {
        const {x: viewportX, y: viewportY} = getViewportCenter();

        if (
            tryAddNode({
                deletable: true,
                draggable: true,
                dragging: false,
                selectable: true,
                selected: false,
                zIndex: 0,
                connectable: true,
                type: 'serviceNode',
                id: service.id ?? service.name,
                data: {
                    serviceInfo: {
                        id: service.id,
                        name: service.name,
                        type: service.type,
                    },
                },
                position: {
                    x: viewportX,
                    y: viewportY,
                },
            })
        ) {
            hide();
        }
    }

    return (
        <ClickAwayListener onClickAway={() => hide()}>
            <Card className={styles['modal-container']} >
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
                            dataFiltered?.map((service, index) => (
                                <ServiceInfoCard
                                    key={service.name}
                                    name={service.name}
                                    type={service.type}
                                    selected={selectedNode === service}
                                    onClick={() => handleAddService(service)}
                                    tabIndex={index + 1}
                                />
                            ))}
                    </Flex>
                </Flex>
            </Card>
        </ClickAwayListener>
    );
}
