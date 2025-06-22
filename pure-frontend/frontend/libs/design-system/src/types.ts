export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface BaseComponentProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
}

export interface WithChildren {
  children: React.ReactNode;
}

export interface WithLocale {
  locale?: 'en' | 'ar';
}

export type Direction = 'ltr' | 'rtl';

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
}

export interface Theme {
  colors: ThemeColors;
  direction: Direction;
  fontFamily: {
    sans: string;
    arabic: string;
  };
}