import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { useCustomTheme } from "../context/ThemeContext";
import { getDashboardStats } from "../services/reportsService";

interface OverviewMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
}

interface AttendanceStats {
  present: number;
  absent: number;
  totalMarked: number;
}

interface FeesSummary {
  collected: number;
  pending: number;
}
/////////////////// everythign up-to-date insided of your rempstory
interface DashboardData {
  schoolOverview: OverviewMetrics;
  todayAttendance: AttendanceStats;
  monthlyFeesSummary: FeesSummary;
}

const dashboardHeaderStyles = {
  fontWeight: 800,
  fontFamily: '"Roboto", "Arial", sans-serif',
  color: "primary.main",
  letterSpacing: "-0.01em",

  "@media (max-width: 899px)": {
    fontSize: "1.45rem",
    mb: 0.5,
  },

  "@media (min-width: 900px) and (max-width: 1199px)": {
    fontSize: "1.75rem",
    mb: 1,
  },

  "@media (min-width: 1200px)": {
    fontSize: "2rem",
    mb: 1,
  },
};

const dashboardSubtitleStyles = {
  fontFamily: '"Roboto", "Arial", sans-serif',
  color: "text.secondary",

  "@media (max-width: 899px)": {
    fontSize: "0.85rem",
    mb: 3,
  },

  "@media (min-width: 900px) and (max-width: 1199px)": {
    fontSize: "0.95rem",
    mb: 4,
  },

  "@media (min-width: 1200px)": {
    fontSize: "1rem",
    mb: 4,
  },
};

const metricsGridStyles = {
  display: "grid",
  gap: 3,

  "@media (max-width: 599px)": {
    gridTemplateColumns: "1fr",
  },

  "@media (min-width: 600px) and (max-width: 1199px)": {
    gridTemplateColumns: "1fr 1fr",
  },

  "@media (min-width: 1200px)": {
    gridTemplateColumns: "1fr 1fr 1fr",
  },
};

const getMetricCardStyles = (mode: string) => ({
  borderRadius: "10px",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  bgcolor: "background.paper",

  borderLeft: "5px solid",
  borderLeftColor: "primary.main",

  boxShadow:
    mode === "light"
      ? "0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.05)"
      : "none",
  border: mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",

  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      mode === "light"
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)"
        : "0 4px 20px rgba(96, 165, 250, 0.15)",
    borderLeftColor: mode === "light" ? "primary.light" : "primary.main",
  },
});

const metricTitleStyles = {
  fontWeight: 650,
  fontFamily: '"Roboto", "Arial", sans-serif',
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
  color: "text.secondary",
  mb: 1.5,

  "@media (max-width: 899px)": {
    fontSize: "11px",
  },
  "@media (min-width: 900px)": {
    fontSize: "12px",
  },
};

const metricValueStyles = {
  fontWeight: 500,
  fontFamily: '"Roboto", "Arial", sans-serif',
  color: "text.primary",
  letterSpacing: "-0.01em",

  "@media (max-width: 899px)": {
    fontSize: "1.65rem",
  },
  "@media (min-width: 900px)": {
    fontSize: "1.85rem",
  },
};

const detailsGridStyles = {
  display: "grid",
  gap: 3,
  alignItems: "start",

  "@media (max-width: 1199px)": {
    gridTemplateColumns: "1fr",
  },

  "@media (min-width: 1200px)": {
    gridTemplateColumns: "1fr 1fr",
  },
};

const getAnalyticsCardStyles = (mode: string) => ({
  borderRadius: "10px",
  bgcolor: "background.paper",
  boxShadow:
    mode === "light"
      ? "0 1px 3px rgba(0,0,0,0.02), 0 10px 20px -2px rgba(15, 23, 42, 0.03)"
      : "none",
  border: mode === "dark" ? "1px solid #1F2937" : "1px solid #F1F5F9",
});

const analyticsCardHeaderStyles = {
  fontWeight: 700,
  fontFamily: '"Roboto", "Arial", sans-serif',
  color: "text.primary",
  mb: 3,

  "@media (max-width: 899px)": {
    fontSize: "15px",
  },
  "@media (min-width: 900px)": {
    fontSize: "16px",
  },
};

const dataRowStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  py: 1.2,
  px: 1.5,
  borderRadius: "8px",
  bgcolor: "transparent",
  transition: "background-color 0.2s ease",
  "&:hover": {
    bgcolor: "action.hover",
  },
};

