import { Dropdown, MenuProps } from 'antd';
import { PropsWithChildren } from 'react';

interface GraphContextMenuProps {
  items: MenuProps['items'];
}

export function GraphContextMenu(props: GraphContextMenuProps & PropsWithChildren) {
  const {items, children} = props;
  
  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      {children}
    </Dropdown>
  );
}
