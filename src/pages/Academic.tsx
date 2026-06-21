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
import {
  getClasses,
  createSection,
  createClass,
  createSubject,
  getSubjectsByClass,
  deleteClass,
  deleteSubject,
} from "../services/academicService";

interface Section {
  _id: string;
  name: string;
}

interface ClassData {
  _id: string;
  name: string;
  sections: Section[];
}

interface SubjectData {
  _id: string;
  name: string;
  code: string;
  class: {
    _id: string;
    name: string;
  };
}

/// asfand sab
export const Academic: React.FC = () => {
  const { mode } = useCustomTheme();
  const [activeTab, setActiveTab] = useState(0);

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success",
  );

  const setError = useCallback((message: string) => {
    setToastSeverity("error");
    setToastMessage(message);
    setToastOpen(true);
  }, []);

  const setSuccess = useCallback((message: string) => {
    setToastSeverity("success");
    setToastMessage(message);
    setToastOpen(true);
  }, []);

  const [sectionName, setSectionName] = useState("");
  const [className, setClassName] = useState("");

  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectClassId, setSubjectClassId] = useState("");
  const [selectedClassFilter, setSelectedClassFilter] = useState("");

  const [sectionLoading, setSectionLoading] = useState(false);
  const [classLoading, setClassLoading] = useState(false);
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [classDeleteLoadingId, setClassDeleteLoadingId] = useState<
    string | null
  >(null);
  const [subjectDeleteLoadingId, setSubjectDeleteLoadingId] = useState<
    string | null
  >(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getClasses();
      setClasses(res.data);
      setLoading(false);
    } catch (err: unknown) {
      setLoading(false);
      setError("Failed to fetch classes from server.");

      console.error("--- ACADEMIC PAGE FETCH CLASSES FAILED ---");
      console.error(err);
      console.error("-----------------------------------------");
    }
  }, [setError]);

  const fetchSubjects = useCallback(
    async (classId: string) => {
      if (!classId) return;
      try {
        setSubjectsLoading(true);
        const res = await getSubjectsByClass(classId);
        setSubjects(res.data);
        setSubjectsLoading(false);
      } catch (err: unknown) {
        setSubjectsLoading(false);
        setError("Failed to fetch subjects for this class.");
        console.error("fetchSubjects error details:", err);
      }
    },
    [setError],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClasses();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchClasses]);

  useEffect(() => {
    if (selectedClassFilter) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchSubjects(selectedClassFilter);
    } else {
      setSubjects([]);
    }
  }, [selectedClassFilter, fetchSubjects]);

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sectionName) {
      setError("Section name is required!");
      return;
    }

    setSectionLoading(true);

    setTimeout(async () => {
      try {
        await createSection(sectionName);
        setSuccess("Section created successfully!");
        setSectionName("");
        setSectionLoading(false);
        fetchClasses();
      } catch (err: unknown) {
        setSectionLoading(false);
        let msg = "Failed to create section.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setError(msg);
      }
    }, 2000);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();

    if (!className) {
      setError("Class name is required!");
      return;
    }

    setClassLoading(true);

    setTimeout(async () => {
      try {
        await createClass(className, []);
        setSuccess("Class created successfully!");
        setClassName("");
        setClassLoading(false);
        fetchClasses();
      } catch (err: unknown) {
        setClassLoading(false);
        let msg = "Failed to create class.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setError(msg);
      }
    }, 2000);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subjectName || !subjectCode || !subjectClassId) {
      setError("All fields are required to create a subject!");
      return;
    }

    setSubjectLoading(true);

    setTimeout(async () => {
      try {
        await createSubject(subjectName, subjectCode, subjectClassId);
        setSuccess("Subject created successfully and linked to Class!");
        setSubjectName("");
        setSubjectCode("");
        setSubjectClassId("");
        setSubjectLoading(false);

        if (selectedClassFilter === subjectClassId) {
          fetchSubjects(selectedClassFilter);
        }
      } catch (err: unknown) {
        setSubjectLoading(false);
        let msg = "Failed to create subject.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setError(msg);
      }
    }, 2000);
  };

  const handleDeleteClass = (classId: string) => {
    setClassDeleteLoadingId(classId);

    setTimeout(async () => {
      try {
        const res = await deleteClass(classId);
        setSuccess(res.message || "Class deleted successfully!");
        setClassDeleteLoadingId(null);
        fetchClasses();
      } catch (err: unknown) {
        setClassDeleteLoadingId(null);
        let msg = "Failed to delete class.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setError(msg);
        console.error("Delete Class error details:", err);
      }
    }, 2000);
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjectDeleteLoadingId(subjectId);

    setTimeout(async () => {
      try {
        const res = await deleteSubject(subjectId);
        setSuccess(res.message || "Subject deleted successfully!");
        setSubjectDeleteLoadingId(null);
        if (selectedClassFilter) {
          fetchSubjects(selectedClassFilter);
        }
      } catch (err: unknown) {
        setSubjectDeleteLoadingId(null);
        let msg = "Failed to delete subject.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setError(msg);
        console.error("Delete Subject error details:", err);
      }
    }, 2000);
  };

  return (
   <Box
      sx={{
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
        Academic Management
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
        Manage classes, sections, and subjects from here.
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
          <Tab label="Classes & Sections" />
          <Tab label="Subjects" />
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

      {activeTab === 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr", lg: "320px 1fr" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Card
              sx={{
                borderRadius: "10px",
                bgcolor: "background.paper",
                boxShadow:
                  mode === "light"
                    ? "0 1px 3px rgba(15, 23, 42, 0.04)"
                    : "none",
                border:
                  mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    fontWeight: 700,
                    fontSize: "14px",
                    mb: 2,
                    fontFamily: '"Roboto", "Arial", sans-serif',
                  }}
                >
                  Create Section
                </Typography>
                <form onSubmit={handleCreateSection}>
                  <TextField
                    label="Section Name"
                    placeholder="Enter section name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    disabled={sectionLoading}
                    sx={{
                      mb: 2,
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
                    type="submit"
                    variant="contained"
                    color="secondary"
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
                    {sectionLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      "Add Section"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: "10px",
                bgcolor: "background.paper",
                boxShadow:
                  mode === "light"
                    ? "0 1px 3px rgba(15, 23, 42, 0.04)"
                    : "none",
                border:
                  mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    fontWeight: 700,
                    fontSize: "14px",
                    mb: 2,
                    fontFamily: '"Roboto", "Arial", sans-serif',
                  }}
                >
                  Create Class
                </Typography>
                <form onSubmit={handleCreateClass}>
                  <TextField
                    label="Class Name"
                    placeholder="Enter class name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    disabled={classLoading}
                    sx={{
                      mb: 2,
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
                    type="submit"
                    variant="contained"
                    color="primary"
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
                    {classLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      "Add Class"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Box>

          <Card
            sx={{
              borderRadius: "10px",
              bgcolor: "background.paper",
              boxShadow:
                mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
              border:
                mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
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
                Classes & Assigned Sections
              </Typography>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : (
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{ bgcolor: "transparent" }}
                >
                  <Table sx={{ minWidth: 400 }}>
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
                          Class Name
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            fontSize: "13px",
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            borderBottomColor: "divider",
                          }}
                        >
                          Assigned Sections
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
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {classes.map((c) => (
                        <TableRow
                          key={c._id}
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
                            }}
                          >
                            {c.name}
                          </TableCell>
                          <TableCell sx={{ borderBottomColor: "divider" }}>
                            {c.sections.length > 0 ? (
                              <Typography
                                component="span"
                                sx={{
                                  fontSize: "13px",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  color: "text.primary",
                                }}
                              >
                                {c.sections.map((s) => s.name).join(", ")}
                              </Typography>
                            ) : (
                              <Typography
                                component="span"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "12px",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                }}
                              >
                                No sections linked
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ borderBottomColor: "divider" }}
                          >
                            <Button
                              size="small"
                              variant="text"
                              color="error"
                              onClick={() => handleDeleteClass(c._id)}
                              disabled={classDeleteLoadingId === c._id}
                              sx={{
                                fontWeight: 600,
                                fontSize: "12px",
                                textTransform: "none",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                minWidth: 60,
                              }}
                            >
                              {classDeleteLoadingId === c._id ? (
                                <CircularProgress size={14} color="inherit" />
                              ) : (
                                "Delete"
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr", lg: "320px 1fr" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Card
            sx={{
              borderRadius: "10px",
              bgcolor: "background.paper",
              boxShadow:
                mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
              border:
                mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography
                variant="h6"
                color="primary"
                sx={{
                  fontWeight: 700,
                  fontSize: "14px",
                  mb: 2,
                  fontFamily: '"Roboto", "Arial", sans-serif',
                }}
              >
                Create Subject
              </Typography>
              <form onSubmit={handleCreateSubject}>
                <TextField
                  label="Subject Name"
                  placeholder="Enter subject name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  disabled={subjectLoading}
                  sx={{
                    mb: 2,
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
                  label="Subject Code"
                  placeholder="Enter subject code"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  disabled={subjectLoading}
                  sx={{
                    mb: 2,
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

                <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                  <InputLabel
                    id="class-select-label"
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
                    labelId="class-select-label"
                    value={subjectClassId}
                    label="Select Class"
                    onChange={(e) => setSubjectClassId(e.target.value)}
                    disabled={subjectLoading}
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

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={subjectLoading}
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
                  {subjectLoading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    "Add Subject"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Card
              sx={{
                borderRadius: "10px",
                bgcolor: "background.paper",
                boxShadow:
                  mode === "light"
                    ? "0 1px 3px rgba(15, 23, 42, 0.04)"
                    : "none",
                border:
                  mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
                p: 1,
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: 2,
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontFamily: '"Roboto", "Arial", sans-serif',
                    color: "text.primary",
                    fontSize: "13px",
                  }}
                >
                  Filter Subjects by Class:
                </Typography>
                <FormControl 
                  size="small" 
                  sx={{ 
                    width: { xs: "100%", sm: "auto" }, 
                    minWidth: { xs: "100%", sm: 200 },
                    maxWidth: { xs: "100%", sm: "400px" } 
                  }}
                >
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
                    Select Class
                  </InputLabel>
                  <Select
                    labelId="filter-class-label"
                    value={selectedClassFilter}
                    label="Select Class"
                    onChange={(e) => setSelectedClassFilter(e.target.value)}
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
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: "10px",
                bgcolor: "background.paper",
                boxShadow:
                  mode === "light"
                    ? "0 1px 3px rgba(15, 23, 42, 0.04)"
                    : "none",
                border:
                  mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
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
                  Subjects List
                </Typography>

                {!selectedClassFilter ? (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      Please select a class from the filter dropdown above to
                      view its registered subjects.
                    </Typography>
                  </Box>
                ) : subjectsLoading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 5 }}
                  >
                    <CircularProgress size={28} />
                  </Box>
                ) : subjects.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      No subjects registered for this class yet.
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Box sx={{ display: { xs: "none", md: "block" } }}>
                      <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{ bgcolor: "transparent" }}
                      >
                        <Table sx={{ minWidth: 400 }}>
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
                                Subject Name
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "13px",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  borderBottomColor: "divider",
                                }}
                              >
                                Subject Code
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "13px",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  borderBottomColor: "divider",
                                }}
                              >
                                Class Link
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
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {subjects.map((sub) => (
                              <TableRow
                                key={sub._id}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                  "&:hover": { bgcolor: "action.hover" },
                                }}
                              >
                                <TableCell
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: "13px",
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    borderBottomColor: "divider",
                                  }}
                                >
                                  {sub.name}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontSize: "13px",
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    borderBottomColor: "divider",
                                  }}
                                >
                                  {sub.code}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontSize: "13px",
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    borderBottomColor: "divider",
                                  }}
                                >
                                  {sub.class.name}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ borderBottomColor: "divider" }}
                                >
                                  <Button
                                    size="small"
                                    variant="text"
                                    color="error"
                                    onClick={() => handleDeleteSubject(sub._id)}
                                    disabled={
                                      subjectDeleteLoadingId === sub._id
                                    }
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: "12px",
                                      textTransform: "none",
                                      fontFamily:
                                        '"Roboto", "Arial", sans-serif',
                                      minWidth: 60,
                                    }}
                                  >
                                    {subjectDeleteLoadingId === sub._id ? (
                                      <CircularProgress
                                        size={14}
                                        color="inherit"
                                      />
                                    ) : (
                                      "Delete"
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
                        gap: 2,
                        p: 2,
                      }}
                    >
                      {subjects.map((sub) => (
                        <Card
                          key={sub._id}
                          sx={{
                            p: 2,
                            borderRadius: "10px",
                            border:
                              mode === "dark"
                                ? "1px solid #1F2937"
                                : "1px solid #E2E8F0",
                            boxShadow:
                              mode === "light"
                                ? "0 1px 3px rgba(15, 23, 42, 0.04)"
                                : "none",
                            bgcolor: "background.paper",
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
                              {sub.code}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "12px",
                                fontWeight: 600,
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                color: "primary.main",
                              }}
                            >
                              {sub.class.name}
                            </Typography>
                          </Box>

                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              fontSize: "13px",
                              mb: 1.5,
                              color: "text.primary",
                            }}
                          >
                            {sub.name}
                          </Typography>

                          <Divider
                            sx={{
                              my: 1.5,
                              borderColor: "divider",
                              opacity: 0.6,
                            }}
                          />

                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteSubject(sub._id)}
                              disabled={subjectDeleteLoadingId === sub._id}
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
                                  bgcolor: "rgba(239, 68, 68, 0.04)"
                                }
                              }}
                            >
                              {subjectDeleteLoadingId === sub._id ? (
                                <CircularProgress size={14} color="inherit" />
                              ) : (
                                "Delete"
                              )}
                            </Button>
                          </Box>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
};
