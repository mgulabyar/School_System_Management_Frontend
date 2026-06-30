// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box, Card, CardContent, Typography, TextField, Button,
//   Tabs, Tab, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, Alert, CircularProgress, Snackbar,
//   Select, MenuItem, FormControl, InputLabel, Divider,
// } from '@mui/material';
// import axios from 'axios';
// import { useCustomTheme } from '../context/ThemeContext';
// import { getClasses, getSubjectsByClass } from '../services/academicService';
// import { getStudents } from '../services/studentService';
// import { scheduleExam, getExams, enterMarks, getStudentReportCard, getMeritList } from '../services/examService';

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
//   };
// }

// interface SubjectData {
//   _id: string;
//   name: string;
//   code: string;
// }

// interface ReportCardData {
//   studentName: string;
//   admissionNo: string;
//   examName: string;
//   results: {
//     subjectName: string;
//     subjectCode: string;
//     obtained: number;
//     total: number;
//     percentage: string;
//   }[];
//   summary: {
//     totalObtained: number;
//     totalMaximum: number;
//     percentage: string;
//   };
// }

// interface MeritData {
//   name: string;
//   admissionNo: string;
//   obtained: number;
//   total: number;
//   percentage: number;
// }

// export const Exams: React.FC = () => {
//   const { mode } = useCustomTheme();
//   // const theme = useTheme();
//   const [activeTab, setActiveTab] = useState(0);

//   const [classes, setClasses] = useState<ClassData[]>([]);
//   const [students, setStudents] = useState<StudentData[]>([]);
//   const [subjects, setSubjects] = useState<SubjectData[]>([]);
//   const [exams, setExams] = useState<{ _id: string; name: string; class: { _id: string } }[]>([]);
//   const [, setLoading] = useState(true);

//   const [toastOpen, setToastOpen] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

//   const [examName, setExamName] = useState('');
//   const [scheduleClassId, setScheduleClassId] = useState('');

//   const [marksExamId, setMarksExamId] = useState('');
//   const [marksSubjectId, setMarksSubjectId] = useState('');
//   const [marksClassId, setMarksClassId] = useState('');
//   const [marksRecords, setMarksRecords] = useState<{ [key: string]: { obtained: string; total: string } }>({});

//   const [reportStudentId, setReportStudentId] = useState('');
//   const [reportExamId, setReportExamId] = useState('');
//   const [reportCard, setReportCard] = useState<ReportCardData | null>(null);
//   const [reportCardLoading, setReportCardLoading] = useState(false);

//   const [meritExamId, setMeritExamId] = useState('');
//   const [meritList, setMeritList] = useState<MeritData[]>([]);
//   const [meritLoading, setMeritLoading] = useState(false);

//   const [scheduleLoading, setScheduleLoading] = useState(false);
//   const [marksSaveLoading, setMarksSaveLoading] = useState(false);

//   const loadBaselineData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const resClasses = await getClasses();
//       const resStudents = await getStudents();
//       const resExams = await getExams();

//       setClasses(resClasses.data);
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       setStudents(resStudents.data.filter((s: any) => s.status === 'Active'));
//       setExams(resExams.data || []);
//       setLoading(false);
//     } catch {
//       setLoading(false);
//       setToastSeverity('error');
//       setToastMessage('Failed to fetch baseline exams and classes details.');
//       setToastOpen(true);
//     }
//   }, []);

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     loadBaselineData();
//   }, [loadBaselineData]);

//   const handleScheduleExam = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!examName || !scheduleClassId) {
//       setToastSeverity('error');
//       setToastMessage('Please enter both Exam Name and select a Class!');
//       setToastOpen(true);
//       return;
//     }

//     setScheduleLoading(true);

//     setTimeout(async () => {
//       try {
//         await scheduleExam({
//           name: examName,
//           classId: scheduleClassId
//         });

//         setToastSeverity('success');
//         setToastMessage('Exam scheduled successfully!');
//         setToastOpen(true);

//         setExamName('');
//         setScheduleClassId('');
//         setScheduleLoading(false);
//         loadBaselineData();
//       } catch (err: unknown) {
//         setScheduleLoading(false);
//         let msg = 'Failed to schedule exam.';
//         if (axios.isAxiosError(err)) {
//           msg = err.response?.data?.message || msg;
//         }
//         setToastSeverity('error');
//         setToastMessage(msg);
//         setToastOpen(true);
//       }
//     }, 2000);
//   };

//   const handleMarksExamChange = async (examId: string) => {
//     setMarksExamId(examId);
//     setMarksSubjectId('');
//     setMarksRecords({});
//     setSubjects([]);

//     const selectedExam = exams.find(e => e._id === examId);
//     if (selectedExam) {
//       const classId = selectedExam.class._id;
//       setMarksClassId(classId);

//       try {
//         const resSubjects = await getSubjectsByClass(classId);
//         setSubjects(resSubjects.data);
//       } catch {
//         setToastSeverity('error');
//         setToastMessage('Failed to fetch subjects for this class.');
//         setToastOpen(true);
//       }
//     }
//   };

//   const handleLoadMarksheet = () => {
//     if (!marksExamId || !marksSubjectId) {
//       setToastSeverity('error');
//       setToastMessage('Please select both Exam and Subject first!');
//       setToastOpen(true);
//       return;
//     }

//     const classStudents = students.filter(s => s.class._id === marksClassId);

//     if (classStudents.length === 0) {
//       setToastSeverity('error');
//       setToastMessage('No active students found in this class!');
//       setToastOpen(true);
//       return;
//     }

//     const initialMarks: { [key: string]: { obtained: string; total: string } } = {};
//     classStudents.forEach(stud => {
//       initialMarks[stud._id] = { obtained: '0', total: '100' };
//     });

//     setMarksRecords(initialMarks);
//   };

//   const handleMarksValueChange = (studentId: string, field: 'obtained' | 'total', value: string) => {
//     setMarksRecords(prev => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [field]: value
//       }
//     }));
//   };

//   const handleSaveMarks = (e: React.FormEvent) => {
//     e.preventDefault();

//     const formattedRecords = Object.keys(marksRecords).map(key => ({
//       student: key,
//       obtainedMarks: Number(marksRecords[key].obtained),
//       totalMarks: Number(marksRecords[key].total)
//     }));

//     if (formattedRecords.length === 0) {
//       setToastSeverity('error');
//       setToastMessage('No marks record list loaded to save!');
//       setToastOpen(true);
//       return;
//     }

