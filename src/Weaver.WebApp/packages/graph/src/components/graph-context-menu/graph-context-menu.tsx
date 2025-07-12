import { Dropdown, MenuProps } from 'antd';
import { PropsWithChildren } from 'react';
import { LuPlus } from 'react-icons/lu';
import { useServiceSearchModal } from '../../hooks/use-service-search-modal';

export function GraphContextMenu(props: PropsWithChildren) {
  const { show: showServiceModal } = useServiceSearchModal();

  const items: MenuProps['items'] = [
    {
      label: 'Add service',
      icon: <LuPlus />,
      key: 'add-service',
      onClick: showServiceModal,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      {props.children}
    </Dropdown>
  );
}
