"""
Theme System for NCQ LLM Platform
Supports dark/light mode with customizable themes
"""

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Base colors
  primary: string;
  primaryVariant: string;
  secondary: string;
  secondaryVariant: string;
  
  // Background colors
  background: string;
  surface: string;
  surfaceVariant: string;
  
  // Text colors
  onPrimary: string;
  onSecondary: string;
  onBackground: string;
  onSurface: string;
  onSurfaceVariant: string;
  
  // Semantic colors
  error: string;
  warning: string;
  success: string;
  info: string;
  
  // UI colors
  border: string;
  divider: string;
  shadow: string;
  overlay: string;
  
  // Interactive states
  hover: string;
  focus: string;
  selected: string;
  disabled: string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string;
    mono: string;
    arabic: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export interface ThemeSpacing {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
  40: string;
  48: string;
  56: string;
  64: string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: {
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    none: string;
  };
  transitions: {
    fast: string;
    base: string;
    slow: string;
  };
  zIndex: {
    auto: string;
    0: string;
    10: string;
    20: string;
    30: string;
    40: string;
    50: string;
    dropdown: string;
    modal: string;
    popover: string;
    tooltip: string;
  };
}

// Light theme colors
export const lightColors: ThemeColors = {
  // NCQ Brand colors
  primary: '#1E40AF', // Blue-800
  primaryVariant: '#1E3A8A', // Blue-900
  secondary: '#059669', // Emerald-600
  secondaryVariant: '#047857', // Emerald-700
  
  // Backgrounds
  background: '#FFFFFF',
  surface: '#F9FAFB',
  surfaceVariant: '#F3F4F6',
  
  // Text
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onBackground: '#111827',
  onSurface: '#1F2937',
  onSurfaceVariant: '#6B7280',
  
  // Semantic
  error: '#DC2626',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
  
  // UI
  border: '#E5E7EB',
  divider: '#D1D5DB',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // States
  hover: 'rgba(0, 0, 0, 0.04)',
  focus: 'rgba(30, 64, 175, 0.2)',
  selected: 'rgba(30, 64, 175, 0.1)',
  disabled: 'rgba(0, 0, 0, 0.38)',
};

// Dark theme colors
export const darkColors: ThemeColors = {
  // NCQ Brand colors (adjusted for dark mode)
  primary: '#3B82F6', // Blue-500
  primaryVariant: '#2563EB', // Blue-600
  secondary: '#10B981', // Emerald-500
  secondaryVariant: '#059669', // Emerald-600
  
  // Backgrounds
  background: '#0F172A', // Slate-900
  surface: '#1E293B', // Slate-800
  surfaceVariant: '#334155', // Slate-700
  
  // Text
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onBackground: '#F9FAFB',
  onSurface: '#F1F5F9',
  onSurfaceVariant: '#CBD5E1',
  
  // Semantic
  error: '#EF4444',
  warning: '#FCD34D',
  success: '#34D399',
  info: '#60A5FA',
  
  // UI
  border: '#475569',
  divider: '#334155',
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // States
  hover: 'rgba(255, 255, 255, 0.08)',
  focus: 'rgba(59, 130, 246, 0.4)',
  selected: 'rgba(59, 130, 246, 0.2)',
  disabled: 'rgba(255, 255, 255, 0.38)',
};

// Shared theme properties
const sharedTheme = {
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      arabic: '"Noto Sans Arabic", "Segoe UI", Tahoma, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    modal: '1300',
    popover: '1400',
    tooltip: '1500',
  },
};

// Create themes
export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  ...sharedTheme,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  ...sharedTheme,
};

// Theme utilities
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Apply CSS variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Apply data attribute for CSS selectors
  root.setAttribute('data-theme', theme.mode);
};

// Theme storage
const THEME_STORAGE_KEY = 'ncq-theme-preference';

export const saveThemePreference = (mode: ThemeMode) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_STORAGE_KEY, mode);
};

export const getThemePreference = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || 'system';
};

// Custom theme creator
export const createCustomTheme = (
  mode: 'light' | 'dark',
  customColors: Partial<ThemeColors>
): Theme => {
  const baseColors = mode === 'light' ? lightColors : darkColors;
  
  return {
    mode,
    colors: {
      ...baseColors,
      ...customColors,
    },
    ...sharedTheme,
  };
};

// RTL support for Arabic
export const applyRTL = (isRTL: boolean) => {
  if (typeof document === 'undefined') return;
  
  const html = document.documentElement;
  html.dir = isRTL ? 'rtl' : 'ltr';
  html.lang = isRTL ? 'ar' : 'en';
  
  // Apply RTL-specific font
  if (isRTL) {
    document.body.style.fontFamily = sharedTheme.typography.fontFamily.arabic;
  } else {
    document.body.style.fontFamily = sharedTheme.typography.fontFamily.sans;
  }
};