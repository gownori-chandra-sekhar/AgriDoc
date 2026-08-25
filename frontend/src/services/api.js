import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const scanPlant = async (imageFile, lang = 'en', gps = '16.5062, 80.6480') => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await apiClient.post('/api/scan', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'lang': lang,
      'gps': gps,
    },
  });
  return response.data;
};

export const getReports = async (crop = 'All', disease = 'All', userId = 'demo_farmer_123') => {
  const response = await apiClient.get('/api/reports', {
    params: { crop, disease, user_id: userId },
  });
  return response.data;
};

export const getRobotStatus = async () => {
  const response = await apiClient.get('/api/robot/status');
  return response.data;
};

export const toggleRobotConnection = async (connect = true) => {
  const response = await apiClient.post('/api/robot/connect', { connect });
  return response.data;
};

export const sendRobotCommand = async (command) => {
  const response = await apiClient.post('/api/robot/control', { command });
  return response.data;
};

export const getAnalytics = async () => {
  const response = await apiClient.get('/api/analytics');
  return response.data;
};

export default apiClient;