//     setMarksSaveLoading(true);

//     setTimeout(async () => {
//       try {
//         await enterMarks({
//           examId: marksExamId,
//           subjectId: marksSubjectId,
//           records: formattedRecords
//         });

//         setToastSeverity('success');
//         setToastMessage('Exam marks saved successfully!');
//         setToastOpen(true);

//         setMarksRecords({});
//         setMarksExamId('');
//         setMarksSubjectId('');
//         setMarksSaveLoading(false);
//       } catch (err: unknown) {
//         setMarksSaveLoading(false);
//         let msg = 'Failed to save marks.';
//         if (axios.isAxiosError(err)) {
//           msg = err.response?.data?.message || msg;
//         }
//         setToastSeverity('error');
//         setToastMessage(msg);
//         setToastOpen(true);
//       }
//     }, 2000);
//   };

//   const handleLoadReportCard = async () => {
//     if (!reportStudentId || !reportExamId) {
//       setToastSeverity('error');
//       setToastMessage('Please select both Student and Exam first!');
//       setToastOpen(true);
//       return;
//     }

//     try {
//       setReportCardLoading(true);
//       const res = await getStudentReportCard(reportStudentId, reportExamId);
//       setReportCard(res.data);
//       setReportCardLoading(false);
//     } catch (err: unknown) {
//       setReportCard(null);
//       setReportCardLoading(false);
//       let msg = 'Failed to fetch student report card.';
//       if (axios.isAxiosError(err)) {
//         msg = err.response?.data?.message || msg;
//       }
//       setToastSeverity('error');
//       setToastMessage(msg);
//       setToastOpen(true);
//     }
//   };

//   const handleLoadMeritList = async () => {
//     if (!meritExamId) {
//       setToastSeverity('error');
//       setToastMessage('Please select an Exam to generate merit list!');
//       setToastOpen(true);
//       return;
//     }

//     try {
//       setMeritLoading(true);
//       const res = await getMeritList(meritExamId);
//       setMeritList(res.meritList);
//       setMeritLoading(false);
//     } catch (err: unknown) {
//       setMeritList([]);
//       setMeritLoading(false);
//       let msg = 'Failed to fetch merit list.';
//       if (axios.isAxiosError(err)) {
//         msg = err.response?.data?.message || msg;
//       }
//       setToastSeverity('error');
//       setToastMessage(msg);
//       setToastOpen(true);
//       console.error('getMeritList failed logs:', err);
//     }
//   };

//   return (
//    <Box
//       sx={{
//         width: '100%',
//         maxWidth: '100%',
//         overflowX: 'hidden',
//         '@keyframes pageSlideUp': {
//           '0%': { opacity: 0, transform: 'translateY(12px)' },
//           '100%': { opacity: 1, transform: 'translateY(0)' }
//         },
//         animation: 'pageSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards'
//       }}
//     >
//       <Typography variant="h1" color="primary" sx={{ mb: 1, fontSize: '1.65rem', fontWeight: 800, fontFamily: '"Roboto", "Arial", sans-serif', letterSpacing: '-0.01em' }}>
//         Examination System
//       </Typography>
//       <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '0.925rem', fontFamily: '"Roboto", "Arial", sans-serif' }}>
//         Schedule exams, enter grades, generate calculated report cards, and evaluate merit lists.
//       </Typography>

//       <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
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
//               padding: "6px 16px"
//             }
//           }}
//         >
//           <Tab label="Schedule Exam" />
//           <Tab label="Bulk Marks Entry" />
//           <Tab label="Student Report Cards" />
//           <Tab label="Class Merit Lists" />
//         </Tabs>
//       </Box>

//       <Snackbar
//         open={toastOpen}
//         autoHideDuration={4000}
//         onClose={() => setToastOpen(false)}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={() => setToastOpen(false)}
//           severity={toastSeverity}
//           sx={{
//             width: '100%',
//             borderRadius: "10px",
//             fontFamily: '"Roboto", "Arial", sans-serif',
//             boxShadow: mode === 'light' ? '0 10px 24px rgba(15, 23, 42, 0.08)' : 'none'
//           }}
//         >
//           {toastMessage}
//         </Alert>
//       </Snackbar>

//       {activeTab === 0 && (
//         <Card sx={{ borderRadius: "10px", bgcolor: 'background.paper', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', maxWidth: 600 }}>
//           <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
//             <Typography variant="h6" color="primary" sx={{ fontWeight: 700, fontSize: "14px", mb: 3, fontFamily: '"Roboto", "Arial", sans-serif' }}>
//               Schedule New Class Exam
//             </Typography>

//             <form onSubmit={handleScheduleExam}>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3.5 }}>

//                 <TextField
//                   label="Exam Name"
//                   placeholder="Enter exam name"
//                   variant="outlined"
//                   size="small"
//                   fullWidth
//                   value={examName}
//                   onChange={(e) => setExamName(e.target.value)}
//                   disabled={scheduleLoading}
//                   sx={{
//                     '& .MuiOutlinedInput-root': { height: 42, borderRadius: "8px", fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px' },
//                     '& .MuiInputLabel-root': { fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px', transform: 'translate(14px, 12px) scale(1)' },
//                     '& .MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' }
//                   }}
//                 />

//                 <FormControl size="small" fullWidth>
//                   <InputLabel
//                     id="schedule-class-label"
//                     sx={{
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 11px) scale(1)",
//                       "&.MuiInputLabel-shrink": {
//                         transform: "translate(14px, -6px) scale(0.75)",
//                       }
//                     }}
//                   >
//                     Select Class
//                   </InputLabel>
//                   <Select
//                     labelId="schedule-class-label"
//                     value={scheduleClassId}
//                     label="Select Class"
//                     onChange={(e) => setScheduleClassId(e.target.value)}
//                     disabled={scheduleLoading}
//                     sx={{
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: '13px',
//                       "& .MuiSelect-select": {
//                         paddingTop: "11px",
//                         paddingBottom: "11px"
//                       }
//                     }}
//                   >
//                     {classes.map((cls) => (
//                       <MenuItem key={cls._id} value={cls._id} sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>
//                         {cls.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//               </Box>

