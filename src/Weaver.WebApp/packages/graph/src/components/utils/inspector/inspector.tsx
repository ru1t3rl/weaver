import { Card } from 'antd';
import { PropsWithChildren } from 'react';
import styles from './inspector.module.scss'

export const Inspector = (props: PropsWithChildren) => {
    const { children } = props;
    return (
        <Card className={styles['inspector-container']}>
            {children}
        </Card>
    )
}