import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useCustomTheme } from "../context/ThemeContext";
import { getClasses } from "../services/academicService";
import {
  setupFeeStructure,
  generateMonthlyFees,
  getDefaultersList,
  collectFee,
  voidInvoice,
} from "../services/feeService";
// ../../services./feesServices
interface Section {
  _id: string;
  name: string;
}

interface ClassData {
  _id: string;
  name: string;
  sections: Section[];
}

interface DefaulterData {
  _id: string;
  student: {
    user: {
      name: string;
      email: string;
    };
    admissionNo: string;
    rollNo: string;
  };
  class: {
    name: string;
  };
  month: string;
  tuitionFee: number;
  otherCharges: number;
  totalAmount: number;
  status: string;
}

export const Fees: React.FC = () => {
  const { mode } = useCustomTheme();
  const [activeTab, setActiveTab] = useState(0);

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [defaulters, setDefaulters] = useState<DefaulterData[]>([]);
  const [, setLoading] = useState(true);
  const [defaultersLoading, setDefaultersLoading] = useState(false);

  const [, setToastOpen] = useState(false);
  const [, setToastMessage] = useState("");
  const [, setToastSeverity] = useState<"success" | "error">("success");

  const [structClassId, setStructClassId] = useState("");
  const [tuitionFee, setTuitionFee] = useState("");
  const [admissionFee, setAdmissionFee] = useState("");
  const [otherCharges, setOtherCharges] = useState("");

  const [genClassId, setGenClassId] = useState("");
  const [genMonth, setGenMonth] = useState("");

  const [filterClassId, setFilterClassId] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const [structLoading, setStructLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [collectLoadingId, setCollectLoadingId] = useState<string | null>(null);
  const [voidLoadingId, setVoidLoadingId] = useState<string | null>(null);

  const fetchBaselineClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getClasses();
      setClasses(res.data);
      setLoading(false);
    } catch {
      setLoading(false);
      setToastSeverity("error");
      setToastMessage("Failed to fetch baseline classes list.");
      setToastOpen(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBaselineClasses();
  }, [fetchBaselineClasses]);

  const handleSetupStructure = (e: React.FormEvent) => {
    e.preventDefault();

    if (!structClassId || !tuitionFee || !admissionFee || !otherCharges) {
      setToastSeverity("error");
      setToastMessage("Please fill out all fields in the Structure Form!");
      setToastOpen(true);
      return;
    }

    setStructLoading(true);

    setTimeout(async () => {
      try {
        await setupFeeStructure({
          classId: structClassId,
          tuitionFee: Number(tuitionFee),
          admissionFee: Number(admissionFee),
          otherCharges: Number(otherCharges),
        });

        setToastSeverity("success");
        setToastMessage("Class Fee Structure configured successfully!");
        setToastOpen(true);

        setStructClassId("");
        setTuitionFee("");
        setAdmissionFee("");
        setOtherCharges("");
        setStructLoading(false);
      } catch (err: unknown) {
        setStructLoading(false);
        let msg = "Failed to setup structure.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleGenerateInvoices = (e: React.FormEvent) => {
    e.preventDefault();

    if (!genClassId || !genMonth) {
      setToastSeverity("error");
      setToastMessage("Please select both Class and Month to generate bills!");
      setToastOpen(true);
      return;
    }

    setGenLoading(true);

    setTimeout(async () => {
      try {
        const res = await generateMonthlyFees(genClassId, genMonth);
        setToastSeverity("success");
        setToastMessage(res.message || "Fee invoices generated successfully!");
        setToastOpen(true);

        setGenClassId("");
        setGenMonth("");
        setGenLoading(false);
      } catch (err: unknown) {
        setGenLoading(false);
        let msg = "Failed to generate monthly fees.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleLoadDefaulters = async () => {
    if (!filterClassId || !filterMonth) {
      setToastSeverity("error");
      setToastMessage("Please select Class and Month to search bills!");
      setToastOpen(true);
      return;
    }

    try {
      setDefaultersLoading(true);
      const res = await getDefaultersList(filterClassId, filterMonth);
      setDefaulters(res.data);
      setDefaultersLoading(false);
    } catch {
      setDefaultersLoading(false);
      setToastSeverity("error");
      setToastMessage("Failed to fetch unpaid invoices.");
      setToastOpen(true);
    }
  };

  const handleCollectFee = (invoiceId: string) => {
    setCollectLoadingId(invoiceId);

    setTimeout(async () => {
      try {
        await collectFee(invoiceId);
        setToastSeverity("success");
        setToastMessage("Fee payment collected and logged successfully!");
        setToastOpen(true);
        setCollectLoadingId(null);
        handleLoadDefaulters();
      } catch (err: unknown) {
        setCollectLoadingId(null);
        let msg = "Failed to collect payment.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleVoidInvoice = (invoiceId: string) => {
    setVoidLoadingId(invoiceId);

    setTimeout(async () => {
      try {
        await voidInvoice(invoiceId);
        setToastSeverity("success");
        setToastMessage("Invoice cancelled and deleted successfully!");
        setToastOpen(true);
        setVoidLoadingId(null);
        handleLoadDefaulters();
      } catch (err: unknown) {
        setVoidLoadingId(null);
        let msg = "Failed to void invoice.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

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
      <Typography
        variant="h1"
        color="primary"
        sx={{
          mb: 1,
          fontSize: "1.65rem",
          fontWeight: 800,
          fontFamily: '"Roboto", "Arial", sans-serif',
          letterSpacing: "-0.01em",
        }}
      >
        Fee Management
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mb: 4,
          fontSize: "0.925rem",
          fontFamily: '"Roboto", "Arial", sans-serif',
        }}
      >
        Manage class fee structures, bulk generate monthly slips, and collect
        payments.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: "40px",
            "& .MuiTab-root": {
              minHeight: "40px",
              fontSize: "13px",
              fontWeight: 500,
              fontFamily: '"Roboto", "Arial", sans-serif',
              textTransform: "none",
              padding: "6px 16px",
            },
          }}
        >
          <Tab label="Fee Structure Setup" />
          <Tab label="Generate Monthly Slips" />
          <Tab label="Collection & Defaulters Board" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Card
          sx={{
            borderRadius: "10px",
            bgcolor: "background.paper",
            boxShadow:
              mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
            border: mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
            maxWidth: 600,
            "&:hover": {
              transform: "none !important",
              borderColor:
                mode === "dark" ? "#334155 !important" : "#CBD5E1 !important",
              boxShadow:
                mode === "light"
                  ? "0 1px 3px rgba(15, 23, 42, 0.04) !important"
                  : "none !important",
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: 700,
                fontSize: "14px",
                mb: 3,
                fontFamily: '"Roboto", "Arial", sans-serif',
              }}
            >
              Configure Class Fee Structure
            </Typography>

            <form onSubmit={handleSetupStructure}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  mb: 3.5,
                }}
              >
                <FormControl size="small" fullWidth>
                  <InputLabel
                    id="struct-class-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Select Class
                  </InputLabel>
                  <Select
                    labelId="struct-class-label"
                    value={structClassId}
                    label="Select Class"
                    onChange={(e) => setStructClassId(e.target.value)}
                    disabled={structLoading}
                    sx={{
                      height: 42,
                      borderRadius: "8px",
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      "& .MuiSelect-select": {
                        paddingTop: "11px",
                        paddingBottom: "11px",
                      },
                    }}
                  >
                    {classes.map((cls) => (
                      <MenuItem
                        key={cls._id}
                        value={cls._id}
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          fontSize: "13px",
                        }}
                      >
                        {cls.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Monthly Tuition Fee (Rs.)"
                  placeholder="Enter monthly tuition fee amount"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={tuitionFee}
                  onChange={(e) => setTuitionFee(e.target.value)}
                  disabled={structLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 42,
                      borderRadius: "8px",
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 12px) scale(1)",
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: "translate(14px, -6px) scale(0.75)",
                    },
                  }}
                />

                <TextField
                  label="One-Time Admission Fee (Rs.)"
                  placeholder="Enter standard admission fee amount"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={admissionFee}
                  onChange={(e) => setAdmissionFee(e.target.value)}
                  disabled={structLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 42,
                      borderRadius: "8px",
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 12px) scale(1)",
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: "translate(14px, -6px) scale(0.75)",
                    },
                  }}
                />

                <TextField
                  label="Other Monthly Charges (Rs.)"
                  placeholder="Enter other monthly utility charges"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={otherCharges}
                  onChange={(e) => setOtherCharges(e.target.value)}
                  disabled={structLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 42,
                      borderRadius: "8px",
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 12px) scale(1)",
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: "translate(14px, -6px) scale(0.75)",
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={structLoading}
                sx={{
                  height: 42,
                  fontSize: "13px",
                  borderRadius: "8px",
                  textTransform: "none",
                  boxShadow: "none",
                  fontWeight: 600,
                  fontFamily: '"Roboto", "Arial", sans-serif',
                }}
              >
                {structLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Configure Fee Structure"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Card
          sx={{
            borderRadius: "10px",
            bgcolor: "background.paper",
            boxShadow:
              mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
            border: mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
            maxWidth: 500,
            "&:hover": {
              transform: "none !important",
              borderColor:
                mode === "dark" ? "#334155 !important" : "#CBD5E1 !important",
              boxShadow:
                mode === "light"
                  ? "0 1px 3px rgba(15, 23, 42, 0.04) !important"
                  : "none !important",
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: 700,
                fontSize: "14px",
                mb: 3,
                fontFamily: '"Roboto", "Arial", sans-serif',
              }}
            >
              Bulk Generate Monthly Fee Slips
            </Typography>

            <form onSubmit={handleGenerateInvoices}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  mb: 3.5,
                }}
              >
                <FormControl size="small" fullWidth>
                  <InputLabel
                    id="gen-class-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Select Class
                  </InputLabel>
                  <Select
                    labelId="gen-class-label"
                    value={genClassId}
                    label="Select Class"
                    onChange={(e) => setGenClassId(e.target.value)}
                    disabled={genLoading}
                    sx={{
                      height: 42,
                      borderRadius: "8px",
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      "& .MuiSelect-select": {
                        paddingTop: "11px",
                        paddingBottom: "11px",
                      },
                    }}
                  >
                    {classes.map((cls) => (
                      <MenuItem
                        key={cls._id}
                        value={cls._id}
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          fontSize: "13px",
                        }}
                      >
                        {cls.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  type="date"
                  label="Select Billing Month"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={genMonth}
                  onChange={(e) => setGenMonth(e.target.value)}
                  disabled={genLoading}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 42,
                      borderRadius: "8px",
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 12px) scale(1)",
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: "translate(14px, -6px) scale(0.75)",
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                disabled={genLoading}
                sx={{
                  height: 42,
                  fontSize: "13px",
                  borderRadius: "8px",
                  textTransform: "none",
                  boxShadow: "none",
                  fontWeight: 600,
                  fontFamily: '"Roboto", "Arial", sans-serif',
                }}
              >
                {genLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Generate Fee Slips"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card
            sx={{
              borderRadius: "10px",
              bgcolor: "background.paper",
              boxShadow:
                mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
              border:
                mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
              width: "100%",
              "&:hover": {
                transform: "none !important",
                borderColor:
                  mode === "dark" ? "#334155 !important" : "#CBD5E1 !important",
                boxShadow:
                  mode === "light"
                    ? "0 1px 3px rgba(15, 23, 42, 0.04) !important"
                    : "none !important",
              },
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1.5fr 1.5fr 1fr",
                  },
                  gap: 2,
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <FormControl size="small" fullWidth>
                  <InputLabel
                    id="filter-class-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Class
                  </InputLabel>
                  <Select
                    labelId="filter-class-label"
                    value={filterClassId}
                    label="Class"
                    onChange={(e) => setFilterClassId(e.target.value)}
                    sx={{
                      height: 42,
                      borderRadius: "8px",
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      "& .MuiSelect-select": {
                        paddingTop: "11px",
                        paddingBottom: "11px",
                      },
                    }}
                  >
                    {classes.map((cls) => (
                      <MenuItem
                        key={cls._id}
                        value={cls._id}
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          fontSize: "13px",
                        }}
                      >
                        {cls.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  type="date"
                  label="Target Month"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 42,
                      borderRadius: "8px",
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 12px) scale(1)",
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: "translate(14px, -6px) scale(0.75)",
                    },
                  }}
                />

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLoadDefaulters}
                  fullWidth
                  sx={{
                    height: 42,
                    fontSize: "13px",
                    borderRadius: "8px",
                    textTransform: "none",
                    boxShadow: "none",
                    fontWeight: 600,
                    fontFamily: '"Roboto", "Arial", sans-serif',
                  }}
                >
                  Search Defaulters
                </Button>
              </Box>
            </CardContent>
          </Card>

          {defaultersLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={28} />
            </Box>
          ) : defaulters.length === 0 ? (
            <Card
              sx={{
                borderRadius: "10px",
                border:
                  mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
                boxShadow:
                  mode === "light"
                    ? "0 1px 3px rgba(15, 23, 42, 0.04)"
                    : "none",
                p: 4,
                textAlign: "center",
                "&:hover": {
                  transform: "none !important",
                  borderColor:
                    mode === "dark"
                      ? "#334155 !important"
                      : "#CBD5E1 !important",
                  boxShadow:
                    mode === "light"
                      ? "0 1px 3px rgba(15, 23, 42, 0.04) !important"
                      : "none !important",
                },
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontFamily: '"Roboto", "Arial", sans-serif',
                  fontSize: "13px",
                }}
              >
                Please select class and month, then click Search Defaulters
                above.
              </Typography>
            </Card>
          ) : (
            <Card
              sx={{
                borderRadius: "10px",
                bgcolor: "background.paper",
                boxShadow:
                  mode === "light"
                    ? "0 1px 3px rgba(15, 23, 42, 0.04)"
                    : "none",
                border:
                  mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
                p: 1,
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
                "&:hover": {
                  transform: "none !important",
                  borderColor:
                    mode === "dark"
                      ? "#334155 !important"
                      : "#CBD5E1 !important",
                  boxShadow:
                    mode === "light"
                      ? "0 1px 3px rgba(15, 23, 42, 0.04) !important"
                      : "none !important",
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    fontWeight: 700,
                    fontSize: "14px",
                    p: 2,
                    fontFamily: '"Roboto", "Arial", sans-serif',
                  }}
                >
                  Unpaid Invoices Ledger
                </Typography>

                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ bgcolor: "transparent" }}
                  >
                    <Table sx={{ minWidth: 700 }}>
                      <TableHead sx={{ bgcolor: "action.hover" }}>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Admission No
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Student Name
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Billing Month
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Tuition Fee
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Total Bill
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Status
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
                              whiteSpace: "nowrap",
                            }}
                            align="right"
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {defaulters.map((inv) => (
                          <TableRow
                            key={inv._id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              "&:hover": { bgcolor: "action.hover" },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {inv.student.admissionNo}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {inv.student.user.name}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {new Date(inv.month).toLocaleDateString(
                                undefined,
                                { month: "long", year: "numeric" },
                              )}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Rs. {inv.tuitionFee}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Rs. {inv.totalAmount}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottomColor: "divider",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Typography
                                component="span"
                                sx={{
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  px: 1.5,
                                  py: 0.4,
                                  borderRadius: "4px",
                                  bgcolor: "rgba(239, 68, 68, 0.08)",
                                  color: "error.main",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                }}
                              >
                                {inv.status}
                              </Typography>
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                borderBottomColor: "divider",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Button
                                size="small"
                                variant="text"
                                color="primary"
                                onClick={() => handleCollectFee(inv._id)}
                                disabled={
                                  collectLoadingId === inv._id ||
                                  voidLoadingId === inv._id
                                }
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  textTransform: "none",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  mr: 2,
                                  minWidth: "auto",
                                  padding: 0,
                                  "&:hover": {
                                    backgroundColor: "transparent !important",
                                    color: "primary.dark",
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                {collectLoadingId === inv._id ? (
                                  <CircularProgress size={14} color="inherit" />
                                ) : (
                                  "Collect"
                                )}
                              </Button>
                              <Button
                                size="small"
                                variant="text"
                                color="error"
                                onClick={() => handleVoidInvoice(inv._id)}
                                disabled={
                                  collectLoadingId === inv._id ||
                                  voidLoadingId === inv._id
                                }
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  textTransform: "none",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  minWidth: "auto",
                                  padding: 0,
                                  "&:hover": {
                                    backgroundColor: "transparent !important",
                                    color: "error.dark",
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                {voidLoadingId === inv._id ? (
                                  <CircularProgress size={14} color="inherit" />
                                ) : (
                                  "Void"
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Box
                  sx={{
                    display: { xs: "flex", md: "none" },
                    flexDirection: "column",
                    gap: 2.5,
                    p: 2,
                  }}
                >
                  {defaulters.map((inv) => (
                    <Card
                      key={inv._id}
                      sx={{
                        p: 2,
                        borderRadius: "10px",
                        border:
                          mode === "dark"
                            ? "1px solid #334155"
                            : "1px solid #CBD5E1",
                        borderLeft: "5px solid",
                        borderLeftColor: "error.main",
                        boxShadow:
                          mode === "light"
                            ? "0 4px 12px rgba(15, 23, 42, 0.04)"
                            : "none",
                        bgcolor: "background.paper",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "none !important",
                          borderColor:
                            mode === "dark"
                              ? "#334155 !important"
                              : "#CBD5E1 !important",
                          boxShadow: "none !important",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "11px",
                            fontWeight: 700,
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            color: "text.secondary",
                          }}
                        >
                          {inv.student.admissionNo}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "10px",
                            fontWeight: 750,
                            px: 1,
                            py: 0.2,
                            borderRadius: "4px",
                            bgcolor: "rgba(239, 68, 68, 0.08)",
                            color: "error.main",
                            fontFamily: '"Roboto", "Arial", sans-serif',
                          }}
                        >
                          {inv.status}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          fontWeight: 750,
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          fontSize: "14px",
                          mb: 1.5,
                          color: "primary.main",
                        }}
                      >
                        {inv.student.user.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.8,
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            color: "text.secondary",
                            fontSize: "12px",
                          }}
                        >
                          <strong>Billing Month:</strong>{" "}
                          {new Date(inv.month).toLocaleDateString(undefined, {
                            month: "long",
                            year: "numeric",
                          })}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            color: "text.secondary",
                            fontSize: "12px",
                          }}
                        >
                          <strong>Tuition Fee:</strong> Rs. {inv.tuitionFee}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            color: "text.secondary",
                            fontSize: "12px",
                          }}
                        >
                          <strong>Total Bill:</strong> Rs. {inv.totalAmount}
                        </Typography>
                      </Box>

                      <Divider
                        sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1.5,
                        }}
                      >
                        <Button
                          size="small"
                          variant="text"
                          color="primary"
                          onClick={() => handleCollectFee(inv._id)}
                          disabled={
                            collectLoadingId === inv._id ||
                            voidLoadingId === inv._id
                          }
                          sx={{
                            fontWeight: 600,
                            fontSize: "12px",
                            textTransform: "none",
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            minWidth: "auto",
                            padding: 0,
                            "&:hover": {
                              backgroundColor: "transparent !important",
                              color: "primary.dark",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {collectLoadingId === inv._id ? (
                            <CircularProgress size={14} color="inherit" />
                          ) : (
                            "Collect"
                          )}
                        </Button>
                        <Button
                          size="small"
                          variant="text"
                          color="error"
                          onClick={() => handleVoidInvoice(inv._id)}
                          disabled={
                            collectLoadingId === inv._id ||
                            voidLoadingId === inv._id
                          }
                          sx={{
                            fontWeight: 600,
                            fontSize: "12px",
                            textTransform: "none",
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            minWidth: "auto",
                            padding: 0,
                            "&:hover": {
                              backgroundColor: "transparent !important",
                              color: "error.dark",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {voidLoadingId === inv._id ? (
                            <CircularProgress size={14} color="inherit" />
                          ) : (
                            "Void"
                          )}
                        </Button>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};
