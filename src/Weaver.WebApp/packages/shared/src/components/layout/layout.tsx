import { Card, Flex } from 'antd';
import { NavBar } from '../nav-bar/nav-bar';
import styles from './layout.module.scss';
import { PropsWithChildren } from "react";
import { useTheme } from '@weaver/styling';

interface LayoutProps {
    iconPath: string;
}

export const Layout = (props: LayoutProps & PropsWithChildren) => {
    const { iconPath, children } = props;
    const { theme } = useTheme();

    return (
        <Flex className={styles['layout-container']} style={{
            backgroundColor: theme.token?.colorBgBase
        }}>
            <NavBar iconPath={iconPath} />
            <Card className={styles['layout-body']}>
                {children}
            </Card>
        </Flex>
    )
}