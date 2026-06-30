// /* eslint-disable react-hooks/set-state-in-effect */
// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
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
//   ToggleButton,
//   ToggleButtonGroup,
//   Divider,
//   TextField,
// } from "@mui/material";
// import axios from "axios";
// import { useCustomTheme } from "../context/ThemeContext";
// import { getClasses } from "../services/academicService";
// import { getStudents } from "../services/studentService";
// import { getTeachers } from "../services/teacherService";
// import {
//   markStudentAttendance,
//   getStudentAttendanceReport,
//   markStaffAttendance,
//   getStaffAttendanceReport,
// } from "../services/attendanceService";

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
//   };
//   rollNo: string;
//   admissionNo: string;
//   class: {
//     _id: string;
//     name: string;
//   };
//   section: {
//     _id: string;
//     name: string;
//   };
//   status: string;
// }

// interface TeacherData {
//   _id: string;
//   user: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   employeeId: string;
// }

// interface AttendanceRecord {
//   _id: string;
//   student: {
//     user: {
//       name: string;
//     };
//     admissionNo: string;
//     rollNo: string;
//   };
//   status: string;
// }

// interface StaffAttendanceRecord {
//   _id: string;
//   staff: {
//     name: string;
//     email: string;
//     role: string;
//   };
//   status: string;
// }

// export const Attendance: React.FC = () => {
//   const { mode } = useCustomTheme();
//   const [activeTab, setActiveTab] = useState(0);

//   const [classes, setClasses] = useState<ClassData[]>([]);
//   const [studentsList, setStudentsList] = useState<StudentData[]>([]);
//   const [teachersList, setTeachersList] = useState<TeacherData[]>([]);
//   const [availableSections, setAvailableSections] = useState<Section[]>([]);
//   const [, setLoading] = useState(true);
//   const [toastOpen, setToastOpen] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
//     "success",
//   );

