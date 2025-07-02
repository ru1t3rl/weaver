import {HiMoon, HiSun} from 'react-icons/hi2';
import useTheme from "./use-theme";
import {Button} from "antd";

interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle(props: ThemeToggleProps) {
    const {mode, setMode} = useTheme();

    function handleClick() {
        setMode(mode === 'dark' ? 'light' : 'dark');
    }

    return (
        <Button
            onClick={handleClick}
            className={props.className}
            shape='circle'
            icon={mode === 'dark' ? <HiSun/> : <HiMoon/>}
        />
    );
}

export default ThemeToggle;
