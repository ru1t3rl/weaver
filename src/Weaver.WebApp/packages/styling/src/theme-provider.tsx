import { PropsWithChildren, useState } from "react";
import { createTheme, ThemeMode } from "./theme";
import { ConfigProvider } from "antd";
import { IThemeContext, ThemeContext } from "./theme-context";


export function ThemeProvider({ children }: PropsWithChildren) {
    const [mode, setMode] = useState<ThemeMode>('dark');
    const themeConfig = createTheme(mode);

    function toggleTheme() {
        if (mode === 'dark') {
            setMode('light');
        } else {
            setMode('dark');
        }
    }

    const value: IThemeContext = {
        mode,
        theme: themeConfig,
        toggleTheme,
        setMode,
    }

    return (
        <ThemeContext.Provider value={value}>
            <ConfigProvider theme={{ ...themeConfig }}>
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;