import api from './api';

export const markStudentAttendance = async (attendanceData: {
  classId: string;
  sectionId: string;
  date: string;
  records: { student: string; status: string }[];
}) => {
  const response = await api.post('/attendance/student', attendanceData);
  return response.data;
};

export const getStudentAttendanceReport = async (classId: string, sectionId: string, date: string) => {
  const response = await api.get(`/attendance/student/report?classId=${classId}&sectionId=${sectionId}&date=${date}`);
  return response.data;
};

export const markStaffAttendance = async (attendanceData: {
  date: string;
  records: { staff: string; status: string }[];
}) => {
  const response = await api.post('/attendance/staff', attendanceData);
  return response.data;
};

export const getStaffAttendanceReport = async (date: string) => {
  const response = await api.get(`/attendance/staff/report?date=${date}`);
  return response.data;
};