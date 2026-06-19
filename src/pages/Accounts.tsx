import React, { useState } from "react";
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
  Alert,
  CircularProgress,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useCustomTheme } from "../context/ThemeContext";
import {
  addTransaction,
  getFinancialReport,
} from "../services/accountsService";

interface TransactionRecord {
  _id: string;
  type: "Income" | "Expense";
  category: string;
  amount: number;
  date: string;
  description?: string;
  markedBy: {
    name: string;
    email: string;
    role: string;
  };
}

interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  status: string;
}

export const Accounts: React.FC = () => {
  const { mode } = useCustomTheme();
  const [activeTab, setActiveTab] = useState(0);

  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success",
  );

  const [type, setType] = useState<"Income" | "Expense" | "">("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [addLoading, setAddLoading] = useState(false);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();

    if (!type || !category || !amount) {
      setToastSeverity("error");
      setToastMessage("Please select Type, Category, and enter Amount!");
      setToastOpen(true);
      return;
    }

    setAddLoading(true);

    setTimeout(async () => {
      try {
        await addTransaction({
          type,
          category,
          amount: Number(amount),
          date: date || undefined,
          description: description || undefined,
        });

        setToastSeverity("success");
        setToastMessage(`${type} transaction recorded successfully!`);
        setToastOpen(true);

        setType("");
        setCategory("");
        setAmount("");
        setDescription("");
        setDate(new Date().toISOString().split("T")[0]);
        setAddLoading(false);
      } catch (err: unknown) {
        setAddLoading(false);
        let msg = "Failed to record transaction.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleLoadReport = async () => {
    if (!startDate || !endDate) {
      setToastSeverity("error");
      setToastMessage("Please select both Start Date and End Date!");
      setToastOpen(true);
      return;
    }

    try {
      setReportLoading(true);
      const res = await getFinancialReport(startDate, endDate);
      setTransactions(res.data);
      setSummary(res.summary);
      setReportLoading(false);
    } catch {
      setReportLoading(false);
      setToastSeverity("error");
      setToastMessage("Failed to fetch financial report.");
      setToastOpen(true);
    }
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
        Accounts Management
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, fontSize: "0.925rem", fontFamily: '"Roboto", "Arial", sans-serif' }}
      >
        Record school manual transactions ledger and generate financial
        profit/loss reports.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
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
          <Tab label="Record Transaction" />
          <Tab label="Financial Reports" />
        </Tabs>
      </Box>

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

      {activeTab === 0 && (
        <Card
          sx={{
            borderRadius: "10px",
            bgcolor: "background.paper",
            boxShadow: mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
            border: mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
            maxWidth: 600,
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
              Add Income or Expense Log
            </Typography>

            <form onSubmit={handleAddTransaction}>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 3.5 }}
              >
                <FormControl size="small" fullWidth>
                  <InputLabel
                    id="trans-type-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: 'translate(14px, 11px) scale(1)',
                    }}
                  >
                    Transaction Type
                  </InputLabel>
                  <Select
                    labelId="trans-type-label"
                    value={type}
                    label="Transaction Type"
                    onChange={(e) =>
                      setType(e.target.value as "Income" | "Expense")
                    }
                    disabled={addLoading}
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
                    <MenuItem
                      value="Income"
                      sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}
                    >
                      Income
                    </MenuItem>
                    <MenuItem
                      value="Expense"
                      sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}
                    >
                      Expense
                    </MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Category"
                  placeholder="e.g. Electricity Bill, Canteen Rent, Donations"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={addLoading}
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
                      transform: 'translate(14px, 12px) scale(1)',
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: 'translate(14px, -6px) scale(0.75)',
                    },
                  }}
                />

                <TextField
                  label="Amount (Rs.)"
                  placeholder="Enter total amount"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={addLoading}
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
                      transform: 'translate(14px, 12px) scale(1)',
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: 'translate(14px, -6px) scale(0.75)',
                    },
                  }}
                />

                <TextField
                  type="date"
                  label="Transaction Date"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={addLoading}
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
                      transform: 'translate(14px, 12px) scale(1)',
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: 'translate(14px, -6px) scale(0.75)',
                    },
                  }}
                />

                <TextField
                  label="Description"
                  placeholder="Enter short details of transaction"
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={addLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      py: 1.5,
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={addLoading}
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
                {addLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Record Transaction"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card
            sx={{
              borderRadius: "10px",
              bgcolor: "background.paper",
              boxShadow: mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
              border: mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
              width: "100%",
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
                <TextField
                  type="date"
                  label="Start Date"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
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
                      transform: 'translate(14px, 12px) scale(1)',
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: 'translate(14px, -6px) scale(0.75)',
                    },
                  }}
                />

                <TextField
                  type="date"
                  label="End Date"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
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
                      transform: 'translate(14px, 12px) scale(1)',
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: 'translate(14px, -6px) scale(0.75)',
                    },
                  }}
                />

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLoadReport}
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
                  Generate Report
                </Button>
              </Box>
            </CardContent>
          </Card>

          {reportLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={28} />
            </Box>
          ) : !summary ? (
            <Card
              sx={{
                borderRadius: "10px",
                border: mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
                boxShadow: mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}
              >
                Please select both start date and end date, then click Generate Report above.
              </Typography>
            </Card>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Card
                sx={{
                  borderRadius: "10px",
                  bgcolor: "background.paper",
                  boxShadow: mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
                  borderLeft: "5px solid",
                  borderLeftColor: "primary.main",
                  borderTop: mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
                  borderRight: mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
                  borderBottom: mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
                  maxWidth: 600,
                  width: "100%",
                  p: 1,
                }}
              >
                <CardContent sx={{ p: 2 }}>
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
                    Financial Profit/Loss Statement Summary
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between", px: 1 }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}
                      >
                        Total Income
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "13px",
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          color: "success.main",
                        }}
                      >
                        Rs. {summary.totalIncome}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between", px: 1 }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}
                      >
                        Total Expenses
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "13px",
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          color: "error.main",
                        }}
                      >
                        Rs. {summary.totalExpense}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1, borderColor: "divider", opacity: 0.6 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                        px: 1.5,
                        borderRadius: "8px",
                        bgcolor: mode === "light" ? "rgba(30, 58, 138, 0.03)" : "rgba(96, 165, 250, 0.04)",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          fontSize: "13px",
                          fontFamily: '"Roboto", "Arial", sans-serif',
                        }}
                      >
                        Net Ledger Balance
                      </Typography>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            color:
                              summary.netBalance >= 0
                                ? "success.main"
                                : "error.main",
                            fontSize: "1.05rem",
                          }}
                        >
                          Rs. {summary.netBalance}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            color:
                              summary.netBalance >= 0
                                ? "success.main"
                                : "error.main",
                            textTransform: "capitalize",
                          }}
                        >
                          {summary.status}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card
                sx={{
                  borderRadius: "10px",
                  bgcolor: "background.paper",
                  boxShadow: mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
                  border: mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
                  p: 1,
                  width: "100%",
                  maxWidth: "100%",
                  overflow: "hidden",
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
                    Ledger Transactions History Directory
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
                            <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: "divider" }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: "divider" }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: "divider" }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: "divider" }}>Amount</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: "divider" }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: "divider" }} align="right">Marked By</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {transactions.map((t) => (
                            <TableRow
                              key={t._id}
                              sx={{
                                "&:last-child td, &:last-child th": { border: 0 },
                                "&:hover": { bgcolor: "action.hover" },
                              }}
                            >
                              <TableCell sx={{ fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: "divider" }}>
                                {new Date(t.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell sx={{ borderBottomColor: "divider" }}>
                                <Typography
                                  component="span"
                                  sx={{
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    px: 1.5,
                                    py: 0.4,
                                    borderRadius: "4px",
                                    bgcolor:
                                      t.type === "Income"
                                        ? (mode === "light" ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.15)")
                                        : (mode === "light" ? "rgba(239, 68, 68, 0.08)" : "rgba(239, 68, 68, 0.15)"),
                                    color:
                                      t.type === "Income"
                                        ? "success.main"
                                        : "error.main",
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                  }}
                                >
                                  {t.type}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: "divider" }}>
                                {t.category}
                              </TableCell>
                              <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: "divider" }}>
                                Rs. {t.amount}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: "13px",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  borderBottomColor: "divider",
                                  maxWidth: 200,
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                }}
                              >
                                {t.description}
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  fontSize: "13px",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  borderBottomColor: "divider",
                                }}
                              >
                                {t.markedBy.name} ({t.markedBy.role.split("_")[0]})
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
                    {transactions.map((t) => (
                      <Card
                        key={t._id}
                        sx={{
                          p: 2,
                          borderRadius: "10px",
                          border: mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
                          borderLeft: "5px solid",
                          borderLeftColor: t.type === "Income" ? "success.main" : "error.main",
                          boxShadow: mode === "light" ? "0 4px 12px rgba(15, 23, 42, 0.04)" : "none",
                          bgcolor: "background.paper",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: mode === "light" 
                              ? "0 12px 20px -5px rgba(15, 23, 42, 0.08)" 
                              : "0 4px 20px rgba(96, 165, 250, 0.1)",
                          }
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
                            {new Date(t.date).toLocaleDateString()}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "10px",
                              fontWeight: 750,
                              px: 1,
                              py: 0.2,
                              borderRadius: "4px",
                              bgcolor:
                                t.type === "Income"
                                  ? (mode === "light" ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.15)")
                                  : (mode === "light" ? "rgba(239, 68, 68, 0.08)" : "rgba(239, 68, 68, 0.15)"),
                              color:
                                t.type === "Income"
                                  ? "success.main"
                                  : "error.main",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                            }}
                          >
                            {t.type}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            fontWeight: 750,
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            fontSize: "14px",
                            mb: 0.5,
                            color: "primary.main",
                          }}
                        >
                          Rs. {t.amount}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2,
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          Category: {t.category}
                        </Typography>

                        <Divider sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }} />
                        
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            color: "text.secondary",
                            fontSize: "12px",
                          }}
                        >
                          {t.description}
                        </Typography>
                      </Card>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};