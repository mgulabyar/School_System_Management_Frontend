// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Alert,
//   CircularProgress,
//   IconButton,
// } from "@mui/material";
// import { useAuth } from "../context/AuthContext";
// import { useCustomTheme } from "../context/ThemeContext";
// import DarkModeIcon from "@mui/icons-material/DarkMode";
// import LightModeIcon from "@mui/icons-material/LightMode";
// import SchoolIcon from "@mui/icons-material/School";

// const containerStyles = {
//   display: "flex",
//   flexDirection: "column" as const,
//   alignItems: "center",
//   justifyContent: "center",
//   minHeight: "100vh",
//   bgcolor: "background.default",

//   "@media (max-width: 599px)": {
//     p: 2,
//   },
//   "@media (min-width: 600px)": {
//     p: 3,
//   },
// };

// const themeTogglerStyles = {
//   position: "absolute" as const,
//   top: 16,
//   right: 16,
// };

// const getLoginCardStyles = (mode: string) => ({
//   maxWidth: 400,
//   width: "100%",
//   borderRadius: "10px",
//   bgcolor: "background.paper",

//   boxShadow: mode === "light" ? "0 10px 30px rgba(15, 23, 42, 0.06)" : "none",
//   border: mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",

//   "@keyframes slideUp": {
//     "0%": { opacity: 0, transform: "translateY(20px)" },
//     "100%": { opacity: 1, transform: "translateY(0)" },
//   },
//   animation: "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",

//   "@media (max-width: 599px)": {
//     p: 2,
//   },
//   "@media (min-width: 600px)": {
//     p: 3,
//   },
// });

// const logoContainerStyles = {
//   display: "flex",
//   justifyContent: "center",
//   mb: 1.5,
// };

// const titleStyles = {
//   fontWeight: 700,
//   textAlign: "center" as const,
//   fontFamily: '"Roboto", "Arial", sans-serif',
//   color: "primary.main",
//   mb: 1,

//   "@media (max-width: 599px)": {
//     fontSize: "1.45rem",
//   },
//   "@media (min-width: 600px)": {
//     fontSize: "1.65rem",
//   },
// };

// const subtitleStyles = {
//   textAlign: "center" as const,
//   fontFamily: '"Roboto", "Arial", sans-serif',
//   color: "text.secondary",
//   mb: 4,

//   "@media (max-width: 599px)": {
//     fontSize: "0.85rem",
//   },
//   "@media (min-width: 600px)": {
//     fontSize: "0.9rem",
//   },
// };

// const inputFieldStyles = {
//   mb: 2.5,
//   "& .MuiOutlinedInput-root": {
//     height: 48,
//     borderRadius: "8px",
//     transition: "border-color 0.2s ease, box-shadow 0.2s ease",
//   },
// };

// const actionButtonStyles = {
//   height: 48,
//   fontSize: "0.925rem",
//   fontWeight: 600,
//   borderRadius: "8px",
//   boxShadow: "none",
//   textTransform: "none" as const,
//   "&:hover": {
//     boxShadow: "none",
//   },
// };

// export const Login: React.FC = () => {
//   const { login, loading } = useAuth();
//   const { toggleTheme, mode } = useCustomTheme();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [localLoading, setLocalLoading] = useState(false);

//   const isCurrentLoading = loading || localLoading;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!email || !password) {
//       setError("Please fill out all fields!");
//       return;
//     }

//     try {
//       setLocalLoading(true);

//       const loginPromise = login(email, password);
//       const delayPromise = new Promise((resolve) => setTimeout(resolve, 2000));

//       await Promise.all([loginPromise, delayPromise]);
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("An unexpected error occurred.");
//       }
//     } finally {
//       setLocalLoading(false);
//     }
//   };

//   return (
//     <Box sx={containerStyles}>
//       <Box sx={themeTogglerStyles}>
//         <IconButton
//           onClick={toggleTheme}
//           color="primary"
//           disabled={isCurrentLoading}
//         >
//           {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
//         </IconButton>
//       </Box>

//       <Card sx={getLoginCardStyles(mode)}>
//         <CardContent sx={{ p: 0 }}>
//           <Box sx={logoContainerStyles}>
//             <SchoolIcon sx={{ fontSize: 44, color: "primary.main" }} />
//           </Box>