const getSummaryBoxStyles = (mode: string) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  py: 1.5,
  px: 2,
  borderRadius: "10px",
  bgcolor:
    mode === "light" ? "rgba(30, 58, 138, 0.03)" : "rgba(96, 165, 250, 0.04)",
  border: "1px solid",
  borderColor:
    mode === "light" ? "rgba(30, 58, 138, 0.05)" : "rgba(96, 165, 250, 0.08)",
});

export const Dashboard: React.FC = () => {
  const { mode } = useCustomTheme();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success",
  );

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      setData(res.data);
      setLoading(false);
    } catch {
      setLoading(false);
      setToastSeverity("error");
      setToastMessage("Failed to fetch real-time dashboard analytics details.");
      setToastOpen(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStats();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchStats]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 12,
        }}
      >
        <CircularProgress size={36} thickness={4.5} />
      </Box>
    );
  }

  const attendanceRate =
    data && data.todayAttendance.totalMarked > 0
      ? (
          (data.todayAttendance.present / data.todayAttendance.totalMarked) *
          100
        ).toFixed(2)
      : null;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        "@keyframes pageSlideUp": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        animation: "pageSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      <Typography variant="h1" sx={dashboardHeaderStyles}>
        System Overview Dashboard
      </Typography>
      <Typography variant="body1" sx={dashboardSubtitleStyles}>
        Real-time statistical overview and administrative analytics ledger.
      </Typography>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{
            width: "100%",
            borderRadius: "10px",
            fontFamily: '"Roboto", "Arial", sans-serif',
            boxShadow:
              mode === "light" ? "0 10px 24px rgba(15, 23, 42, 0.08)" : "none",
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>

      {data && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Box sx={metricsGridStyles}>
            <Card sx={getMetricCardStyles(mode)}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="body2" sx={metricTitleStyles}>
                  Total Students Enrolled
                </Typography>
                <Typography variant="h2" sx={metricValueStyles}>
                  {data.schoolOverview.totalStudents}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={getMetricCardStyles(mode)}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="body2" sx={metricTitleStyles}>
                  Active Staff Directory
                </Typography>
                <Typography variant="h2" sx={metricValueStyles}>
                  {data.schoolOverview.totalTeachers}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={getMetricCardStyles(mode)}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="body2" sx={metricTitleStyles}>
                  Registered Classes
                </Typography>
                <Typography variant="h2" sx={metricValueStyles}>
                  {data.schoolOverview.totalClasses}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={detailsGridStyles}>
            <Card sx={getAnalyticsCardStyles(mode)}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <Typography sx={analyticsCardHeaderStyles}>
                  Today's Student Attendance Log
                </Typography>

                {data.todayAttendance.totalMarked === 0 ? (
                  <Box sx={{ py: 4, px: 2, textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontFamily: '"Roboto", "Arial", sans-serif' }}
                    >
                      No student daily attendance logs have been marked for
                      today yet.
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Box sx={dataRowStyles}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Present Students
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          color: "success.main",
                        }}
                      >
                        {data.todayAttendance.present}
                      </Typography>
                    </Box>
                    <Box sx={dataRowStyles}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Absent Students
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          color: "error.main",
                        }}
                      >
                        {data.todayAttendance.absent}
                      </Typography>
                    </Box>

                    <Divider
                      sx={{ my: 1, borderColor: "divider", opacity: 0.6 }}
                    />

                    <Box sx={getSummaryBoxStyles(mode)}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          color: "text.primary",
                        }}
                      >
                        Overall Attendance Rate
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: "primary.main",
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          fontSize: "1.05rem",
                        }}
                      >
                        {attendanceRate}%
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card sx={getAnalyticsCardStyles(mode)}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <Typography sx={analyticsCardHeaderStyles}>
                  Current Month Fees Ledger Summary
                </Typography>

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box sx={dataRowStyles}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Collected Tuition Fees
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        color: "success.main",
                      }}
                    >
                      Rs. {data.monthlyFeesSummary.collected}
                    </Typography>
                  </Box>
                  <Box sx={dataRowStyles}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Pending Invoices Amount
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        color: "error.main",
                      }}
                    >
                      Rs. {data.monthlyFeesSummary.pending}
                    </Typography>
                  </Box>

                  <Divider
                    sx={{ my: 1, borderColor: "divider", opacity: 0.6 }}
                  />

                  <Box sx={getSummaryBoxStyles(mode)}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        color: "text.primary",
                      }}
                    >
                      Total Monthly Billing
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "primary.main",
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "1.05rem",
                      }}
                    >
                      Rs.{" "}
                      {data.monthlyFeesSummary.collected +
                        data.monthlyFeesSummary.pending}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
};