//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 disabled={scheduleLoading}
//                 sx={{ height: 42, fontSize: "13px", borderRadius: "8px", textTransform: "none", boxShadow: "none", fontWeight: 600, fontFamily: '"Roboto", "Arial", sans-serif' }}
//               >
//                 {scheduleLoading ? <CircularProgress size={18} color="inherit" /> : 'Schedule Exam'}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       )}

//       {activeTab === 1 && (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//           <Card sx={{ borderRadius: "10px", bgcolor: 'background.paper', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', width: '100%', maxWidth: '100%' }}>
//             <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
//               <Box
//                 sx={{
//                   display: 'grid',
//                   gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.5fr 1.5fr 1fr' },
//                   gap: 2,
//                   alignItems: 'center',
//                   width: '100%'
//                 }}
//               >
//                 <FormControl size="small" fullWidth>
//                   <InputLabel
//                     id="marks-exam-label"
//                     sx={{
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 11px) scale(1)",
//                       "&.MuiInputLabel-shrink": {
//                         transform: "translate(14px, -6px) scale(0.75)",
//                       }
//                     }}
//                   >
//                     Select Scheduled Exam
//                   </InputLabel>
//                   <Select
//                     labelId="marks-exam-label"
//                     value={marksExamId}
//                     label="Select Scheduled Exam"
//                     onChange={(e) => handleMarksExamChange(e.target.value)}
//                     sx={{
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: '13px',
//                       "& .MuiSelect-select": {
//                         paddingTop: "11px",
//                         paddingBottom: "11px"
//                       }
//                     }}
//                   >
//                     {exams.map((ex) => (
//                       <MenuItem key={ex._id} value={ex._id} sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>
//                         {ex.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 <FormControl size="small" fullWidth>
//                   <InputLabel
//                     id="marks-subject-label"
//                     sx={{
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 11px) scale(1)",
//                       "&.MuiInputLabel-shrink": {
//                         transform: "translate(14px, -6px) scale(0.75)",
//                       }
//                     }}
//                   >
//                     Select Subject
//                   </InputLabel>
//                   <Select
//                     labelId="marks-subject-label"
//                     value={marksSubjectId}
//                     label="Select Subject"
//                     onChange={(e) => setMarksSubjectId(e.target.value)}
//                     disabled={!marksExamId}
//                     sx={{
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: '13px',
//                       "& .MuiSelect-select": {
//                         paddingTop: "11px",
//                         paddingBottom: "11px"
//                       }
//                     }}
//                   >
//                     {subjects.map((sub) => (
//                       <MenuItem key={sub._id} value={sub._id} sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>
//                         {sub.name} ({sub.code})
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={handleLoadMarksheet}
//                   fullWidth
//                   sx={{ height: 42, fontSize: "13px", borderRadius: "8px", textTransform: "none", boxShadow: "none", fontWeight: 600, fontFamily: '"Roboto", "Arial", sans-serif' }}
//                 >
//                   Load Mark Sheet
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>

//           {Object.keys(marksRecords).length > 0 && (
//             <Card sx={{ borderRadius: "10px", bgcolor: 'background.paper', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', p: 1, width: '100%', maxWidth: '100%' }}>
//               <CardContent sx={{ p: 0 }}>
//                 <Typography variant="h6" color="primary" sx={{ fontWeight: 700, fontSize: "14px", p: 2, fontFamily: '"Roboto", "Arial", sans-serif' }}>
//                   Register Students Subject Marks
//                 </Typography>

//                 <Box sx={{ display: { xs: 'none', md: 'block' } }}>
//                   <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
//                     <Table sx={{ minWidth: 600 }}>
//                       <TableHead sx={{ bgcolor: 'action.hover' }}>
//                         <TableRow>
//                           <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Roll No</TableCell>
//                           <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Student Name</TableCell>
//                           <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Obtained Marks</TableCell>
//                           <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Total Marks</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {students.filter(s => s.class._id === marksClassId).map((stud) => (
//                           <TableRow key={stud._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}>
//                             <TableCell sx={{ fontWeight: 600, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>{stud.rollNo}</TableCell>
//                             <TableCell sx={{ fontWeight: 600, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>{stud.user.name}</TableCell>
//                             <TableCell sx={{ borderBottomColor: 'divider', whiteSpace: "nowrap" }}>
//                               <TextField
//                                 type="number"
//                                 variant="outlined"
//                                 size="small"
//                                 value={marksRecords[stud._id]?.obtained || '0'}
//                                 onChange={(e) => handleMarksValueChange(stud._id, 'obtained', e.target.value)}
//                                 slotProps={{
//                                   input: {
//                                     sx: {
//                                       height: 38,
//                                       width: 120,
//                                       borderRadius: "6px",
//                                       fontFamily: '"Roboto", "Arial", sans-serif',
//                                       fontSize: "13px"
//                                     }
//                                   }
//                                 }}
//                               />
//                             </TableCell>
//                             <TableCell sx={{ borderBottomColor: 'divider', whiteSpace: "nowrap" }}>
//                               <TextField
//                                 type="number"
//                                 variant="outlined"
//                                 size="small"
//                                 value={marksRecords[stud._id]?.total || '100'}
//                                 onChange={(e) => handleMarksValueChange(stud._id, 'total', e.target.value)}
//                                 slotProps={{
//                                   input: {
//                                     sx: {
//                                       height: 38,
//                                       width: 120,
//                                       borderRadius: "6px",
//                                       fontFamily: '"Roboto", "Arial", sans-serif',
//                                       fontSize: "13px"
//                                     }
//                                   }
//                                 }}
//                               />
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Box>

//                 <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2, p: 2 }}>
//                   {students.filter(s => s.class._id === marksClassId).map((stud) => (
//                     <Card
//                       key={stud._id}
//                       sx={{
//                         p: 2,
//                         borderRadius: "10px",
//                         border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1',
//                         boxShadow: 'none',
//                         bgcolor: 'background.paper'
//                       }}
//                     >
//                       <Typography sx={{ fontSize: '11px', fontWeight: 700, fontFamily: '"Roboto", "Arial", sans-serif', color: 'text.secondary', mb: 1 }}>
//                         Roll No: {stud.rollNo}
//                       </Typography>
//                       <Typography sx={{ fontWeight: 600, fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px', mb: 2, color: 'text.primary' }}>
//                         {stud.user.name}
//                       </Typography>

//                       <Divider sx={{ mb: 2, borderColor: 'divider', opacity: 0.6 }} />

