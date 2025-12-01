import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTheme, toggleTheme as toggleThemeAction } from '../store/slices/themeSlice';
import storageService from '../services/storageService';
import { lightTheme, darkTheme } from '../theme';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const { isDark } = useAppSelector(state => state.theme);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    const savedTheme = await storageService.getThemePreference();
    dispatch(setTheme(savedTheme));
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    dispatch(toggleThemeAction());
    await storageService.saveThemePreference(newTheme);
  };

  return {
    theme: isDark ? darkTheme : lightTheme,
    isDark,
    toggleTheme,
  };
};
