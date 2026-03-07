import { Card, Flex } from 'antd';
import { NavBar } from '../nav-bar/nav-bar';
import styles from './layout.module.scss';
import { PropsWithChildren } from "react";
import { useTheme } from '@weaver/styling';
import { Outlet } from 'react-router';

interface LayoutProps {
    iconPath?: string;
}

export const Layout = (props: LayoutProps & PropsWithChildren) => {
    const { children } = props;
    const { theme } = useTheme();

    return (
        <Flex className={styles['layout-container']} style={{
            backgroundColor: theme.token?.colorBgBase
        }}>
            <NavBar />
            <Card className={styles['layout-body']}>
                <Outlet />
                {children}
            </Card>
        </Flex>
    )
}