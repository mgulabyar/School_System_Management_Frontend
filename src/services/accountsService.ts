import api from './api';

export const addTransaction = async (data: {
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  date?: string;
  description?: string;
}) => {
  const response = await api.post('/accounts/transaction', data);
  return response.data;
};

export const getFinancialReport = async (startDate: string, endDate: string) => {
  const response = await api.get(`/accounts/report?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};