//                       <Box sx={{ display: 'flex', gap: 2 }}>
//                         <TextField
//                           label="Obtained"
//                           type="number"
//                           variant="outlined"
//                           size="small"
//                           fullWidth
//                           value={marksRecords[stud._id]?.obtained || '0'}
//                           onChange={(e) => handleMarksValueChange(stud._id, 'obtained', e.target.value)}
//                           sx={{
//                             '& .MuiOutlinedInput-root': { height: 42, borderRadius: "8px", fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px' },
//                             '& .MuiInputLabel-root': { fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px', transform: 'translate(14px, 12px) scale(1)' },
//                             '& .MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' }
//                           }}
//                         />
//                         <TextField
//                           label="Total"
//                           type="number"
//                           variant="outlined"
//                           size="small"
//                           fullWidth
//                           value={marksRecords[stud._id]?.total || '100'}
//                           onChange={(e) => handleMarksValueChange(stud._id, 'total', e.target.value)}
//                           sx={{
//                             '& .MuiOutlinedInput-root': { height: 42, borderRadius: "8px", fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px' },
//                             '& .MuiInputLabel-root': { fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px', transform: 'translate(14px, 12px) scale(1)' },
//                             '& .MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' }
//                           }}
//                         />
//                       </Box>
//                     </Card>
//                   ))}
//                 </Box>

//                 <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid', borderColor: 'divider' }}>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     disabled={marksSaveLoading}
//                     onClick={handleSaveMarks}
//                     sx={{ height: 42, fontSize: "13px", borderRadius: "8px", px: 4, textTransform: "none", boxShadow: "none", fontWeight: 600, fontFamily: '"Roboto", "Arial", sans-serif' }}
//                   >
//                     {marksSaveLoading ? <CircularProgress size={18} color="inherit" /> : 'Save Exam Marks'}
//                   </Button>
//                 </Box>

//               </CardContent>
//             </Card>
//           )}
//         </Box>
//       )}

//       {activeTab === 2 && (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//           <Card sx={{ borderRadius: "10px", bgcolor: 'background.paper', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', width: '100%', maxWidth: '100%' }}>
//             <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
//               <Box
//                 sx={{
//                   display: 'grid',
//                   gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.5fr 1.5fr 1fr' },
//                   gap: 2,
//                   alignItems: 'center',
//                   width: '100%'
//                 }}
//               >
//                 <FormControl size="small" fullWidth>
//                   <InputLabel
//                     id="report-student-label"
//                     sx={{
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 11px) scale(1)",
//                       "&.MuiInputLabel-shrink": {
//                         transform: "translate(14px, -6px) scale(0.75)",
//                       }
//                     }}
//                   >
//                     Select Student
//                   </InputLabel>
//                   <Select
//                     labelId="report-student-label"
//                     value={reportStudentId}
//                     label="Select Student"
//                     onChange={(e) => setReportStudentId(e.target.value)}
//                     sx={{
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: '13px',
//                       "& .MuiSelect-select": {
//                         paddingTop: "11px",
//                         paddingBottom: "11px"
//                       }
//                     }}
//                   >
//                     {students.map((st) => (
//                       <MenuItem key={st._id} value={st._id} sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>
//                         {st.user.name} ({st.admissionNo})
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 <FormControl size="small" fullWidth>
//                   <InputLabel
//                     id="report-exam-label"
//                     sx={{
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 11px) scale(1)",
//                       "&.MuiInputLabel-shrink": {
//                         transform: "translate(14px, -6px) scale(0.75)",
//                       }
//                     }}
//                   >
//                     Select Exam
//                   </InputLabel>
//                   <Select
//                     labelId="report-exam-label"
//                     value={reportExamId}
//                     label="Select Exam"
//                     onChange={(e) => setReportExamId(e.target.value)}
//                     sx={{
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: '13px',
//                       "& .MuiSelect-select": {
//                         paddingTop: "11px",
//                         paddingBottom: "11px"
//                       }
//                     }}
//                   >
//                     {exams.map((ex) => (
//                       <MenuItem key={ex._id} value={ex._id} sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>
//                         {ex.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={handleLoadReportCard}
//                   fullWidth
//                   sx={{ height: 42, fontSize: "13px", borderRadius: "8px", textTransform: "none", boxShadow: "none", fontWeight: 600, fontFamily: '"Roboto", "Arial", sans-serif' }}
//                 >
//                   Generate Report Card
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>

//           {reportCardLoading ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
//               <CircularProgress size={28} />
//             </Box>
//           ) : !reportCard ? (
//             <Card sx={{ borderRadius: "10px", border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', p: 4, textAlign: 'center', width: '100%' }}>
//               <Typography variant="body2" color="text.secondary" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>
//                 Please select student and exam, then click Generate Report Card above.
//               </Typography>
//             </Card>
//           ) : (
//             <Card sx={{ borderRadius: "10px", bgcolor: 'background.paper', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', maxWidth: '100%', width: '100%', p: { xs: 0.5, sm: 1.5 } }}>
//               <CardContent sx={{ p: { xs: 2, sm: 2 } }}>

//                 <Box sx={{ textAlign: 'center', pb: 2, mb: 2, borderBottom: '2px solid', borderColor: 'primary.main' }}>
//                   <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: '"Roboto", "Arial", sans-serif', letterSpacing: '0.04em', fontSize: { xs: '1.15rem', sm: '1.4rem' } }}>
//                     CAMPUS HIGH SCHOOL
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '0.8rem' }}>
//                     Official Academic Achievement Report
//                   </Typography>
//                 </Box>

//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3, px: { xs: 1, sm: 2 } }}>
//                   <Typography variant="body2" noWrap sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '0.85rem', textOverflow: 'ellipsis', overflow: 'hidden' }}>
//                     <strong>Student Name:</strong> {reportCard.studentName}
//                   </Typography>
//                   <Typography variant="body2" noWrap sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '0.85rem', textOverflow: 'ellipsis', overflow: 'hidden' }}>
//                     <strong>Admission No:</strong> {reportCard.admissionNo}
//                   </Typography>
//                   <Typography variant="body2" noWrap sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '0.85rem', textOverflow: 'ellipsis', overflow: 'hidden' }}>
//                     <strong>Exam Term:</strong> {reportCard.examName}
//                   </Typography>
//                 </Box>

