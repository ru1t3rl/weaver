import { ClickAwayListener } from '@weaver/graph';
import { axiosGetRequestConfig, ServiceTemplateListItemModel, useGetServiceTemplate } from '@weaver/shared';
import { Card, Flex, Input, Skeleton } from 'antd';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useServiceTemplateSearchModal } from '../../../hooks';
import styles from './service-search-modal.module.scss';


// type position = {
//   x: number;
//   y: number;
// };

export function ServiceSearchModal() {
  const { hide } = useServiceTemplateSearchModal();

  // const store = useStoreApi();
  // const { screenToFlowPosition } = useReactFlow();

  const { data: response, isLoading } = useGetServiceTemplate({
    axios: axiosGetRequestConfig,
  });

  const [selectedNode, setSelectedNode] = useState<ServiceTemplateListItemModel | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const [filter, setFilter] = useState<string>('');
  const dataFiltered = useMemo<ServiceTemplateListItemModel[]>(() => {
    if (!response || isLoading) {
      return [];
    }

    if (filter.length <= 0) {
      return response.data;
    }

    const filterLowered = filter.toLowerCase();
    return response.data.filter(service => service.name.toLowerCase().includes(filterLowered));
  }, [response, isLoading, filter]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
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
            // handleAddService(dataFiltered[focusedIndex]);
          }
          break;
        case 'Escape':
          hide();
          break;
        default:
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataFiltered, selectedNode, focusedIndex],
  );

  useEffect(() => {
    setFocusedIndex(dataFiltered.length > 0 ? 0 : -1);
  }, [dataFiltered]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dataFiltered, focusedIndex, handleKeyDown, hide]);

  function drawSkeletons(amount: number): ReactNode[] {
    const nodes: ReactNode[] = [];
    for (let i = 0; i < amount; i++) {
      nodes.push(<Skeleton.Input key={i} />);
    }
    return nodes;
  }

  // function getViewportCenter(): position {
  //   const { domNode } = store.getState();
  //   const boundingRect = domNode?.getBoundingClientRect();

  //   let position: position = { x: 0, y: 0 };

  //   if (boundingRect) {
  //     const cneter = screenToFlowPosition({
  //       x: boundingRect.x + boundingRect.width / 2,
  //       y: boundingRect.y + boundingRect.height / 2,
  //     });

  //     position = {
  //       x: cneter.x,
  //       y: cneter.y,
  //     };
  //   }

  //   return position;
  // }

  // function handleAddService(service: ServiceTemplateListItemModel) {
  //   const { x: viewportX, y: viewportY } = getViewportCenter();

  //   if (
  //     // TODO: Replace with add now from react flow
  //     // tryAddServiceNode({
  //     //   type: 'serviceNode',
  //     //   data: {
  //     //     serviceInfo: {
  //     //       id: service.id,
  //     //       name: service.name,
  //     //       type: service.type,
  //     //     },
  //     //   },
  //     //   position: {
  //     //     x: viewportX,
  //     //     y: viewportY,
  //     //   },
  //     // })
  //     true
  //   ) {
  //     hide();
  //   }
  // }

  return (
    <ClickAwayListener onClickAway={() => hide()}>
      <Card className={styles['modal-container']}>
        <Flex vertical gap={10}>
          <Input
            autoFocus
            placeholder='Service Name...'
            onChange={e => {
              setFilter(e.currentTarget.value);
            }}
          />
          <Flex className={styles['services-container']} vertical gap={5}>
            {isLoading && drawSkeletons(2)}
            {/* {!isLoading &&
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
              ))} */}
          </Flex>
        </Flex>
      </Card>
    </ClickAwayListener>
  );
}
