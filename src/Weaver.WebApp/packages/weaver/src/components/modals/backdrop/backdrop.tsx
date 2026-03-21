import { PropsWithChildren } from "react";
import styles from './backdrop.module.scss';

export const Backdrop: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
    return <div className={styles['container']}>{props.children}</div>
}