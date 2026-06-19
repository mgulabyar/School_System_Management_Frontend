import api from './api';

export const admitStudent = async (studentData: {
  name: string;
  email: string;
  password?: string;
  admissionNo: string;
  rollNo: string;
  dateOfBirth: string;
  gender: string;
  classId: string;
  sectionId: string;
  parentName: string;
  parentPhone: string;
}) => {
  const response = await api.post('/students/admit', studentData);
  return response.data;
};

export const getStudents = async () => {
  const response = await api.get('/students');
  return response.data;
};

export const getStudentProfile = async (id: string) => {
  const response = await api.get(`/students/profile/${id}`);
  return response.data;
};

export const deleteStudent = async (id: string) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};