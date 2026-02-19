import type { ThemeConfig } from 'antd';

export const creditFixTheme: ThemeConfig = {
  token: {
    // Primary brand colors
    colorPrimary: '#3b82f6', // CreditFix Pro blue
    colorSuccess: '#10b981', // Green for positive changes
    colorWarning: '#f59e0b', // Orange for warnings
    colorError: '#ef4444', // Red for errors
    colorInfo: '#8b5cf6', // Purple accent
    
    // Background and surface colors
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorBgSpotlight: '#f1f5f9',
    
    // Border and divider colors
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
    
    // Text colors
    colorText: '#1e293b',
    colorTextSecondary: '#64748b',
    colorTextTertiary: '#94a3b8',
    colorTextQuaternary: '#cbd5e1',
    
    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeHeading4: 18,
    fontSizeHeading5: 16,
    
    // Spacing and sizing
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
    
    // Component specific
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    
    // Motion
    motionDurationSlow: '0.3s',
    motionDurationMid: '0.2s',
    motionDurationFast: '0.1s',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      fontWeight: 500,
    },
    Card: {
      borderRadius: 12,
      boxShadowTertiary: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    Table: {
      borderRadius: 8,
      headerBg: '#f8fafc',
      headerColor: '#374151',
      headerSortActiveBg: '#e5e7eb',
      headerSortHoverBg: '#f3f4f6',
    },
    Layout: {
      headerBg: '#ffffff',
      headerColor: '#1e293b',
      headerHeight: 64,
      siderBg: '#ffffff',
      triggerBg: '#f8fafc',
      triggerColor: '#64748b',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#eff6ff',
      itemSelectedColor: '#3b82f6',
      itemHoverBg: '#f8fafc',
      itemHoverColor: '#1e293b',
    },
    Progress: {
      defaultColor: '#3b82f6',
      remainingColor: '#e2e8f0',
    },
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 24,
    },
  },
  algorithm: undefined, // Use default algorithm
};

// Dark theme configuration
export const creditFixDarkTheme: ThemeConfig = {
  token: {
    ...creditFixTheme.token,
    colorBgBase: '#0f172a',
    colorBgContainer: '#1e293b',
    colorBgElevated: '#334155',
    colorBgLayout: '#020617',
    colorBgSpotlight: '#1e293b',
    
    colorBorder: '#334155',
    colorBorderSecondary: '#1e293b',
    
    colorText: '#f1f5f9',
    colorTextSecondary: '#cbd5e1',
    colorTextTertiary: '#94a3b8',
    colorTextQuaternary: '#64748b',
  },
  components: {
    ...creditFixTheme.components,
    Table: {
      ...creditFixTheme.components?.Table,
      headerBg: '#1e293b',
      headerColor: '#f1f5f9',
    },
    Layout: {
      ...creditFixTheme.components?.Layout,
      headerBg: '#1e293b',
      headerColor: '#f1f5f9',
      siderBg: '#1e293b',
    },
    Menu: {
      ...creditFixTheme.components?.Menu,
      itemSelectedBg: '#3b82f620',
      itemHoverBg: '#334155',
    },
  },
};
