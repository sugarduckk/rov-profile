// Design tokens and theme configuration
export const theme = {
  colors: {
    // Primary palette
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main primary
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },

    // Gray palette  
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },

    // Semantic colors
    success: {
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
    },

    warning: {
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
    },

    error: {
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
    },

    // Background & surfaces
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
  },

  typography: {
    // Font families
    fontFamily: {
      sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    },

    // Font sizes - mobile-first approach
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px  
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },

    // Line heights
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },

    // Font weights
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  spacing: {
    // Mobile-first spacing scale (in rem)
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Breakpoints for responsive design
  breakpoints: {
    xs: '320px',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Touch targets and interactive elements
  touchTarget: {
    min: '44px', // Minimum touch target size
    comfortable: '48px', // Comfortable touch target
  },

  // Animation & transitions
  animation: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },

    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

export type Theme = typeof theme;

// Utility function for media queries
export const media = {
  xs: `@media (min-width: ${theme.breakpoints.xs})`,
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
  '2xl': `@media (min-width: ${theme.breakpoints['2xl']})`,
};

// Common button styles
export const buttonStyles = {
  base: `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.borderRadius.xl};
    font-weight: ${theme.typography.fontWeight.semibold};
    transition: all ${theme.animation.duration.normal} ${theme.animation.easing.ease};
    cursor: pointer;
    border: none;
    text-decoration: none;
    font-family: inherit;
    min-height: ${theme.touchTarget.comfortable};
    min-width: ${theme.touchTarget.comfortable};
    
    &:focus {
      outline: 2px solid ${theme.colors.primary[500]};
      outline-offset: 2px;
    }
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `,

  sizes: {
    sm: `
      padding: ${theme.spacing[2]} ${theme.spacing[4]};
      font-size: ${theme.typography.fontSize.sm};
      min-width: 120px;
      
      ${media.sm} {
        min-width: 140px;
      }
    `,

    md: `
      padding: ${theme.spacing[3]} ${theme.spacing[6]};
      font-size: ${theme.typography.fontSize.base};
      min-width: 160px;
      
      ${media.sm} {
        min-width: 180px;
      }
    `,

    lg: `
      padding: ${theme.spacing[4]} ${theme.spacing[8]};
      font-size: ${theme.typography.fontSize.lg};
      min-width: 180px;
      
      ${media.sm} {
        min-width: 200px;
      }
    `,
  },

  variants: {
    primary: `
      background-color: ${theme.colors.primary[500]};
      color: white;
      box-shadow: ${theme.boxShadow.md};
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary[600]};
        transform: translateY(-1px);
        box-shadow: ${theme.boxShadow.lg};
      }
      
      &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: ${theme.boxShadow.base};
      }
    `,

    secondary: `
      background-color: ${theme.colors.gray[600]};
      color: white;
      box-shadow: ${theme.boxShadow.md};
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.gray[700]};
        transform: translateY(-1px);
        box-shadow: ${theme.boxShadow.lg};
      }
      
      &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: ${theme.boxShadow.base};
      }
    `,

    outline: `
      background-color: transparent;
      color: ${theme.colors.primary[600]};
      border: 2px solid ${theme.colors.primary[200]};
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary[50]};
        border-color: ${theme.colors.primary[300]};
      }
    `,
  },
};
