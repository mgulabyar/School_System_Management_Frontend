import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/reports/dashboard-stats'); 
  return response.data;
};

export const getFeeReport = async (month?: string, status?: string) => {
  let url = '/reports/fee-report';
  const params: string[] = [];
  if (month) params.push(`month=${month}`);
  if (status) params.push(`status=${status}`);
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  const response = await api.get(url);
  return response.data;
};