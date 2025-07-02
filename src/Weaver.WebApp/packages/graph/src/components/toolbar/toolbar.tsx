import {Button, Flex} from "antd";
import {LuFolderOpen, LuPlus, LuSave} from "react-icons/lu";
import styles from './toolbar.module.scss';
import {useServiceSearchModal} from "../../hooks/use-service-search-modal";

export function Toolbar() {
    const {show: showModal} = useServiceSearchModal();

    function handleAddNewClicked() {
        showModal();
    }

    return (
        <Flex className={styles['toolbar-container']} gap={10}>
            <Button shape='round' icon={<LuFolderOpen/>}/>
            <Button shape='round' icon={<LuSave/>}/>
            <Button shape='round' icon={<LuPlus/>} onClick={handleAddNewClicked}/>
        </Flex>
    )
}