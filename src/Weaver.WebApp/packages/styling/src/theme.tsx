import { MappingAlgorithm, theme, ThemeConfig } from "antd";
import { ComponentTokenMap } from "antd/es/theme/interface";
import { typographyOverride } from "./component-overrides";
import { darkThemeColors, lightThemeColors } from './palettes';

export type ThemeMode = 'light' | 'dark';

export function createTheme(mode: ThemeMode): ThemeConfig {

    const componentOverrides: Partial<ComponentTokenMap> = {
        // ...cardOverrides,
        ...typographyOverride
    };

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
        components: componentOverrides
    })
}

export default createTheme;