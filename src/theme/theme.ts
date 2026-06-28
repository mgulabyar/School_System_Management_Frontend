import type { PaletteMode } from "@mui/material";

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#1E3A8A",
            light: "#3B82F6",
            dark: "#172554",
            contrastText: "#FFFFFF",
          },
          secondary: {
            main: "#B45309",
            light: "#F59E0B",
            dark: "#78350F",
            contrastText: "#FFFFFF",
          },
          background: {
            default: "#F8FAFC",
            paper: "#FFFFFF",
          },
          text: {
            primary: "#0F172A",
            secondary: "#475569",
            disabled: "#94A3B8",
          },
          divider: "#E2E8F0",
          error: { main: "#DC2626", light: "#EF4444", dark: "#991B1B" },
          success: { main: "#16A34A", light: "#22C55E", dark: "#14532D" },
          warning: { main: "#D97706", light: "#F59E0B", dark: "#78350F" },
          info: { main: "#2563EB", light: "#3B82F6", dark: "#1D4ED8" },
        }
      : {
          primary: {
            main: "#60A5FA",
            light: "#93C5FD",
            dark: "#1E3A8A",
            contrastText: "#0F172A",
          },
          secondary: {
            main: "#FBBF24",
            light: "#FDE68A",
            dark: "#B45309",
            contrastText: "#0F172A",
          },
          background: {
            default: "#0F172A",
            paper: "#1E293B",
          },
          text: {
            primary: "#F8FAFC",
            secondary: "#94A3B8",
            disabled: "#64748B",
          },
          divider: "#334155",
          error: { main: "#F87171", light: "#FCA5A5", dark: "#991B1B" },
          success: { main: "#4ADE80", light: "#86EFAC", dark: "#14532D" },
          warning: { main: "#FBBF24", light: "#FDE68A", dark: "#78350F" },
          info: { main: "#60A5FA", light: "#93C5FD", dark: "#1D4ED8" },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h1: { fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontSize: "1.25rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: "0.925rem", fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: "0.8rem", fontWeight: 400, lineHeight: 1.5 },
    button: {
      textTransform: "none" as const,
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: 600,
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "none",
          "&:hover": {
            boxShadow: `0px 4px 12px ${mode === "light" ? "rgba(30, 58, 138, 0.15)" : "rgba(96, 165, 250, 0.15)"}`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          boxShadow:
            mode === "light"
              ? "0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03)"
              : "none",
          border: mode === "dark" ? "1px solid #334155" : "1px solid #E2E8F0",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              mode === "light"
                ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                : "none",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1.5px",
            borderColor: mode === "light" ? "#1E3A8A" : "#60A5FA",
          },
        },
      },
    },
  },
});


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
//             contrastText: '#FFFFFF',
//           },
//           secondary: {
//             main: '#B45309',
//             light: '#F59E0B',
//             dark: '#78350F',
//             contrastText: '#FFFFFF',
//           },
//           background: {
//             default: '#F8FAFC',
//             paper: '#FFFFFF',
//           },
//           text: {
//             primary: '#0F172A',
//             secondary: '#475569',
//             disabled: '#94A3B8',
//           },
//           divider: '#E2E8F0',
//           error: { main: '#DC2626', light: '#EF4444', dark: '#991B1B' },
//           success: { main: '#16A34A', light: '#22C55E', dark: '#14532D' },
//           warning: { main: '#D97706', light: '#F59E0B', dark: '#78350F' },
//           info: { main: '#2563EB', light: '#3B82F6', dark: '#1D4ED8' },
//           action: {
//             hover: 'rgba(30, 58, 138, 0.04)',
//             selected: 'rgba(30, 58, 138, 0.08)',
//             disabled: '#E2E8F0',
//             disabledBackground: '#F1F5F9',
//           },
//         }
//       : {
//           primary: {
//             main: '#60A5FA',
//             light: '#93C5FD',
//             dark: '#1E3A8A',
//             contrastText: '#0F172A',
//           },
//           secondary: {
//             main: '#FBBF24',
//             light: '#FDE68A',
//             dark: '#B45309',
//             contrastText: '#0F172A',
//           },
//           background: {
//             default: '#0F172A',
//             paper: '#1E293B',
//           },
//           text: {
//             primary: '#F8FAFC',
//             secondary: '#94A3B8',
//             disabled: '#64748B',
//           },
//           divider: '#334155',
//           error: { main: '#F87171', light: '#FCA5A5', dark: '#991B1B' },
//           success: { main: '#4ADE80', light: '#86EFAC', dark: '#14532D' },
//           warning: { main: '#FBBF24', light: '#FDE68A', dark: '#78350F' },
//           info: { main: '#60A5FA', light: '#93C5FD', dark: '#1D4ED8' },
//           action: { 
//             hover: 'rgba(96, 165, 250, 0.08)',
//             selected: 'rgba(96, 165, 250, 0.16)', 
//             disabled: '#334155',
//             disabledBackground: '#1F2937',
//           },
//         }),
//   },
//   typography: {
//     fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
//     h1: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em' }, 
//     h2: { fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' },
//     h3: { fontSize: '1.75rem', fontWeight: 700 },
//     h4: { fontSize: '1.5rem', fontWeight: 700 }, 
//     h5: { fontSize: '1.25rem', fontWeight: 600 }, 
//     h6: { fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4 },
//     subtitle1: { fontSize: '1rem', fontWeight: 500 }, 
//     body1: { fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }, 
//     body2: { fontSize: '0.85rem', fontWeight: 400, lineHeight: 1.5 }, 
//     button: { textTransform: 'none' as const, fontWeight: 600, letterSpacing: '0.01em' },
//     caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.4 },
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
//           fontWeight: 600,
//           transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
//           boxShadow: 'none',
//           '&:hover': {
//             boxShadow: `0px 4px 12px ${mode === 'light' ? 'rgba(30, 58, 138, 0.15)' : 'rgba(96, 165, 250, 0.15)'}`,
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
//           border: mode === 'dark' ? '1px solid #334155' : '1px solid #E2E8F0',
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
//             borderColor: mode === 'light' ? '#1E3A8A' : '#60A5FA',
//           },
//         },
//       },
//     },
//     MuiAppBar: { 
//       styleOverrides: {
//         root: {
//           boxShadow: 'none',
//           borderBottom: '1px solid',
//           borderColor: 'divider',
//           backdropFilter: 'blur(12px)',
//           backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(11, 15, 25, 0.85)',
//           color: 'text.primary',
//         },
//       },
//     },
//     MuiDrawer: { 
//       styleOverrides: {
//         paper: {
//           borderRight: '1px solid',
//           borderColor: 'divider',
//           backgroundColor: 'background.paper',
//         },
//       },
//     },
//     MuiListItemButton: { 
//       styleOverrides: {
//         root: {
//           borderRadius: '8px',
//           margin: '4px 12px', 
//           padding: '8px 16px', 
//           '&:hover': {
//             backgroundColor: mode === 'light' ? 'action.hover' : 'action.hover',
//           },
//           '&.Mui-selected': {
//             backgroundColor: mode === 'light' ? 'action.selected' : 'action.selected',
//             color: mode === 'light' ? 'primary.main' : 'primary.light', 
//             '& .MuiListItemIcon-root': {
//               color: mode === 'light' ? 'primary.main' : 'primary.light',
//             },
//           },
//         },
//       },
//     },
//     MuiListItemIcon: { 
//       styleOverrides: {
//         root: {
//           minWidth: 36, 
//           color: 'text.secondary',
//           transition: 'color 0.2s ease-in-out',
//         },
//       },
//     },
//     MuiListItemText: {
//       styleOverrides: {
//         primary: {
//           fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
//           fontWeight: 500,
//           fontSize: '0.95rem', 
//           letterSpacing: '0.01em',
//         },
//       },
//     },
//     MuiTypography: {
//       variants: [
//         {
//           props: { variant: 'subtitle1' },
//           style: {
//             fontWeight: 700, 
//             letterSpacing: '0.08em',
//             textTransform: 'uppercase',
//             color: 'text.secondary',
//             fontSize: '0.75rem',
//             padding: '8px 16px 4px 16px', 
//             '@media (min-width:900px)': {
//               fontSize: '0.8rem',
//               padding: '12px 24px 8px 24px', 
//             },
//           },
//         },
//       ],
//     },
//   },
// });