//   const [classId, setClassId] = useState("");
//   const [sectionId, setSectionId] = useState("");
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [attendanceRecords, setAttendanceRecords] = useState<{
//     [key: string]: string;
//   }>({});

//   const [reportClassId, setReportClassId] = useState("");
//   const [reportSectionId, setReportSectionId] = useState("");
//   const [reportDate, setReportDate] = useState(
//     new Date().toISOString().split("T")[0],
//   );
//   const [studentReport, setStudentReport] = useState<AttendanceRecord[]>([]);
//   const [reportLoading, setReportLoading] = useState(false);

//   const [staffDate, setStaffDate] = useState(
//     new Date().toISOString().split("T")[0],
//   );
//   const [staffRecords, setStaffRecords] = useState<{ [key: string]: string }>(
//     {},
//   );

//   const [staffReportDate, setStaffReportDate] = useState(
//     new Date().toISOString().split("T")[0],
//   );
//   const [staffReport, setStaffReport] = useState<StaffAttendanceRecord[]>([]);
//   const [staffReportLoading, setStaffReportLoading] = useState(false);

//   const [saveLoading, setSaveLoading] = useState(false);
//   const [staffSaveLoading, setStaffSaveLoading] = useState(false);

//   const loadBaseData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const resClasses = await getClasses();
//       const resTeachers = await getTeachers();
//       setClasses(resClasses.data);
       
//       setTeachersList(
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         resTeachers.data.filter((t: any) => t.status === "Active"),
//       );
//       setLoading(false);
//     } catch {
//       setLoading(false);
//       setToastSeverity("error");
//       setToastMessage(
//         "Failed to fetch baseline attendance classes/staff data.",
//       );
//       setToastOpen(true);
//     }
//   }, []);

//   useEffect(() => {
//     loadBaseData();
//   }, [loadBaseData]);

//   const handleClassChange = (selectedClassId: string, isFilter: boolean) => {
//     if (isFilter) {
//       setReportClassId(selectedClassId);
//       setReportSectionId("");
//     } else {
//       setClassId(selectedClassId);
//       setSectionId("");
//       setStudentsList([]);
//       setAttendanceRecords({});
//     }

//     const selectedClass = classes.find((c) => c._id === selectedClassId);
//     if (selectedClass) {
//       setAvailableSections(selectedClass.sections);
//     } else {
//       setAvailableSections([]);
//     }
//   };

//   const handleLoadClassStudents = async () => {
//     if (!classId || !sectionId) {
//       setToastSeverity("error");
//       setToastMessage("Please select both Class and Section first!");
//       setToastOpen(true);
//       return;
//     }

//     try {
//       setLoading(true);

//       console.log("--- ATTENDANCE SEARCH FILTER PARAMS ---");
//       console.log("Selected Class ID:", classId);
//       console.log("Selected Section ID:", sectionId);
//       console.log("----------------------------------------");

//       const res = await getStudents();

//       console.log("Fetched Students from Backend:", res.data);

//       const filtered = res.data.filter(
//         (s: StudentData) =>
//           s.class._id === classId &&
//           s.section._id === sectionId &&
//           s.status === "Active",
//       );

//       console.log("Filtered Students Count:", filtered.length);
//       console.log("Filtered Students:", filtered);

//       if (filtered.length === 0) {
//         setToastSeverity("error");
//         setToastMessage("No active students found in this class & section!");
//         setToastOpen(true);
//       }

//       setStudentsList(filtered);

//       const initialRecords: { [key: string]: string } = {};
//       filtered.forEach((stud: StudentData) => {
//         initialRecords[stud._id] = "Present";
//       });
//       setAttendanceRecords(initialRecords);
//       setLoading(false);
//     } catch (err: unknown) {
//       setLoading(false);
//       let msg = "Failed to fetch class students list.";
//       if (axios.isAxiosError(err)) {
//         msg = err.response?.data?.message || msg;
//       }
//       setToastSeverity("error");
//       setToastMessage(msg);
//       setToastOpen(true);
//       console.error("Error in handleLoadClassStudents:", err);
//     }
//   };

//   const handleStatusChange = (studentId: string, status: string) => {
//     if (status) {
//       setAttendanceRecords((prev) => ({
//         ...prev,
//         [studentId]: status,
//       }));
//     }
//   };

//   const handleSaveAttendance = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (studentsList.length === 0) {
//       setToastSeverity("error");
//       setToastMessage("No student list loaded to save attendance!");
//       setToastOpen(true);
//       return;
//     }

//     setSaveLoading(true);

//     const formattedRecords = Object.keys(attendanceRecords).map((key) => ({
//       student: key,
//       status: attendanceRecords[key],
//     }));

//     setTimeout(async () => {
//       try {
//         await markStudentAttendance({
//           classId,
//           sectionId,
//           date,
//           records: formattedRecords,
//         });

//         setToastSeverity("success");
//         setToastMessage("Student daily attendance saved successfully!");
//         setToastOpen(true);

//         setStudentsList([]);
//         setAttendanceRecords({});
//         setClassId("");
//         setSectionId("");
//         setSaveLoading(false);
//       } catch (err: unknown) {
//         setSaveLoading(false);
//         let msg = "Failed to save student attendance.";
//         if (axios.isAxiosError(err)) {
//           msg = err.response?.data?.message || msg;
//         }
//         setToastSeverity("error");
//         setToastMessage(msg);
//         setToastOpen(true);
//       }
//     }, 2000);
//   };

//   const handleLoadStudentReport = async () => {
//     if (!reportClassId || !reportSectionId || !reportDate) {
//       setToastSeverity("error");
//       setToastMessage(
//         "Please select Class, Section, and Date to generate report!",
//       );
//       setToastOpen(true);
//       return;
//     }

//     try {
//       setReportLoading(true);
//       const res = await getStudentAttendanceReport(
//         reportClassId,
//         reportSectionId,
//         reportDate,
//       );
//       setStudentReport(res.data);
//       setReportLoading(false);
//     } catch {
//       setReportLoading(false);
//       setToastSeverity("error");
//       setToastMessage("Failed to fetch attendance report.");
//       setToastOpen(true);
//     }
//   };

//   const handleLoadStaff = () => {
//     if (teachersList.length === 0) {
//       setToastSeverity("error");
//       setToastMessage("No active staff registered in the directory!");
//       setToastOpen(true);
//       return;
//     }

//     const initialStaff: { [key: string]: string } = {};
//     teachersList.forEach((teach) => {
//       initialStaff[teach.user._id] = "Present";
//     });
//     setStaffRecords(initialStaff);
//   };

//   const handleStaffStatusChange = (staffId: string, status: string) => {
//     if (status) {
//       setStaffRecords((prev) => ({ ...prev, [staffId]: status }));
//     }
//   };

//   const handleSaveStaffAttendance = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (Object.keys(staffRecords).length === 0) {
//       setToastSeverity("error");
//       setToastMessage("No staff loaded to mark attendance!");
//       setToastOpen(true);
//       return;
//     }

//     setStaffSaveLoading(true);

//     const formattedRecords = Object.keys(staffRecords).map((key) => ({
//       staff: key,
//       status: staffRecords[key],
//     }));

//     setTimeout(async () => {
//       try {
//         await markStaffAttendance({
//           date: staffDate,
//           records: formattedRecords,
//         });

//         setToastSeverity("success");
//         setToastMessage("Staff daily attendance saved successfully!");
//         setToastOpen(true);

//         setStaffRecords({});
//         setStaffSaveLoading(false);
//       } catch (err: unknown) {
//         setStaffSaveLoading(false);
//         let msg = "Failed to save staff attendance.";
//         if (axios.isAxiosError(err)) {
//           msg = err.response?.data?.message || msg;
//         }
//         setToastSeverity("error");
//         setToastMessage(msg);
//         setToastOpen(true);
//       }
//     }, 2000);
//   };

//   const handleLoadStaffReport = async () => {
//     try {
//       setStaffReportLoading(true);
//       const res = await getStaffAttendanceReport(staffReportDate);
//       setStaffReport(res.data);
//       setStaffReportLoading(false);
//     } catch {
//       setStaffReportLoading(false);
//       setToastSeverity("error");
//       setToastMessage("Failed to fetch staff attendance report.");
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
//         Attendance System
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
//         Mark and manage daily attendance logs for students and staff.
//       </Typography>

//       <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
//         <Tabs
//           value={activeTab}
//           onChange={(_, newValue) => setActiveTab(newValue)}
//           textColor="primary"
//           indicatorColor="primary"
//           variant="scrollable"
//           scrollButtons="auto"
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
//           <Tab label="Mark Student Attendance" />
//           <Tab label="Student Attendance Report" />
//           <Tab label="Mark Staff Attendance" />
//           <Tab label="Staff Attendance Report" />
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
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//           <Card
//             sx={{
//               borderRadius: "10px",
//               bgcolor: "background.paper",
//               boxShadow:
//                 mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
//               border:
//                 mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
//               width: "100%",
//               maxWidth: "100%",
//             }}
//           >
//             <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
//               <Box
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: {
//                     xs: "1fr",
//                     sm: "1fr 1fr",
//                     md: "1.2fr 1.2fr 1.2fr 1fr",
//                   },
//                   gap: 2,
//                   alignItems: "center",
//                   width: "100%",
//                 }}
//               >
//                 <FormControl size="small" fullWidth>
//                   <InputLabel
//                     id="mark-class-label"
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
//                     labelId="mark-class-label"
//                     value={classId}
//                     label="Class"
//                     onChange={(e) => handleClassChange(e.target.value, false)}
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

//                 <FormControl size="small" fullWidth>
//                   <InputLabel
//                     id="mark-section-label"
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
//                     labelId="mark-section-label"
//                     value={sectionId}
//                     label="Section"
//                     onChange={(e) => setSectionId(e.target.value)}
//                     disabled={!classId}
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
//                     {availableSections.map((sec) => (
//                       <MenuItem
//                         key={sec._id}
//                         value={sec._id}
//                         sx={{
//                           fontFamily: '"Roboto", "Arial", sans-serif',
//                           fontSize: "13px",
//                         }}
//                       >
//                         {sec.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 <TextField
//                   type="date"
//                   label="Date"
//                   variant="outlined"
//                   size="small"
//                   fullWidth
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   slotProps={{ inputLabel: { shrink: true } }}
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

//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={handleLoadClassStudents}
//                   fullWidth
//                   sx={{
//                     height: 42,
//                     fontSize: "13px",
//                     borderRadius: "8px",
//                     textTransform: "none",
//                     boxShadow: "none",
//                     fontWeight: 600,
//                     fontFamily: '"Roboto", "Arial", sans-serif',
//                   }}
//                 >
//                   Load Students
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>

//           {studentsList.length > 0 && (
//             <Card
//               sx={{
//                 borderRadius: "10px",
//                 bgcolor: "background.paper",
//                 boxShadow:
//                   mode === "light"
//                     ? "0 1px 3px rgba(15, 23, 42, 0.04)"
//                     : "none",
//                 border:
//                   mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
//                 p: 1,
//                 width: "100%",
//                 maxWidth: "100%",
//               }}
//             >
//               <CardContent sx={{ p: 0 }}>
//                 <Typography
//                   variant="h6"
//                   color="primary"
//                   sx={{
//                     fontWeight: 700,
//                     fontSize: "14px",
//                     p: 2,
//                     fontFamily: '"Roboto", "Arial", sans-serif',
//                   }}
//                 >
//                   Mark Daily Student Attendance
//                 </Typography>

//                 <Box sx={{ display: { xs: "none", md: "block" } }}>
//                   <TableContainer
//                     component={Paper}
//                     elevation={0}
//                     sx={{ bgcolor: "transparent" }}
//                   >
//                     <Table sx={{ minWidth: 600 }}>
//                       <TableHead sx={{ bgcolor: "action.hover" }}>
//                         <TableRow>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: "13px",
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               borderBottomColor: "divider",
//                             }}
//                           >
//                             Roll No
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: "13px",
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               borderBottomColor: "divider",
//                             }}
//                           >
//                             Student Name
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: "13px",
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               borderBottomColor: "divider",
//                             }}
//                             align="right"
//                           >
//                             Attendance Status
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {studentsList.map((stud) => (
//                           <TableRow
//                             key={stud._id}
//                             sx={{
//                               "&:last-child td, &:last-child th": { border: 0 },
//                               "&:hover": { bgcolor: "action.hover" },
//                             }}
//                           >
//                             <TableCell
//                               sx={{
//                                 fontWeight: 600,
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                               }}
//                             >
//                               {stud.rollNo}
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 600,
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                               }}
//                             >
//                               {stud.user.name}
//                             </TableCell>
//                             <TableCell
//                               align="right"
//                               sx={{ borderBottomColor: "divider" }}
//                             >
//                               <ToggleButtonGroup
//                                 size="small"
//                                 color="primary"
//                                 value={attendanceRecords[stud._id] || "Present"}
//                                 exclusive
//                                 onChange={(_, val) =>
//                                   handleStatusChange(stud._id, val)
//                                 }
//                                 sx={{ height: 32, borderRadius: "6px" }}
//                               >
//                                 <ToggleButton
//                                   value="Present"
//                                   sx={{
//                                     fontFamily: '"Roboto", "Arial", sans-serif',
//                                     fontSize: "0.75rem",
//                                     fontWeight: 600,
//                                     textTransform: "none",
//                                   }}
//                                 >
//                                   Present
//                                 </ToggleButton>
//                                 <ToggleButton
//                                   value="Absent"
//                                   sx={{
//                                     fontFamily: '"Roboto", "Arial", sans-serif',
//                                     fontSize: "0.75rem",
//                                     fontWeight: 600,
//                                     color: "error.main",
//                                     textTransform: "none",
//                                   }}
//                                 >
//                                   Absent
//                                 </ToggleButton>
//                                 <ToggleButton
//                                   value="Late"
//                                   sx={{
//                                     fontFamily: '"Roboto", "Arial", sans-serif',
//                                     fontSize: "0.75rem",
//                                     fontWeight: 600,
//                                     color: "warning.main",
//                                     textTransform: "none",
//                                   }}
//                                 >
//                                   Late
//                                 </ToggleButton>
//                               </ToggleButtonGroup>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Box>

//                 <Box
//                   sx={{
//                     display: { xs: "flex", md: "none" },
//                     flexDirection: "column",
//                     gap: 2,
//                     p: 2,
//                   }}
//                 >
//                   {studentsList.map((stud) => (
//                     <Card
//                       key={stud._id}
//                       sx={{
//                         p: 2,
//                         borderRadius: "10px",
//                         border:
//                           mode === "dark"
//                             ? "1px solid #1F2937"
//                             : "1px solid #E2E8F0",
//                         boxShadow: "none",
//                         bgcolor: "background.paper",
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           mb: 1.5,
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: "11px",
//                             fontWeight: 700,
//                             fontFamily: '"Roboto", "Arial", sans-serif',
//                             color: "text.secondary",
//                           }}
//                         >
//                           Roll No: {stud.rollNo}
//                         </Typography>
//                       </Box>

//                       <Typography
//                         sx={{
//                           fontWeight: 600,
//                           fontFamily: '"Roboto", "Arial", sans-serif',
//                           fontSize: "13px",
//                           mb: 2,
//                           color: "text.primary",
//                         }}
//                       >
//                         {stud.user.name}
//                       </Typography>

//                       <Divider
//                         sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }}
//                       />

//                       <Box sx={{ display: "flex", justifyContent: "center" }}>
//                         <ToggleButtonGroup
//                           size="small"
//                           color="primary"
//                           value={attendanceRecords[stud._id] || "Present"}
//                           exclusive
//                           onChange={(_, val) =>
//                             handleStatusChange(stud._id, val)
//                           }
//                           sx={{
//                             height: 34,
//                             width: "100%",
//                             justifyContent: "center",
//                             borderRadius: "6px",
//                           }}
//                         >
//                           <ToggleButton
//                             value="Present"
//                             sx={{
//                               flexGrow: 1,
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               fontSize: "0.75rem",
//                               fontWeight: 600,
//                               textTransform: "none",
//                             }}
//                           >
//                             Present
//                           </ToggleButton>
//                           <ToggleButton
//                             value="Absent"
//                             sx={{
//                               flexGrow: 1,
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               fontSize: "0.75rem",
//                               fontWeight: 600,
//                               color: "error.main",
//                               textTransform: "none",
//                             }}
//                           >
//                             Absent
//                           </ToggleButton>
//                           <ToggleButton
//                             value="Late"
//                             sx={{
//                               flexGrow: 1,
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               fontSize: "0.75rem",
//                               fontWeight: 600,
//                               color: "warning.main",
//                               textTransform: "none",
//                             }}
//                           >
//                             Late
//                           </ToggleButton>
//                         </ToggleButtonGroup>
//                       </Box>
//                     </Card>
//                   ))}
//                 </Box>

//                 <Box
//                   sx={{
//                     p: 2,
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     borderTop: "1px solid",
//                     borderColor: "divider",
//                   }}
//                 >
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     disabled={saveLoading}
//                     onClick={handleSaveAttendance}
//                     sx={{
//                       height: 42,
//                       fontSize: "13px",
//                       borderRadius: "8px",
//                       px: 4,
//                       textTransform: "none",
//                       boxShadow: "none",
//                       fontWeight: 600,
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                     }}
//                   >
//                     {saveLoading ? (
//                       <CircularProgress size={18} color="inherit" />
//                     ) : (
//                       "Save Attendance"
//                     )}
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>
//           )}
//         </Box>
//       )}

