import api from './api';

export const addVehicle = async (data: {
  vehicleNo: string;
  registrationNo: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
}) => {
  const response = await api.post('/transport/vehicles', data);
  return response.data;
};

export const getVehicles = async () => {
  const response = await api.get('/transport/vehicles');
  return response.data;
};

export const createRoute = async (data: {
  routeName: string;
  routeCost: number;
  stops: string[];
}) => {
  const response = await api.post('/transport/routes', data);
  return response.data;
};

export const getRoutes = async () => {
  const response = await api.get('/transport/routes');
  return response.data;
};

export const allocateTransport = async (data: {
  studentId: string;
  routeId: string;
  vehicleId: string;
}) => {
  const response = await api.post('/transport/allocate', data);
  return response.data;
};

export const cancelAllocation = async (id: string) => {
  const response = await api.delete(`/transport/allocate/${id}`);
  return response.data;
};

export const getTransportReport = async () => {
  const response = await api.get('/transport/report');
  return response.data;
};