/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Card, CardContent, Typography, Button, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Alert, CircularProgress, Snackbar,
  Select, MenuItem, FormControl, InputLabel, TextField,
  Divider
} from '@mui/material';
import axios from 'axios';
import { useCustomTheme } from '../context/ThemeContext';
import { getClasses } from '../services/academicService';
import { getStudents } from '../services/studentService';
import { getTeachers } from '../services/teacherService';
import { getFeeReport } from '../services/reportsService';
import { getMeritList } from '../services/examService';
import { getExams } from '../services/examService';

interface ReportRow {
  col1: string;
  col2: string; 
  col3: string; 
  col4: string; 
}

export const Reports: React.FC = () => {
  const { mode } = useCustomTheme();
  const [, setClasses] = useState<{ _id: string; name: string }[]>([]);
  const [exams, setExams] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

  const [reportType, setReportType] = useState<'admissions' | 'staff' | 'fees' | 'exams' | ''>('');
  // const [filterClassId, setFilterClassId] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterExamId, setFilterExamId] = useState('');

  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [reportLoading, setReportLoading] = useState(false);

  const loadBaseData = useCallback(async () => {
    try {
      setLoading(true);
      const resClasses = await getClasses();
      const resExams = await getExams();
      setClasses(resClasses.data);
      setExams(resExams.data || []);
      setLoading(false);
    } catch {
      setLoading(false);
      setToastSeverity('error');
      setToastMessage('Failed to load baseline reports parameters.');
      setToastOpen(true);
    }
  }, []);

  useEffect(() => {
    loadBaseData();
  }, [loadBaseData]);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportType) {
      setToastSeverity('error');
      setToastMessage('Please select a Report Type first!');
      setToastOpen(true);
      return;
    }

    setReportLoading(true);

    setTimeout(async () => {
      try {
        let formattedData: ReportRow[] = [];

        if (reportType === 'admissions') {
          const res = await getStudents();
          formattedData = res.data.map((s: any) => ({
            col1: s.admissionNo,
            col2: s.user.name,
            col3: `${s.class.name} - ${s.section.name}`,
            col4: s.parentPhone
          }));
        }

        else if (reportType === 'staff') {
          const res = await getTeachers();
          formattedData = res.data.map((t: any) => ({
            col1: t.employeeId,
            col2: t.user.name,
            col3: t.qualification,
            col4: `Rs. ${t.salary}`
          }));
        }

        else if (reportType === 'fees') {
          if (!filterMonth) {
            setToastSeverity('error');
            setToastMessage('Please select a Target Month for Fee Report!');
            setToastOpen(true);
            setReportLoading(false);
            return;
          }
          const res = await getFeeReport(filterMonth, undefined);
          formattedData = res.data.map((inv: any) => ({
            col1: inv.student.admissionNo,
            col2: inv.student.user.name,
            col3: `${inv.class.name} (Billing Month)`,
            col4: `Rs. ${inv.totalAmount} [${inv.status.toUpperCase()}]`
          }));
        }

        else if (reportType === 'exams') {
          if (!filterExamId) {
            setToastSeverity('error');
            setToastMessage('Please select an Exam for Results Report!');
            setToastOpen(true);
            setReportLoading(false);
            return;
          }
          const res = await getMeritList(filterExamId);
          formattedData = res.meritList.map((m: any, index: number) => ({
            col1: `${index + 1} Position`,
            col2: m.name,
            col3: m.admissionNo,
            col4: `${m.percentage.toFixed(2)}% Marks Obtained`
          }));
        }

        setReportData(formattedData);
        setReportLoading(false);
        setToastSeverity('success');
        setToastMessage('Report generated successfully!');
        setToastOpen(true);

      } catch (err: unknown) {
        setReportLoading(false);
        let msg = 'Failed to generate report.';
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity('error');
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  return (
   <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        '@keyframes pageSlideUp': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        animation: 'pageSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setToastOpen(false)} 
          severity={toastSeverity} 
          sx={{ 
            width: '100%', 
            borderRadius: "10px", 
            fontFamily: '"Roboto", "Arial", sans-serif',
            boxShadow: mode === 'light' ? '0 10px 24px rgba(15, 23, 42, 0.08)' : 'none'
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>

      <Typography variant="h1" color="primary" sx={{ mb: 1, fontSize: '1.65rem', fontWeight: 800, fontFamily: '"Roboto", "Arial", sans-serif', letterSpacing: '-0.01em' }}>
        Unified Reports Center
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '0.925rem', fontFamily: '"Roboto", "Arial", sans-serif' }}>
        Generate, view, and audit comprehensive academic and financial ledgers.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card sx={{ borderRadius: "10px", bgcolor: 'background.paper', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', width: '100%' }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.5fr 1.5fr 1fr' }, 
                  gap: 2, 
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <FormControl size="small" fullWidth>
                  <InputLabel 
                    id="report-type-label" 
                    sx={{ 
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      }
                    }}
                  >
                    Select Report Type
                  </InputLabel>
                  <Select
                    labelId="report-type-label"
                    value={reportType}
                    label="Select Report Type"
                    onChange={(e) => {
                      setReportType(e.target.value as any);
                      setReportData([]); 
                    }}
                    disabled={reportLoading}
                    sx={{ 
                      height: 42, 
                      borderRadius: "8px", 
                      fontFamily: '"Roboto", "Arial", sans-serif', 
                      fontSize: '13px',
                      "& .MuiSelect-select": {
                        paddingTop: "11px",
                        paddingBottom: "11px"
                      }
                    }}
                  >
                    <MenuItem value="admissions" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>Student Admissions Report</MenuItem>
                    <MenuItem value="staff" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>Staff & Teachers Directory</MenuItem>
                    <MenuItem value="fees" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>Monthly Fees Collection Ledger</MenuItem>
                    <MenuItem value="exams" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>Exam Results Merit Standings</MenuItem>
                  </Select>
                </FormControl>

                {reportType === 'fees' && (
                  <TextField
                    type="date"
                    label="Select Month"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    disabled={reportLoading}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        height: 42, 
                        borderRadius: "8px", 
                        fontFamily: '"Roboto", "Arial", sans-serif', 
                        fontSize: '13px' 
                      },
                      '& .MuiInputLabel-root': { 
                        fontFamily: '"Roboto", "Arial", sans-serif', 
                        fontSize: '13px',
                        transform: "translate(14px, 12px) scale(1)"
                      },
                      '& .MuiInputLabel-shrink': {
                        transform: "translate(14px, -6px) scale(0.75)"
                      }
                    }}
                  />
                )}

                {reportType === 'exams' && (
                  <FormControl size="small" fullWidth>
                    <InputLabel 
                      id="filter-exam-label" 
                      sx={{ 
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        fontSize: "13px",
                        transform: "translate(14px, 11px) scale(1)",
                        "&.MuiInputLabel-shrink": {
                          transform: "translate(14px, -6px) scale(0.75)",
                        }
                      }}
                    >
                      Select Scheduled Exam
                    </InputLabel>
                    <Select
                      labelId="filter-exam-label"
                      value={filterExamId}
                      label="Select Scheduled Exam"
                      onChange={(e) => setFilterExamId(e.target.value)}
                      disabled={reportLoading}
                      sx={{ 
                        height: 42, 
                        borderRadius: "8px", 
                        fontFamily: '"Roboto", "Arial", sans-serif', 
                        fontSize: '13px',
                        "& .MuiSelect-select": {
                          paddingTop: "11px",
                          paddingBottom: "11px"
                        }
                      }}
                    >
                      {exams.map((ex) => (
                        <MenuItem key={ex._id} value={ex._id} sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>
                          {ex.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {reportType !== 'fees' && reportType !== 'exams' && <Box />}

                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleGenerateReport}
                  disabled={reportLoading}
                  fullWidth
                  sx={{ height: 42, fontSize: "13px", borderRadius: "8px", textTransform: "none", boxShadow: "none", fontWeight: 600, fontFamily: '"Roboto", "Arial", sans-serif' }}
                >
                  {reportLoading ? <CircularProgress size={18} color="inherit" /> : 'Generate Report'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {reportLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress size={28} />
            </Box>
          ) : reportData.length === 0 ? (
            <Card sx={{ borderRadius: "10px", border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>
                Please select a report type, configure filters, and click Generate Report above.
              </Typography>
            </Card>
          ) : (
            <Card sx={{ borderRadius: "10px", bgcolor: 'background.paper', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', p: 1, width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, fontSize: "14px", p: 2, fontFamily: '"Roboto", "Arial", sans-serif' }}>
                  Audited Report Directory Table
                </Typography>

                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
                    <Table sx={{ minWidth: 600 }}>
                      <TableHead sx={{ bgcolor: 'action.hover' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>
                            {reportType === 'admissions' ? 'Admission No' : reportType === 'staff' ? 'Employee ID' : reportType === 'fees' ? 'Admission No' : 'Position'}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>
                            {reportType === 'exams' ? 'Student Name' : 'Name'}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>
                            {reportType === 'admissions' ? 'Class & Section' : reportType === 'staff' ? 'Qualification' : reportType === 'fees' ? 'Billing Month' : 'Admission No'}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>
                            {reportType === 'admissions' ? 'Parent Phone' : reportType === 'staff' ? 'Base Salary' : reportType === 'fees' ? 'Total Bill' : 'Percentage Score'}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportData.map((row, index) => (
                          <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}>
                            <TableCell sx={{ fontWeight: 600, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>{row.col1}</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>{row.col2}</TableCell>
                            <TableCell sx={{ fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>{row.col3}</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: "13px", color: 'primary.main', fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>{row.col4}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2.5, p: 2 }}>
                  {reportData.map((row, index) => (
                    <Card 
                      key={index} 
                      sx={{ 
                        p: 2, 
                        borderRadius: "10px", 
                        border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1',
                        borderLeft: "5px solid",
                        borderLeftColor: "primary.main",
                        boxShadow: mode === 'light' ? '0 4px 12px rgba(15, 23, 42, 0.04)' : 'none',
                        bgcolor: 'background.paper',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: mode === "light" 
                            ? "0 12px 20px -5px rgba(15, 23, 42, 0.08)" 
                            : "0 4px 20px rgba(96, 165, 250, 0.1)",
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 700, fontFamily: '"Roboto", "Arial", sans-serif', color: 'text.secondary' }}>
                          {row.col1}
                        </Typography>
                      </Box>

                      <Typography sx={{ fontWeight: 700, fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '14px', mb: 0.5, color: 'primary.main' }}>
                        {row.col2}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1.5, fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '12px' }}>
                        {row.col3}
                      </Typography>

                      <Divider sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }} />
                      <Typography sx={{ fontWeight: 750, color: 'primary.main', fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px' }}>
                        {row.col4}
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