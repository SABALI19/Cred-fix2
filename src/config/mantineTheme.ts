import { createTheme } from '@mantine/core';

export const creditFixMantineTheme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: [
      '#eff6ff', // blue.50
      '#dbeafe', // blue.100
      '#bfdbfe', // blue.200
      '#93c5fd', // blue.300
      '#60a5fa', // blue.400
      '#3b82f6', // blue.500 - Primary CreditFix Pro blue
      '#2563eb', // blue.600
      '#1d4ed8', // blue.700
      '#1e40af', // blue.800
      '#1e3a8a', // blue.900
    ],
    green: [
      '#f0fdf4',
      '#dcfce7',
      '#bbf7d0',
      '#86efac',
      '#4ade80',
      '#10b981', // Success green
      '#059669',
      '#047857',
      '#065f46',
      '#064e3b',
    ],
    orange: [
      '#fff7ed',
      '#ffedd5',
      '#fed7aa',
      '#fdba74',
      '#fb923c',
      '#f59e0b', // Warning orange
      '#d97706',
      '#b45309',
      '#92400e',
      '#78350f',
    ],
    red: [
      '#fef2f2',
      '#fecaca',
      '#fca5a5',
      '#f87171',
      '#ef4444', // Error red
      '#dc2626',
      '#b91c1c',
      '#991b1b',
      '#7f1d1d',
      '#dc2626',
    ],
  },
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '600',
  },
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  },
});
