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
import {
  sendNotification,
  getNotificationLogs,
} from "../services/communicationService";

interface StudentData {
  _id: string; 
  user: {
    name: string;
  };
  parentPhone: string;
  admissionNo: string;
}

interface NotificationLog {
  _id: string;
  sender: {
    name: string;
    role: string;
  };
  recipientPhone: string;
  message: string;
  channel: string;
  status: string;
  createdAt: string;
}

export const Communication: React.FC = () => {
  const { mode } = useCustomTheme();
  const [activeTab, setActiveTab] = useState(0);

  const [students, setStudents] = useState<StudentData[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success",
  );

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<"SMS" | "WhatsApp" | "Email" | "">("");

  const [sendLoading, setSendLoading] = useState(false);

  const loadBaselineData = useCallback(async () => {
    try {
      setLoading(true);
      const resStudents = await getStudents();
      const resLogs = await getNotificationLogs();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setStudents(resStudents.data.filter((s: any) => s.status === "Active"));
      setLogs(resLogs.data);
      setLoading(false);
    } catch {
      setLoading(false);
      setToastSeverity("error");
      setToastMessage("Failed to fetch baseline communication details.");
      setToastOpen(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBaselineData();
  }, [loadBaselineData]);

  const handleStudentChange = (studentId: string) => {
    setSelectedStudentId(studentId);
    const student = students.find((s) => s._id === studentId);
    if (student) {
      setRecipientPhone(student.parentPhone); 
    } else {
      setRecipientPhone("");
    }
  };

  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientPhone || !message || !channel) {
      setToastSeverity("error");
      setToastMessage(
        "Please fill out Recipient Phone, Message, and select Channel!",
      );
      setToastOpen(true);
      return;
    }

    setSendLoading(true);

    setTimeout(async () => {
      try {
        const res = await sendNotification({
          recipientId: selectedStudentId || undefined,
          recipientPhone,
          message,
          channel,
        });

        if (channel === "WhatsApp") {
          let cleanPhone = recipientPhone.replace(/\D/g, "");
          if (cleanPhone.startsWith("0")) {
            cleanPhone = "92" + cleanPhone.substring(1);
          } else if (!cleanPhone.startsWith("92") && cleanPhone.length === 10) {
            cleanPhone = "92" + cleanPhone;
          }
          const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, "_blank");
        }

        setToastSeverity("success");
        setToastMessage(res.message || "Alert notification processed successfully!");
        setToastOpen(true);

        setSelectedStudentId("");
        setRecipientPhone("");
        setMessage("");
        setChannel("");
        setSendLoading(false);
        loadBaselineData(); 
      } catch (err: unknown) {
        setSendLoading(false);
        let msg = "Failed to send alert.";
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
        Communication Module
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
        Send SMS/WhatsApp notifications to parents and track delivery logs.
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
          <Tab label="Send Alert" />
          <Tab label="Communication History Logs" />
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
            "&:hover": {
              transform: "none !important",
              borderColor: mode === "dark" ? "#334155 !important" : "#CBD5E1 !important",
              boxShadow: mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04) !important" : "none !important",
            }
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
              Send SMS / WhatsApp Alert
            </Typography>

            <form onSubmit={handleSendAlert}>
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
                    id="alert-student-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Select Student (Optional)
                  </InputLabel>
                  <Select
                    labelId="alert-student-label"
                    value={selectedStudentId}
                    label="Select Student (Optional)"
                    onChange={(e) => handleStudentChange(e.target.value)}
                    disabled={sendLoading}
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
                      value=""
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      None (Type Custom Number)
                    </MenuItem>
                    {students.map((st) => (
                      <MenuItem
                        key={st._id}
                        value={st._id}
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          fontSize: "13px",
                        }}
                      >
                        {st.user.name} ({st.admissionNo})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Recipient Phone"
                  placeholder="Enter parent mobile number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  disabled={sendLoading}
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

                <FormControl size="small" fullWidth>
                  <InputLabel
                    id="alert-channel-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Select Channel
                  </InputLabel>
                  <Select
                    labelId="alert-channel-label"
                    value={channel}
                    label="Select Channel"
                    onChange={(e) =>
                      setChannel(
                        e.target.value as "SMS" | "WhatsApp" | "Email" | "",
                      )
                    }
                    disabled={sendLoading}
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
                      value="SMS"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      SMS Gateway
                    </MenuItem>
                    <MenuItem
                      value="WhatsApp"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      WhatsApp Gateway
                    </MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Alert Message"
                  placeholder="Enter message details to send"
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={sendLoading}
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
                disabled={sendLoading}
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
                {sendLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Send Alert Notification"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Box>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={28} />
            </Box>
          ) : logs.length === 0 ? (
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
                  borderColor: mode === "dark" ? "#334155 !important" : "#CBD5E1 !important",
                  boxShadow: mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04) !important" : "none !important",
                }
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
                No alert history logs registered in the system yet.
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
                  borderColor: mode === "dark" ? "#334155 !important" : "#CBD5E1 !important",
                  boxShadow: mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04) !important" : "none !important",
                }
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
                  Alerts Delivery History Ledger
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
                            }}
                          >
                            Date
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
                            }}
                          >
                            Channel
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
                            }}
                          >
                            Recipient Phone
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
                            }}
                          >
                            Sender
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
                            }}
                          >
                            Message Details
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
                            }}
                            align="right"
                          >
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {logs.map((log) => (
                          <TableRow
                            key={log._id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              "&:hover": { bgcolor: "action.hover" },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                              }}
                            >
                              {new Date(log.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                              }}
                            >
                              {log.channel}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                              }}
                            >
                              {log.recipientPhone}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                              }}
                            >
                              {log.sender.name} ({log.sender.role.split("_")[0]}
                              )
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
                              {log.message}
                            </TableCell>

                            <TableCell
                              align="right"
                              sx={{ borderBottomColor: "divider" }}
                            >
                              <Typography
                                component="span"
                                sx={{
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  px: 1.5,
                                  py: 0.4,
                                  borderRadius: "4px",
                                  bgcolor:
                                    log.status === "Sent"
                                      ? mode === "light"
                                        ? "rgba(16, 185, 129, 0.08)"
                                        : "rgba(16, 185, 129, 0.15)"
                                      : mode === "light"
                                        ? "rgba(239, 68, 68, 0.08)"
                                        : "rgba(239, 68, 68, 0.15)",
                                  color:
                                    log.status === "Sent"
                                      ? "success.main"
                                      : "error.main",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                }}
                              >
                                {log.status}
                              </Typography>
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
                  {logs.map((log) => (
                    <Card
                      key={log._id}
                      sx={{
                        p: 2,
                        borderRadius: "10px",
                        border:
                          mode === "dark"
                            ? "1px solid #334155"
                            : "1px solid #CBD5E1",
                        borderLeft: "5px solid",
                        borderLeftColor:
                          log.status === "Sent" ? "success.main" : "error.main",
                        boxShadow:
                          mode === "light"
                            ? "0 4px 12px rgba(15, 23, 42, 0.04)"
                            : "none",
                        bgcolor: "background.paper",
                        transition:
                          "transform 0.25s ease, box-shadow 0.25s ease",
                        "&:hover": {
                          transform: "none !important",
                          borderColor: mode === "dark" ? "#334155 !important" : "#CBD5E1 !important",
                          boxShadow: "none !important"
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
                          {new Date(log.createdAt).toLocaleString()}
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
                              log.status === "Sent"
                                ? mode === "light"
                                  ? "rgba(16, 185, 129, 0.08)"
                                  : "rgba(16, 185, 129, 0.15)"
                                : mode === "light"
                                  ? "rgba(239, 68, 68, 0.08)"
                                  : "rgba(239, 68, 68, 0.15)",
                            color:
                              log.status === "Sent"
                                ? "success.main"
                                : "error.main",
                            fontFamily: '"Roboto", "Arial", sans-serif',
                          }}
                        >
                          {log.status}
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
                        Channel: {log.channel}
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
                        To: {log.recipientPhone}
                      </Typography>

                      <Divider
                        sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          color: "text.secondary",
                          fontSize: "12px",
                        }}
                      >
                        {log.message}
                      </Typography>
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