//                 <Box sx={{ width: '100%', overflowX: 'auto', px: { xs: 1, sm: 2 } }}>
//                   <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent', mb: 3 }}>
//                     <Table size="small" sx={{ minWidth: 400 }}>
//                       <TableHead sx={{ bgcolor: 'action.hover' }}>
//                         <TableRow>
//                           <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', px: { xs: 0.8, sm: 2 }, borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Subject</TableCell>
//                           <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', px: { xs: 0.8, sm: 2 }, borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Obtained</TableCell>
//                           <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', px: { xs: 0.8, sm: 2 }, borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Total</TableCell>
//                           <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', px: { xs: 0.8, sm: 2 }, borderBottomColor: 'divider', whiteSpace: "nowrap" }} align="right">Percentage</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {reportCard.results.map((r, i) => (
//                           <TableRow key={i} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
//                             <TableCell sx={{ px: { xs: 0.8, sm: 2 }, borderBottomColor: 'divider', maxWidth: 120, whiteSpace: "nowrap" }}>
//                               <Typography
//                                 noWrap
//                                 sx={{
//                                   fontWeight: 600,
//                                   fontFamily: '"Roboto", "Arial", sans-serif',
//                                   fontSize: '0.88rem',
//                                   textOverflow: 'ellipsis',
//                                   overflow: 'hidden',
//                                   maxWidth: 120
//                                 }}
//                               >
//                                 {r.subjectName}
//                               </Typography>
//                             </TableCell>
//                             <TableCell sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px", borderBottomColor: 'divider', px: { xs: 0.8, sm: 2 }, whiteSpace: "nowrap" }}>{r.obtained}</TableCell>
//                             <TableCell sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px", borderBottomColor: 'divider', px: { xs: 0.8, sm: 2 }, whiteSpace: "nowrap" }}>{r.total}</TableCell>
//                             <TableCell align="right" sx={{ fontWeight: 600, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', px: { xs: 0.8, sm: 2 }, whiteSpace: "nowrap" }}>{r.percentage}</TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Box>

//                 <Divider sx={{ mb: 2 }} />

//                 <Box sx={{ p: 2, mx: { xs: 1, sm: 2 }, bgcolor: 'action.hover', borderRadius: "10px", border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
//                   <Typography sx={{ fontWeight: 700, fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px' }}>
//                     Aggregate Result Status:
//                   </Typography>
//                   <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
//                     <Typography variant="body2" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px', mb: 0.5 }}>
//                       Total: <strong>{reportCard.summary.totalObtained} / {reportCard.summary.totalMaximum}</strong>
//                     </Typography>
//                     <Typography sx={{ fontWeight: 700, color: 'primary.main', fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '1.05rem' }}>
//                       Percentage: {reportCard.summary.percentage}
//                     </Typography>
//                   </Box>
//                 </Box>

//               </CardContent>
//             </Card>
//           )}
//         </Box>
//       )}

//       {activeTab === 3 && (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//           <Card sx={{ borderRadius: "10px", bgcolor: 'background.paper', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', width: '100%', maxWidth: '100%' }}>
//             <CardContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
//               <Box
//                 sx={{
//                   display: 'grid',
//                   gridTemplateColumns: { xs: '1fr', sm: '1.5fr 1fr' },
//                   gap: 2,
//                   alignItems: 'center',
//                   maxWidth: 450,
//                   width: '100%'
//                 }}
//               >
//                 <FormControl size="small" fullWidth>
//                   <InputLabel
//                     id="merit-exam-label"
//                     sx={{
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: "13px",
//                       transform: "translate(14px, 11px) scale(1)",
//                       "&.MuiInputLabel-shrink": {
//                         transform: "translate(14px, -6px) scale(0.75)",
//                       }
//                     }}
//                   >
//                     Select Exam
//                   </InputLabel>
//                   <Select
//                     labelId="merit-exam-label"
//                     value={meritExamId}
//                     label="Select Exam"
//                     onChange={(e) => setMeritExamId(e.target.value)}
//                     sx={{
//                       height: 42,
//                       borderRadius: "8px",
//                       fontFamily: '"Roboto", "Arial", sans-serif',
//                       fontSize: '13px',
//                       "& .MuiSelect-select": {
//                         paddingTop: "11px",
//                         paddingBottom: "11px"
//                       }
//                     }}
//                   >
//                     {exams.map((ex) => (
//                       <MenuItem key={ex._id} value={ex._id} sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>
//                         {ex.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={handleLoadMeritList}
//                   fullWidth
//                   sx={{ height: 42, fontSize: "13px", borderRadius: "8px", textTransform: "none", boxShadow: "none", fontWeight: 600, fontFamily: '"Roboto", "Arial", sans-serif' }}
//                 >
//                   Generate Merit List
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>

//           {meritLoading ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
//               <CircularProgress size={28} />
//             </Box>
//           ) : meritList.length === 0 ? (
//             <Card sx={{ borderRadius: "10px", border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', p: 4, textAlign: 'center', width: '100%' }}>
//               <Typography variant="body2" color="text.secondary" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>
//                 Please select an exam, then click Generate Merit List above.
//               </Typography>
//             </Card>
//           ) : (
//             <Card sx={{ borderRadius: "10px", border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', p: 1, maxWidth: '100%', overflow: "hidden" }}>
//               <CardContent sx={{ p: 0 }}>
//                 <Typography variant="h6" color="primary" sx={{ fontWeight: 700, fontSize: "14px", p: 2, fontFamily: '"Roboto", "Arial", sans-serif' }}>
//                   Exam Position Standings (Merit List)
//                 </Typography>

//                 <Box sx={{ width: '100%', overflowX: 'auto' }}>
//                   <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
//                     <Table sx={{ minWidth: 600 }}>
//                       <TableHead sx={{ bgcolor: 'action.hover' }}>
//                         <TableRow>
//                           <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Position</TableCell>
//                           <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Admission No</TableCell>
//                           <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Student Name</TableCell>
//                           <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Obtained Marks</TableCell>
//                           <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Total Marks</TableCell>
//                           <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }} align="right">Percentage</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {meritList.map((m, index) => (
//                           <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}>
//                             <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', color: index === 0 ? 'success.main' : 'text.primary', whiteSpace: "nowrap" }}>
//                               {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}th`}
//                             </TableCell>
//                             <TableCell sx={{ fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>{m.admissionNo}</TableCell>
//                             <TableCell sx={{ fontWeight: 600, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>{m.name}</TableCell>
//                             <TableCell sx={{ fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>{m.obtained}</TableCell>
//                             <TableCell sx={{ fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>{m.total}</TableCell>
//                             <TableCell align="right" sx={{ fontWeight: 700, fontSize: "13px", color: 'primary.main', fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>
//                               {m.percentage.toFixed(2)}%
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
import { getClasses, getSubjectsByClass } from "../services/academicService";
import { getStudents } from "../services/studentService";
import {
  scheduleExam,
  getExams,
  enterMarks,
  getStudentReportCard,
  getMeritList,
} from "../services/examService";

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
  };
}

