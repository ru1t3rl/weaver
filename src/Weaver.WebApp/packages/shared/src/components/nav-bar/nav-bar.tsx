import { Button, Card } from "antd";
import { LuLogOut } from 'react-icons/lu';
import styles from './nav-bar.module.scss';
import { ThemeToggle, useTheme } from "@weaver/styling";
import WeaverLogo from "../../weaver-logo";

interface NavBarProps {
    iconPath: string;
}

export const NavBar = (props: NavBarProps) => {
    const x = useTheme();

    return (
        <Card className={styles['nav-bar-container']}>
            <div className={styles['nav-bar-top']}>
                <WeaverLogo size={'150%'} color={x.theme.token?.colorTextBase}/>
            </div>
            <div className={styles['nav-bar-bottom']}>
                <ThemeToggle />
                <Button icon={<LuLogOut />} />
            </div>
        </Card>
    );
}