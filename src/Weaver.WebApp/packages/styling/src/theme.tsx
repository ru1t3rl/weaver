import {MappingAlgorithm, theme, ThemeConfig} from "antd";
import {darkThemeColors, lightThemeColors} from './palettes';

export type ThemeMode = 'light' | 'dark';

export function createTheme(mode: ThemeMode): ThemeConfig {
    function getAlgorithm(mode: ThemeMode): MappingAlgorithm | undefined {
        switch (mode) {
            case 'dark':
                return theme.darkAlgorithm;
            case 'light':
                return theme.defaultAlgorithm;
            default:
                return undefined;
        }
    }

    function getTokens(mode: ThemeMode) {
        switch (mode) {
            case 'light':
                return lightThemeColors;
            case 'dark':
            default:
                return darkThemeColors;
        }
    }

    return ({
        algorithm: getAlgorithm(mode),
        token: getTokens(mode),
    })
}

export default createTheme;