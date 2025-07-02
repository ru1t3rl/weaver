import {useContext} from "react";
import {IThemeContext, ThemeContext} from "./theme-context";

export function useTheme(): IThemeContext {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}

export default useTheme;