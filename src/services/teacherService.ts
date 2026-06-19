import api from './api';

export const registerTeacher = async (teacherData: {
  name: string;
  email: string;
  password?: string;
  employeeId: string;
  qualification: string;
  salary: number;
}) => {
  const response = await api.post('/teachers/register', teacherData);
  return response.data;
};

export const getTeachers = async () => {
  const response = await api.get('/teachers');
  return response.data;
};

export const getTeacherProfile = async (id: string) => {
  const response = await api.get(`/teachers/profile/${id}`);
  return response.data;
};

export const allocateClassAndSubject = async (allocationData: {
  teacherId: string;
  classes: string[];
  sections: string[];
  subjects: string[];
}) => {
  const response = await api.put('/teachers/allocate', allocationData);
  return response.data;
};

export const clearTeacherAllocations = async (id: string) => {
  const response = await api.put(`/teachers/clear-allocations/${id}`);
  return response.data;
};

export const deleteTeacher = async (id: string) => {
  const response = await api.delete(`/teachers/${id}`);
  return response.data;
};

export const paySalary = async (teacherId: string, month: string) => {
  const response = await api.post('/teachers/pay-salary', { teacherId, month });
  return response.data;
};