import { Box, Card, Input, Skeleton } from '@mui/joy';
import { ServiceListItemModel, useGetService } from 'packages/shared';
import { ReactNode, useMemo, useState } from 'react';
import { useServiceGraph } from '../../hooks/use-service-graph';
import { ServiceInfoCard } from '../service-info-card/service-info-card';
import styles from './service-search-modal.module.scss';

export function ServiceModal() {
  const { tryAddNode } = useServiceGraph();
  const { data: response, isLoading } = useGetService();

  const [filter, setFilter] = useState<string>('');
  const dataFiltered = useMemo<ServiceListItemModel[]>(() => {
    if (!response) {
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
      nodes.push(<Skeleton />);
    }
    return nodes;
  }

  return (
    <Box className={styles['modal-contaienr']}>
      <Card variant='soft'>
        <Input
          variant='soft'
          placeholder='Service Name...'
          onChange={e => {
            setFilter(e.currentTarget.value);
          }}
        />
        <Box className={styles['services-container']}>
          {isLoading && drawSkeletons(5)}
          {!isLoading &&
            response &&
            dataFiltered.map(service => (
              <ServiceInfoCard name={service.name} type={service.type} />
            ))}
        </Box>
      </Card>
    </Box>
  );
}
