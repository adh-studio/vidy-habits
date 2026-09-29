import { useColorScheme } from 'react-native';

export const palette = {
  brand: '#7c3aed',
  brandAlt: '#2563eb',
  success: '#16a34a',
  danger: '#dc2626',
  warning: '#d97706',
};

const light = {
  bg: '#f4f6fa',
  card: '#ffffff',
  text: '#1a1f2e',
  muted: '#5b6474',
  border: '#e3e7ef',
  ...palette,
};

const dark = {
  bg: '#0b1120',
  card: '#131c30',
  text: '#e7ecf6',
  muted: '#8b97ad',
  border: '#233152',
  ...palette,
};

export type Theme = typeof light;

export function useTheme(): { theme: Theme; scheme: 'light' | 'dark' } {
  const scheme = useColorScheme() ?? 'light';
  return { theme: scheme === 'dark' ? dark : light, scheme };
}

export const spacing = (n: number) => n * 4;
export const radius = { sm: 8, md: 12, lg: 20, pill: 999 };
