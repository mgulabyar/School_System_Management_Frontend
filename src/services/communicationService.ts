import api from './api';

export const sendNotification = async (data: {
  recipientId?: string;
  recipientPhone: string;
  message: string;
  channel: 'SMS' | 'WhatsApp' | 'Email';
}) => {
  const response = await api.post('/communication/send', data);
  return response.data;
};

export const getNotificationLogs = async () => {
  const response = await api.get('/communication/logs');
  return response.data;
};