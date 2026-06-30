// import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
// import { ThemeProvider, createTheme, type PaletteMode } from '@mui/material';
// import type { ThemeOptions } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { getDesignTokens } from '../theme/theme';

// interface ThemeContextType {
//   toggleTheme: () => void;
//   mode: PaletteMode;
// }

// const CustomThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [mode, setMode] = useState<PaletteMode>(() => {
//     const savedMode = localStorage.getItem('themeMode');
//     return (savedMode as PaletteMode) || 'light';
//   });

//   useEffect(() => {
//     localStorage.setItem('themeMode', mode);
//   }, [mode]);

//   const toggleTheme = () => {
//     setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
//   };

//   const theme = useMemo(
//     () => createTheme(getDesignTokens(mode) as ThemeOptions),
//     [mode]
//   );

//   return (
//     <CustomThemeContext.Provider value={{ toggleTheme, mode }}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         {children}
//       </ThemeProvider>
//     </CustomThemeContext.Provider>
//   );
// };

// // eslint-disable-next-line react-refresh/only-export-components
// export const useCustomTheme = () => {
//   const context = useContext(CustomThemeContext);
//   if (!context) {
//     throw new Error('useCustomTheme must be used within a CustomThemeProvider');
//   }
//   return context;
// };

import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme, type PaletteMode } from '@mui/material';
import type { ThemeOptions } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getDesignTokens } from '../theme/theme';

interface ThemeContextType {
  toggleTheme: () => void;
  mode: PaletteMode;
}

const CustomThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as PaletteMode) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () => createTheme(getDesignTokens(mode) as ThemeOptions),
    [mode]
  );

  return (
    <CustomThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCustomTheme = () => {
  const context = useContext(CustomThemeContext);
  if (!context) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
};