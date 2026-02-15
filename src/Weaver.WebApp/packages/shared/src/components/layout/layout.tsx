import { Card, Flex } from 'antd';
import { NavBar } from '../nav-bar/nav-bar';
import styles from './layout.module.scss';
import { PropsWithChildren } from "react";

interface LayoutProps {
    iconPath: string;
}

export const Layout = (props: LayoutProps & PropsWithChildren) => {
    const { iconPath, children } = props;

    return (
        <Flex className={styles['layout-container']}>
            <NavBar iconPath={iconPath} />
            <Card className={styles['layout-body']}>
                {children}
            </Card>
        </Flex>
    )
}