//       {activeTab === 1 && (
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//           <Card
//             sx={{
//               borderRadius: "10px",
//               bgcolor: "background.paper",
//               boxShadow:
//                 mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
//               border:
//                 mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
//               width: "100%",
//               maxWidth: "100%",
//             }}
//           >
//             <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
//               <Box
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: {
//                     xs: "1fr",
//                     sm: "1fr 1fr",
//                     md: "1.2fr 1.2fr 1.2fr 1fr",
//                   },
//                   gap: 2,
//                   alignItems: "center",
//                   width: "100%",
//                 }}
//               >
//                 <FormControl size="small" fullWidth>
//                   <InputLabel
//                     id="report-class-label"
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
//                     labelId="report-class-label"
//                     value={reportClassId}
//                     label="Class"
//                     onChange={(e) => handleClassChange(e.target.value, true)}
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

//                 <FormControl size="small" fullWidth>
//                   <InputLabel
//                     id="report-section-label"
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
//                     labelId="report-section-label"
//                     value={reportSectionId}
//                     label="Section"
//                     onChange={(e) => setReportSectionId(e.target.value)}
//                     disabled={!reportClassId}
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
//                     {availableSections.map((sec) => (
//                       <MenuItem
//                         key={sec._id}
//                         value={sec._id}
//                         sx={{
//                           fontFamily: '"Roboto", "Arial", sans-serif',
//                           fontSize: "13px",
//                         }}
//                       >
//                         {sec.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 <TextField
//                   type="date"
//                   label="Date"
//                   variant="outlined"
//                   size="small"
//                   fullWidth
//                   value={reportDate}
//                   onChange={(e) => setReportDate(e.target.value)}
//                   slotProps={{ inputLabel: { shrink: true } }}
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

//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={handleLoadStudentReport}
//                   fullWidth
//                   sx={{
//                     height: 42,
//                     fontSize: "13px",
//                     borderRadius: "8px",
//                     textTransform: "none",
//                     boxShadow: "none",
//                     fontWeight: 600,
//                     fontFamily: '"Roboto", "Arial", sans-serif',
//                   }}
//                 >
//                   Generate Report
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>

//           {reportLoading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
//               <CircularProgress size={28} />
//             </Box>
//           ) : studentReport.length === 0 ? (
//             <Card
//               sx={{
//                 borderRadius: "10px",
//                 border:
//                   mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
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
//                 Please select class, section, and date, then click Generate
//                 Report above.
//               </Typography>
//             </Card>
//           ) : (
//             <Card
//               sx={{
//                 borderRadius: "10px",
//                 border:
//                   mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
//                 boxShadow:
//                   mode === "light"
//                     ? "0 1px 3px rgba(15, 23, 42, 0.04)"
//                     : "none",
//                 p: 1,
//                 maxWidth: "100%",
//                 overflow: "hidden",
//               }}
//             >
//               <CardContent sx={{ p: 0 }}>
//                 <Typography
//                   variant="h6"
//                   color="primary"
//                   sx={{
//                     fontWeight: 700,
//                     fontSize: "14px",
//                     p: 2,
//                     fontFamily: '"Roboto", "Arial", sans-serif',
//                   }}
//                 >
//                   Student Attendance Report Directory
//                 </Typography>

//                 <Box sx={{ width: "100%", overflowX: "auto" }}>
//                   <TableContainer
//                     component={Paper}
//                     elevation={0}
//                     sx={{ bgcolor: "transparent" }}
//                   >
//                     <Table sx={{ minWidth: 600 }}>
//                       <TableHead sx={{ bgcolor: "action.hover" }}>
//                         <TableRow>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: "13px",
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               borderBottomColor: "divider",
//                             }}
//                           >
//                             Roll No
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: "13px",
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               borderBottomColor: "divider",
//                             }}
//                           >
//                             Admission No
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: "13px",
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               borderBottomColor: "divider",
//                             }}
//                           >
//                             Student Name
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: "13px",
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               borderBottomColor: "divider",
//                             }}
//                             align="right"
//                           >
//                             Attendance Status
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {studentReport.map((record) => (
//                           <TableRow
//                             key={record._id}
//                             sx={{
//                               "&:last-child td, &:last-child th": { border: 0 },
//                               "&:hover": { bgcolor: "action.hover" },
//                             }}
//                           >
//                             <TableCell
//                               sx={{
//                                 fontWeight: 600,
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                               }}
//                             >
//                               {record.student.rollNo}
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                               }}
//                             >
//                               {record.student.admissionNo}
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 600,
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                               }}
//                             >
//                               {record.student.user.name}
//                             </TableCell>
//                             <TableCell
//                               align="right"
//                               sx={{ borderBottomColor: "divider" }}
//                             >
//                               <Typography
//                                 component="span"
//                                 sx={{
//                                   fontSize: "11px",
//                                   fontWeight: 700,
//                                   px: 1.5,
//                                   py: 0.4,
//                                   borderRadius: "4px",
//                                   bgcolor:
//                                     record.status === "Present"
//                                       ? mode === "light"
//                                         ? "rgba(16, 185, 129, 0.08)"
//                                         : "rgba(16, 185, 129, 0.15)"
//                                       : record.status === "Absent"
//                                         ? mode === "light"
//                                           ? "rgba(239, 68, 68, 0.08)"
//                                           : "rgba(239, 68, 68, 0.15)"
//                                         : mode === "light"
//                                           ? "rgba(245, 158, 11, 0.08)"
//                                           : "rgba(245, 158, 11, 0.15)",
//                                   color:
//                                     record.status === "Present"
//                                       ? "success.main"
//                                       : record.status === "Absent"
//                                         ? "error.main"
//                                         : "warning.main",
//                                   fontFamily: '"Roboto", "Arial", sans-serif',
//                                 }}
//                               >
//                                 {record.status}
//                               </Typography>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Box>
//               </CardContent>
//             </Card>
//           )}
//         </Box>
//       )}

