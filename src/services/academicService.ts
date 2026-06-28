// import api from './api';

// export const createSection = async (name: string) => {
//   const response = await api.post('/academic/sections', { name });
//   return response.data;
// };

// export const createClass = async (name: string, sections: string[]) => {
//   const response = await api.post('/academic/classes', { name, sections });
//   return response.data;
// };

// export const getClasses = async () => {
//   const response = await api.get('/academic/classes');
//   return response.data;
// };

// export const createSubject = async (name: string, code: string, classId: string) => {
//   const response = await api.post('/academic/subjects', { name, code, classId });
//   return response.data;
// };

// export const getSubjectsByClass = async (classId: string) => {
//   const response = await api.get(`/academic/classes/${classId}/subjects`);
//   return response.data;
// };

// export const deleteClass = async (id: string) => {
//   const response = await api.delete(`/academic/classes/${id}`);
//   return response.data;
// };

// export const deleteSubject = async (id: string) => {
//   const response = await api.delete(`/academic/subjects/${id}`);
//   return response.data;
// };

import api from './api';

// Create Section
export const createSection = async (name: string) => {
  const response = await api.post('/academic/sections', { name });
  return response.data;
};

// Get All Sections list [1]
export const getSections = async () => {
  const response = await api.get('/academic/sections'); // Calls GET /api/academic/sections
  return response.data;
};

// Create Class [1]
export const createClass = async (name: string, sections: string[]) => {
  const response = await api.post('/academic/classes', { name, sections });
  return response.data;
};

// Get All Classes [1]
export const getClasses = async () => {
  const response = await api.get('/academic/classes');
  return response.data;
};

// Create Subject [1]
export const createSubject = async (name: string, code: string, classId: string) => {
  const response = await api.post('/academic/subjects', { name, code, classId });
  return response.data;
};

// Get Subjects by Class ID [1]
export const getSubjectsByClass = async (classId: string) => {
  const response = await api.get(`/academic/classes/${classId}/subjects`);
  return response.data;
};

// Delete Class [1]
export const deleteClass = async (id: string) => {
  const response = await api.delete(`/academic/classes/${id}`);
  return response.data;
};

// Delete Subject [1]
export const deleteSubject = async (id: string) => {
  const response = await api.delete(`/academic/subjects/${id}`);
  return response.data;
};
