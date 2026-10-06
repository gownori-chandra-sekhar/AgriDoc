import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getRoverTelemetry,
  sendRoverControl,
  toggleRobotConnection,
  getRoverAlerts,
  captureRoverSnapshot,
} from '../services/api';
import { useToast } from '../context/ToastContext';

export function useTelemetry(autoPoll = true, pollInterval = 1500) {
  const toast = useToast();
  const [telemetry, setTelemetry] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [identifiedSensors, setIdentifiedSensors] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const isPollingRef = useRef(false);

  const fetchTelemetry = useCallback(async () => {
    if (isPollingRef.current) return;
    isPollingRef.current = true;
    try {
      const data = await getRoverTelemetry();
      if (data && data.telemetry) {
        setTelemetry(data.telemetry);
        setHistory(data.history || []);
        if (data.identified_sensors) {
          setIdentifiedSensors(data.identified_sensors);
        }
        setLastUpdated(new Date());
      }

      const alertRes = await getRoverAlerts();
      if (alertRes && alertRes.alerts) {
        setAlerts(alertRes.alerts);
      }
    } catch (err) {
      console.warn('Telemetry polling error (Hardware or backend offline):', err.message);
    } finally {
      isPollingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchTelemetry();
    if (!autoPoll) return;

    const intervalId = setInterval(fetchTelemetry, pollInterval);
    return () => clearInterval(intervalId);
  }, [autoPoll, pollInterval, fetchTelemetry]);

  // Connect or disconnect robot hardware
  const toggleConnection = useCallback(
    async (connectState = true, deviceId = null, ipAddress = null) => {
      setIsLoading(true);
      try {
        const res = await toggleRobotConnection(connectState, deviceId, ipAddress);
        if (res && res.current_state) {
          setTelemetry(res.current_state);
          if (res.identified_sensors) {
            setIdentifiedSensors(res.identified_sensors);
          }
        }
        setLastUpdated(new Date());
        toast.success(
          connectState ? 'Connected to ESP32 Telemetry Node' : 'Robot Hardware Disconnected',
          'Hardware Status'
        );
        return res;
      } catch (err) {
        console.error('Toggle connection error:', err);
        toast.error('Failed to change hardware connection status', 'Connection Error');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Send movement or operational mode command
  const sendCommand = useCallback(
    async (command, speedMode = 'STANDARD') => {
      try {
        const res = await sendRoverControl(command, speedMode);
        if (res && res.current_state) {
          setTelemetry(res.current_state);
          setLastUpdated(new Date());
        }
        toast.info(`Command Sent: ${command} (${speedMode})`, 'Robot Teleoperation');
        return res;
      } catch (err) {
        console.error('Send command error:', err);
        toast.error(`Failed to send command ${command}`, 'Command Error');
        throw err;
      }
    },
    [toast]
  );

  // Take snapshot
  const triggerSnapshot = useCallback(async () => {
    try {
      const res = await captureRoverSnapshot();
      if (res && res.new_alert) {
        setAlerts((prev) => [res.new_alert, ...prev]);
        toast.warning(
          `AI Alert: ${res.new_alert.disease} detected at (${res.new_alert.lat.toFixed(4)}, ${res.new_alert.lng.toFixed(4)})`,
          'Field Outbreak'
        );
      }
      return res;
    } catch (err) {
      console.error('Snapshot error:', err);
      toast.error('Could not capture frame from ESP32 camera', 'Snapshot Error');
      throw err;
    }
  }, [toast]);

  const isConnected = Boolean(telemetry?.connected);

  return {
    telemetry,
    history,
    alerts,
    identifiedSensors,
    isConnected,
    lastUpdated,
    isLoading,
    isSimulated,
    setIsSimulated,
    fetchTelemetry,
    toggleConnection,
    sendCommand,
    triggerSnapshot,
  };
}

export default useTelemetry;
