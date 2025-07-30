import {createContext} from "react";
import {ThemeMode} from "./theme";

export interface IThemeContext{
    mode: ThemeMode;
    toggleTheme: () => void;
    setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<IThemeContext>({
    mode: 'dark', 
    toggleTheme: (): void => undefined,
    setMode: (): void => undefined,
});