//           <Typography variant="h2" sx={titleStyles}>
//             Welcome Back!
//           </Typography>
//           <Typography variant="body1" sx={subtitleStyles}>
//             Log in to access your School ERP Dashboard.
//           </Typography>

//           {error && (
//             <Alert severity="error" sx={{ mb: 2.5, borderRadius: "8px" }}>
//               {error}
//             </Alert>
//           )}

//           <form onSubmit={handleSubmit}>
//             <TextField
//               label="Email Address"
//               type="email"
//               variant="outlined"
//               fullWidth
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={isCurrentLoading}
//               sx={inputFieldStyles}
//             />

//             <TextField
//               label="Password"
//               type="password"
//               variant="outlined"
//               fullWidth
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={isCurrentLoading}
//               sx={inputFieldStyles}
//             />

//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               fullWidth
//               disabled={isCurrentLoading}
//               sx={actionButtonStyles}
//             >
//               {isCurrentLoading ? (
//                 <CircularProgress size={22} color="inherit" />
//               ) : (
//                 "Sign In"
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useCustomTheme } from "../context/ThemeContext";
import SchoolIcon from "@mui/icons-material/School";

const containerStyles = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  minHeight: "calc(100vh - 128px)",
  bgcolor: "background.default",

  "@media (max-width: 599px)": {
    p: 2,
  },
  "@media (min-width: 600px)": {
    p: 3,
  },
};

const getLoginCardStyles = (mode: string) => ({
  maxWidth: 400,
  width: "100%",
  borderRadius: "10px",
  bgcolor: "background.paper",
  boxShadow: mode === "light" ? "0 10px 30px rgba(15, 23, 42, 0.06)" : "none",
  border: mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",

  "&:hover": {
    transform: "none !important",
    borderColor: mode === "dark" ? "#1F2937 !important" : "#E2E8F0 !important",
    boxShadow: mode === "light" ? "0 10px 30px rgba(15, 23, 42, 0.06) !important" : "none !important",
  },

  "@keyframes slideUp": {
    "0%": { opacity: 0, transform: "translateY(20px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
  animation: "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",

  "@media (max-width: 599px)": {
    p: 2,
  },
  "@media (min-width: 600px)": {
    p: 3,
  },
});

const logoContainerStyles = {
  display: "flex",
  justifyContent: "center",
  mb: 1.5,
};

const titleStyles = {
  fontWeight: 700,
  textAlign: "center" as const,
  fontFamily: '"Roboto", "Arial", sans-serif',
  color: "primary.main",
  mb: 1,

  "@media (max-width: 599px)": {
    fontSize: "1.45rem",
  },
  "@media (min-width: 600px)": {
    fontSize: "1.65rem",
  },
};

const subtitleStyles = {
  textAlign: "center" as const,
  fontFamily: '"Roboto", "Arial", sans-serif',
  color: "text.secondary",
  mb: 4,

  "@media (max-width: 599px)": {
    fontSize: "0.85rem",
  },
  "@media (min-width: 600px)": {
    fontSize: "0.9rem",
  },
};

const inputFieldStyles = {
  mb: 2.5,
  "& .MuiOutlinedInput-root": {
    height: 48,
    borderRadius: "8px",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
};

const actionButtonStyles = {
  height: 48,
  fontSize: "0.925rem",
  fontWeight: 600,
  borderRadius: "8px",
  boxShadow: "none",
  textTransform: "none" as const,
  "&:hover": {
    boxShadow: "none",
  },
};

export const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const { mode } = useCustomTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const isCurrentLoading = loading || localLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill out all fields!");
      return;
    }

    try {
      setLocalLoading(true);

      const loginPromise = login(email, password);
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 2000));

      await Promise.all([loginPromise, delayPromise]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <Box sx={containerStyles}>
      <Card sx={getLoginCardStyles(mode)}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={logoContainerStyles}>
            <SchoolIcon sx={{ fontSize: 44, color: "primary.main" }} />
          </Box>

          <Typography variant="h2" sx={titleStyles}>
            Welcome Back!
          </Typography>
          <Typography variant="body1" sx={subtitleStyles}>
            Log in to access your School ERP Dashboard.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: "8px" }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isCurrentLoading}
              sx={inputFieldStyles}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isCurrentLoading}
              sx={inputFieldStyles}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isCurrentLoading}
              sx={actionButtonStyles}
            >
              {isCurrentLoading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
