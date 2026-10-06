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

export const getRoverTelemetry = async () => {
  const response = await apiClient.get('/api/rover/telemetry');
  return response.data;
};

export const scanEsp32Nodes = async () => {
  const response = await apiClient.get('/api/esp32/scan');
  return response.data;
};

export const toggleRobotConnection = async (connect = true, deviceId = null, ipAddress = null) => {
  const response = await apiClient.post('/api/robot/connect', {
    connect,
    device_id: deviceId,
    ip_address: ipAddress
  });
  return response.data;
};

export const getEsp32Pins = async () => {
  const response = await apiClient.get('/api/esp32/pins');
  return response.data;
};

export const scanEsp32Pins = async (ipAddress = null) => {
  const response = await apiClient.post('/api/esp32/scan-pins', {
    ip_address: ipAddress
  });
  return response.data;
};

export const updateEsp32Pins = async (pinsConfig) => {
  const response = await apiClient.post('/api/esp32/update-pins', {
    pins: pinsConfig
  });
  return response.data;
};

export const testEsp32Pin = async (pinNumber, action = 'read') => {
  const response = await apiClient.post('/api/esp32/test-pin', {
    pin: pinNumber,
    action: action
  });
  return response.data;
};

export const pingEsp32Node = async () => {
  const response = await apiClient.get('/api/esp32/ping');
  return response.data;
};

export const sendEsp32LiveTelemetry = async (telemetryPayload) => {
  const response = await apiClient.post('/api/esp32/telemetry', telemetryPayload);
  return response.data;
};

const CMD_SHORT_MAP = {
  FORWARD: 'w',
  BACKWARD: 'b',
  LEFT: 'l',
  RIGHT: 'r',
  STOP: 'stop',
  w: 'w',
  b: 'b',
  l: 'l',
  r: 'r',
  stop: 'stop',
  START_SCAN: 'sequence'
};

export const sendRobotCommand = async (command) => {
  const shortCmd = CMD_SHORT_MAP[command] || command.toLowerCase();
  const response = await apiClient.post('/api/robot/control', { command, cmd: shortCmd });
  
  // Also trigger direct ESP32 or localhost:8088
  try {
    fetch(`http://localhost:8088/api/control?cmd=${shortCmd}`, { mode: 'no-cors' }).catch(() => {});
    fetch(`http://localhost:8088/?cmd=${shortCmd}`, { mode: 'no-cors' }).catch(() => {});
    fetch(`http://192.168.4.1/api/control?cmd=${shortCmd}`, { mode: 'no-cors' }).catch(() => {});
  } catch (e) {}

  return response.data;
};

export const sendRoverControl = async (command, speedMode = 'STANDARD') => {
  const shortCmd = CMD_SHORT_MAP[command] || command.toLowerCase();
  const response = await apiClient.post('/api/rover/control', { command, cmd: shortCmd, speed_mode: speedMode });

  // Also trigger direct ESP32 or localhost:8088
  try {
    fetch(`http://localhost:8088/api/control?cmd=${shortCmd}&speed=${speedMode}`, { mode: 'no-cors' }).catch(() => {});
    fetch(`http://localhost:8088/?cmd=${shortCmd}&speed=${speedMode}`, { mode: 'no-cors' }).catch(() => {});
    fetch(`http://192.168.4.1/api/control?cmd=${shortCmd}`, { mode: 'no-cors' }).catch(() => {});
  } catch (e) {}

  return response.data;
};

export const getRoverAlerts = async () => {
  const response = await apiClient.get('/api/rover/alerts');
  return response.data;
};

export const captureRoverSnapshot = async () => {
  const response = await apiClient.post('/api/rover/snapshot');
  return response.data;
};

export const getAnalytics = async () => {
  const response = await apiClient.get('/api/analytics');
  return response.data;
};

export default apiClient;
