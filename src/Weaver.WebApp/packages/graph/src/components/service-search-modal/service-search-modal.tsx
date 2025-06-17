import { Box, Card, Input, Skeleton } from '@mui/joy';
import {
  apiRequestConfig,
  ServiceListItemModel,
  useGetService,
} from '@weaver/shared';
import { ReactNode, useMemo, useState } from 'react';
import { useServiceGraph } from '../../hooks/use-service-graph';
import { ServiceInfoCard } from '../service-info-card/service-info-card';
import styles from './service-search-modal.module.scss';

export function ServiceModal() {
  const { tryAddNode } = useServiceGraph();
  const { data: response, isLoading } = useGetService({
    axios: apiRequestConfig,
  });

  const [filter, setFilter] = useState<string>('');
  const dataFiltered = useMemo<ServiceListItemModel[]>(() => {
    if (!response) {
      return [];
    }

    if (filter.length <= 0) {
      return response.data;
    }

    const lowerFilter = filter.toLowerCase();
    return response.data.filter(service =>
      service.name.toLowerCase().includes(lowerFilter),
    );
  }, [response, filter]);

  function drawSkeletons(amount: number): ReactNode[] {
    const nodes: ReactNode[] = [];
    for (let i = 0; i < amount; i++) {
      nodes.push(<Skeleton key={i} />);
    }
    return nodes;
  }

  return (
    <Box className={styles['modal-container']}>
      <Input
        variant='outlined'
        placeholder='Service Name...'
        className={styles['services-input']}
        onChange={e => {
          setFilter(e.currentTarget.value);
        }}
      />
      <Card className={styles['services-list']} variant='plain'>
        {isLoading && drawSkeletons(5)}
        {!isLoading &&
          response &&
          dataFiltered.map((service, index) => (
            <ServiceInfoCard
              variant='plain'
              key={index}
              name={service.name}
              type={service.type}
            />
          ))}
      </Card>
    </Box>
  );
}