interface SubjectData {
  _id: string;
  name: string;
  code: string;
}

interface ReportCardData {
  studentName: string;
  admissionNo: string;
  examName: string;
  results: {
    subjectName: string;
    subjectCode: string;
    obtained: number;
    total: number;
    percentage: string;
  }[];
  summary: {
    totalObtained: number;
    totalMaximum: number;
    percentage: string;
  };
}

interface MeritData {
  name: string;
  admissionNo: string;
  obtained: number;
  total: number;
  percentage: number;
}

export const Exams: React.FC = () => {
  const { mode } = useCustomTheme();
  const [activeTab, setActiveTab] = useState(0);

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [exams, setExams] = useState<
    { _id: string; name: string; class: { _id: string } }[]
  >([]);
  const [, setLoading] = useState(true);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success",
  );

  const [examName, setExamName] = useState("");
  const [scheduleClassId, setScheduleClassId] = useState("");

  const [marksExamId, setMarksExamId] = useState("");
  const [marksSubjectId, setMarksSubjectId] = useState("");
  const [marksClassId, setMarksClassId] = useState("");
  const [marksRecords, setMarksRecords] = useState<{
    [key: string]: { obtained: string; total: string };
  }>({});

  const [reportStudentId, setReportStudentId] = useState("");
  const [reportExamId, setReportExamId] = useState("");
  const [reportCard, setReportCard] = useState<ReportCardData | null>(null);
  const [reportCardLoading, setReportCardLoading] = useState(false);

  const [meritExamId, setMeritExamId] = useState("");
  const [meritList, setMeritList] = useState<MeritData[]>([]);
  const [meritLoading, setMeritLoading] = useState(false);

  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [marksSaveLoading, setMarksSaveLoading] = useState(false);

  const loadBaselineData = useCallback(async () => {
    try {
      setLoading(true);
      const resClasses = await getClasses();
      const resStudents = await getStudents();
      const resExams = await getExams();

      setClasses(resClasses.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setStudents(resStudents.data.filter((s: any) => s.status === "Active"));
      setExams(resExams.data || []);
      setLoading(false);
    } catch {
      setLoading(false);
      setToastSeverity("error");
      setToastMessage("Failed to fetch baseline exams and classes details.");
      setToastOpen(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBaselineData();
  }, [loadBaselineData]);

  const handleScheduleExam = (e: React.FormEvent) => {
    e.preventDefault();

    if (!examName || !scheduleClassId) {
      setToastSeverity("error");
      setToastMessage("Please enter both Exam Name and select a Class!");
      setToastOpen(true);
      return;
    }

    setScheduleLoading(true);

    setTimeout(async () => {
      try {
        await scheduleExam({
          name: examName,
          classId: scheduleClassId,
        });

        setToastSeverity("success");
        setToastMessage("Exam scheduled successfully!");
        setToastOpen(true);

        setExamName("");
        setScheduleClassId("");
        setScheduleLoading(false);
        loadBaselineData();
      } catch (err: unknown) {
        setScheduleLoading(false);
        let msg = "Failed to schedule exam.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleMarksExamChange = async (examId: string) => {
    setMarksExamId(examId);
    setMarksSubjectId("");
    setMarksRecords({});
    setSubjects([]);

    const selectedExam = exams.find((e) => e._id === examId);
    if (selectedExam) {
      const classId = selectedExam.class._id;
      setMarksClassId(classId);

      try {
        const resSubjects = await getSubjectsByClass(classId);
        setSubjects(resSubjects.data);
      } catch {
        setToastSeverity("error");
        setToastMessage("Failed to fetch subjects for this class.");
        setToastOpen(true);
      }
    }
  };

  const handleLoadMarksheet = () => {
    if (!marksExamId || !marksSubjectId) {
      setToastSeverity("error");
      setToastMessage("Please select both Exam and Subject first!");
      setToastOpen(true);
      return;
    }

    const classStudents = students.filter((s) => s.class._id === marksClassId);

    if (classStudents.length === 0) {
      setToastSeverity("error");
      setToastMessage("No active students found in this class!");
      setToastOpen(true);
      return;
    }

    const initialMarks: { [key: string]: { obtained: string; total: string } } =
      {};
    classStudents.forEach((stud) => {
      initialMarks[stud._id] = { obtained: "0", total: "100" };
    });

    setMarksRecords(initialMarks);
  };

  const handleMarksValueChange = (
    studentId: string,
    field: "obtained" | "total",
    value: string,
  ) => {
    setMarksRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedRecords = Object.keys(marksRecords).map((key) => ({
      student: key,
      obtainedMarks: Number(marksRecords[key].obtained),
      totalMarks: Number(marksRecords[key].total),
    }));

    if (formattedRecords.length === 0) {
      setToastSeverity("error");
      setToastMessage("No marks record list loaded to save!");
      setToastOpen(true);
      return;
    }

    setMarksSaveLoading(true);

    setTimeout(async () => {
      try {
        await enterMarks({
          examId: marksExamId,
          subjectId: marksSubjectId,
          records: formattedRecords,
        });

        setToastSeverity("success");
        setToastMessage("Exam marks saved successfully!");
        setToastOpen(true);

        setMarksRecords({});
        setMarksExamId("");
        setMarksSubjectId("");
        setMarksSaveLoading(false);
      } catch (err: unknown) {
        setMarksSaveLoading(false);
        let msg = "Failed to save marks.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity("error");
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  const handleLoadReportCard = async () => {
    if (!reportStudentId || !reportExamId) {
      setToastSeverity("error");
      setToastMessage("Please select both Student and Exam first!");
      setToastOpen(true);
      return;
    }

    try {
      setReportCardLoading(true);
      const res = await getStudentReportCard(reportStudentId, reportExamId);
      setReportCard(res.data);
      setReportCardLoading(false);
    } catch (err: unknown) {
      setReportCard(null);
      setReportCardLoading(false);
      let msg = "Failed to fetch student report card.";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || msg;
      }
      setToastSeverity("error");
      setToastMessage(msg);
      setToastOpen(true);
    }
  };

  const handleLoadMeritList = async () => {
    if (!meritExamId) {
      setToastSeverity("error");
      setToastMessage("Please select an Exam to generate merit list!");
      setToastOpen(true);
      return;
    }

    try {
      setMeritLoading(true);
      const res = await getMeritList(meritExamId);
      setMeritList(res.meritList);
      setMeritLoading(false);
    } catch (err: unknown) {
      setMeritList([]);
      setMeritLoading(false);
      let msg = "Failed to fetch merit list.";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || msg;
      }
      setToastSeverity("error");
      setToastMessage(msg);
      setToastOpen(true);
      console.error("getMeritList failed logs:", err);
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
        Examination System
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
        Schedule exams, enter grades, generate calculated report cards, and
        evaluate merit lists.
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
          <Tab label="Schedule Exam" />
          <Tab label="Bulk Marks Entry" />
          <Tab label="Student Report Cards" />
          <Tab label="Class Merit Lists" />
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
              Schedule New Class Exam
            </Typography>

            <form onSubmit={handleScheduleExam}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  mb: 3.5,
                }}
              >
                <TextField
                  label="Exam Name"
                  placeholder="Enter exam name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  disabled={scheduleLoading}
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
                    id="schedule-class-label"
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
                    labelId="schedule-class-label"
                    value={scheduleClassId}
                    label="Select Class"
                    onChange={(e) => setScheduleClassId(e.target.value)}
                    disabled={scheduleLoading}
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
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={scheduleLoading}
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
                {scheduleLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Schedule Exam"
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
              boxShadow:
                mode === "light" ? "0 1px 3px rgba(15, 23, 42, 0.04)" : "none",
              border:
                mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
              width: "100%",
              maxWidth: "100%",
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
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
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
                    id="marks-exam-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Select Scheduled Exam
                  </InputLabel>
                  <Select
                    labelId="marks-exam-label"
                    value={marksExamId}
                    label="Select Scheduled Exam"
                    onChange={(e) => handleMarksExamChange(e.target.value)}
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
                    {exams.map((ex) => (
                      <MenuItem
                        key={ex._id}
                        value={ex._id}
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          fontSize: "13px",
                        }}
                      >
                        {ex.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel
                    id="marks-subject-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Select Subject
                  </InputLabel>
                  <Select
                    labelId="marks-subject-label"
                    value={marksSubjectId}
                    label="Select Subject"
                    onChange={(e) => setMarksSubjectId(e.target.value)}
                    disabled={!marksExamId}
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
                    {subjects.map((sub) => (
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
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLoadMarksheet}
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
                  Load Mark Sheet
                </Button>
              </Box>
            </CardContent>
          </Card>

          {Object.keys(marksRecords).length > 0 && (
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
                  Register Students Subject Marks
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
                            Obtained Marks
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
                            Total Marks
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {students
                          .filter((s) => s.class._id === marksClassId)
                          .map((stud) => (
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
                                {stud.rollNo}
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
                                  borderBottomColor: "divider",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <TextField
                                  type="number"
                                  variant="outlined"
                                  size="small"
                                  value={
                                    marksRecords[stud._id]?.obtained || "0"
                                  }
                                  onChange={(e) =>
                                    handleMarksValueChange(
                                      stud._id,
                                      "obtained",
                                      e.target.value,
                                    )
                                  }
                                  slotProps={{
                                    input: {
                                      sx: {
                                        height: 38,
                                        width: 120,
                                        borderRadius: "6px",
                                        fontFamily:
                                          '"Roboto", "Arial", sans-serif',
                                        fontSize: "13px",
                                      },
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottomColor: "divider",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <TextField
                                  type="number"
                                  variant="outlined"
                                  size="small"
                                  value={marksRecords[stud._id]?.total || "100"}
                                  onChange={(e) =>
                                    handleMarksValueChange(
                                      stud._id,
                                      "total",
                                      e.target.value,
                                    )
                                  }
                                  slotProps={{
                                    input: {
                                      sx: {
                                        height: 38,
                                        width: 120,
                                        borderRadius: "6px",
                                        fontFamily:
                                          '"Roboto", "Arial", sans-serif',
                                        fontSize: "13px",
                                      },
                                    },
                                  }}
                                />
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
                  {students
                    .filter((s) => s.class._id === marksClassId)
                    .map((stud) => (
                      <Card
                        key={stud._id}
                        sx={{
                          p: 2,
                          borderRadius: "10px",
                          border:
                            mode === "dark"
                              ? "1px solid #334155"
                              : "1px solid #CBD5E1",
                          boxShadow: "none",
                          bgcolor: "background.paper",
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
                        <Typography
                          sx={{
                            fontSize: "11px",
                            fontWeight: 700,
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            color: "text.secondary",
                            mb: 1,
                          }}
                        >
                          Roll No: {stud.rollNo}
                        </Typography>
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
                          sx={{ mb: 2, borderColor: "divider", opacity: 0.6 }}
                        />

                        <Box sx={{ display: "flex", gap: 2 }}>
                          <TextField
                            label="Obtained"
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={marksRecords[stud._id]?.obtained || "0"}
                            onChange={(e) =>
                              handleMarksValueChange(
                                stud._id,
                                "obtained",
                                e.target.value,
                              )
                            }
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
                            label="Total"
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={marksRecords[stud._id]?.total || "100"}
                            onChange={(e) =>
                              handleMarksValueChange(
                                stud._id,
                                "total",
                                e.target.value,
                              )
                            }
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
                    disabled={marksSaveLoading}
                    onClick={handleSaveMarks}
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
                    {marksSaveLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      "Save Exam Marks"
                    )}
                  </Button>
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
                mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
              width: "100%",
              maxWidth: "100%",
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
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
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
                    id="report-student-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Select Student
                  </InputLabel>
                  <Select
                    labelId="report-student-label"
                    value={reportStudentId}
                    label="Select Student"
                    onChange={(e) => setReportStudentId(e.target.value)}
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

                <FormControl size="small" fullWidth>
                  <InputLabel
                    id="report-exam-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Select Exam
                  </InputLabel>
                  <Select
                    labelId="report-exam-label"
                    value={reportExamId}
                    label="Select Exam"
                    onChange={(e) => setReportExamId(e.target.value)}
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
                    {exams.map((ex) => (
                      <MenuItem
                        key={ex._id}
                        value={ex._id}
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          fontSize: "13px",
                        }}
                      >
                        {ex.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLoadReportCard}
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
                  Generate Report Card
                </Button>
              </Box>
            </CardContent>
          </Card>

          {reportCardLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={28} />
            </Box>
          ) : !reportCard ? (
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
                width: "100%",
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
                Please select student and exam, then click Generate Report Card
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
                maxWidth: "100%",
                width: "100%",
                p: { xs: 0.5, sm: 1.5 },
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
              <CardContent sx={{ p: { xs: 2, sm: 2 } }}>
                <Box
                  sx={{
                    textAlign: "center",
                    pb: 2,
                    mb: 2,
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      color: "primary.main",
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      letterSpacing: "0.04em",
                      fontSize: { xs: "1.15rem", sm: "1.4rem" },
                    }}
                  >
                    CAMPUS HIGH SCHOOL
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "0.8rem",
                    }}
                  >
                    Official Academic Achievement Report
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    mb: 3,
                    px: { xs: 1, sm: 2 },
                  }}
                >
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "0.85rem",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    <strong>Student Name:</strong> {reportCard.studentName}
                  </Typography>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "0.85rem",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    <strong>Admission No:</strong> {reportCard.admissionNo}
                  </Typography>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "0.85rem",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    <strong>Exam Term:</strong> {reportCard.examName}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    overflowX: "auto",
                    px: { xs: 1, sm: 2 },
                  }}
                >
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ bgcolor: "transparent", mb: 3 }}
                  >
                    <Table size="small" sx={{ minWidth: 400 }}>
                      <TableHead sx={{ bgcolor: "action.hover" }}>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              px: { xs: 0.8, sm: 2 },
                              borderBottomColor: "divider",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Subject
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              px: { xs: 0.8, sm: 2 },
                              borderBottomColor: "divider",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Obtained
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              px: { xs: 0.8, sm: 2 },
                              borderBottomColor: "divider",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Total
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              fontSize: "13px",
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              px: { xs: 0.8, sm: 2 },
                              borderBottomColor: "divider",
                              whiteSpace: "nowrap",
                            }}
                            align="right"
                          >
                            Percentage
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportCard.results.map((r, i) => (
                          <TableRow
                            key={i}
                            sx={{ "&:hover": { bgcolor: "action.hover" } }}
                          >
                            <TableCell
                              sx={{
                                px: { xs: 0.8, sm: 2 },
                                borderBottomColor: "divider",
                                maxWidth: 120,
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Typography
                                noWrap
                                sx={{
                                  fontWeight: 600,
                                  fontFamily: '"Roboto", "Arial", sans-serif',
                                  fontSize: "0.88rem",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  maxWidth: 120,
                                }}
                              >
                                {r.subjectName}
                              </Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                fontSize: "13px",
                                borderBottomColor: "divider",
                                px: { xs: 0.8, sm: 2 },
                                whiteSpace: "nowrap",
                              }}
                            >
                              {r.obtained}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                fontSize: "13px",
                                borderBottomColor: "divider",
                                px: { xs: 0.8, sm: 2 },
                                whiteSpace: "nowrap",
                              }}
                            >
                              {r.total}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                fontWeight: 600,
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                                px: { xs: 0.8, sm: 2 },
                                whiteSpace: "nowrap",
                              }}
                            >
                              {r.percentage}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box
                  sx={{
                    p: 2,
                    mx: { xs: 1, sm: 2 },
                    bgcolor: "action.hover",
                    borderRadius: "10px",
                    border:
                      mode === "dark"
                        ? "1px solid #334155"
                        : "1px solid #CBD5E1",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 1.5,
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
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
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                    }}
                  >
                    Aggregate Result Status:
                  </Typography>
                  <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                        mb: 0.5,
                      }}
                    >
                      Total:{" "}
                      <strong>
                        {reportCard.summary.totalObtained} /{" "}
                        {reportCard.summary.totalMaximum}
                      </strong>
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                      }}
                    >
                      Percentage: {reportCard.summary.percentage}
                    </Typography>
                  </Box>
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
                mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
              width: "100%",
              maxWidth: "100%",
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
            <CardContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1.5fr 1fr" },
                  gap: 2,
                  alignItems: "center",
                  maxWidth: 450,
                  width: "100%",
                }}
              >
                <FormControl size="small" fullWidth>
                  <InputLabel
                    id="merit-exam-label"
                    sx={{
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Select Exam
                  </InputLabel>
                  <Select
                    labelId="merit-exam-label"
                    value={meritExamId}
                    label="Select Exam"
                    onChange={(e) => setMeritExamId(e.target.value)}
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
                    {exams.map((ex) => (
                      <MenuItem
                        key={ex._id}
                        value={ex._id}
                        sx={{
                          fontFamily: '"Roboto", "Arial", sans-serif',
                          fontSize: "13px",
                        }}
                      >
                        {ex.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLoadMeritList}
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
                  Generate Merit List
                </Button>
              </Box>
            </CardContent>
          </Card>

          {meritLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={28} />
            </Box>
          ) : meritList.length === 0 ? (
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
                width: "100%",
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
                Please select an exam, then click Generate Merit List above.
              </Typography>
            </Card>
          ) : (
            <Card
              sx={{
                borderRadius: "10px",
                border:
                  mode === "dark" ? "1px solid #334155" : "1px solid #CBD5E1",
                boxShadow:
                  mode === "light"
                    ? "0 1px 3px rgba(15, 23, 42, 0.04)"
                    : "none",
                p: 1,
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
                  Exam Position Standings (Merit List)
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
                              whiteSpace: "nowrap",
                            }}
                          >
                            Position
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
                            Obtained Marks
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
                            Total Marks
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
                            Percentage
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {meritList.map((m, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              "&:hover": { bgcolor: "action.hover" },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                                color:
                                  index === 0 ? "success.main" : "text.primary",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {index === 0
                                ? "1st"
                                : index === 1
                                  ? "2nd"
                                  : index === 2
                                    ? "3rd"
                                    : `${index + 1}th`}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {m.admissionNo}
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
                              {m.name}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {m.obtained}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "13px",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {m.total}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                fontWeight: 700,
                                fontSize: "13px",
                                color: "primary.main",
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                borderBottomColor: "divider",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {m.percentage.toFixed(2)}%
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
