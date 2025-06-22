import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface UseThemeReturn {
  theme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  systemTheme: 'light' | 'dark';
}

export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('ncq-theme') as ThemeMode | null;
    if (savedTheme === 'system' || !savedTheme) {
      setThemeState(systemTheme);
    } else {
      setThemeState(savedTheme as 'light' | 'dark');
    }
  }, [systemTheme]);

  const setTheme = (newTheme: ThemeMode) => {
    localStorage.setItem('ncq-theme', newTheme);
    if (newTheme === 'system') {
      setThemeState(systemTheme);
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else {
      setThemeState(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  };

  return { theme, setTheme, systemTheme };
};