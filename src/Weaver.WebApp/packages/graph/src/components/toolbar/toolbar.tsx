import { Button, Dropdown, Flex, MenuProps } from 'antd';
import { LuFolderOpen, LuMenu, LuPencil, LuPlus, LuSave } from 'react-icons/lu';
import { useServiceSearchModal } from '../../hooks/use-service-search-modal';
import styles from './toolbar.module.scss';

export function Toolbar() {
  const { show: showModal } = useServiceSearchModal();

  function handleAddNewClicked() {
    showModal();
  }

  const menuItems: MenuProps['items'] = [
    { label: 'New Service Template', icon: <LuPencil />, key: 'create-service-template' },
    { label: 'Add Service Template', icon: <LuPlus />, key: 'add-service', onClick: handleAddNewClicked },
  ];

  return (
    <Flex className={styles['toolbar-container']} gap={10}>
      <Dropdown menu={{ items: menuItems }} arrow>
        <Button shape='round' icon={<LuMenu />} />
      </Dropdown>
      <Button shape='round' icon={<LuFolderOpen />} />
      <Button shape='round' icon={<LuSave />} />
      <Button shape='round' icon={<LuPlus />} onClick={handleAddNewClicked} />
    </Flex>
  );
}
