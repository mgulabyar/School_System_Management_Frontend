import api from './api';

export const setupFeeStructure = async (data: {
  classId: string;
  tuitionFee: number;
  admissionFee: number;
  otherCharges: number;
}) => {
  const response = await api.post('/fees/structure', data);
  return response.data;
};

export const generateMonthlyFees = async (classId: string, month: string) => {
  const response = await api.post('/fees/generate', { classId, month });
  return response.data;
};

export const getDefaultersList = async (classId: string, month: string) => {
  const response = await api.get(`/fees/defaulters?classId=${classId}&month=${month}`);
  return response.data;
};

export const collectFee = async (invoiceId: string) => {
  const response = await api.put(`/fees/collect/${invoiceId}`);
  return response.data;
};

export const voidInvoice = async (invoiceId: string) => {
  const response = await api.delete(`/fees/collect/${invoiceId}`);
  return response.data;
};