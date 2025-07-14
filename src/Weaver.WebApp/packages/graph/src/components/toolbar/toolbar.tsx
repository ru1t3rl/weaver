import { Button, Dropdown, Flex, MenuProps } from 'antd';
import { LuFolderOpen, LuMenu, LuPencil, LuPlus, LuSave } from 'react-icons/lu';
import { useModals } from '../../hooks';
import styles from './toolbar.module.scss';

export function Toolbar() {
  const { showAddServiceTemplate, showCreateServiceTemplate } = useModals();

  const menuItems: MenuProps['items'] = [
    {
      label: 'New Service Template',
      icon: <LuPencil />,
      key: 'create-service-template',
      onClick: showCreateServiceTemplate,
    },
    { label: 'Add Service Template', icon: <LuPlus />, key: 'add-service', onClick: showAddServiceTemplate },
  ];

  return (
    <Flex className={styles['toolbar-container']} gap={10}>
      <Dropdown menu={{ items: menuItems }} arrow>
        <Button shape='round' icon={<LuMenu />} />
      </Dropdown>
      <Button shape='round' icon={<LuFolderOpen />} />
      <Button shape='round' icon={<LuSave />} />
      <Button shape='round' icon={<LuPlus />} onClick={showAddServiceTemplate} />
    </Flex>
  );
}
