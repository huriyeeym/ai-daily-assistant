import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { THEME_COLORS } from '../constants';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: THEME_COLORS.primary,
    secondary: THEME_COLORS.accent,
    background: THEME_COLORS.background,
    surface: THEME_COLORS.surface,
    error: THEME_COLORS.error,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: THEME_COLORS.primary,
    secondary: THEME_COLORS.accent,
    error: THEME_COLORS.error,
  },
};
