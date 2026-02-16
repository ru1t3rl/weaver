import { Button, Card } from "antd";
import { LuHouse, LuLogOut } from 'react-icons/lu';
import styles from './nav-bar.module.scss';
import { ThemeToggle, useTheme } from "@weaver/styling";
import WeaverLogo from "../../weaver-logo";
import { useNavigate } from "react-router";
import { routes } from "../../routes";

interface NavBarProps {
    iconPath: string;
}

export const NavBar = (props: NavBarProps) => {
    const theme = useTheme();
    const navigate = useNavigate();

    function handleHomeClicked() {
        navigate(routes.home);
    }

    return (
        <Card className={styles['nav-bar-container']}>
            <div className={styles['nav-bar-top']}>
                <WeaverLogo size={'150%'} onClick={handleHomeClicked} color={theme.theme.token?.colorTextBase} />
                <Button icon={<LuHouse />} onClick={handleHomeClicked} className={styles['icon-button']}/>
            </div>
            <div className={styles['nav-bar-bottom']}>
                <ThemeToggle />
                <Button icon={<LuLogOut />} className={styles['icon-button']} />
            </div>
        </Card>
    );
}