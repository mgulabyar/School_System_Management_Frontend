import api from './api';

export const addBook = async (data: {
  title: string;
  author: string;
  isbn?: string;
  quantity: number;
  rackNo?: string;
}) => {
  const response = await api.post('/library/books', data);
  return response.data;
};

export const getBooks = async () => {
  const response = await api.get('/library/books'); 
  return response.data;
};

export const issueBook = async (data: {
  bookId: string;
  borrowerId: string; 
  dueDate: string;
}) => {
  const response = await api.post('/library/issue', data);
  return response.data;
};

export const returnBook = async (issueId: string) => {
  const response = await api.put(`/library/return/${issueId}`);
  return response.data;
};

export const getIssuedBooks = async () => {
  const response = await api.get('/library/issued-list');
  return response.data;
};