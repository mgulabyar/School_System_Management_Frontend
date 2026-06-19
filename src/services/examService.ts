import api from './api';

export const scheduleExam = async (data: { name: string; classId: string }) => {
  const response = await api.post('/exams/schedule', data);
  return response.data;
};

export const getExams = async () => {
  const response = await api.get('/exams'); 
  return response.data;
};

export const enterMarks = async (data: {
  examId: string;
  subjectId: string;
  records: { student: string; obtainedMarks: number; totalMarks?: number }[];
}) => {
  const response = await api.post('/exams/marks-entry', data);
  return response.data;
};

export const getStudentReportCard = async (studentId: string, examId: string) => {
  const response = await api.get(`/exams/report-card/${studentId}/${examId}`);
  return response.data;
};

export const getMeritList = async (examId: string) => {
  const response = await api.get(`/exams/merit-list/${examId}`);
  return response.data;
};