import {Button, Flex} from "antd";
import {LuPlus} from "react-icons/lu";
import styles from './toolbar.module.scss';

export function Toolbar() {
    return (
        <Flex className={styles['toolbar-container']}>
            <Button shape='round' icon={<LuPlus/>} onClick={() => {}}/>
        </Flex>
    )
}