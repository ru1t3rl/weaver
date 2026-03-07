import { createContext } from "react";
import { ThemeMode } from "./theme";
import { ThemeConfig } from "antd";

export interface IThemeContext {
    mode: ThemeMode;
    theme: ThemeConfig;
    toggleTheme: () => void;
    setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<IThemeContext>({
    mode: 'dark',
    theme: {} as ThemeConfig,
    toggleTheme: (): void => undefined,
    setMode: (): void => undefined,
});