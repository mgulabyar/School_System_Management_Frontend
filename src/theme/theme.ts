import type { PaletteMode } from '@mui/material';

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#1E3A8A', 
            light: '#3B82F6',
            dark: '#172554',
          },
          secondary: {
            main: '#0D9488',
          },
          background: {
            default: '#F8FAFC', 
            paper: '#FFFFFF',  
          },
          text: {
            primary: '#0F172A', 
            secondary: '#475569',
          },
          divider: '#E2E8F0',
        }
      : {
          primary: {
            main: '#60A5FA', 
            light: '#93C5FD',
            dark: '#1E40AF',
          },
          secondary: {
            main: '#2DD4BF',
          },
          background: {
            default: '#0B0F19', 
            paper: '#111827',  
          },
          text: {
            primary: '#F8FAFC',  
            secondary: '#94A3B8',
          },
          divider: '#1F2937',
        }),
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h1: {
      fontSize: '1.75rem', 
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.4,
      '@media (min-width:600px)': {
        fontSize: '1.15rem',
      },
    },
    body1: {
      fontSize: '0.925rem',
      fontWeight: 400,
      lineHeight: 1.6, 
      '@media (min-width:600px)': {
        fontSize: '1rem',
      },
    },
    body2: {
      fontSize: '0.8rem',
      fontWeight: 400,
      lineHeight: 1.5,
      '@media (min-width:600px)': {
        fontSize: '0.875rem',
      },
    },
    button: {
      textTransform: 'none' as const, 
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 8, 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', 
          padding: '8px 20px',
          fontWeight: 500,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(30, 58, 138, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px', 
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',

          boxShadow: mode === 'light' 
            ? '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03)' 
            : 'none',
          border: mode === 'dark' ? '1px solid #1F2937' : '1px solid #F1F5F9',
          '&:hover': {
            transform: 'translateY(-2px)', 
            boxShadow: mode === 'light'
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              : 'none',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1.5px',
          },
        },
      },
    },
  },
});