// import type { PaletteMode } from "@mui/material";

// export const getDesignTokens = (mode: PaletteMode) => ({
//   palette: {
//     mode,
//     ...(mode === "light"
//       ? {
//           primary: {
//             main: "#1E3A8A",
//             light: "#3B82F6",
//             dark: "#172554",
//             contrastText: "#FFFFFF",
//           },
//           secondary: {
//             main: "#B45309",
//             light: "#F59E0B",
//             dark: "#78350F",
//             contrastText: "#FFFFFF",
//           },
//           background: {
//             default: "#F8FAFC",
//             paper: "#FFFFFF",
//           },
//           text: {
//             primary: "#0F172A",
//             secondary: "#475569",
//             disabled: "#94A3B8",
//           },
//           divider: "#E2E8F0",
//           error: { main: "#DC2626", light: "#EF4444", dark: "#991B1B" },
//           success: { main: "#16A34A", light: "#22C55E", dark: "#14532D" },
//           warning: { main: "#D97706", light: "#F59E0B", dark: "#78350F" },
//           info: { main: "#2563EB", light: "#3B82F6", dark: "#1D4ED8" },
//         }
//       : {
//           primary: {
//             main: "#60A5FA",
//             light: "#93C5FD",
//             dark: "#1E3A8A",
//             contrastText: "#0F172A",
//           },
//           secondary: {
//             main: "#FBBF24",
//             light: "#FDE68A",
//             dark: "#B45309",
//             contrastText: "#0F172A",
//           },
//           background: {
//             default: "#0F172A",
//             paper: "#1E293B",
//           },
//           text: {
//             primary: "#F8FAFC",
//             secondary: "#94A3B8",
//             disabled: "#64748B",
//           },
//           divider: "#334155",
//           error: { main: "#F87171", light: "#FCA5A5", dark: "#991B1B" },
//           success: { main: "#4ADE80", light: "#86EFAC", dark: "#14532D" },
//           warning: { main: "#FBBF24", light: "#FDE68A", dark: "#78350F" },
//           info: { main: "#60A5FA", light: "#93C5FD", dark: "#1D4ED8" },
//         }),
//   },
//   typography: {
//     fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
//     h1: { fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" },
//     h2: { fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em" },
//     h3: { fontSize: "1.25rem", fontWeight: 600 },
//     h6: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.4 },
//     body1: { fontSize: "0.925rem", fontWeight: 400, lineHeight: 1.6 },
//     body2: { fontSize: "0.8rem", fontWeight: 400, lineHeight: 1.5 },
//     button: {
//       textTransform: "none" as const,
//       fontWeight: 600,
//       letterSpacing: "0.01em",
//     },
//   },
//   shape: {
//     borderRadius: 8,
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: "8px",
//           padding: "8px 20px",
//           fontWeight: 600,
//           transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
//           boxShadow: "none",
//           "&:hover": {
//             boxShadow: `0px 4px 12px ${mode === "light" ? "rgba(30, 58, 138, 0.15)" : "rgba(96, 165, 250, 0.15)"}`,
//           },
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: "12px",
//           transition: "transform 0.3s ease, box-shadow 0.3s ease",
//           boxShadow:
//             mode === "light"
//               ? "0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03)"
//               : "none",
//           border: mode === "dark" ? "1px solid #334155" : "1px solid #E2E8F0",
//           "&:hover": {
//             transform: "translateY(-2px)",
//             boxShadow:
//               mode === "light"
//                 ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
//                 : "none",
//           },
//         },
//       },
//     },
//     MuiOutlinedInput: {
//       styleOverrides: {
//         root: {
//           borderRadius: "8px",
//           transition: "border-color 0.2s ease, box-shadow 0.2s ease",
//           "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//             borderWidth: "1.5px",
//             borderColor: mode === "light" ? "#1E3A8A" : "#60A5FA",
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
          primary: {
            main: '#1E3A8A',
            light: '#3B82F6',
            dark: '#172554',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#B45309',
            light: '#F59E0B',
            dark: '#78350F',
            contrastText: '#FFFFFF',
          },
          background: {
            default: '#F8FAFC',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#0F172A',
            secondary: '#475569',
            disabled: '#94A3B8',
          },
          divider: '#E2E8F0',
          error: { main: '#DC2626', light: '#EF4444', dark: '#991B1B' },
          success: { main: '#16A34A', light: '#22C55E', dark: '#14532D' },
          warning: { main: '#D97706', light: '#F59E0B', dark: '#78350F' },
          info: { main: '#2563EB', light: '#3B82F6', dark: '#1D4ED8' },
          action: { // Added action palette for consistent hover/active states
            hover: 'rgba(30, 58, 138, 0.04)', // Light primary hover
            selected: 'rgba(30, 58, 138, 0.08)', // Light primary selected
            disabled: '#E2E8F0',
            disabledBackground: '#F1F5F9',
          },
        }
      : {
          primary: {
            main: '#60A5FA',
            light: '#93C5FD',
            dark: '#1E3A8A',
            contrastText: '#0F172A',
          },
          secondary: {
            main: '#FBBF24',
            light: '#FDE68A',
            dark: '#B45309',
            contrastText: '#0F172A',
          },
          background: {
            default: '#0F172A',
            paper: '#1E293B',
          },
          text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
            disabled: '#64748B',
          },
          divider: '#334155',
          error: { main: '#F87171', light: '#FCA5A5', dark: '#991B1B' },
          success: { main: '#4ADE80', light: '#86EFAC', dark: '#14532D' },
          warning: { main: '#FBBF24', light: '#FDE68A', dark: '#78350F' },
          info: { main: '#60A5FA', light: '#93C5FD', dark: '#1D4ED8' },
          action: { // Added action palette for consistent hover/active states
            hover: 'rgba(96, 165, 250, 0.08)', // Dark primary hover
            selected: 'rgba(96, 165, 250, 0.16)', // Dark primary selected
            disabled: '#334155',
            disabledBackground: '#1F2937',
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em' }, // Adjusted for stronger headings
    h2: { fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontSize: '1.75rem', fontWeight: 700 },
    h4: { fontSize: '1.5rem', fontWeight: 700 }, // Added h4
    h5: { fontSize: '1.25rem', fontWeight: 600 }, // Added h5
    h6: { fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4 }, // Slightly larger for sub-headings
    subtitle1: { fontSize: '1rem', fontWeight: 500 }, // For sidebar section titles
    body1: { fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }, // Increased for main text readability (like YouTube links)
    body2: { fontSize: '0.85rem', fontWeight: 400, lineHeight: 1.5 }, // Slightly larger for detail text
    button: { textTransform: 'none' as const, fontWeight: 600, letterSpacing: '0.01em' },
    caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.4 },
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
          fontWeight: 600,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: `0px 4px 12px ${mode === 'light' ? 'rgba(30, 58, 138, 0.15)' : 'rgba(96, 165, 250, 0.15)'}`,
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
          border: mode === 'dark' ? '1px solid #334155' : '1px solid #E2E8F0',
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
            borderColor: mode === 'light' ? '#1E3A8A' : '#60A5FA',
          },
        },
      },
    },
    MuiAppBar: { // Custom styling for AppBar
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(12px)',
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(11, 15, 25, 0.85)',
          color: 'text.primary',
        },
      },
    },
    MuiDrawer: { // Custom styling for Drawer
      styleOverrides: {
        paper: {
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        },
      },
    },
    MuiListItemButton: { // Custom styling for List Item Buttons
      styleOverrides: {
        root: {
          borderRadius: '8px', // Slightly larger border-radius
          margin: '4px 12px', // Adjusted horizontal margin for better spacing
          padding: '8px 16px', // Adjusted padding
          '&:hover': {
            backgroundColor: mode === 'light' ? 'action.hover' : 'action.hover', // Use action.hover from palette
          },
          '&.Mui-selected': {
            backgroundColor: mode === 'light' ? 'action.selected' : 'action.selected', // Use action.selected
            color: mode === 'light' ? 'primary.main' : 'primary.light', // Active item text color
            '& .MuiListItemIcon-root': {
              color: mode === 'light' ? 'primary.main' : 'primary.light', // Active item icon color
            },
          },
        },
      },
    },
    MuiListItemIcon: { // Custom styling for List Item Icons
      styleOverrides: {
        root: {
          minWidth: 36, // Slightly reduced minWidth for icons
          color: 'text.secondary', // Default icon color
          transition: 'color 0.2s ease-in-out',
        },
      },
    },
    MuiListItemText: { // Custom styling for List Item Text
      styleOverrides: {
        primary: {
          fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
          fontWeight: 500, // Default font weight for sidebar items
          fontSize: '0.95rem', // Default font size
          letterSpacing: '0.01em',
        },
      },
    },
    MuiTypography: { // Global Typography overrides for sidebar section headers
      variants: [
        {
          props: { variant: 'subtitle1' },
          style: {
            fontWeight: 700, // YouTube-like section header bold
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'text.secondary',
            fontSize: '0.75rem', // Smaller section header text
            padding: '8px 16px 4px 16px', // Specific padding for section headers
            '@media (min-width:900px)': {
              fontSize: '0.8rem',
              padding: '12px 24px 8px 24px', // Desktop padding
            },
          },
        },
      ],
    },
  },
});