//       {activeTab === 2 && (
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//           <Card
//             sx={{
//               borderRadius: "10px",
//               bgcolor: "background.paper",
//               boxShadow:
//                 mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
//               border:
//                 mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
//               width: "100%",
//               maxWidth: "100%",
//             }}
//           >
//             <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
//               <Box
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: { xs: "1fr", sm: "1.2fr 1fr" },
//                   gap: 2,
//                   alignItems: "center",
//                   maxWidth: 450,
//                   width: "100%",
//                 }}
//               >
//                 <TextField
//                   type="date"
//                   label="Date"
//                   variant="outlined"
//                   size="small"
//                   fullWidth
//                   value={staffDate}
//                   onChange={(e) => setStaffDate(e.target.value)}
//                   slotProps={{ inputLabel: { shrink: true } }}
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

//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={handleLoadStaff}
//                   fullWidth
//                   sx={{
//                     height: 42,
//                     fontSize: "13px",
//                     borderRadius: "8px",
//                     px: 3,
//                     textTransform: "none",
//                     boxShadow: "none",
//                     fontWeight: 600,
//                     fontFamily: '"Roboto", "Arial", sans-serif',
//                   }}
//                 >
//                   Load Staff
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>

//           {Object.keys(staffRecords).length > 0 && (
//             <Card
//               sx={{
//                 borderRadius: "10px",
//                 bgcolor: "background.paper",
//                 boxShadow:
//                   mode === "light"
//                     ? "0 1px 3px rgba(15, 23, 42, 0.04)"
//                     : "none",
//                 border:
//                   mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
//                 p: 1,
//                 width: "100%",
//                 maxWidth: "100%",
//               }}
//             >
//               <CardContent sx={{ p: 0 }}>
//                 <Typography
//                   variant="h6"
//                   color="primary"
//                   sx={{
//                     fontWeight: 700,
//                     fontSize: "14px",
//                     p: 2,
//                     fontFamily: '"Roboto", "Arial", sans-serif',
//                   }}
//                 >
//                   Mark Daily Staff Attendance
//                 </Typography>

//                 <Box sx={{ display: { xs: "none", md: "block" } }}>
//                   <TableContainer
//                     component={Paper}
//                     elevation={0}
//                     sx={{ bgcolor: "transparent" }}
//                   >
//                     <Table sx={{ minWidth: 600 }}>
//                       <TableHead sx={{ bgcolor: "action.hover" }}>
//                         <TableRow>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: "13px",
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               borderBottomColor: "divider",
//                             }}
//                           >
//                             Employee ID
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: "13px",
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               borderBottomColor: "divider",
//                             }}
//                           >
//                             Staff Name
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: "13px",
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               borderBottomColor: "divider",
//                             }}
//                             align="right"
//                           >
//                             Attendance Status
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {teachersList.map((teach) => (
//                           <TableRow
//                             key={teach._id}
//                             sx={{
//                               "&:last-child td, &:last-child th": { border: 0 },
//                               "&:hover": { bgcolor: "action.hover" },
//                             }}
//                           >
//                             <TableCell
//                               sx={{
//                                 fontWeight: 600,
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                               }}
//                             >
//                               {teach.employeeId}
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 600,
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                               }}
//                             >
//                               {teach.user.name}
//                             </TableCell>
//                             <TableCell
//                               align="right"
//                               sx={{ borderBottomColor: "divider" }}
//                             >
//                               <ToggleButtonGroup
//                                 size="small"
//                                 color="primary"
//                                 value={
//                                   staffRecords[teach.user._id] || "Present"
//                                 }
//                                 exclusive
//                                 onChange={(_, val) =>
//                                   handleStaffStatusChange(teach.user._id, val)
//                                 }
//                                 sx={{ height: 32, borderRadius: "6px" }}
//                               >
//                                 <ToggleButton
//                                   value="Present"
//                                   sx={{
//                                     fontFamily: '"Roboto", "Arial", sans-serif',
//                                     fontSize: "0.75rem",
//                                     fontWeight: 600,
//                                     textTransform: "none",
//                                   }}
//                                 >
//                                   Present
//                                 </ToggleButton>
//                                 <ToggleButton
//                                   value="Absent"
//                                   sx={{
//                                     fontFamily: '"Roboto", "Arial", sans-serif',
//                                     fontSize: "0.75rem",
//                                     fontWeight: 600,
//                                     color: "error.main",
//                                     textTransform: "none",
//                                   }}
//                                 >
//                                   Absent
//                                 </ToggleButton>
//                                 <ToggleButton
//                                   value="Late"
//                                   sx={{
//                                     fontFamily: '"Roboto", "Arial", sans-serif',
//                                     fontSize: "0.75rem",
//                                     fontWeight: 600,
//                                     color: "warning.main",
//                                     textTransform: "none",
//                                   }}
//                                 >
//                                   Late
//                                 </ToggleButton>
//                               </ToggleButtonGroup>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Box>

//                 <Box
//                   sx={{
//                     display: { xs: "flex", md: "none" },
//                     flexDirection: "column",
//                     gap: 2,
//                     p: 2,
//                   }}
//                 >
//                   {teachersList.map((teach) => (
//                     <Card
//                       key={teach._id}
//                       sx={{
//                         p: 2,
//                         borderRadius: "10px",
//                         border:
//                           mode === "dark"
//                             ? "1px solid #1F2937"
//                             : "1px solid #E2E8F0",
//                         boxShadow: "none",
//                         bgcolor: "background.paper",
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           mb: 1.5,
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: "11px",
//                             fontWeight: 700,
//                             fontFamily: '"Roboto", "Arial", sans-serif',
//                             color: "text.secondary",
//                           }}
//                         >
//                           ID: {teach.employeeId}
//                         </Typography>
//                       </Box>

//                       <Typography
//                         sx={{
//                           fontWeight: 600,
//                           fontFamily: '"Roboto", "Arial", sans-serif',
//                           fontSize: "13px",
//                           mb: 2,
//                           color: "text.primary",
//                         }}
//                       >
//                         {teach.user.name}
//                       </Typography>

//                       <Divider
//                         sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }}
//                       />

