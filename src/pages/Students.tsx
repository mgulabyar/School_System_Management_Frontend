/* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Tabs,
//   Tab,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Alert,
//   CircularProgress,
//   Snackbar,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   useTheme,
//   useMediaQuery,
//   Divider,
// } from "@mui/material";
// import axios from "axios";
// import { useCustomTheme } from "../context/ThemeContext";
// import { getClasses } from "../services/academicService";
// import {
//   admitStudent,
//   getStudents,
//   getStudentProfile,
//   deleteStudent,
// } from "../services/studentService";

// interface Section {
//   _id: string;
//   name: string;
// }

// interface ClassData {
//   _id: string;
//   name: string;
//   sections: Section[];
// }

// interface StudentData {
//   _id: string;
//   user: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   admissionNo: string;
//   rollNo: string;
//   dateOfBirth: string;
//   gender: string;
//   class: {
//     _id: string;
//     name: string;
//   };
//   section: {
//     _id: string;
//     name: string;
//   };
//   parentName: string;
//   parentPhone: string;
//   status: string;
// }

// export const Students: React.FC = () => {
//   const { mode } = useCustomTheme();
//   const theme = useTheme();
//   const [activeTab, setActiveTab] = useState(0);

//   const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));

//   const [students, setStudents] = useState<StudentData[]>([]);
//   const [classes, setClasses] = useState<ClassData[]>([]);
//   const [availableSections, setAvailableSections] = useState<Section[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [profileOpen, setProfileOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
//     null,
//   );

//   const [toastOpen, setToastOpen] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
//     "success",
//   );

//   const [studentName, setStudentName] = useState("");
//   const [studentEmail, setStudentEmail] = useState("");
//   const [studentPassword, setStudentPassword] = useState("");
//   const [admissionNo, setAdmissionNo] = useState("");
//   const [rollNo, setRollNo] = useState("");
//   const [dob, setDob] = useState("");
//   const [gender, setGender] = useState("");
//   const [studentClassId, setStudentClassId] = useState("");
//   const [studentSectionId, setStudentSectionId] = useState("");
//   const [parentName, setParentName] = useState("");
//   const [parentPhone, setParentPhone] = useState("");

//   const [admitLoading, setAdmitLoading] = useState(false);
//   const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

//   const fetchClasses = useCallback(async () => {
//     try {
//       const res = await getClasses();
//       setClasses(res.data);
//     } catch {
//       setToastSeverity("error");
//       setToastMessage("Failed to fetch classes for admission form.");
//       setToastOpen(true);
//     }
//   }, []);

//   const fetchStudents = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await getStudents();
//       setStudents(res.data);
//       setLoading(false);
//     } catch {
//       setLoading(false);
//       setToastSeverity("error");
//       setToastMessage("Failed to fetch student list.");
//       setToastOpen(true);
//     }
//   }, []);

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     fetchClasses();
//     fetchStudents();
//   }, [fetchClasses, fetchStudents]);

//   const handleClassChange = (classId: string) => {
//     setStudentClassId(classId);
//     setStudentSectionId("");

//     const selectedClass = classes.find((c) => c._id === classId);
//     if (selectedClass) {
//       setAvailableSections(selectedClass.sections);
//     } else {
//       setAvailableSections([]);
//     }
//   };

//   const handleAdmitStudent = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (
//       !studentName ||
//       !studentEmail ||
//       !admissionNo ||
//       !rollNo ||
//       !dob ||
//       !gender ||
//       !studentClassId ||
//       !studentSectionId ||
//       !parentName ||
//       !parentPhone
//     ) {
//       setToastSeverity("error");
//       setToastMessage("Please fill out all fields in the Admission Form!");
//       setToastOpen(true);
//       return;
//     }

//     setAdmitLoading(true);

//     setTimeout(async () => {
//       try {
//         await admitStudent({
//           name: studentName,
//           email: studentEmail,
//           password: studentPassword || undefined,
//           admissionNo,
//           rollNo,
//           dateOfBirth: dob,
//           gender,
//           classId: studentClassId,
//           sectionId: studentSectionId,
//           parentName,
//           parentPhone,
//         });

//         setToastSeverity("success");
//         setToastMessage("Student admitted successfully!");
//         setToastOpen(true);

//         setStudentName("");
//         setStudentEmail("");
//         setStudentPassword("");
//         setAdmissionNo("");
//         setRollNo("");
//         setDob("");
//         setGender("");
//         setStudentClassId("");
//         setStudentSectionId("");
//         setAvailableSections([]);
//         setParentName("");
//         setParentPhone("");

//         setAdmitLoading(false);
//         fetchStudents();
//       } catch (err: unknown) {
//         setAdmitLoading(false);
//         let msg = "Failed to admit student.";
//         if (axios.isAxiosError(err)) {
//           msg = err.response?.data?.message || msg;
//         }
//         setToastSeverity("error");
//         setToastMessage(msg);
//         setToastOpen(true);
//       }
//     }, 2000);
//   };

//   const handleDeleteStudent = (studentId: string) => {
//     setDeleteLoadingId(studentId);

//     setTimeout(async () => {
//       try {
//         const res = await deleteStudent(studentId);
//         setToastSeverity("success");
//         setToastMessage(
//           res.message || "Student profile deactivated successfully!",
//         );
//         setToastOpen(true);
//         setDeleteLoadingId(null);
//         fetchStudents();
//       } catch (err: unknown) {
//         setDeleteLoadingId(null);
//         let msg = "Failed to delete student.";
//         if (axios.isAxiosError(err)) {
//           msg = err.response?.data?.message || msg;
//         }
//         setToastSeverity("error");
//         setToastMessage(msg);
//         setToastOpen(true);

//         console.error("--- DELETE STUDENT ERROR DETAILS ---");
//         console.error(err);
//         console.error("------------------------------------");
//       }
//     }, 2000);
//   };

//   const handleViewProfile = async (student: StudentData) => {
//     try {
//       const res = await getStudentProfile(student._id);
//       setSelectedStudent(res.data);
//       setProfileOpen(true);
//     } catch {
//       setToastSeverity("error");
//       setToastMessage("Failed to fetch complete student profile details.");
//       setToastOpen(true);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         maxWidth: "100%",
//         overflowX: "hidden",
//         "@keyframes pageSlideUp": {
//           "0%": { opacity: 0, transform: "translateY(12px)" },
//           "100%": { opacity: 1, transform: "translateY(0)" },
//         },
//         animation: "pageSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
//       }}
//     >
//       <Typography
//         variant="h1"
//         color="primary"
//         sx={{
//           mb: 1,
//           fontSize: "1.65rem",
//           fontWeight: 800,
//           fontFamily: '"Roboto", "Arial", sans-serif',
//           letterSpacing: "-0.01em",
//         }}
//       >
//         Student Management
//       </Typography>
//       <Typography
//         variant="body1"
//         color="text.secondary"
//         sx={{
//           mb: 4,
//           fontSize: "0.925rem",
//           fontFamily: '"Roboto", "Arial", sans-serif',
//         }}
//       >
//         Admit new students and manage profiles.
//       </Typography>

//       <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
//         <Tabs
//           value={activeTab}
//           onChange={(_, newValue) => setActiveTab(newValue)}
//           textColor="primary"
//           indicatorColor="primary"
//           sx={{
//             minHeight: "40px",
//             "& .MuiTab-root": {
//               minHeight: "40px",
//               fontSize: "13px",
//               fontWeight: 500,
//               fontFamily: '"Roboto", "Arial", sans-serif',
//               textTransform: "none",
//               padding: "6px 16px",
//             },
//           }}
//         >
//           <Tab label="Admit Student" />
//           <Tab label="Students List" />
//         </Tabs>
//       </Box>

//       <Snackbar
//         open={toastOpen}
//         autoHideDuration={4000}
//         onClose={() => setToastOpen(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={() => setToastOpen(false)}
//           severity={toastSeverity}
//           sx={{
//             width: "100%",
//             borderRadius: "10px",
//             fontFamily: '"Roboto", "Arial", sans-serif',
//             boxShadow:
//               mode === "light" ? "0 10px 24px rgba(15, 23, 42, 0.08)" : "none",
//           }}
//         >
//           {toastMessage}
//         </Alert>
//       </Snackbar>

//       {activeTab === 0 && (
//         <Card
//           sx={{
//             borderRadius: "10px",
//             bgcolor: "background.paper",
//             boxShadow:
//               mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
//             border: mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
//             maxWidth: 800,
//           }}
//         >
//           <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
//             <Typography
//               variant="h6"
//               color="primary"
//               sx={{
//                 fontWeight: 700,
//                 fontSize: "14px",
//                 mb: 3,
//                 fontFamily: '"Roboto", "Arial", sans-serif',
//               }}
//             >
//               Student Admission Form
//             </Typography>

//             <form onSubmit={handleAdmitStudent}>
//               <Box
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
//                   gap: 2.5,
//                   mb: 3.5,
//                 }}
//               >
//                 <TextField
//                   label="Full Name"
//                   placeholder="Enter student full name"
//                   variant="outlined"
//                   size="small"
//                   value={studentName}
//                   onChange={(e) => setStudentName(e.target.value)}
//                   disabled={admitLoading}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                     },
//                     "& .MuiInputLabel-root": {
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 12px) scale(1)",
//                     },
//                     "& .MuiInputLabel-shrink": {
//                       transform: "translate(14px, -6px) scale(0.75)",
//                     },
//                   }}
//                 />

//                 <TextField
//                   label="Email Address"
//                   placeholder="Enter student email address"
//                   type="email"
//                   variant="outlined"
//                   size="small"
//                   value={studentEmail}
//                   onChange={(e) => setStudentEmail(e.target.value)}
//                   disabled={admitLoading}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                     },
//                     "& .MuiInputLabel-root": {
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 12px) scale(1)",
//                     },
//                     "& .MuiInputLabel-shrink": {
//                       transform: "translate(14px, -6px) scale(0.75)",
//                     },
//                   }}
//                 />

//                 <TextField
//                   label="Portal Password"
//                   placeholder="Enter default login password"
//                   type="password"
//                   variant="outlined"
//                   size="small"
//                   value={studentPassword}
//                   onChange={(e) => setStudentPassword(e.target.value)}
//                   disabled={admitLoading}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                     },
//                     "& .MuiInputLabel-root": {
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 12px) scale(1)",
//                     },
//                     "& .MuiInputLabel-shrink": {
//                       transform: "translate(14px, -6px) scale(0.75)",
//                     },
//                   }}
//                 />

//                 <TextField
//                   label="Date of Birth"
//                   type="date"
//                   variant="outlined"
//                   size="small"
//                   value={dob}
//                   onChange={(e) => setDob(e.target.value)}
//                   disabled={admitLoading}
//                   slotProps={{
//                     inputLabel: { shrink: true },
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                     },
//                     "& .MuiInputLabel-root": {
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 12px) scale(1)",
//                     },
//                     "& .MuiInputLabel-shrink": {
//                       transform: "translate(14px, -6px) scale(0.75)",
//                     },
//                   }}
//                 />

//                 <FormControl size="small">
//                   <InputLabel
//                     id="gender-label"
//                     sx={{
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 11px) scale(1)",
//                       "&.MuiInputLabel-shrink": {
//                         transform: "translate(14px, -6px) scale(0.75)",
//                       },
//                     }}
//                   >
//                     Gender
//                   </InputLabel>
//                   <Select
//                     labelId="gender-label"
//                     value={gender}
//                     label="Gender"
//                     onChange={(e) => setGender(e.target.value)}
//                     disabled={admitLoading}
//                     sx={{
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       "& .MuiSelect-select": {
//                         paddingTop: "11px",
//                         paddingBottom: "11px",
//                       },
//                     }}
//                   >
//                     <MenuItem
//                       value="Male"
//                       sx={{
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontSize: "13px",
//                       }}
//                     >
//                       Male
//                     </MenuItem>
//                     <MenuItem
//                       value="Female"
//                       sx={{
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontSize: "13px",
//                       }}
//                     >
//                       Female
//                     </MenuItem>
//                     <MenuItem
//                       value="Other"
//                       sx={{
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontSize: "13px",
//                       }}
//                     >
//                       Other
//                     </MenuItem>
//                   </Select>
//                 </FormControl>

//                 <TextField
//                   label="Admission Number"
//                   placeholder="Enter admission number"
//                   variant="outlined"
//                   size="small"
//                   value={admissionNo}
//                   onChange={(e) => setAdmissionNo(e.target.value)}
//                   disabled={admitLoading}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                     },
//                     "& .MuiInputLabel-root": {
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 12px) scale(1)",
//                     },
//                     "& .MuiInputLabel-shrink": {
//                       transform: "translate(14px, -6px) scale(0.75)",
//                     },
//                   }}
//                 />

//                 <TextField
//                   label="Roll Number"
//                   placeholder="Enter class roll number"
//                   variant="outlined"
//                   size="small"
//                   value={rollNo}
//                   onChange={(e) => setRollNo(e.target.value)}
//                   disabled={admitLoading}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                     },
//                     "& .MuiInputLabel-root": {
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 12px) scale(1)",
//                     },
//                     "& .MuiInputLabel-shrink": {
//                       transform: "translate(14px, -6px) scale(0.75)",
//                     },
//                   }}
//                 />

//                 <FormControl size="small">
//                   <InputLabel
//                     id="student-class-label"
//                     sx={{
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 11px) scale(1)",
//                       "&.MuiInputLabel-shrink": {
//                         transform: "translate(14px, -6px) scale(0.75)",
//                       },
//                     }}
//                   >
//                     Class
//                   </InputLabel>
//                   <Select
//                     labelId="student-class-label"
//                     value={studentClassId}
//                     label="Class"
//                     onChange={(e) => handleClassChange(e.target.value)}
//                     disabled={admitLoading}
//                     sx={{
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       "& .MuiSelect-select": {
//                         paddingTop: "11px",
//                         paddingBottom: "11px",
//                       },
//                     }}
//                   >
//                     {classes.map((cls) => (
//                       <MenuItem
//                         key={cls._id}
//                         value={cls._id}
//                         sx={{
//                           fontFamily: '"Roboto", "Arial", sans-serif',
//                           fontSize: "13px",
//                         }}
//                       >
//                         {cls.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 <FormControl size="small">
//                   <InputLabel
//                     id="student-section-label"
//                     sx={{
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 11px) scale(1)",
//                       "&.MuiInputLabel-shrink": {
//                         transform: "translate(14px, -6px) scale(0.75)",
//                       },
//                     }}
//                   >
//                     Section
//                   </InputLabel>
//                   <Select
//                     labelId="student-section-label"
//                     value={studentSectionId}
//                     label="Section"
//                     onChange={(e) => setStudentSectionId(e.target.value)}
//                     disabled={admitLoading || !studentClassId}
//                     sx={{
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       "& .MuiSelect-select": {
//                         paddingTop: "11px",
//                         paddingBottom: "11px",
//                       },
//                     }}
//                   >
//                     {availableSections.length > 0 ? (
//                       availableSections.map((sec) => (
//                         <MenuItem
//                           key={sec._id}
//                           value={sec._id}
//                           sx={{
//                             fontFamily: '"Roboto", "Arial", sans-serif',
//                             fontSize: "13px",
//                           }}
//                         >
//                           {sec.name}
//                         </MenuItem>
//                       ))
//                     ) : (
//                       <MenuItem
//                         disabled
//                         sx={{
//                           fontFamily: '"Roboto", "Arial", sans-serif',
//                           fontSize: "13px",
//                         }}
//                       >
//                         No sections available
//                       </MenuItem>
//                     )}
//                   </Select>
//                 </FormControl>

//                 <TextField
//                   label="Parent/Guardian Name"
//                   placeholder="Enter father or guardian name"
//                   variant="outlined"
//                   size="small"
//                   value={parentName}
//                   onChange={(e) => setParentName(e.target.value)}
//                   disabled={admitLoading}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                     },
//                     "& .MuiInputLabel-root": {
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 12px) scale(1)",
//                     },
//                     "& .MuiInputLabel-shrink": {
//                       transform: "translate(14px, -6px) scale(0.75)",
//                     },
//                   }}
//                 />

//                 <TextField
//                   label="Parent Contact Phone"
//                   placeholder="Enter parent mobile number"
//                   variant="outlined"
//                   size="small"
//                   value={parentPhone}
//                   onChange={(e) => setParentPhone(e.target.value)}
//                   disabled={admitLoading}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                     },
//                     "& .MuiInputLabel-root": {
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 12px) scale(1)",
//                     },
//                     "& .MuiInputLabel-shrink": {
//                       transform: "translate(14px, -6px) scale(0.75)",
//                     },
//                   }}
//                 />
//               </Box>

//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 disabled={admitLoading}
//                 sx={{
//                   height: 42,
//                   fontSize: "13px",
//                   borderRadius: "8px",
//                   textTransform: "none",
//                   boxShadow: "none",
//                   fontWeight: 600,
//                   fontFamily: '"Roboto", "Arial", sans-serif',
//                 }}
//               >
//                 {admitLoading ? (
//                   <CircularProgress size={18} color="inherit" />
//                 ) : (
//                   "Admit Student"
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       )}

//       {activeTab === 1 && (
//         <Box>
//           {loading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
//               <CircularProgress size={28} />
//             </Box>
//           ) : students.length === 0 ? (
//             <Card
//               sx={{
//                 borderRadius: "10px",
//                 border:
//                   mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
//                 boxShadow:
//                   mode === "light"
//                     ? "0 1px 3px rgba(15, 23, 42, 0.04)"
//                     : "none",
//                 p: 4,
//                 textAlign: "center",
//               }}
//             >
//               <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 sx={{
//                   fontFamily: '"Roboto", "Arial", sans-serif',
//                   fontSize: "13px",
//                 }}
//               >
//                 No students registered in the system yet.
//               </Typography>
//             </Card>
//           ) : (
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//               <Box sx={{ display: { xs: "none", md: "block" } }}>
//                 <Card
//                   sx={{
//                     borderRadius: "10px",
//                     bgcolor: "background.paper",
//                     boxShadow:
//                       mode === "light"
//                         ? "0 1px 3px rgba(15, 23, 42, 0.04)"
//                         : "none",
//                     border:
//                       mode === "dark"
//                         ? "1px solid #334155"
//                         : "1px solid #CBD5E1",
//                     p: 1,
//                   }}
//                 >
//                   <CardContent sx={{ p: 0 }}>
//                     <Typography
//                       variant="h6"
//                       color="primary"
//                       sx={{
//                         fontWeight: 700,
//                         fontSize: "14px",
//                         p: 2,
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                       }}
//                     >
//                       Enrolled Students Directory
//                     </Typography>
//                     <TableContainer
//                       component={Paper}
//                       elevation={0}
//                       sx={{ bgcolor: "transparent" }}
//                     >
//                       <Table sx={{ minWidth: 800 }}>
//                         <TableHead sx={{ bgcolor: "action.hover" }}>
//                           <TableRow>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 700,
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                                 whiteSpace: "nowrap",
//                               }}
//                             >
//                               Admission No
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 700,
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                                 whiteSpace: "nowrap",
//                               }}
//                             >
//                               Student Name
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 700,
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                                 whiteSpace: "nowrap",
//                               }}
//                             >
//                               Class & Section
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 700,
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                                 whiteSpace: "nowrap",
//                               }}
//                             >
//                               Roll No
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 700,
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                                 whiteSpace: "nowrap",
//                               }}
//                             >
//                               Parent Phone
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 700,
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                                 whiteSpace: "nowrap",
//                               }}
//                             >
//                               Status
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 700,
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                                 whiteSpace: "nowrap",
//                               }}
//                               align="right"
//                             >
//                               Actions
//                             </TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {students.map((stud) => (
//                             <TableRow
//                               key={stud._id}
//                               sx={{
//                                 "&:last-child td, &:last-child th": {
//                                   border: 0,
//                                 },
//                                 "&:hover": { bgcolor: "action.hover" },
//                               }}
//                             >
//                               <TableCell
//                                 sx={{
//                                   fontWeight: 600,
//                                   fontSize: "13px",
//                                   fontFamily: '"Roboto", "Arial", sans-serif',
//                                   borderBottomColor: "divider",
//                                   whiteSpace: "nowrap",
//                                 }}
//                               >
//                                 {stud.admissionNo}
//                               </TableCell>
//                               <TableCell
//                                 sx={{
//                                   fontWeight: 600,
//                                   fontSize: "13px",
//                                   fontFamily: '"Roboto", "Arial", sans-serif',
//                                   borderBottomColor: "divider",
//                                   whiteSpace: "nowrap",
//                                 }}
//                               >
//                                 {stud.user.name}
//                               </TableCell>
//                               <TableCell
//                                 sx={{
//                                   fontSize: "13px",
//                                   fontFamily: '"Roboto", "Arial", sans-serif',
//                                   borderBottomColor: "divider",
//                                   whiteSpace: "nowrap",
//                                 }}
//                               >
//                                 {stud.class.name} - {stud.section.name}
//                               </TableCell>
//                               <TableCell
//                                 sx={{
//                                   fontSize: "13px",
//                                   fontFamily: '"Roboto", "Arial", sans-serif',
//                                   borderBottomColor: "divider",
//                                   whiteSpace: "nowrap",
//                                 }}
//                               >
//                                 {stud.rollNo}
//                               </TableCell>
//                               <TableCell
//                                 sx={{
//                                   fontSize: "13px",
//                                   fontFamily: '"Roboto", "Arial", sans-serif',
//                                   borderBottomColor: "divider",
//                                   whiteSpace: "nowrap",
//                                 }}
//                               >
//                                 {stud.parentPhone}
//                               </TableCell>
//                               <TableCell
//                                 sx={{
//                                   borderBottomColor: "divider",
//                                   whiteSpace: "nowrap",
//                                 }}
//                               >
//                                 <Typography
//                                   component="span"
//                                   sx={{
//                                     fontSize: "11px",
//                                     fontWeight: 700,
//                                     px: 1.5,
//                                     py: 0.4,
//                                     borderRadius: "4px",
//                                     bgcolor:
//                                       stud.status === "Active"
//                                         ? mode === "light"
//                                           ? "rgba(16, 185, 129, 0.08)"
//                                           : "rgba(16, 185, 129, 0.15)"
//                                         : mode === "light"
//                                           ? "rgba(15, 23, 42, 0.08)"
//                                           : "rgba(255, 255, 255, 0.1)",
//                                     color:
//                                       stud.status === "Active"
//                                         ? "success.main"
//                                         : "text.secondary",
//                                     fontFamily: '"Roboto", "Arial", sans-serif',
//                                   }}
//                                 >
//                                   {stud.status}
//                                 </Typography>
//                               </TableCell>
//                               <TableCell
//                                 align="right"
//                                 sx={{
//                                   borderBottomColor: "divider",
//                                   whiteSpace: "nowrap",
//                                 }}
//                               >
//                                 <Button
//                                   size="small"
//                                   variant="text"
//                                   color="primary"
//                                   onClick={() => handleViewProfile(stud)}
//                                   sx={{
//                                     fontWeight: 600,
//                                     fontSize: "12px",
//                                     textTransform: "none",
//                                     fontFamily: '"Roboto", "Arial", sans-serif',
//                                     mr: 1,
//                                   }}
//                                 >
//                                   View
//                                 </Button>
//                                 <Button
//                                   size="small"
//                                   variant="text"
//                                   color="error"
//                                   onClick={() => handleDeleteStudent(stud._id)}
//                                   disabled={deleteLoadingId === stud._id}
//                                   sx={{
//                                     fontWeight: 600,
//                                     fontSize: "12px",
//                                     textTransform: "none",
//                                     fontFamily: '"Roboto", "Arial", sans-serif',
//                                     minWidth: 60,
//                                   }}
//                                 >
//                                   {deleteLoadingId === stud._id ? (
//                                     <CircularProgress
//                                       size={14}
//                                       color="inherit"
//                                     />
//                                   ) : (
//                                     "Delete"
//                                   )}
//                                 </Button>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   </CardContent>
//                 </Card>
//               </Box>

//               <Box
//                 sx={{
//                   display: { xs: "flex", md: "none" },
//                   flexDirection: "column",
//                   gap: 2.5,
//                 }}
//               >
//                 {students.map((stud) => (
//                   <Card
//                     key={stud._id}
//                     sx={{
//                       p: 2,
//                       borderRadius: "10px",
//                       border:
//                         mode === "dark"
//                           ? "1px solid #334155"
//                           : "1px solid #CBD5E1",
//                       borderLeft: "5px solid",
//                       borderLeftColor: "primary.main",
//                       boxShadow:
//                         mode === "light"
//                           ? "0 4px 12px rgba(15, 23, 42, 0.04)"
//                           : "none",
//                       bgcolor: "background.paper",
//                       transition: "transform 0.2s ease, box-shadow 0.2s ease",
//                       "&:hover": {
//                         transform: "translateY(-2px)",
//                         boxShadow:
//                           mode === "light"
//                             ? "0 12px 20px -5px rgba(15, 23, 42, 0.08)"
//                             : "0 4px 20px rgba(96, 165, 250, 0.1)",
//                       },
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         mb: 1.5,
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           fontSize: "11px",
//                           fontWeight: 700,
//                           fontFamily: '"Roboto", "Arial", sans-serif',
//                           color: "text.secondary",
//                         }}
//                       >
//                         {stud.admissionNo}
//                       </Typography>
//                       <Typography
//                         component="span"
//                         sx={{
//                           fontSize: "10px",
//                           fontWeight: 700,
//                           px: 1,
//                           py: 0.2,
//                           borderRadius: "4px",
//                           bgcolor:
//                             stud.status === "Active"
//                               ? mode === "light"
//                                 ? "rgba(16, 185, 129, 0.08)"
//                                 : "rgba(16, 185, 129, 0.15)"
//                               : mode === "light"
//                                 ? "rgba(15, 23, 42, 0.08)"
//                                 : "rgba(255, 255, 255, 0.1)",
//                           color:
//                             stud.status === "Active"
//                               ? "success.main"
//                               : "text.secondary",
//                           fontFamily: '"Roboto", "Arial", sans-serif',
//                         }}
//                       >
//                         {stud.status}
//                       </Typography>
//                     </Box>

//                     <Typography
//                       sx={{
//                         fontWeight: 700,
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontSize: "14px",
//                         mb: 1.5,
//                         color: "primary.main",
//                         textOverflow: "ellipsis",
//                         overflow: "hidden",
//                         maxWidth: "100%",
//                       }}
//                     >
//                       {stud.user.name}
//                     </Typography>

//                     <Box
//                       sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: 0.8,
//                         mb: 2,
//                       }}
//                     >
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           fontFamily: '"Roboto", "Arial", sans-serif',
//                           color: "text.secondary",
//                           fontSize: "12px",
//                         }}
//                       >
//                         <strong>Class & Section:</strong> {stud.class.name} -{" "}
//                         {stud.section.name}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           fontFamily: '"Roboto", "Arial", sans-serif',
//                           color: "text.secondary",
//                           fontSize: "12px",
//                         }}
//                       >
//                         <strong>Roll No:</strong> {stud.rollNo}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           fontFamily: '"Roboto", "Arial", sans-serif',
//                           color: "text.secondary",
//                           fontSize: "12px",
//                         }}
//                       >
//                         <strong>Parent Phone:</strong> {stud.parentPhone}
//                       </Typography>
//                     </Box>

//                     <Divider
//                       sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }}
//                     />

//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "flex-end",
//                         gap: 1.5,
//                       }}
//                     >
//                       <Button
//                         size="small"
//                         variant="outlined"
//                         color="primary"
//                         onClick={() => handleViewProfile(stud)}
//                         sx={{
//                           fontWeight: 600,
//                           fontSize: "12px",
//                           textTransform: "none",
//                           fontFamily: '"Roboto", "Arial", sans-serif',
//                           height: 30,
//                           borderRadius: "6px",
//                           borderWidth: "1px",
//                           "&:hover": {
//                             borderWidth: "1px",
//                             bgcolor: "rgba(30, 58, 138, 0.04)",
//                           },
//                         }}
//                       >
//                         View
//                       </Button>
//                       <Button
//                         size="small"
//                         variant="outlined"
//                         color="error"
//                         onClick={() => handleDeleteStudent(stud._id)}
//                         disabled={deleteLoadingId === stud._id}
//                         sx={{
//                           fontWeight: 600,
//                           fontSize: "12px",
//                           textTransform: "none",
//                           fontFamily: '"Roboto", "Arial", sans-serif',
//                           height: 30,
//                           borderRadius: "6px",
//                           minWidth: 70,
//                           borderWidth: "1px",
//                           "&:hover": {
//                             borderWidth: "1px",
//                             bgcolor: "rgba(239, 68, 68, 0.04)",
//                           },
//                         }}
//                       >
//                         {deleteLoadingId === stud._id ? (
//                           <CircularProgress size={14} color="inherit" />
//                         ) : (
//                           "Delete"
//                         )}
//                       </Button>
//                     </Box>
//                   </Card>
//                 ))}
//               </Box>
//             </Box>
//           )}
//         </Box>
//       )}

//       <Dialog
//         fullScreen={isFullScreen}
//         open={profileOpen}
//         onClose={() => setProfileOpen(false)}
//         maxWidth="sm"
//         fullWidth
//         sx={{
//           "& .MuiDialog-paper": {
//             borderRadius: isFullScreen ? 0 : "10px",
//             border: mode === "dark" ? "1px solid #334155" : "none",
//           },
//         }}
//       >
//         {selectedStudent && (
//           <>
//             <DialogTitle
//               sx={{
//                 fontWeight: 700,
//                 fontSize: "15px",
//                 fontFamily: '"Roboto", "Arial", sans-serif',
//                 color: "primary.main",
//                 borderBottom: "1px solid",
//                 borderColor: "divider",
//                 py: 2,
//               }}
//             >
//               Student Profile Details
//             </DialogTitle>
//             <DialogContent sx={{ p: 3, pt: "24px !important" }}>
//               <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                 <Box
//                   sx={{
//                     p: 2,
//                     bgcolor: "action.hover",
//                     borderRadius: "10px",
//                     border:
//                       mode === "dark"
//                         ? "1px solid #334155"
//                         : "1px solid #F1F5F9",
//                   }}
//                 >
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontWeight: 700,
//                       fontSize: "14px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       mb: 0.5,
//                     }}
//                   >
//                     {selectedStudent.user.name}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "12px",
//                     }}
//                   >
//                     Email: {selectedStudent.user.email}
//                   </Typography>
//                 </Box>

//                 <Box
//                   sx={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr",
//                     gap: 2,
//                   }}
//                 >
//                   <Box>
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontWeight: 500,
//                         fontSize: "12px",
//                       }}
//                     >
//                       Admission No
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontWeight: 600,
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontSize: "13px",
//                       }}
//                     >
//                       {selectedStudent.admissionNo}
//                     </Typography>
//                   </Box>
//                   <Box>
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontWeight: 500,
//                         fontSize: "12px",
//                       }}
//                     >
//                       Class & Section
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontWeight: 600,
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontSize: "13px",
//                       }}
//                     >
//                       {selectedStudent.class.name} -{" "}
//                       {selectedStudent.section.name}
//                     </Typography>
//                   </Box>
//                   <Box>
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontWeight: 500,
//                         fontSize: "12px",
//                       }}
//                     >
//                       Roll No
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontWeight: 600,
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontSize: "13px",
//                       }}
//                     >
//                       {selectedStudent.rollNo}
//                     </Typography>
//                   </Box>
//                   <Box>
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontWeight: 500,
//                         fontSize: "12px",
//                       }}
//                     >
//                       Gender
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontWeight: 600,
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontSize: "13px",
//                       }}
//                     >
//                       {selectedStudent.gender}
//                     </Typography>
//                   </Box>
//                   <Box>
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontWeight: 500,
//                         fontSize: "12px",
//                       }}
//                     >
//                       Date of Birth
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontWeight: 600,
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontSize: "13px",
//                       }}
//                     >
//                       {new Date(
//                         selectedStudent.dateOfBirth,
//                       ).toLocaleDateString()}
//                     </Typography>
//                   </Box>
//                   <Box>
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontWeight: 500,
//                         fontSize: "12px",
//                       }}
//                     >
//                       Status
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontWeight: 600,
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontSize: "13px",
//                         color:
//                           selectedStudent.status === "Active"
//                             ? "success.main"
//                             : "text.secondary",
//                       }}
//                     >
//                       {selectedStudent.status}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Divider
//                   sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }}
//                 />

//                 <Typography
//                   sx={{
//                     fontWeight: 700,
//                     fontFamily: '"Roboto", "Arial", sans-serif',
//                     color: "primary.main",
//                     fontSize: "13px",
//                   }}
//                 >
//                   Parent / Guardian Details
//                 </Typography>

//                 <Box
//                   sx={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr",
//                     gap: 2,
//                   }}
//                 >
//                   <Box>
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontWeight: 500,
//                         fontSize: "12px",
//                       }}
//                     >
//                       Father/Guardian Name
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontWeight: 600,
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontSize: "13px",
//                       }}
//                     >
//                       {selectedStudent.parentName}
//                     </Typography>
//                   </Box>
//                   <Box>
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontWeight: 500,
//                         fontSize: "12px",
//                       }}
//                     >
//                       Parent Contact Phone
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontWeight: 600,
//                         fontFamily: '"Roboto", "Arial", sans-serif',
//                         fontSize: "13px",
//                       }}
//                     >
//                       {selectedStudent.parentPhone}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Box>
//             </DialogContent>
//             <DialogActions
//               sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
//             >
//               <Button
//                 onClick={() => setProfileOpen(false)}
//                 variant="contained"
//                 color="primary"
//                 sx={{
//                   px: 3,
//                   height: 38,
//                   fontSize: "13px",
//                   borderRadius: "8px",
//                   textTransform: "none",
//                   boxShadow: "none",
//                   fontWeight: 600,
//                   fontFamily: '"Roboto", "Arial", sans-serif',
//                   "&:hover": { boxShadow: "none" },
//                 }}
//               >
//                 Close
//               </Button>
//             </DialogActions>
//           </>
//         )}
//       </Dialog>
//     </Box>
//   );
// };

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
  admitStudent,
  getStudents,
  getStudentProfile,
  deleteStudent,
} from "../services/studentService";
// Excel Exporter and Named Icons Import [1]
import { exportToExcel } from "../utils/exportUtil";
import { 
  Download as DownloadIcon, 
  Badge as BadgeIcon, 
  CardMembership as CardMembershipIcon,
  ArrowBack as ArrowBackIcon 
} from '@mui/icons-material';

interface Section {
  _id: string;
  name: string;
}

interface ClassData {
  _id: string;
  name: string;
  sections: Section[];
}

interface StudentData {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  admissionNo: string;
  rollNo: string;
  dateOfBirth: string;
  gender: string;
  class: {
    _id: string;
    name: string;
  };
  section: {
    _id: string;
    name: string;
  };
  parentName: string;
  parentPhone: string;
  status: string;
}

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

  boxShadow: mode === "light" 
    ? "0 10px 30px rgba(15, 23, 42, 0.06)" 
    : "none",
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

export const Students: React.FC = () => {
  const { mode } = useCustomTheme();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [students, setStudents] = useState<StudentData[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const [profileOpen, setProfileOpen] = useState(false);
  const [idCardOpen, setIdCardOpen] = useState(false); // ID Card state [1]
  const [tcOpen, setTcOpen] = useState(false); // TC state [1]
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
    null,
  );

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success",
  );

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [studentClassId, setStudentClassId] = useState("");
  const [studentSectionId, setStudentSectionId] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");

  const [admitLoading, setAdmitLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      const res = await getClasses();
      setClasses(res.data);
    } catch {
      setToastSeverity("error");
      setToastMessage("Failed to fetch classes for admission form.");
      setToastOpen(true);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getStudents();
      setStudents(res.data);
      setLoading(false);
    } catch {
      setLoading(false);
      setToastSeverity("error");
      setToastMessage("Failed to fetch student list.");
      setToastOpen(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClasses();
    fetchStudents();
  }, [fetchClasses, fetchStudents]);

  const handleClassChange = (classId: string) => {
    setStudentClassId(classId);
    setStudentSectionId("");

    const selectedClass = classes.find((c) => c._id === classId);
    if (selectedClass) {
      setAvailableSections(selectedClass.sections);
    } else {
      setAvailableSections([]);
    }
  };

  const handleAdmitStudent = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !studentName ||
      !studentEmail ||
      !admissionNo ||
      !rollNo ||
      !dob ||
      !gender ||
      !studentClassId ||
      !studentSectionId ||
      !parentName ||
      !parentPhone
    ) {
      setToastSeverity("error");
      setToastMessage("Please fill out all fields in the Admission Form!");
      setToastOpen(true);
      return;
    }

    setAdmitLoading(true);

    setTimeout(async () => {
      try {
        await admitStudent({
          name: studentName,
          email: studentEmail,
          password: studentPassword || undefined,
          admissionNo,
          rollNo,
          dateOfBirth: dob,
          gender,
          classId: studentClassId,
          sectionId: studentSectionId,
          parentName,
          parentPhone,
        });

        setToastSeverity("success");
        setToastMessage("Student admitted successfully!");
        setToastOpen(true);

        setStudentName("");
        setStudentEmail("");
        setStudentPassword("");
        setAdmissionNo("");
        setRollNo("");
        setDob("");
        setGender("");
        setStudentClassId("");
        setStudentSectionId("");
        setAvailableSections([]);
        setParentName("");
        setParentPhone("");

        setAdmitLoading(false);
        fetchStudents();
      } catch (err: unknown) {
        setAdmitLoading(false);
        let msg = "Failed to admit student.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleDeleteStudent = (studentId: string) => {
    setDeleteLoadingId(studentId);

    setTimeout(async () => {
      try {
        const res = await deleteStudent(studentId);
        setToastSeverity("success");
        setToastMessage(
          res.message || "Student profile deactivated successfully!",
        );
        setToastOpen(true);
        setDeleteLoadingId(null);
        fetchStudents();
      } catch (err: unknown) {
        setDeleteLoadingId(null);
        let msg = "Failed to delete student.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);

        console.error("--- DELETE STUDENT ERROR DETAILS ---");
        console.error(err);
        console.error("------------------------------------");
      }
    }, 2000);
  };

  const handleViewProfile = async (student: StudentData) => {
    try {
      const res = await getStudentProfile(student._id);
      setSelectedStudent(res.data);
      setProfileOpen(true);
    } catch {
      setToastSeverity("error");
      setToastMessage("Failed to fetch complete student profile details.");
      setToastOpen(true);
    }
  };

  const handleOpenIdCard = (student: StudentData) => {
    setSelectedStudent(student);
    setIdCardOpen(true);
  };

  const handleOpenTC = (student: StudentData) => {
    setSelectedStudent(student);
    setTcOpen(true);
  };

  const handleExcelExport = () => {
    if (students.length === 0) return;
    
    const formattedData = students.map(s => ({
      'Admission No': s.admissionNo,
      'Student Name': s.user.name,
      'Class': s.class.name,
      'Section': s.section.name,
      'Roll No': s.rollNo,
      'Parent Contact': s.parentPhone,
      'Status': s.status
    }));

    exportToExcel(formattedData, 'Students_Directory_Report_2026');
  };

  const handlePrint = () => {
    window.print();
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
        Student Management
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
        Admit new students and manage profiles.
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
          <Tab label="Admit Student" />
          <Tab label="Students List" />
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
              Student Admission Form
            </Typography>

            <form onSubmit={handleAdmitStudent}>
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
                  placeholder="Enter student full name"
                  variant="outlined"
                  size="small"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  disabled={admitLoading}
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
                  placeholder="Enter student email address"
                  type="email"
                  variant="outlined"
                  size="small"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  disabled={admitLoading}
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
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  disabled={admitLoading}
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
                  label="Date of Birth"
                  type="date"
                  variant="outlined"
                  size="small"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  disabled={admitLoading}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
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

                <FormControl size="small">
                  <InputLabel
                    id="gender-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Gender
                  </InputLabel>
                  <Select
                    labelId="gender-label"
                    value={gender}
                    label="Gender"
                    onChange={(e) => setGender(e.target.value)}
                    disabled={admitLoading}
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
                      value="Male"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      Male
                    </MenuItem>
                    <MenuItem
                      value="Female"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      Female
                    </MenuItem>
                    <MenuItem
                      value="Other"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      Other
                    </MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Admission Number"
                  placeholder="Enter admission number"
                  variant="outlined"
                  size="small"
                  value={admissionNo}
                  onChange={(e) => setAdmissionNo(e.target.value)}
                  disabled={admitLoading}
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
                  label="Roll Number"
                  placeholder="Enter class roll number"
                  variant="outlined"
                  size="small"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  disabled={admitLoading}
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

                <FormControl size="small">
                  <InputLabel
                    id="student-class-label"
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
                    labelId="student-class-label"
                    value={studentClassId}
                    label="Class"
                    onChange={(e) => handleClassChange(e.target.value)}
                    disabled={admitLoading}
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

                <FormControl size="small">
                  <InputLabel
                    id="student-section-label"
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
                    labelId="student-section-label"
                    value={studentSectionId}
                    label="Section"
                    onChange={(e) => setStudentSectionId(e.target.value)}
                    disabled={admitLoading || !studentClassId}
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
                    {availableSections.length > 0 ? (
                      availableSections.map((sec) => (
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

                <TextField
                  label="Parent/Guardian Name"
                  placeholder="Enter father or guardian name"
                  variant="outlined"
                  size="small"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  disabled={admitLoading}
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
                  label="Parent Contact Phone"
                  placeholder="Enter parent mobile number"
                  variant="outlined"
                  size="small"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  disabled={admitLoading}
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
                disabled={admitLoading}
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
                {admitLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Admit Student"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={28} />
            </Box>
          ) : students.length === 0 ? (
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
                No students registered in the system yet.
              </Typography>
            </Card>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Premium Top Actions Bar with Excel Export */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, flexWrap: "wrap" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                  onClick={handleExcelExport}
                  sx={{
                    height: 38,
                    fontSize: "12px",
                    fontWeight: 600,
                    borderRadius: "8px",
                    textTransform: "none",
                    fontFamily: '"Roboto", "Arial", sans-serif',
                    borderWidth: "1.5px",
                    "&:hover": { borderWidth: "1.5px" }
                  }}
                >
                  Export Directory (Excel)
                </Button>
              </Box>

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
                      Enrolled Students Directory
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
                              Class & Section
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
                              Roll No
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
                              Parent Phone
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
                          {students.map((stud) => (
                            <TableRow
                              key={stud._id}
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
                                {stud.admissionNo}
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
                                {stud.user.name}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: "13px",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  borderBottomColor: "divider",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {stud.class.name} - {stud.section.name}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: "13px",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  borderBottomColor: "divider",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {stud.rollNo}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: "13px",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  borderBottomColor: "divider",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {stud.parentPhone}
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
                                      stud.status === "Active"
                                        ? mode === "light"
                                          ? "rgba(16, 185, 129, 0.08)"
                                          : "rgba(16, 185, 129, 0.15)"
                                        : mode === "light"
                                          ? "rgba(15, 23, 42, 0.08)"
                                          : "rgba(255, 255, 255, 0.1)",
                                    color:
                                      stud.status === "Active"
                                        ? "success.main"
                                        : "text.secondary",
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                  }}
                                >
                                  {stud.status}
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
                                  onClick={() => handleViewProfile(stud)}
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
                                {/* Generate ID Card link [1] */}
                                <Button 
                                  size="small" 
                                  variant="text" 
                                  color="secondary" 
                                  onClick={() => handleOpenIdCard(stud)}
                                  sx={{ fontWeight: 600, fontSize: "12px", textTransform: "none", fontFamily: '"Roboto", "Arial", sans-serif', mr: 1 }}
                                >
                                  ID Card
                                </Button>
                                {/* Issue Transfer Certificate link [1] */}
                                <Button 
                                  size="small" 
                                  variant="text" 
                                  color="secondary" 
                                  onClick={() => handleOpenTC(stud)}
                                  sx={{ fontWeight: 600, fontSize: "12px", textTransform: "none", fontFamily: '"Roboto", "Arial", sans-serif', mr: 1 }}
                                >
                                  TC
                                </Button>
                                <Button
                                  size="small"
                                  variant="text"
                                  color="error"
                                  onClick={() => handleDeleteStudent(stud._id)}
                                  disabled={deleteLoadingId === stud._id}
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    textTransform: "none",
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    minWidth: 60,
                                  }}
                                >
                                  {deleteLoadingId === stud._id ? (
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
                {students.map((stud) => (
                  <Card
                    key={stud._id}
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
                        {stud.admissionNo}
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
                            stud.status === "Active"
                              ? mode === "light"
                                ? "rgba(16, 185, 129, 0.08)"
                                : "rgba(16, 185, 129, 0.15)"
                              : mode === "light"
                                ? "rgba(15, 23, 42, 0.08)"
                                : "rgba(255, 255, 255, 0.1)",
                          color:
                            stud.status === "Active"
                              ? "success.main"
                              : "text.secondary",
                          fontFamily: '"Roboto", "Arial", sans-serif',
                        }}
                      >
                        {stud.status}
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
                      {stud.user.name}
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
                        <strong>Class & Section:</strong> {stud.class.name} -{" "}
                        {stud.section.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          color: "text.secondary",
                          fontSize: "12px",
                        }}
                      >
                        <strong>Roll No:</strong> {stud.rollNo}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          color: "text.secondary",
                          fontSize: "12px",
                        }}
                      >
                        <strong>Parent Phone:</strong> {stud.parentPhone}
                      </Typography>
                    </Box>

                    <Divider
                      sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 0.8,
                        overflowX: "auto",
                        flexWrap: "nowrap"
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleViewProfile(stud)}
                        sx={{
                          fontWeight: 600,
                          fontSize: "11px",
                          textTransform: "none",
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          height: 28,
                          borderRadius: "6px",
                          borderWidth: "1px",
                          px: 1,
                          minWidth: "auto",
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
                        onClick={() => handleOpenIdCard(stud)}
                        sx={{
                          fontWeight: 600,
                          fontSize: "11px",
                          textTransform: "none",
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          height: 28,
                          borderRadius: "6px",
                          borderWidth: "1px",
                          px: 1,
                          minWidth: "auto",
                          "&:hover": {
                            borderWidth: "1px",
                            bgcolor: "rgba(107, 114, 128, 0.04)",
                          },
                        }}
                      >
                        ID Card
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleOpenTC(stud)}
                        sx={{
                          fontWeight: 600,
                          fontSize: "11px",
                          textTransform: "none",
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          height: 28,
                          borderRadius: "6px",
                          borderWidth: "1px",
                          px: 1,
                          minWidth: "auto",
                          "&:hover": {
                            borderWidth: "1px",
                            bgcolor: "rgba(107, 114, 128, 0.04)",
                          },
                        }}
                      >
                        TC
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteStudent(stud._id)}
                        disabled={deleteLoadingId === stud._id}
                        sx={{
                          fontWeight: 600,
                          fontSize: "11px",
                          textTransform: "none",
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          height: 28,
                          borderRadius: "6px",
                          minWidth: 54,
                          borderWidth: "1px",
                          px: 1,
                          "&:hover": {
                            borderWidth: "1px",
                            bgcolor: "rgba(239, 68, 68, 0.04)",
                          },
                        }}
                      >
                        {deleteLoadingId === stud._id ? (
                          <CircularProgress size={12} color="inherit" />
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

      {/* Profile Dialog */}
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
        {selectedStudent && (
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
              Student Profile Details
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
                    {selectedStudent.user.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "12px",
                    }}
                  >
                    Email: {selectedStudent.user.email}
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
                      Admission No
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      {selectedStudent.admissionNo}
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
                      Class & Section
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      {selectedStudent.class.name} -{" "}
                      {selectedStudent.section.name}
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
                      Roll No
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      {selectedStudent.rollNo}
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
                      Gender
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      {selectedStudent.gender}
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
                      Date of Birth
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      {new Date(
                        selectedStudent.dateOfBirth,
                      ).toLocaleDateString()}
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
                          selectedStudent.status === "Active"
                            ? "success.main"
                            : "text.secondary",
                      }}
                    >
                      {selectedStudent.status}
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
                  Parent / Guardian Details
                </Typography>

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
                      Father/Guardian Name
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      {selectedStudent.parentName}
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
                      Parent Contact Phone
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      {selectedStudent.parentPhone}
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
    </Box>
  );
};
  // ab is style to mny sab manage kr dia ha excel report bhi ban rha ha lakin jo nechay wo button ha id card or ts wala wo logic kaisy kam kr ha dekho zara sab thk ha. is me wo do dialog reh gy to is file me wo merge kr k iska final full code do.