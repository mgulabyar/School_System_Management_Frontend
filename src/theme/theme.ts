// import type { PaletteMode } from '@mui/material';

// export const getDesignTokens = (mode: PaletteMode) => ({
//   palette: {
//     mode,
//     ...(mode === 'light'
//       ? {
//           primary: {
//             main: '#1E3A8A', 
//             light: '#3B82F6',
//             dark: '#172554',
//           },
//           secondary: {
//             main: '#0D9488',
//           },
//           background: {
//             default: '#F8FAFC', 
//             paper: '#FFFFFF',  
//           },
//           text: {
//             primary: '#0F172A', 
//             secondary: '#475569',
//           },
//           divider: '#E2E8F0',
//         }
//       : {
//           primary: {
//             main: '#60A5FA', 
//             light: '#93C5FD',
//             dark: '#1E40AF',
//           },
//           secondary: {
//             main: '#2DD4BF',
//           },
//           background: {
//             default: '#0B0F19', 
//             paper: '#111827',  
//           },
//           text: {
//             primary: '#F8FAFC',  
//             secondary: '#94A3B8',
//           },
//           divider: '#1F2937',
//         }),
//   },
//   typography: {
//     fontFamily: '"Roboto", "Arial", sans-serif',
//     h1: {
//       fontSize: '1.75rem', 
//       fontWeight: 700,
//       lineHeight: 1.25,
//       letterSpacing: '-0.02em',
//       '@media (min-width:600px)': {
//         fontSize: '2.5rem',
//       },
//     },
//     h2: {
//       fontSize: '1.5rem',
//       fontWeight: 600,
//       lineHeight: 1.3,
//       letterSpacing: '-0.01em',
//       '@media (min-width:600px)': {
//         fontSize: '2rem',
//       },
//     },
//     h3: {
//       fontSize: '1.25rem',
//       fontWeight: 600,
//       lineHeight: 1.4,
//       '@media (min-width:600px)': {
//         fontSize: '1.5rem',
//       },
//     },
//     h6: {
//       fontSize: '1rem',
//       fontWeight: 500,
//       lineHeight: 1.4,
//       '@media (min-width:600px)': {
//         fontSize: '1.15rem',
//       },
//     },
//     body1: {
//       fontSize: '0.925rem',
//       fontWeight: 400,
//       lineHeight: 1.6, 
//       '@media (min-width:600px)': {
//         fontSize: '1rem',
//       },
//     },
//     body2: {
//       fontSize: '0.8rem',
//       fontWeight: 400,
//       lineHeight: 1.5,
//       '@media (min-width:600px)': {
//         fontSize: '0.875rem',
//       },
//     },
//     button: {
//       textTransform: 'none' as const, 
//       fontWeight: 500,
//       letterSpacing: '0.01em',
//     },
//   },
//   shape: {
//     borderRadius: 8, 
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: '8px', 
//           padding: '8px 20px',
//           fontWeight: 500,
//           transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
//           boxShadow: 'none',
//           '&:hover': {
//             boxShadow: '0px 4px 12px rgba(30, 58, 138, 0.15)',
//           },
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: '12px', 
//           transition: 'transform 0.3s ease, box-shadow 0.3s ease',

//           boxShadow: mode === 'light' 
//             ? '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03)' 
//             : 'none',
//           border: mode === 'dark' ? '1px solid #1F2937' : '1px solid #F1F5F9',
//           '&:hover': {
//             transform: 'translateY(-2px)', 
//             boxShadow: mode === 'light'
//               ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
//               : 'none',
//           },
//         },
//       },
//     },
//     MuiOutlinedInput: {
//       styleOverrides: {
//         root: {
//           borderRadius: '8px',
//           transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
//           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//             borderWidth: '1.5px',
//           },
//         },
//       },
//     },
//   },
// });
import type { PaletteMode } from '@mui/material';

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // --- Refined Light Mode Palette (Professional Blues) ---
          primary: {
            main: '#1A73E8',
            light: '#629FFC',
            dark: '#145CBF',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#00B0FF', 
            light: '#40C4FF',
            dark: '#0091EA',
            contrastText: '#FFFFFF',
          },
          background: {
            default: '#F8F9FA',
            paper: '#FFFFFF',  
          },
          text: {
            primary: '#202124', 
            secondary: '#5F6368',
            disabled: '#9AA0A6',
          },
          divider: '#E0E0E0',
          error: {
            main: '#D93025',
            light: '#F28B82',
            dark: '#A50E0E',
          },
          success: {
            main: '#188038',
            light: '#5BB974',
            dark: '#11652E',
          },
          warning: {
            main: '#F9AB00',
            light: '#FDD663',
            dark: '#C58100',
          },
          info: {
            main: '#4285F4',
            light: '#629FFC',
            dark: '#356ACF',
          },
        }
      : {
          primary: {
            main: '#8AB4F8', 
            light: '#C4D7FA',
            dark: '#4285F4',
            contrastText: '#121212',
          },
          secondary: {
            main: '#78E8FA',
            light: '#B2F0FA',
            dark: '#35C2E0',
            contrastText: '#121212',
          },
          background: {
            default: '#171717',
            paper: '#212121',  
          },
          text: {
            primary: '#E0E0E0',  
            secondary: '#A0A0A0',
            disabled: '#616161',
          },
          divider: '#373737',
          error: {
            main: '#EA5D54',
            light: '#F8A8A3',
            dark: '#C83B32',
          },
          success: {
            main: '#4CAF50',
            light: '#81C784',
            dark: '#388E3C',
          },
          warning: {
            main: '#FFC107',
            light: '#FFEB3B',
            dark: '#FFA000',
          },
          info: {
            main: '#64B5F6',
            light: '#90CAF9',
            dark: '#42A5F5',
          },
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