//                       <Box sx={{ display: "flex", justifyContent: "center" }}>
//                         <ToggleButtonGroup
//                           size="small"
//                           color="primary"
//                           value={staffRecords[teach.user._id] || "Present"}
//                           exclusive
//                           onChange={(_, val) =>
//                             handleStaffStatusChange(teach.user._id, val)
//                           }
//                           sx={{
//                             height: 34,
//                             width: "100%",
//                             justifyContent: "center",
//                             borderRadius: "6px",
//                           }}
//                         >
//                           <ToggleButton
//                             value="Present"
//                             sx={{
//                               flexGrow: 1,
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               fontSize: "0.75rem",
//                               fontWeight: 600,
//                               textTransform: "none",
//                             }}
//                           >
//                             Present
//                           </ToggleButton>
//                           <ToggleButton
//                             value="Absent"
//                             sx={{
//                               flexGrow: 1,
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               fontSize: "0.75rem",
//                               fontWeight: 600,
//                               color: "error.main",
//                               textTransform: "none",
//                             }}
//                           >
//                             Absent
//                           </ToggleButton>
//                           <ToggleButton
//                             value="Late"
//                             sx={{
//                               flexGrow: 1,
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               fontSize: "0.75rem",
//                               fontWeight: 600,
//                               color: "warning.main",
//                               textTransform: "none",
//                             }}
//                           >
//                             Late
//                           </ToggleButton>
//                         </ToggleButtonGroup>
//                       </Box>
//                     </Card>
//                   ))}
//                 </Box>

//                 <Box
//                   sx={{
//                     p: 2,
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     borderTop: "1px solid",
//                     borderColor: "divider",
//                   }}
//                 >
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     disabled={staffSaveLoading}
//                     onClick={handleSaveStaffAttendance}
//                     sx={{
//                       height: 42,
//                       fontSize: "13px",
//                       borderRadius: "8px",
//                       px: 4,
//                       textTransform: "none",
//                       boxShadow: "none",
//                       fontWeight: 600,
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                     }}
//                   >
//                     {staffSaveLoading ? (
//                       <CircularProgress size={18} color="inherit" />
//                     ) : (
//                       "Save Staff Attendance"
//                     )}
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>
//           )}
//         </Box>
//       )}

//       {activeTab === 3 && (
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//           <Card
//             sx={{
//               borderRadius: "10px",
//               bgcolor: "background.paper",
//               boxShadow:
//                 mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
//               border:
//                 mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
//               width: "100%",
//               maxWidth: "100%",
//             }}
//           >
//             <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
//               <Box
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: { xs: "1fr", sm: "1.2fr 1fr" },
//                   gap: 2,
//                   alignItems: "center",
//                   maxWidth: 450,
//                   width: "100%",
//                 }}
//               >
//                 <TextField
//                   type="date"
//                   label="Date"
//                   variant="outlined"
//                   size="small"
//                   fullWidth
//                   value={staffReportDate}
//                   onChange={(e) => setStaffReportDate(e.target.value)}
//                   slotProps={{ inputLabel: { shrink: true } }}
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

//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={handleLoadStaffReport}
//                   fullWidth
//                   sx={{
//                     height: 42,
//                     fontSize: "13px",
//                     borderRadius: "8px",
//                     px: 3,
//                     textTransform: "none",
//                     boxShadow: "none",
//                     fontWeight: 600,
//                     fontFamily: '"Roboto", "Arial", sans-serif',
//                   }}
//                 >
//                   Generate Staff Report
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>

//           {staffReportLoading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
//               <CircularProgress size={28} />
//             </Box>
//           ) : staffReport.length === 0 ? (
//             <Card
//               sx={{
//                 borderRadius: "10px",
//                 border:
//                   mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
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
//                 Please select a date, then click Generate Staff Report above.
//               </Typography>
//             </Card>
//           ) : (
//             <Card
//               sx={{
//                 borderRadius: "10px",
//                 border:
//                   mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
//                 boxShadow:
//                   mode === "light"
//                     ? "0 1px 3px rgba(15, 23, 42, 0.04)"
//                     : "none",
//                 p: 1,
//                 maxWidth: "100%",
//                 overflow: "hidden",
//               }}
//             >
//               <CardContent sx={{ p: 0 }}>
//                 <Typography
//                   variant="h6"
//                   color="primary"
//                   sx={{
//                     fontWeight: 700,
//                     fontSize: "14px",
//                     p: 2,
//                     fontFamily: '"Roboto", "Arial", sans-serif',
//                   }}
//                 >
//                   Staff Attendance Report Directory
//                 </Typography>

//                 <Box sx={{ width: "100%", overflowX: "auto" }}>
//                   <TableContainer
//                     component={Paper}
//                     elevation={0}
//                     sx={{ bgcolor: "transparent" }}
//                   >
//                     <Table sx={{ minWidth: 600 }}>
//                       <TableHead sx={{ bgcolor: "action.hover" }}>
//                         <TableRow>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: "13px",
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               borderBottomColor: "divider",
//                             }}
//                           >
//                             Staff Name
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: "13px",
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               borderBottomColor: "divider",
//                             }}
//                           >
//                             Email
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: "13px",
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               borderBottomColor: "divider",
//                             }}
//                           >
//                             Role
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               fontWeight: 700,
//                               fontSize: "13px",
//                               fontFamily: '"Roboto", "Arial", sans-serif',
//                               borderBottomColor: "divider",
//                             }}
//                             align="right"
//                           >
//                             Attendance Status
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {staffReport.map((record) => (
//                           <TableRow
//                             key={record._id}
//                             sx={{
//                               "&:last-child td, &:last-child th": { border: 0 },
//                               "&:hover": { bgcolor: "action.hover" },
//                             }}
//                           >
//                             <TableCell
//                               sx={{
//                                 fontWeight: 600,
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                               }}
//                             >
//                               {record.staff.name}
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontSize: "13px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 borderBottomColor: "divider",
//                               }}
//                             >
//                               {record.staff.email}
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontSize: "12px",
//                                 fontFamily: '"Roboto", "Arial", sans-serif',
//                                 textTransform: "uppercase",
//                                 borderBottomColor: "divider",
//                               }}
//                             >
//                               {record.staff.role}
//                             </TableCell>
//                             <TableCell
//                               align="right"
//                               sx={{ borderBottomColor: "divider" }}
//                             >
//                               <Typography
//                                 component="span"
//                                 sx={{
//                                   fontSize: "11px",
//                                   fontWeight: 700,
//                                   px: 1.5,
//                                   py: 0.4,
//                                   borderRadius: "4px",
//                                   bgcolor:
//                                     record.status === "Present"
//                                       ? mode === "light"
//                                         ? "rgba(16, 185, 129, 0.08)"
//                                         : "rgba(16, 185, 129, 0.15)"
//                                       : record.status === "Absent"
//                                         ? mode === "light"
//                                           ? "rgba(239, 68, 68, 0.08)"
//                                           : "rgba(239, 68, 68, 0.15)"
//                                         : mode === "light"
//                                           ? "rgba(245, 158, 11, 0.08)"
//                                           : "rgba(245, 158, 11, 0.15)",
//                                   color:
//                                     record.status === "Present"
//                                       ? "success.main"
//                                       : record.status === "Absent"
//                                         ? "error.main"
//                                         : "warning.main",
//                                   fontFamily: '"Roboto", "Arial", sans-serif',
//                                 }}
//                               >
//                                 {record.status}
//                               </Typography>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Box>
//               </CardContent>
//             </Card>
//           )}
//         </Box>
//       )}
//     </Box>
//   );
// };

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useCustomTheme } from "../context/ThemeContext";
import { getClasses } from "../services/academicService";
import { getStudents } from "../services/studentService";
import { getTeachers } from "../services/teacherService";
import {
  markStudentAttendance,
  getStudentAttendanceReport,
  markStaffAttendance,
  getStaffAttendanceReport,
} from "../services/attendanceService";

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
  };
  rollNo: string;
  admissionNo: string;
  class: {
    _id: string;
    name: string;
  };
  section: {
    _id: string;
    name: string;
  };
  status: string;
}

interface TeacherData {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  employeeId: string;
}

interface AttendanceRecord {
  _id: string;
  student: {
    user: {
      name: string;
    };
    admissionNo: string;
    rollNo: string;
  };
  status: string;
}

