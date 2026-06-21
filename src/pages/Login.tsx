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
  IconButton,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useCustomTheme } from "../context/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SchoolIcon from "@mui/icons-material/School";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const containerStyles = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  bgcolor: "background.default",

  "@media (max-width: 599px)": {
    p: 2,
  },
  "@media (min-width: 600px)": {
    p: 3,
  },
};

const themeTogglerStyles = {
  position: "absolute" as const,
  top: 16,
  right: 16,
};

const getLoginCardStyles = (mode: string) => ({
  maxWidth: 420,
  width: "100%",
  borderRadius: "10px",
  bgcolor: "background.paper",

  boxShadow: mode === "light" ? "0 10px 30px rgba(15, 23, 42, 0.06)" : "none",
  border: mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",

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

const dividerBoxStyles = {
  display: "flex",
  alignItems: "center",
  my: 3,
};

const dividerLineStyles = {
  flexGrow: 1,
  height: "1px",
  bgcolor: "divider",
};

const dividerTextStyles = {
  mx: 2,
  color: "text.secondary",
  fontWeight: 500,
  fontSize: "0.8rem",
};

const forgetPasswordButtonStyles = {
  height: 48,
  fontSize: "0.825rem",
  fontWeight: 500,
  borderRadius: "8px",
  textTransform: "none" as const,
  borderStyle: "dashed",
  "&:hover": {
    borderStyle: "dashed",
  },
};

export const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const { toggleTheme, mode } = useCustomTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
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

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!resetEmail) {
      setError("Please enter your email address!");
      return;
    }

    setLocalLoading(true);

    setTimeout(() => {
      setSuccessMessage("Password reset link has been sent to your email!");
      setResetEmail("");
      setLocalLoading(false);
    }, 2000);
  };

  return (
    <Box sx={containerStyles}>
      <Box sx={themeTogglerStyles}>
        <IconButton
          onClick={toggleTheme}
          color="primary"
          disabled={isCurrentLoading}
        >
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Box>

      <Card sx={getLoginCardStyles(mode)}>
        <CardContent sx={{ p: 0 }}>
          {isForgotPassword ? (
            <Box>
              <Button
                startIcon={<ArrowBackIcon />}
                disabled={isCurrentLoading}
                onClick={() => {
                  setIsForgotPassword(false);
                  setError(null);
                  setSuccessMessage(null);
                }}
                sx={{
                  p: 0,
                  minWidth: "auto",
                  mb: 2,
                  color: "text.secondary",
                  textTransform: "none",
                }}
              >
                Back
              </Button>

              <Box sx={logoContainerStyles}>
                <SchoolIcon sx={{ fontSize: 44, color: "primary.main" }} />
              </Box>

              <Typography variant="h2" sx={titleStyles}>
                Reset Password
              </Typography>
              <Typography variant="body1" sx={subtitleStyles}>
                Enter your registered email to receive a password reset link.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: "8px" }}>
                  {error}
                </Alert>
              )}

              {successMessage && (
                <Alert severity="success" sx={{ mb: 2.5, borderRadius: "8px" }}>
                  {successMessage}
                </Alert>
              )}

              <form onSubmit={handleForgotPasswordSubmit}>
                <TextField
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
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
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </Box>
          ) : (
            <Box>
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

              <Box sx={dividerBoxStyles}>
                <Box sx={dividerLineStyles} />
                <Typography variant="body2" sx={dividerTextStyles}>
                  OR
                </Typography>
                <Box sx={dividerLineStyles} />
              </Box>

              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                disabled={isCurrentLoading}
                onClick={() => {
                  setIsForgotPassword(true);
                  setError(null);
                  setSuccessMessage(null);
                }}
                sx={forgetPasswordButtonStyles}
              >
                Forget Password? Reset Here
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

