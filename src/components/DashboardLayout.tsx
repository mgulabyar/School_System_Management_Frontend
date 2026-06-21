import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Class,
  People,
  Person,
  HowToReg,
  AccountBalanceWallet,
  Assignment,
  MenuBook,
  DirectionsBus,
  ReceiptLong,
  Sms,
  BarChart,
  Logout,
  DarkMode,
  LightMode,
  School as SchoolIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useCustomTheme } from "../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 260;
const getAppBarStyles = (mode: string) => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  zIndex: (theme: any) => theme.zIndex.drawer + 1,
  borderBottom: "1px solid",
  borderColor: "divider",
  backdropFilter: "blur(12px)",
  bgcolor:
    mode === "light" ? "rgba(255, 255, 255, 0.85)" : "rgba(11, 15, 25, 0.85)",
  color: "text.primary",

  "@media (max-width: 899px)": {
    boxShadow: mode === "light" ? "0px 1px 3px rgba(15, 23, 42, 0.04)" : "none",
  },

  "@media (min-width: 900px) and (max-width: 1199px)": {
    boxShadow: "none",
  },

  "@media (min-width: 1200px)": {
    boxShadow: mode === "light" ? "0px 1px 3px rgba(15, 23, 42, 0.04)" : "none",
  },
});

const toolbarStyles = {
  display: "flex",
  justifyContent: "space-between",

  "@media (max-width: 899px)": {
    px: 2,
    minHeight: "56px",
  },

  "@media (min-width: 900px) and (max-width: 1199px)": {
    px: 2,
    minHeight: "64px",
  },

  "@media (min-width: 1200px)": {
    px: 3,
    minHeight: "64px",
  },
};

const logoTextStyles = {
  fontWeight: 800,
  letterSpacing: "0.06em",
  color: "primary.main",
  fontFamily: '"Roboto", "Arial", sans-serif',

  "@media (max-width: 899px)": {
    fontSize: "14px",
  },

  "@media (min-width: 900px) and (max-width: 1199px)": {
    fontSize: "15px",
  },

  "@media (min-width: 1200px)": {
    fontSize: "16px",
  },
};

const getDrawerNavStyles = (drawerWidth: number) => ({
  "@media (max-width: 899px)": {
    width: "auto",
  },

  "@media (min-width: 900px) and (max-width: 1199px)": {
    width: drawerWidth,
    flexShrink: 0,
  },

  "@media (min-width: 1200px)": {
    width: drawerWidth,
    flexShrink: 0,
  },
});

const sidebarSectionHeaderStyles = {
  fontWeight: 600,
  letterSpacing: "0.05em",
  textTransform: "uppercase" as const,
  fontFamily: '"Roboto", "Arial", sans-serif',
  color: "text.secondary",
  opacity: 0.8,

  "@media (max-width: 899px)": {
    fontSize: "10px",
    px: 2,
    mb: 1,
  },

  "@media (min-width: 900px) and (max-width: 1199px)": {
    fontSize: "11px",
    px: 2.5,
    mb: 1.2,
  },

  "@media (min-width: 1200px)": {
    fontSize: "11px",
    px: 2.5,
    mb: 1.2,
  },
};

const sidebarListItemStyles = {
  "@media (max-width: 899px)": {
    mb: 0.6,
  },

  "@media (min-width: 900px) and (max-width: 1199px)": {
    mb: 0.8,
  },

  "@media (min-width: 1200px)": {
    mb: 0.8,
  },
};

const getSidebarItemButtonStyles = (
  isActive: boolean,
  activeBg: string,
  hoverBg: string,
) => ({
  borderRadius: "6px",
  transition: "background-color 0.15s ease",
  bgcolor: isActive ? activeBg : "transparent",
  "&:hover": {
    bgcolor: isActive ? activeBg : hoverBg,
  },

  "@media (max-width: 899px)": {
    mx: 1,
    py: 0.5,
    px: 1.2,
  },

  "@media (min-width: 900px) and (max-width: 1199px)": {
    mx: 1.5,
    py: 0.6,
    px: 1.5,
  },

  "@media (min-width: 1200px)": {
    mx: 1.5,
    py: 0.6,
    px: 1.5,
  },
});

const getSidebarItemTextStyles = (isActive: boolean) => ({
  fontFamily: '"Roboto", "Arial", sans-serif',
  color: "text.primary",
  letterSpacing: 0.5,

  "@media (max-width: 899px)": {
    fontSize: "12px",
    fontWeight: isActive ? 400 : 400,
  },

  "@media (min-width: 900px) and (max-width: 1199px)": {
    fontSize: "12px",
    fontWeight: isActive ? 400 : 400,
  },

  "@media (min-width: 1200px)": {
    fontSize: "13px",
    fontWeight: isActive ? 500 : 500,
    letterSpacing: 0.5,
  },
});

const logoutTextStyles = {
  fontWeight: 500,
  letterSpacing: 0.5,
  fontFamily: '"Roboto", "Arial", sans-serif',
  color: "error.main",

  "@media (max-width: 899px)": {
    fontSize: "12px",
  },

  "@media (min-width: 900px) and (max-width: 1199px)": {
    fontSize: "12px",
  },

  "@media (min-width: 1200px)": {
    fontSize: "11px",
  },
};