interface StaffAttendanceRecord {
  _id: string;
  staff: {
    name: string;
    email: string;
    role: string;
  };
  status: string;
}

export const Attendance: React.FC = () => {
  const { mode } = useCustomTheme();
  const [activeTab, setActiveTab] = useState(0);

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [studentsList, setStudentsList] = useState<StudentData[]>([]);
  const [teachersList, setTeachersList] = useState<TeacherData[]>([]);
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success",
  );

  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<{
    [key: string]: string;
  }>({});

  const [reportClassId, setReportClassId] = useState("");
  const [reportSectionId, setReportSectionId] = useState("");
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [studentReport, setStudentReport] = useState<AttendanceRecord[]>([]);
  const [reportLoading, setReportLoading] = useState(false);

  const [staffDate, setStaffDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [staffRecords, setStaffRecords] = useState<{ [key: string]: string }>(
    {},
  );

  const [staffReportDate, setStaffReportDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [staffReport, setStaffReport] = useState<StaffAttendanceRecord[]>([]);
  const [staffReportLoading, setStaffReportLoading] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);
  const [staffSaveLoading, setStaffSaveLoading] = useState(false);

  const loadBaseData = useCallback(async () => {
    try {
      setLoading(true);
      const resClasses = await getClasses();
      const resTeachers = await getTeachers();
      setClasses(resClasses.data);
       
      setTeachersList(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resTeachers.data.filter((t: any) => t.status === "Active"),
      );
      setLoading(false);
    } catch {
      setLoading(false);
      setToastSeverity("error");
      setToastMessage(
        "Failed to fetch baseline attendance classes/staff data.",
      );
      setToastOpen(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBaseData();
  }, [loadBaseData]);

  const handleClassChange = (selectedClassId: string, isFilter: boolean) => {
    if (isFilter) {
      setReportClassId(selectedClassId);
      setReportSectionId("");
    } else {
      setClassId(selectedClassId);
      setSectionId("");
      setStudentsList([]);
      setAttendanceRecords({});
    }

    const selectedClass = classes.find((c) => c._id === selectedClassId);
    if (selectedClass) {
      setAvailableSections(selectedClass.sections);
    } else {
      setAvailableSections([]);
    }
  };

  const handleLoadClassStudents = async () => {
    if (!classId || !sectionId) {
      setToastSeverity("error");
      setToastMessage("Please select both Class and Section first!");
      setToastOpen(true);
      return;
    }

    try {
      setLoading(true);

      const res = await getStudents();

      const filtered = res.data.filter(
        (s: StudentData) =>
          s.class._id === classId &&
          s.section._id === sectionId &&
          s.status === "Active",
      );

      if (filtered.length === 0) {
        setToastSeverity("error");
        setToastMessage("No active students found in this class & section!");
        setToastOpen(true);
      }

      setStudentsList(filtered);

      const initialRecords: { [key: string]: string } = {};
      filtered.forEach((stud: StudentData) => {
        initialRecords[stud._id] = "Present";
      });
      setAttendanceRecords(initialRecords);
      setLoading(false);
    } catch (err: unknown) {
      setLoading(false);
      let msg = "Failed to fetch class students list.";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || msg;
      }
      setToastSeverity("error");
      setToastMessage(msg);
      setToastOpen(true);
      console.error("Error in handleLoadClassStudents:", err);
    }
  };

  const handleStatusChange = (studentId: string, status: string) => {
    if (status) {
      setAttendanceRecords((prev) => ({
        ...prev,
        [studentId]: status,
      }));
    }
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();

    if (studentsList.length === 0) {
      setToastSeverity("error");
      setToastMessage("No student list loaded to save attendance!");
      setToastOpen(true);
      return;
    }

    setSaveLoading(true);

    const formattedRecords = Object.keys(attendanceRecords).map((key) => ({
      student: key,
      status: attendanceRecords[key],
    }));

    setTimeout(async () => {
      try {
        await markStudentAttendance({
          classId,
          sectionId,
          date,
          records: formattedRecords,
        });

        setToastSeverity("success");
        setToastMessage("Student daily attendance saved successfully!");
        setToastOpen(true);

        setStudentsList([]);
        setAttendanceRecords({});
        setClassId("");
        setSectionId("");
        setSaveLoading(false);
      } catch (err: unknown) {
        setSaveLoading(false);
        let msg = "Failed to save student attendance.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleLoadStudentReport = async () => {
    if (!reportClassId || !reportSectionId || !reportDate) {
      setToastSeverity("error");
      setToastMessage(
        "Please select Class, Section, and Date to generate report!",
      );
      setToastOpen(true);
      return;
    }

    try {
      setReportLoading(true);
      const res = await getStudentAttendanceReport(
        reportClassId,
        reportSectionId,
        reportDate,
      );
      setStudentReport(res.data);
      setReportLoading(false);
    } catch {
      setReportLoading(false);
      setToastSeverity("error");
      setToastMessage("Failed to fetch attendance report.");
      setToastOpen(true);
    }
  };

  const handleLoadStaff = () => {
    if (teachersList.length === 0) {
      setToastSeverity("error");
      setToastMessage("No active staff registered in the directory!");
      setToastOpen(true);
      return;
    }

    const initialStaff: { [key: string]: string } = {};
    teachersList.forEach((teach) => {
      initialStaff[teach.user._id] = "Present";
    });
    setStaffRecords(initialStaff);
  };

  const handleStaffStatusChange = (staffId: string, status: string) => {
    if (status) {
      setStaffRecords((prev) => ({ ...prev, [staffId]: status }));
    }
  };

  const handleSaveStaffAttendance = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(staffRecords).length === 0) {
      setToastSeverity("error");
      setToastMessage("No staff loaded to mark attendance!");
      setToastOpen(true);
      return;
    }

    setStaffSaveLoading(true);

    const formattedRecords = Object.keys(staffRecords).map((key) => ({
      staff: key,
      status: staffRecords[key],
    }));

    setTimeout(async () => {
      try {
        await markStaffAttendance({
          date: staffDate,
          records: formattedRecords,
        });

        setToastSeverity("success");
        setToastMessage("Staff daily attendance saved successfully!");
        setToastOpen(true);

        setStaffRecords({});
        setStaffSaveLoading(false);
      } catch (err: unknown) {
        setStaffSaveLoading(false);
        let msg = "Failed to save staff attendance.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleLoadStaffReport = async () => {
    try {
      setStaffReportLoading(true);
      const res = await getStaffAttendanceReport(staffReportDate);
      setStaffReport(res.data);
      setStaffReportLoading(false);
    } catch {
      setStaffReportLoading(false);
      setToastSeverity("error");
      setToastMessage("Failed to fetch staff attendance report.");
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
        Attendance System
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
        Mark and manage daily attendance logs for students and staff.
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
          <Tab label="Mark Student Attendance" />
          <Tab label="Student Attendance Report" />
          <Tab label="Mark Staff Attendance" />
          <Tab label="Staff Attendance Report" />
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card
            sx={{
              borderRadius: "10px",
              bgcolor: "background.paper",
              boxShadow:
                mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
              border:
                mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
              width: "100%",
              maxWidth: "100%",
              "&:hover": {
                transform: "none !important",
                borderColor: mode === "dark" ? "#1F2937 !important" : "#E2E8F0 !important",
                boxShadow: mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04) !important" : "none !important",
              }
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1.2fr 1.2fr 1.2fr 1fr",
                  },
                  gap: 2,
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <FormControl size="small" fullWidth>
                  <InputLabel
                    id="mark-class-label"
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
                    labelId="mark-class-label"
                    value={classId}
                    label="Class"
                    onChange={(e) => handleClassChange(e.target.value, false)}
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
                    id="mark-section-label"
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
                    labelId="mark-section-label"
                    value={sectionId}
                    label="Section"
                    onChange={(e) => setSectionId(e.target.value)}
                    disabled={!classId}
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
                    {availableSections.map((sec) => (
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
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  type="date"
                  label="Date"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
                  onClick={handleLoadClassStudents}
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
                  Load Students
                </Button>
              </Box>
            </CardContent>
          </Card>

          {studentsList.length > 0 && (
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
                width: "100%",
                maxWidth: "100%",
                "&:hover": {
                  transform: "none !important",
                  borderColor: mode === "dark" ? "#1F2937 !important" : "#E2E8F0 !important",
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
                  Mark Daily Student Attendance
                </Typography>

                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ bgcolor: "transparent" }}
                  >
                    <Table sx={{ minWidth: 600 }}>
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
                            Roll No
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
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
                            }}
                            align="right"
                          >
                            Attendance Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {studentsList.map((stud) => (
                          <TableRow
                            key={stud._id}
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
                              {stud.rollNo}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                              }}
                            >
                              {stud.user.name}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ borderBottomColor: "divider" }}
                            >
                              <ToggleButtonGroup
                                size="small"
                                color="primary"
                                value={attendanceRecords[stud._id] || "Present"}
                                exclusive
                                onChange={(_, val) =>
                                  handleStatusChange(stud._id, val)
                                }
                                sx={{ height: 32, borderRadius: "6px" }}
                              >
                                <ToggleButton
                                  value="Present"
                                  sx={{
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    textTransform: "none",
                                  }}
                                >
                                  Present
                                </ToggleButton>
                                <ToggleButton
                                  value="Absent"
                                  sx={{
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    color: "error.main",
                                    textTransform: "none",
                                  }}
                                >
                                  Absent
                                </ToggleButton>
                                <ToggleButton
                                  value="Late"
                                  sx={{
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    color: "warning.main",
                                    textTransform: "none",
                                  }}
                                >
                                  Late
                                </ToggleButton>
                              </ToggleButtonGroup>
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
                  {studentsList.map((stud) => (
                    <Card
                      key={stud._id}
                      sx={{
                        p: 2,
                        borderRadius: "10px",
                        border:
                          mode === "dark"
                            ? "1px solid #1F2937"
                            : "1px solid #E2E8F0",
                        boxShadow: "none",
                        bgcolor: "background.paper",
                        "&:hover": {
                          transform: "none !important",
                          borderColor: mode === "dark" ? "#1F2937 !important" : "#E2E8F0 !important",
                          boxShadow: "none !important"
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
                          Roll No: {stud.rollNo}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          fontSize: "13px",
                          mb: 2,
                          color: "text.primary",
                        }}
                      >
                        {stud.user.name}
                      </Typography>

                      <Divider
                        sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }}
                      />

                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <ToggleButtonGroup
                          size="small"
                          color="primary"
                          value={attendanceRecords[stud._id] || "Present"}
                          exclusive
                          onChange={(_, val) =>
                            handleStatusChange(stud._id, val)
                          }
                          sx={{
                            height: 34,
                            width: "100%",
                            justifyContent: "center",
                            borderRadius: "6px",
                          }}
                        >
                          <ToggleButton
                            value="Present"
                            sx={{
                              flexGrow: 1,
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              textTransform: "none",
                            }}
                          >
                            Present
                          </ToggleButton>
                          <ToggleButton
                            value="Absent"
                            sx={{
                              flexGrow: 1,
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "error.main",
                              textTransform: "none",
                            }}
                          >
                            Absent
                          </ToggleButton>
                          <ToggleButton
                            value="Late"
                            sx={{
                              flexGrow: 1,
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "warning.main",
                              textTransform: "none",
                            }}
                          >
                            Late
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                    </Card>
                  ))}
                </Box>

                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={saveLoading}
                    onClick={handleSaveAttendance}
                    sx={{
                      height: 42,
                      fontSize: "13px",
                      borderRadius: "8px",
                      px: 4,
                      textTransform: "none",
                      boxShadow: "none",
                      fontWeight: 600,
                      fontFamily: '"Roboto", "Arial", sans-serif',
                    }}
                  >
                    {saveLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      "Save Attendance"
                    )}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card
            sx={{
              borderRadius: "10px",
              bgcolor: "background.paper",
              boxShadow:
                mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
              border:
                mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
              width: "100%",
              maxWidth: "100%",
              "&:hover": {
                transform: "none !important",
                borderColor: mode === "dark" ? "#1F2937 !important" : "#E2E8F0 !important",
                boxShadow: mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04) !important" : "none !important",
              }
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1.2fr 1.2fr 1.2fr 1fr",
                  },
                  gap: 2,
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <FormControl size="small" fullWidth>
                  <InputLabel
                    id="report-class-label"
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
                    labelId="report-class-label"
                    value={reportClassId}
                    label="Class"
                    onChange={(e) => handleClassChange(e.target.value, true)}
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
                    id="report-section-label"
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
                    labelId="report-section-label"
                    value={reportSectionId}
                    label="Section"
                    onChange={(e) => setReportSectionId(e.target.value)}
                    disabled={!reportClassId}
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
                    {availableSections.map((sec) => (
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
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  type="date"
                  label="Date"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
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
                  onClick={handleLoadStudentReport}
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
          ) : studentReport.length === 0 ? (
            <Card
              sx={{
                borderRadius: "10px",
                border:
                  mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
                boxShadow:
                  mode === "light"
                    ? "0 1px 3px rgba(15, 23, 42, 0.04)"
                    : "none",
                p: 4,
                textAlign: "center",
                "&:hover": {
                  transform: "none !important",
                  borderColor: mode === "dark" ? "#1F2937 !important" : "#E2E8F0 !important",
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
                Please select class, section, and date, then click Generate
                Report above.
              </Typography>
            </Card>
          ) : (
            <Card
              sx={{
                borderRadius: "10px",
                border:
                  mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
                boxShadow:
                  mode === "light"
                    ? "0 1px 3px rgba(15, 23, 42, 0.04)"
                    : "none",
                p: 1,
                maxWidth: "100%",
                overflow: "hidden",
                "&:hover": {
                  transform: "none !important",
                  borderColor: mode === "dark" ? "#1F2937 !important" : "#E2E8F0 !important",
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
                  Student Attendance Report Directory
                </Typography>

                <Box sx={{ width: "100%", overflowX: "auto" }}>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ bgcolor: "transparent" }}
                  >
                    <Table sx={{ minWidth: 600 }}>
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
                            Roll No
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
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
                            }}
                            align="right"
                          >
                            Attendance Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {studentReport.map((record) => (
                          <TableRow
                            key={record._id}
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
                              {record.student.rollNo}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                              }}
                            >
                              {record.student.admissionNo}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                              }}
                            >
                              {record.student.user.name}
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
                                    record.status === "Present"
                                      ? mode === "light"
                                        ? "rgba(16, 185, 129, 0.08)"
                                        : "rgba(16, 185, 129, 0.15)"
                                      : record.status === "Absent"
                                        ? mode === "light"
                                          ? "rgba(239, 68, 68, 0.08)"
                                          : "rgba(239, 68, 68, 0.15)"
                                        : mode === "light"
                                          ? "rgba(245, 158, 11, 0.08)"
                                          : "rgba(245, 158, 11, 0.15)",
                                  color:
                                    record.status === "Present"
                                      ? "success.main"
                                      : record.status === "Absent"
                                        ? "error.main"
                                        : "warning.main",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                }}
                              >
                                {record.status}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
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
                mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
              width: "100%",
              maxWidth: "100%",
              "&:hover": {
                transform: "none !important",
                borderColor: mode === "dark" ? "#1F2937 !important" : "#E2E8F0 !important",
                boxShadow: mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04) !important" : "none !important",
              }
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1.2fr 1fr" },
                  gap: 2,
                  alignItems: "center",
                  maxWidth: 450,
                  width: "100%",
                }}
              >
                <TextField
                  type="date"
                  label="Date"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={staffDate}
                  onChange={(e) => setStaffDate(e.target.value)}
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
                  onClick={handleLoadStaff}
                  fullWidth
                  sx={{
                    height: 42,
                    fontSize: "13px",
                    borderRadius: "8px",
                    px: 3,
                    textTransform: "none",
                    boxShadow: "none",
                    fontWeight: 600,
                    fontFamily: '"Roboto", "Arial", sans-serif',
                  }}
                >
                  Load Staff
                </Button>
              </Box>
            </CardContent>
          </Card>

          {Object.keys(staffRecords).length > 0 && (
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
                width: "100%",
                maxWidth: "100%",
                "&:hover": {
                  transform: "none !important",
                  borderColor: mode === "dark" ? "#1F2937 !important" : "#E2E8F0 !important",
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
                  Mark Daily Staff Attendance
                </Typography>

                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ bgcolor: "transparent" }}
                  >
                    <Table sx={{ minWidth: 600 }}>
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
                            Employee ID
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
                            }}
                          >
                            Staff Name
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
                            Attendance Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {teachersList.map((teach) => (
                          <TableRow
                            key={teach._id}
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
                              {teach.employeeId}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                              }}
                            >
                              {teach.user.name}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ borderBottomColor: "divider" }}
                            >
                              <ToggleButtonGroup
                                size="small"
                                color="primary"
                                value={
                                  staffRecords[teach.user._id] || "Present"
                                }
                                exclusive
                                onChange={(_, val) =>
                                  handleStaffStatusChange(teach.user._id, val)
                                }
                                sx={{ height: 32, borderRadius: "6px" }}
                              >
                                <ToggleButton
                                  value="Present"
                                  sx={{
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    textTransform: "none",
                                  }}
                                >
                                  Present
                                </ToggleButton>
                                <ToggleButton
                                  value="Absent"
                                  sx={{
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    color: "error.main",
                                    textTransform: "none",
                                  }}
                                >
                                  Absent
                                </ToggleButton>
                                <ToggleButton
                                  value="Late"
                                  sx={{
                                    fontFamily: '"Roboto", "Arial", sans-serif',
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    color: "warning.main",
                                    textTransform: "none",
                                  }}
                                >
                                  Late
                                </ToggleButton>
                              </ToggleButtonGroup>
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
                  {teachersList.map((teach) => (
                    <Card
                      key={teach._id}
                      sx={{
                        p: 2,
                        borderRadius: "10px",
                        border:
                          mode === "dark"
                            ? "1px solid #1F2937"
                            : "1px solid #E2E8F0",
                        boxShadow: "none",
                        bgcolor: "background.paper",
                        "&:hover": {
                          transform: "none !important",
                          borderColor: mode === "dark" ? "#1F2937 !important" : "#E2E8F0 !important",
                          boxShadow: "none !important"
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
                          ID: {teach.employeeId}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          fontSize: "13px",
                          mb: 2,
                          color: "text.primary",
                        }}
                      >
                        {teach.user.name}
                      </Typography>

                      <Divider
                        sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }}
                      />

                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <ToggleButtonGroup
                          size="small"
                          color="primary"
                          value={staffRecords[teach.user._id] || "Present"}
                          exclusive
                          onChange={(_, val) =>
                            handleStaffStatusChange(teach.user._id, val)
                          }
                          sx={{
                            height: 34,
                            width: "100%",
                            justifyContent: "center",
                            borderRadius: "6px",
                          }}
                        >
                          <ToggleButton
                            value="Present"
                            sx={{
                              flexGrow: 1,
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              textTransform: "none",
                            }}
                          >
                            Present
                          </ToggleButton>
                          <ToggleButton
                            value="Absent"
                            sx={{
                              flexGrow: 1,
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "error.main",
                              textTransform: "none",
                            }}
                          >
                            Absent
                          </ToggleButton>
                          <ToggleButton
                            value="Late"
                            sx={{
                              flexGrow: 1,
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "warning.main",
                              textTransform: "none",
                            }}
                          >
                            Late
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                    </Card>
                  ))}
                </Box>

                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={staffSaveLoading}
                    onClick={handleSaveStaffAttendance}
                    sx={{
                      height: 42,
                      fontSize: "13px",
                      borderRadius: "8px",
                      px: 4,
                      textTransform: "none",
                      boxShadow: "none",
                      fontWeight: 600,
                      fontFamily: '"Roboto", "Arial", sans-serif',
                    }}
                  >
                    {staffSaveLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      "Save Staff Attendance"
                    )}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {activeTab === 3 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card
            sx={{
              borderRadius: "10px",
              bgcolor: "background.paper",
              boxShadow:
                mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
              border:
                mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
              width: "100%",
              maxWidth: "100%",
              "&:hover": {
                transform: "none !important",
                borderColor: mode === "dark" ? "#1F2937 !important" : "#E2E8F0 !important",
                boxShadow: mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04) !important" : "none !important",
              }
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1.2fr 1fr" },
                  gap: 2,
                  alignItems: "center",
                  maxWidth: 450,
                  width: "100%",
                }}
              >
                <TextField
                  type="date"
                  label="Date"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={staffReportDate}
                  onChange={(e) => setStaffReportDate(e.target.value)}
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
                  onClick={handleLoadStaffReport}
                  fullWidth
                  sx={{
                    height: 42,
                    fontSize: "13px",
                    borderRadius: "8px",
                    px: 3,
                    textTransform: "none",
                    boxShadow: "none",
                    fontWeight: 600,
                    fontFamily: '"Roboto", "Arial", sans-serif',
                  }}
                >
                  Generate Staff Report
                </Button>
              </Box>
            </CardContent>
          </Card>

          {staffReportLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={28} />
            </Box>
          ) : staffReport.length === 0 ? (
            <Card
              sx={{
                borderRadius: "10px",
                border:
                  mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
                boxShadow:
                  mode === "light"
                    ? "0 1px 3px rgba(15, 23, 42, 0.04)"
                    : "none",
                p: 4,
                textAlign: "center",
                "&:hover": {
                  transform: "none !important",
                  borderColor: mode === "dark" ? "#1F2937 !important" : "#E2E8F0 !important",
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
                Please select a date, then click Generate Staff Report above.
              </Typography>
            </Card>
          ) : (
            <Card
              sx={{
                borderRadius: "10px",
                border:
                  mode === "dark" ? "1px solid #1F2937" : "1px solid #E2E8F0",
                boxShadow:
                  mode === "light"
                    ? "0 1px 3px rgba(15, 23, 42, 0.04)"
                    : "none",
                p: 1,
                maxWidth: "100%",
                overflow: "hidden",
                "&:hover": {
                  transform: "none !important",
                  borderColor: mode === "dark" ? "#1F2937 !important" : "#E2E8F0 !important",
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
                  Staff Attendance Report Directory
                </Typography>

                <Box sx={{ width: "100%", overflowX: "auto" }}>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ bgcolor: "transparent" }}
                  >
                    <Table sx={{ minWidth: 600 }}>
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
                            Staff Name
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
                            }}
                          >
                            Email
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              borderBottomColor: "divider",
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
                            }}
                            align="right"
                          >
                            Attendance Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {staffReport.map((record) => (
                          <TableRow
                            key={record._id}
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
                              {record.staff.name}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                              }}
                            >
                              {record.staff.email}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "12px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                textTransform: "uppercase",
                                borderBottomColor: "divider",
                              }}
                            >
                              {record.staff.role}
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
                                    record.status === "Present"
                                      ? mode === "light"
                                        ? "rgba(16, 185, 129, 0.08)"
                                        : "rgba(16, 185, 129, 0.15)"
                                      : record.status === "Absent"
                                        ? mode === "light"
                                          ? "rgba(239, 68, 68, 0.08)"
                                          : "rgba(239, 68, 68, 0.15)"
                                        : mode === "light"
                                          ? "rgba(245, 158, 11, 0.08)"
                                          : "rgba(245, 158, 11, 0.15)",
                                  color:
                                    record.status === "Present"
                                      ? "success.main"
                                      : record.status === "Absent"
                                        ? "error.main"
                                        : "warning.main",
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                }}
                              >
                                {record.status}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};
