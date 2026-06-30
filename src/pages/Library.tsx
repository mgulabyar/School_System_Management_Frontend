/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { getStudents } from "../services/studentService";
import { getTeachers } from "../services/teacherService";
import {
  addBook,
  getBooks,
  issueBook,
  returnBook,
  getIssuedBooks,
} from "../services/libraryService";

interface BookData {
  _id: string;
  title: string;
  author: string;
  available: number;
}

interface BorrowerData {
  _id: string;
  name: string;
  role: string;
}

interface IssuedBookRecord {
  _id: string;
  book: {
    _id: string;
    title: string;
    author: string;
  };
  borrower: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  dueDate: string;
  issueDate: string;
  status: string;
  fineAmount: number;
}

export const Library: React.FC = () => {
  const { mode } = useCustomTheme();
  const [activeTab, setActiveTab] = useState(0);

  const [books, setBooks] = useState<BookData[]>([]);
  const [borrowers, setBorrowers] = useState<BorrowerData[]>([]);
  const [issuedBooks, setIssuedBooks] = useState<IssuedBookRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success",
  );

  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookIsbn, setBookIsbn] = useState("");
  const [bookQty, setBookQty] = useState("");
  const [bookRackNo, setBookRackNo] = useState("");

  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedBorrowerId, setSelectedBorrowerId] = useState("");
  const [issueDueDate, setIssueDueDate] = useState("");

  const [addBookLoading, setAddBookLoading] = useState(false);
  const [issueLoading, setIssueLoading] = useState(false);
  const [returnLoadingId, setReturnLoadingId] = useState<string | null>(null);

  const loadBaselineData = useCallback(async () => {
    try {
      setLoading(true);
      const resBooks = await getBooks();
      const resStudents = await getStudents();
      const resTeachers = await getTeachers();
      const resIssued = await getIssuedBooks();

      setBooks(resBooks.data);
      setIssuedBooks(resIssued.data);

      const activeStudents = resStudents.data
        .filter((s: any) => s.status === "Active")
        .map((s: any) => ({
          _id: s.user._id,
          name: s.user.name,
          role: "Student",
        }));

      const activeTeachers = resTeachers.data
        .filter((t: any) => t.status === "Active")
        .map((t: any) => ({
          _id: t.user._id,
          name: t.user.name,
          role: "Teacher",
        }));

      setBorrowers([...activeStudents, ...activeTeachers]);
      setLoading(false);
    } catch {
      setLoading(false);
      setToastSeverity("error");
      setToastMessage("Failed to fetch baseline library details.");
      setToastOpen(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBaselineData();
  }, [loadBaselineData]);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookTitle || !bookAuthor || !bookQty) {
      setToastSeverity("error");
      setToastMessage("Please enter Book Title, Author, and Quantity!");
      setToastOpen(true);
      return;
    }

    setAddBookLoading(true);

    setTimeout(async () => {
      try {
        await addBook({
          title: bookTitle,
          author: bookAuthor,
          isbn: bookIsbn || undefined,
          quantity: Number(bookQty),
          rackNo: bookRackNo || undefined,
        });

        setToastSeverity("success");
        setToastMessage("Book added to library successfully!");
        setToastOpen(true);

        setBookTitle("");
        setBookAuthor("");
        setBookIsbn("");
        setBookQty("");
        setBookRackNo("");
        setAddBookLoading(false);
        loadBaselineData();
      } catch (err: unknown) {
        setAddBookLoading(false);
        let msg = "Failed to add book.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBookId || !selectedBorrowerId || !issueDueDate) {
      setToastSeverity("error");
      setToastMessage("Please select Book, Borrower, and Return Due Date!");
      setToastOpen(true);
      return;
    }

    setIssueLoading(true);

    setTimeout(async () => {
      try {
        await issueBook({
          bookId: selectedBookId,
          borrowerId: selectedBorrowerId,
          dueDate: issueDueDate,
        });

        setToastSeverity("success");
        setToastMessage("Book issued to borrower successfully!");
        setToastOpen(true);

        setSelectedBookId("");
        setSelectedBorrowerId("");
        setIssueDueDate("");
        setIssueLoading(false);
        loadBaselineData();
      } catch (err: unknown) {
        setIssueLoading(false);
        let msg = "Failed to issue book.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleReturnBook = (issueId: string) => {
    setReturnLoadingId(issueId);

    setTimeout(async () => {
      try {
        const res = await returnBook(issueId);
        setToastSeverity("success");
        setToastMessage(res.message || "Book returned successfully!");
        setToastOpen(true);
        setReturnLoadingId(null);
        loadBaselineData();
      } catch (err: unknown) {
        setReturnLoadingId(null);
        let msg = "Failed to return book.";
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
        Library Management
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
        Manage library inventory, issue books, track return timelines, and
        record overdue fines.
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
          <Tab label="Add Book" />
          <Tab label="Issue Book" />
          <Tab label="Issued Books Directory" />
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
            boxShadow:
              mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
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
              Add Book to Inventory
            </Typography>

            <form onSubmit={handleAddBook}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  mb: 3.5,
                }}
              >
                <TextField
                  label="Book Title"
                  placeholder="Enter book title"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  disabled={addBookLoading}
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
                  label="Author"
                  placeholder="Enter author name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  disabled={addBookLoading}
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
                  label="ISBN Number"
                  placeholder="Enter standard ISBN"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={bookIsbn}
                  onChange={(e) => setBookIsbn(e.target.value)}
                  disabled={addBookLoading}
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
                  label="Quantity"
                  placeholder="Enter total stock quantity"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={bookQty}
                  onChange={(e) => setBookQty(e.target.value)}
                  disabled={addBookLoading}
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
                  label="Rack Number"
                  placeholder="Enter shelf or rack position"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={bookRackNo}
                  onChange={(e) => setBookRackNo(e.target.value)}
                  disabled={addBookLoading}
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
                disabled={addBookLoading}
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
                {addBookLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Add Book"
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
              Issue Book to Borrower
            </Typography>

            <form onSubmit={handleIssueBook}>
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
                    id="issue-book-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Select Book
                  </InputLabel>
                  <Select
                    labelId="issue-book-label"
                    value={selectedBookId}
                    label="Select Book"
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    disabled={issueLoading}
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
                    {books
                      .filter((b) => b.available > 0)
                      .map((b) => (
                        <MenuItem
                          key={b._id}
                          value={b._id}
                          sx={{
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            fontSize: "13px",
                          }}
                        >
                          {b.title} ({b.available} available)
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel
                    id="issue-borrower-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Select Borrower
                  </InputLabel>
                  <Select
                    labelId="issue-borrower-label"
                    value={selectedBorrowerId}
                    label="Select Borrower"
                    onChange={(e) => setSelectedBorrowerId(e.target.value)}
                    disabled={issueLoading}
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
                    {borrowers.map((borr) => (
                      <MenuItem
                        key={borr._id}
                        value={borr._id}
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          fontSize: "13px",
                        }}
                      >
                        {borr.name} ({borr.role})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  type="date"
                  label="Return Due Date"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={issueDueDate}
                  onChange={(e) => setIssueDueDate(e.target.value)}
                  disabled={issueLoading}
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
                disabled={issueLoading}
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
                {issueLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Issue Book"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Box>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={28} />
            </Box>
          ) : issuedBooks.length === 0 ? (
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
                No books currently issued out to students or staff.
              </Typography>
            </Card>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Card
                  sx={{
                    borderRadius: "10px",
                    bgcolor: "background.paper",
                    boxShadow:
                      mode === "light"
                        ? "0 1px 3px rgba(15, 23, 42, 0.04)"
                        : "none",
                    border:
                      mode === "dark"
                        ? "1px solid #334155"
                        : "1px solid #CBD5E1",
                    p: 1,
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
                      Issued Books Directory
                    </Typography>
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{ bgcolor: "transparent" }}
                    >
                      <Table sx={{ minWidth: 800 }}>
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
                              Book Title
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
                              Borrower
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
                              Role
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
                              Issue Date
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
                              Due Date
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
                          {issuedBooks.map((record) => (
                            <TableRow
                              key={record._id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                                "&:hover": { bgcolor: "action.hover" },
                              }}
                            >
                              <TableCell
                                sx={{
                                  px: 2,
                                  borderBottomColor: "divider",
                                  maxWidth: 150,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <Typography
                                  noWrap
                                  sx={{
                                    fontWeight: 600,
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    fontSize: "13px",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    maxWidth: 150,
                                  }}
                                >
                                  {record.book.title}
                                </Typography>
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
                                {record.borrower.name}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: "12px",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  textTransform: "uppercase",
                                  borderBottomColor: "divider",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {record.borrower.role}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: "13px",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  borderBottomColor: "divider",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {new Date(
                                  record.issueDate,
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: "13px",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  borderBottomColor: "divider",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {new Date(record.dueDate).toLocaleDateString()}
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
                                  onClick={() => handleReturnBook(record._id)}
                                  disabled={returnLoadingId === record._id}
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    textTransform: "none",
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    minWidth: 60,
                                  }}
                                >
                                  {returnLoadingId === record._id ? (
                                    <CircularProgress
                                      size={14}
                                      color="inherit"
                                    />
                                  ) : (
                                    "Return"
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Box>

              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  flexDirection: "column",
                  gap: 2.5,
                }}
              >
                {issuedBooks.map((record) => (
                  <Card
                    key={record._id}
                    sx={{
                      p: 2,
                      borderRadius: "10px",
                      border:
                        mode === "dark"
                          ? "1px solid #334155"
                          : "1px solid #CBD5E1",
                      borderLeft: "5px solid",
                      borderLeftColor: "primary.main",
                      boxShadow:
                        mode === "light"
                          ? "0 4px 12px rgba(15, 23, 42, 0.04)"
                          : "none",
                      bgcolor: "background.paper",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow:
                          mode === "light"
                            ? "0 12px 20px -5px rgba(15, 23, 42, 0.08)"
                            : "0 4px 20px rgba(96, 165, 250, 0.1)",
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
                        Due: {new Date(record.dueDate).toLocaleDateString()}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "10px",
                          fontWeight: 700,
                          px: 1,
                          py: 0.2,
                          borderRadius: "4px",
                          bgcolor: "action.selected",
                          color: "text.secondary",
                          textTransform: "uppercase",
                          fontFamily: '"Roboto", "Arial", sans-serif',
                        }}
                      >
                        {record.borrower.role}
                      </Typography>
                    </Box>

                    <Typography
                      noWrap
                      sx={{
                        fontWeight: 700,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "14px",
                        mb: 0.5,
                        color: "primary.main",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: "100%",
                      }}
                    >
                      {record.book.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "12px",
                      }}
                    >
                      by {record.book.author}
                    </Typography>

                    <Divider
                      sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }}
                    />

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
                        <strong>Borrower:</strong> {record.borrower.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          color: "text.secondary",
                          fontSize: "12px",
                        }}
                      >
                        <strong>Issue Date:</strong>{" "}
                        {new Date(record.issueDate).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Divider
                      sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleReturnBook(record._id)}
                        disabled={returnLoadingId === record._id}
                        sx={{
                          fontWeight: 600,
                          fontSize: "12px",
                          textTransform: "none",
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          height: 30,
                          borderRadius: "6px",
                          minWidth: 70,
                          borderWidth: "1px",
                          "&:hover": {
                            borderWidth: "1px",
                            bgcolor: "rgba(30, 58, 138, 0.04)",
                          },
                        }}
                      >
                        {returnLoadingId === record._id ? (
                          <CircularProgress size={14} color="inherit" />
                        ) : (
                          "Return"
                        )}
                      </Button>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