const getMainContainerStyles = (drawerWidth: number) => ({
  flexGrow: 1,
  mt: "64px",
  minHeight: "calc(100vh - 64px)",

  "@media (max-width: 899px)": {
    p: 2,
    width: "100%",
  },

  "@media (min-width: 900px) and (max-width: 1199px)": {
    p: 3,
    width: `calc(100% - ${drawerWidth}px)`,
  },

  "@media (min-width: 1200px)": {
    p: 3,
    width: `calc(100% - ${drawerWidth}px)`,
  },
});

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const { toggleTheme, mode } = useCustomTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuSections = [
    {
      title: "General",
      items: [
        {
          text: "Dashboard",
          icon: <Dashboard />,
          path: "/",
          role: ["super_admin", "admin", "teacher", "student"],
        },
      ],
    },
    {
      title: "Academics",
      items: [
        {
          text: "Academic",
          icon: <Class />,
          path: "/academic",
          role: ["super_admin", "admin"],
        },
        {
          text: "Attendance",
          icon: <HowToReg />,
          path: "/attendance",
          role: ["super_admin", "admin", "teacher"],
        },
        {
          text: "Exams",
          icon: <Assignment />,
          path: "/exams",
          role: ["super_admin", "admin", "teacher", "student"],
        },
      ],
    },
    {
      title: "People",
      items: [
        {
          text: "Students",
          icon: <People />,
          path: "/students",
          role: ["super_admin", "admin"],
        },
        {
          text: "Teachers",
          icon: <Person />,
          path: "/teachers",
          role: ["super_admin", "admin"],
        },
      ],
    },
    {
      title: "Finance & Admin",
      items: [
        {
          text: "Fees",
          icon: <AccountBalanceWallet />,
          path: "/fees",
          role: ["super_admin", "admin", "accountant"],
        },
        {
          text: "Accounts",
          icon: <ReceiptLong />,
          path: "/accounts",
          role: ["super_admin", "admin", "accountant"],
        },
        {
          text: "Library",
          icon: <MenuBook />,
          path: "/library",
          role: ["super_admin", "admin"],
        },
        {
          text: "Transport",
          icon: <DirectionsBus />,
          path: "/transport",
          role: ["super_admin", "admin"],
        },
      ],
    },
    {
      title: "System Alerts",
      items: [
        {
          text: "Communication",
          icon: <Sms />,
          path: "/communication",
          role: ["super_admin", "admin"],
        },
        {
          text: "Reports",
          icon: <BarChart />,
          path: "/reports",
          role: ["super_admin", "admin"],
        },
      ],
    },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          py: { xs: 2.5, md: 2 },
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: mode === "light" ? "#E2E8F0" : "#334155",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: mode === "light" ? "#CBD5E1" : "#475569",
          },
        }}
      >
        {menuSections.map((section, index) => {
          const allowedItems = section.items.filter(
            (item) => user && item.role.includes(user.role),
          );

          if (allowedItems.length === 0) return null;

          return (
            <Box key={section.title} sx={{ mb: 1 }}>
              {index > 0 && (
                <Divider
                  sx={{ my: 1.5, borderColor: "divider", opacity: 0.8 }}
                />
              )}

              <Typography sx={sidebarSectionHeaderStyles}>
                {section.title}
              </Typography>

              <List disablePadding>
                {allowedItems.map((item) => {
                  const isActive = location.pathname === item.path;

                  const activeBg =
                    mode === "light"
                      ? "rgba(0, 0, 0, 0.05)"
                      : "rgba(255, 255, 255, 0.1)";

                  const hoverBg =
                    mode === "light"
                      ? "rgba(0, 0, 0, 0.05)"
                      : "rgba(255, 255, 255, 0.1)";

                  return (
                    <ListItem
                      key={item.text}
                      disablePadding
                      sx={sidebarListItemStyles}
                    >
                      <ListItemButton
                        component={Link}
                        to={item.path}
                        onClick={() => {
                          if (mobileOpen) setMobileOpen(false);
                        }}
                        sx={getSidebarItemButtonStyles(
                          isActive,
                          activeBg,
                          hoverBg,
                        )}
                      >
                        <ListItemIcon
                          sx={{
                            color: "text.primary",
                            minWidth: 38,
                          }}
                        >
                          {React.cloneElement(item.icon, {
                            sx: { fontSize: 17 },
                          })}
                        </ListItemIcon>
                        <ListItemText>
                          <Typography sx={getSidebarItemTextStyles(isActive)}>
                            {item.text}
                          </Typography>
                        </ListItemText>
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ borderColor: "divider" }} />

      <List sx={{ pb: 1.5, pt: 1.5 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: "6px",
              mx: 1.5,
              py: 0.6,
              px: 1.5,
              color: "error.main",
              transition: "background-color 0.15s ease",
              "&:hover": {
                bgcolor:
                  mode === "light"
                    ? "rgba(239, 68, 68, 0.05)"
                    : "rgba(248, 113, 113, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "error.main", minWidth: 38 }}>
              <Logout sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={logoutTextStyles}>
                Sign Out
              </Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <AppBar position="fixed" sx={getAppBarStyles(mode)}>
        <Toolbar sx={toolbarStyles}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 1.5,
                display: { md: "none" },
                transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: mobileOpen ? "rotate(90deg)" : "none",
              }}
            >
              {mobileOpen ? (
                <CloseIcon sx={{ fontSize: 22 }} />
              ) : (
                <MenuIcon sx={{ fontSize: 22 }} />
              )}
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SchoolIcon sx={{ fontSize: 24, color: "primary.main" }} />
              <Typography variant="h6" sx={logoTextStyles}>
                CAMPUS ERP
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={toggleTheme} color="primary" sx={{ p: 1 }}>
              {mode === "light" ? (
                <DarkMode sx={{ fontSize: 20 }} />
              ) : (
                <LightMode sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={getDrawerNavStyles(DRAWER_WIDTH)}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider",
              boxShadow: "8px 0px 24px rgba(15, 23, 42, 0.08)",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider",
              top: "64px",
              height: "calc(100% - 64px)",
              bgcolor: "background.paper",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={getMainContainerStyles(DRAWER_WIDTH)}>
        {children}
      </Box>
    </Box>
  );
};