import api from './api';

export const createSection = async (name: string) => {
  const response = await api.post('/academic/sections', { name });
  return response.data;
};

export const createClass = async (name: string, sections: string[]) => {
  const response = await api.post('/academic/classes', { name, sections });
  return response.data;
};

export const getClasses = async () => {
  const response = await api.get('/academic/classes');
  return response.data;
};

export const createSubject = async (name: string, code: string, classId: string) => {
  const response = await api.post('/academic/subjects', { name, code, classId });
  return response.data;
};

export const getSubjectsByClass = async (classId: string) => {
  const response = await api.get(`/academic/classes/${classId}/subjects`);
  return response.data;
};

export const deleteClass = async (id: string) => {
  const response = await api.delete(`/academic/classes/${id}`);
  return response.data;
};

export const deleteSubject = async (id: string) => {
  const response = await api.delete(`/academic/subjects/${id}`);
  return response.data;
};