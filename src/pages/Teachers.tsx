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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useCustomTheme } from "../context/ThemeContext";
import { getClasses } from "../services/academicService";
import {
  registerTeacher,
  getTeachers,
  getTeacherProfile,
  allocateClassAndSubject,
  clearTeacherAllocations,
  deleteTeacher,
  paySalary,
} from "../services/teacherService";

interface Section {
  _id: string;
  name: string;
}
interface ClassData {
  _id: string;
  name: string;
  sections: Section[];
}

interface TeacherData {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  employeeId: string;
  qualification: string;
  salary: number;
  allocatedClasses: { _id: string; name: string }[];
  allocatedSections: { _id: string; name: string }[];
  allocatedSubjects: { _id: string; name: string; code: string }[];
  status: string;
}

export const Teachers: React.FC = () => {
  const { mode } = useCustomTheme();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);

  const [profileOpen, setProfileOpen] = useState(false);
  const [allocationOpen, setAllocationOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherData | null>(
    null,
  );

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success",
  );

  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [qualification, setQualification] = useState("");
  const [salary, setSalary] = useState("");

  const [allocClassId, setAllocClassId] = useState("");
  const [allocSectionId, setAllocSectionId] = useState("");
  const [allocSubjectId, setAllocSubjectId] = useState("");
  const [subjectsList, setSubjectsLoadingList] = useState<
    { _id: string; name: string; code: string }[]
  >([]);
  const [sectionsList, setSectionsList] = useState<Section[]>([]);

  const [salaryTeacherId, setSalaryTeacherId] = useState("");
  const [salaryMonth, setSalaryMonth] = useState("");

  const [registerLoading, setRegisterLoading] = useState(false);
  const [allocationLoading, setAllocationLoading] = useState(false);
  const [salaryLoading, setSalaryLoading] = useState(false);
  const [clearLoadingId, setClearLoadingId] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const fetchClassesAndTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const resClasses = await getClasses();
      const resTeachers = await getTeachers();
      setClasses(resClasses.data);
      setTeachers(resTeachers.data);
      setLoading(false);
    } catch {
      setLoading(false);
      setToastSeverity("error");
      setToastMessage("Failed to fetch teachers directory details.");
      setToastOpen(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClassesAndTeachers();
  }, [fetchClassesAndTeachers]);

  const handleAllocClassChange = async (classId: string) => {
    setAllocClassId(classId);
    setAllocSectionId("");
    setAllocSubjectId("");

    const selectedClass = classes.find((c) => c._id === classId);
    if (selectedClass) {
      setSectionsList(selectedClass.sections);
    } else {
      setSectionsList([]);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://school-system-management-backend.vercel.app/api/academic/classes/${classId}/subjects`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSubjectsLoadingList(response.data.data);
    } catch {
      setToastSeverity("error");
      setToastMessage("Failed to fetch subjects for this class.");
      setToastOpen(true);
    }
  };

  const handleRegisterTeacher = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !teacherName ||
      !teacherEmail ||
      !employeeId ||
      !qualification ||
      !salary
    ) {
      setToastSeverity("error");
      setToastMessage("Please fill out all fields in the Registration Form!");
      setToastOpen(true);
      return;
    }

    setRegisterLoading(true);

    setTimeout(async () => {
      try {
        await registerTeacher({
          name: teacherName,
          email: teacherEmail,
          password: teacherPassword || undefined,
          employeeId,
          qualification,
          salary: Number(salary),
        });

        setToastSeverity("success");
        setToastMessage("Teacher profile registered successfully!");
        setToastOpen(true);

        setTeacherName("");
        setTeacherEmail("");
        setTeacherPassword("");
        setEmployeeId("");
        setQualification("");
        setSalary("");

        setRegisterLoading(false);
        fetchClassesAndTeachers();
      } catch (err: unknown) {
        setRegisterLoading(false);
        let msg = "Failed to register teacher.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedTeacher ||
      !allocClassId ||
      !allocSectionId ||
      !allocSubjectId
    ) {
      setToastSeverity("error");
      setToastMessage("All fields are required for allocation!");
      setToastOpen(true);
      return;
    }

    setAllocationLoading(true);

    setTimeout(async () => {
      try {
        await allocateClassAndSubject({
          teacherId: selectedTeacher._id,
          classes: [allocClassId],
          sections: [allocSectionId],
          subjects: [allocSubjectId],
        });

        setToastSeverity("success");
        setToastMessage("Class and Subject allocated successfully!");
        setToastOpen(true);

        setAllocClassId("");
        setAllocSectionId("");
        setAllocSubjectId("");
        setSectionsList([]);
        setSubjectsLoadingList([]);
        setAllocationOpen(false);
        setAllocationLoading(false);
        fetchClassesAndTeachers();
      } catch (err: unknown) {
        setAllocationLoading(false);
        let msg = "Failed to allocate.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleClearAllocations = (teacherId: string) => {
    setClearLoadingId(teacherId);

    setTimeout(async () => {
      try {
        await clearTeacherAllocations(teacherId);
        setToastSeverity("success");
        setToastMessage("All allocations cleared successfully!");
        setToastOpen(true);
        setClearLoadingId(null);
        fetchClassesAndTeachers();
      } catch (err: unknown) {
        setClearLoadingId(null);
        let msg = "Failed to clear allocations.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setDeleteLoadingId(teacherId);

    setTimeout(async () => {
      try {
        await deleteTeacher(teacherId);
        setToastSeverity("success");
        setToastMessage("Teacher profile marked as Resigned (Soft Deleted)!");
        setToastOpen(true);
        setDeleteLoadingId(null);
        fetchClassesAndTeachers();
      } catch (err: unknown) {
        setDeleteLoadingId(null);
        let msg = "Failed to delete teacher.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handlePaySalary = (e: React.FormEvent) => {
    e.preventDefault();

    if (!salaryTeacherId || !salaryMonth) {
      setToastSeverity("error");
      setToastMessage("Please select both Teacher and Month!");
      setToastOpen(true);
      return;
    }

    setSalaryLoading(true);

    setTimeout(async () => {
      try {
        await paySalary(salaryTeacherId, salaryMonth);
        setToastSeverity("success");
        setToastMessage(`Salary paid and logged in Accounts successfully!`);
        setToastOpen(true);

        setSalaryTeacherId("");
        setSalaryMonth("");
        setSalaryLoading(false);
      } catch (err: unknown) {
        setSalaryLoading(false);
        let msg = "Failed to process salary.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleViewProfile = async (teacher: TeacherData) => {
    try {
      const res = await getTeacherProfile(teacher._id);
      setSelectedTeacher(res.data);
      setProfileOpen(true);
    } catch {
      setToastSeverity("error");
      setToastMessage("Failed to fetch complete profile details.");
      setToastOpen(true);
    }
  };

  const handleOpenAllocationModal = (teacher: TeacherData) => {
    setSelectedTeacher(teacher);
    setAllocationOpen(true);
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
        Teacher Management
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
        Register teachers, manage allocations, and process monthly salaries.
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
          <Tab label="Register Teacher" />
          <Tab label="Teachers Directory" />
          <Tab label="Salary Payments" />
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
            maxWidth: 800,
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
              Teacher Registration Form
            </Typography>

            <form onSubmit={handleRegisterTeacher}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2.5,
                  mb: 3.5,
                }}
              >
                <TextField
                  label="Full Name"
                  placeholder="Enter teacher full name"
                  variant="outlined"
                  size="small"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  disabled={registerLoading}
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
                  label="Email Address"
                  placeholder="Enter teacher email address"
                  type="email"
                  variant="outlined"
                  size="small"
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  disabled={registerLoading}
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
                  label="Portal Password"
                  placeholder="Enter default login password"
                  type="password"
                  variant="outlined"
                  size="small"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  disabled={registerLoading}
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
                  label="Employee ID"
                  placeholder="Enter employee ID"
                  variant="outlined"
                  size="small"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={registerLoading}
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
                  label="Qualification"
                  placeholder="Enter educational qualification"
                  variant="outlined"
                  size="small"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  disabled={registerLoading}
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
                  label="Monthly Base Salary"
                  placeholder="Enter monthly salary"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  disabled={registerLoading}
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
                disabled={registerLoading}
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
                {registerLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Register Teacher"
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
          ) : teachers.length === 0 ? (
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
                No teachers registered in the system yet.
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
                      Registered Teachers Directory
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
                              Employee ID
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
                              Name
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
                              Qualification
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
                              Salary
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
                          {teachers.map((teach) => (
                            <TableRow
                              key={teach._id}
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
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {teach.employeeId}
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
                                {teach.user.name}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: "13px",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  borderBottomColor: "divider",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {teach.qualification}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: "13px",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  borderBottomColor: "divider",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Rs. {teach.salary}
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
                                    bgcolor:
                                      teach.status === "Active"
                                        ? mode === "light"
                                          ? "rgba(16, 185, 129, 0.08)"
                                          : "rgba(16, 185, 129, 0.15)"
                                        : mode === "light"
                                          ? "rgba(15, 23, 42, 0.08)"
                                          : "rgba(255, 255, 255, 0.1)",
                                    color:
                                      teach.status === "Active"
                                        ? "success.main"
                                        : "text.secondary",
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                  }}
                                >
                                  {teach.status}
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
                                  onClick={() => handleViewProfile(teach)}
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    textTransform: "none",
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    mr: 1,
                                  }}
                                >
                                  View
                                </Button>
                                <Button
                                  size="small"
                                  variant="text"
                                  color="secondary"
                                  onClick={() =>
                                    handleOpenAllocationModal(teach)
                                  }
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    textTransform: "none",
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    mr: 1,
                                  }}
                                >
                                  Allocate
                                </Button>
                                <Button
                                  size="small"
                                  variant="text"
                                  color="warning"
                                  onClick={() =>
                                    handleClearAllocations(teach._id)
                                  }
                                  disabled={clearLoadingId === teach._id}
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    textTransform: "none",
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    mr: 1,
                                    minWidth: 60,
                                  }}
                                >
                                  {clearLoadingId === teach._id ? (
                                    <CircularProgress
                                      size={14}
                                      color="inherit"
                                    />
                                  ) : (
                                    "Reset"
                                  )}
                                </Button>
                                <Button
                                  size="small"
                                  variant="text"
                                  color="error"
                                  onClick={() => handleDeleteTeacher(teach._id)}
                                  disabled={deleteLoadingId === teach._id}
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    textTransform: "none",
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    minWidth: 60,
                                  }}
                                >
                                  {deleteLoadingId === teach._id ? (
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
                {teachers.map((teach) => (
                  <Card
                    key={teach._id}
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
                        {teach.employeeId}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "10px",
                          fontWeight: 700,
                          px: 1,
                          py: 0.2,
                          borderRadius: "4px",
                          bgcolor:
                            teach.status === "Active"
                              ? mode === "light"
                                ? "rgba(16, 185, 129, 0.08)"
                                : "rgba(16, 185, 129, 0.15)"
                              : mode === "light"
                                ? "rgba(15, 23, 42, 0.08)"
                                : "rgba(255, 255, 255, 0.1)",
                          color:
                            teach.status === "Active"
                              ? "success.main"
                              : "text.secondary",
                          fontFamily: '"Roboto", "Arial", sans-serif',
                        }}
                      >
                        {teach.status}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "14px",
                        mb: 1.5,
                        color: "primary.main",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: "100%",
                      }}
                    >
                      {teach.user.name}
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
                        <strong>Qualification:</strong> {teach.qualification}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          color: "text.secondary",
                          fontSize: "12px",
                        }}
                      >
                        <strong>Base Salary:</strong> Rs. {teach.salary}
                      </Typography>
                    </Box>

                    <Divider
                      sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "nowrap",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleViewProfile(teach)}
                        sx={{
                          fontWeight: 600,
                          fontSize: "12px",
                          textTransform: "none",
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          height: 30,
                          borderRadius: "6px",
                          borderWidth: "1px",
                          "&:hover": {
                            borderWidth: "1px",
                            bgcolor: "rgba(30, 58, 138, 0.04)",
                          },
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleOpenAllocationModal(teach)}
                        sx={{
                          fontWeight: 600,
                          fontSize: "12px",
                          textTransform: "none",
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          height: 30,
                          borderRadius: "6px",
                          borderWidth: "1px",
                          "&:hover": {
                            borderWidth: "1px",
                            bgcolor: "rgba(107, 114, 128, 0.04)",
                          },
                        }}
                      >
                        Allocate
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => handleClearAllocations(teach._id)}
                        disabled={clearLoadingId === teach._id}
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
                            bgcolor: "rgba(245, 158, 11, 0.04)",
                          },
                        }}
                      >
                        {clearLoadingId === teach._id ? (
                          <CircularProgress size={14} color="inherit" />
                        ) : (
                          "Reset"
                        )}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteTeacher(teach._id)}
                        disabled={deleteLoadingId === teach._id}
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
                            bgcolor: "rgba(239, 68, 68, 0.04)",
                          },
                        }}
                      >
                        {deleteLoadingId === teach._id ? (
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
        </Box>
      )}

      {activeTab === 2 && (
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
              Process Salary Payout
            </Typography>

            <form onSubmit={handlePaySalary}>
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
                    id="salary-teacher-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Select Teacher
                  </InputLabel>
                  <Select
                    labelId="salary-teacher-label"
                    value={salaryTeacherId}
                    label="Select Teacher"
                    onChange={(e) => setSalaryTeacherId(e.target.value)}
                    disabled={salaryLoading}
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
                    {teachers
                      .filter((t) => t.status === "Active")
                      .map((teach) => (
                        <MenuItem
                          key={teach._id}
                          value={teach._id}
                          sx={{
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            fontSize: "13px",
                          }}
                        >
                          {teach.user.name} ({teach.employeeId})
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel
                    id="salary-month-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Select Month
                  </InputLabel>
                  <Select
                    labelId="salary-month-label"
                    value={salaryMonth}
                    label="Select Month"
                    onChange={(e) => setSalaryMonth(e.target.value)}
                    disabled={salaryLoading}
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
                      value="January 2026"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      January 2026
                    </MenuItem>
                    <MenuItem
                      value="February 2026"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      February 2026
                    </MenuItem>
                    <MenuItem
                      value="March 2026"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      March 2026
                    </MenuItem>
                    <MenuItem
                      value="April 2026"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      April 2026
                    </MenuItem>
                    <MenuItem
                      value="May 2026"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      May 2026
                    </MenuItem>
                    <MenuItem
                      value="June 2026"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      June 2026
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={salaryLoading}
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
                {salaryLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Pay Salary"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Dialog
        fullScreen={isFullScreen}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: isFullScreen ? 0 : "10px",
            border: mode === "dark" ? "1px solid #334155" : "none",
          },
        }}
      >
        {selectedTeacher && (
          <>
            <DialogTitle
              sx={{
                fontWeight: 700,
                fontSize: "15px",
                fontFamily: '"Roboto", "Arial", sans-serif',
                color: "primary.main",
                borderBottom: "1px solid",
                borderColor: "divider",
                py: 2,
              }}
            >
              Teacher Profile Details
            </DialogTitle>
            <DialogContent sx={{ p: 3, pt: "24px !important" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "action.hover",
                    borderRadius: "10px",
                    border:
                      mode === "dark"
                        ? "1px solid #334155"
                        : "1px solid #F1F5F9",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: "14px",
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      mb: 0.5,
                    }}
                  >
                    {selectedTeacher.user.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "12px",
                    }}
                  >
                    Email: {selectedTeacher.user.email}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontWeight: 500,
                        fontSize: "12px",
                      }}
                    >
                      Employee ID
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      {selectedTeacher.employeeId}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontWeight: 500,
                        fontSize: "12px",
                      }}
                    >
                      Qualification
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      {selectedTeacher.qualification}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontWeight: 500,
                        fontSize: "12px",
                      }}
                    >
                      Monthly Salary
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      Rs. {selectedTeacher.salary}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontWeight: 500,
                        fontSize: "12px",
                      }}
                    >
                      Status
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                        color:
                          selectedTeacher.status === "Active"
                            ? "success.main"
                            : "text.secondary",
                      }}
                    >
                      {selectedTeacher.status}
                    </Typography>
                  </Box>
                </Box>

                <Divider
                  sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }}
                />

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontFamily: '"Roboto", "Arial", sans-serif',
                    color: "primary.main",
                    fontSize: "13px",
                  }}
                >
                  Assigned Classes & Subjects Allocation
                </Typography>

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontWeight: 500,
                        fontSize: "12px",
                      }}
                    >
                      Allocated Classes
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      {selectedTeacher.allocatedClasses.length > 0
                        ? selectedTeacher.allocatedClasses
                            .map((c) => c.name)
                            .join(", ")
                        : "No classes allocated yet."}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontWeight: 500,
                        fontSize: "12px",
                      }}
                    >
                      Allocated Sections
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      {selectedTeacher.allocatedSections.length > 0
                        ? selectedTeacher.allocatedSections
                            .map((s) => s.name)
                            .join(", ")
                        : "No sections allocated yet."}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontWeight: 500,
                        fontSize: "12px",
                      }}
                    >
                      Allocated Subjects
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      {selectedTeacher.allocatedSubjects.length > 0
                        ? selectedTeacher.allocatedSubjects
                            .map((s) => `${s.name} (${s.code})`)
                            .join(", ")
                        : "No subjects allocated yet."}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions
              sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
            >
              <Button
                onClick={() => setProfileOpen(false)}
                variant="contained"
                color="primary"
                sx={{
                  px: 3,
                  height: 38,
                  fontSize: "13px",
                  borderRadius: "8px",
                  textTransform: "none",
                  boxShadow: "none",
                  fontWeight: 600,
                  fontFamily: '"Roboto", "Arial", sans-serif',
                  "&:hover": { boxShadow: "none" },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog
        fullScreen={isFullScreen}
        open={allocationOpen}
        onClose={() => setAllocationOpen(false)}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: isFullScreen ? 0 : "10px",
            border: mode === "dark" ? "1px solid #334155" : "none",
          },
        }}
      >
        {selectedTeacher && (
          <>
            <DialogTitle
              sx={{
                fontWeight: 700,
                fontSize: "15px",
                fontFamily: '"Roboto", "Arial", sans-serif',
                color: "primary.main",
                borderBottom: "1px solid",
                borderColor: "divider",
                py: 2,
              }}
            >
              Allocate Class & Subject
            </DialogTitle>
            <DialogContent sx={{ p: 3, pt: "24px !important" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 3,
                  fontFamily: '"Roboto", "Arial", sans-serif',
                  fontSize: "13px",
                }}
              >
                Allocating class, section, and subject to teacher:{" "}
                <strong>{selectedTeacher.user.name}</strong>.
              </Typography>

              <form onSubmit={handleAllocate}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                    mb: 1,
                  }}
                >
                  <FormControl size="small" fullWidth>
                    <InputLabel
                      id="alloc-class-label"
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
                      labelId="alloc-class-label"
                      value={allocClassId}
                      label="Class"
                      onChange={(e) => handleAllocClassChange(e.target.value)}
                      disabled={allocationLoading}
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

                  <FormControl size="small" fullWidth>
                    <InputLabel
                      id="alloc-section-label"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                        transform: "translate(14px, 11px) scale(1)",
                        "&.MuiInputLabel-shrink": {
                          transform: "translate(14px, -6px) scale(0.75)",
                        },
                      }}
                    >
                      Section
                    </InputLabel>
                    <Select
                      labelId="alloc-section-label"
                      value={allocSectionId}
                      label="Section"
                      onChange={(e) => setAllocSectionId(e.target.value)}
                      disabled={allocationLoading || !allocClassId}
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
                      {sectionsList.length > 0 ? (
                        sectionsList.map((sec) => (
                          <MenuItem
                            key={sec._id}
                            value={sec._id}
                            sx={{
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              fontSize: "13px",
                            }}
                          >
                            {sec.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem
                          disabled
                          sx={{
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            fontSize: "13px",
                          }}
                        >
                          No sections available
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  <FormControl size="small" fullWidth>
                    <InputLabel
                      id="alloc-subject-label"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                        transform: "translate(14px, 11px) scale(1)",
                        "&.MuiInputLabel-shrink": {
                          transform: "translate(14px, -6px) scale(0.75)",
                        },
                      }}
                    >
                      Subject
                    </InputLabel>
                    <Select
                      labelId="alloc-subject-label"
                      value={allocSubjectId}
                      label="Subject"
                      onChange={(e) => setAllocSubjectId(e.target.value)}
                      disabled={allocationLoading || !allocClassId}
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
                      {subjectsList.length > 0 ? (
                        subjectsList.map((sub) => (
                          <MenuItem
                            key={sub._id}
                            value={sub._id}
                            sx={{
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              fontSize: "13px",
                            }}
                          >
                            {sub.name} ({sub.code})
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem
                          disabled
                          sx={{
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            fontSize: "13px",
                          }}
                        >
                          No subjects available
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>
              </form>
            </DialogContent>
            <DialogActions
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                justifyContent: "space-between",
              }}
            >
              <Button
                onClick={() => setAllocationOpen(false)}
                variant="text"
                color="primary"
                sx={{
                  height: 38,
                  fontSize: "13px",
                  textTransform: "none",
                  fontFamily: '"Roboto", "Arial", sans-serif',
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAllocate}
                variant="contained"
                color="secondary"
                disabled={allocationLoading}
                sx={{
                  px: 3,
                  height: 38,
                  fontSize: "13px",
                  borderRadius: "8px",
                  textTransform: "none",
                  boxShadow: "none",
                  fontWeight: 600,
                  fontFamily: '"Roboto", "Arial", sans-serif',
                  "&:hover": { boxShadow: "none" },
                }}
              >
                {allocationLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Allocate"
                )}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
