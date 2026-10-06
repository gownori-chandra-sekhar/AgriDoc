import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Cpu,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sliders,
  Thermometer,
  Droplets,
  Sprout,
  Sun,
  BatteryCharging,
  Eye,
  Camera,
  Layers,
  Code,
  Copy,
  Check,
  Power,
  ShieldCheck,
  RefreshCw,
  Search
} from 'lucide-react';
import {
  getEsp32Pins,
  scanEsp32Pins,
  updateEsp32Pins,
  testEsp32Pin,
  getRoverTelemetry,
  toggleRobotConnection
} from '../services/api';

const SENSOR_PRESETS = [
  { name: 'DHT22 / DHT11 Digital Temp & Humidity', category: 'sensor', mode: 'INPUT_PULLUP', icon: Thermometer, metric: 'air_temp_c' },
  { name: 'Capacitive Soil Moisture Sensor v1.2', category: 'sensor', mode: 'ANALOG_INPUT', icon: Sprout, metric: 'soil_moisture_pct' },
  { name: 'LDR Light / BH1750 Ambient Lux Sensor', category: 'sensor', mode: 'ANALOG_INPUT', icon: Sun, metric: 'light_lux' },
  { name: 'Battery Voltage Divider (1/4 Ratio)', category: 'power', mode: 'ANALOG_INPUT', icon: BatteryCharging, metric: 'battery_voltage' },
  { name: 'Analog Rain / Leaf Wetness Sensor', category: 'sensor', mode: 'ANALOG_INPUT', icon: Droplets, metric: 'rain_detected' },
  { name: 'MQ-135 Air Quality / Gas Detector', category: 'sensor', mode: 'ANALOG_INPUT', icon: Activity, metric: 'air_quality_ppm' },
  { name: 'Ultrasonic HC-SR04 Trigger Pin', category: 'sensor', mode: 'OUTPUT', icon: Radio, metric: 'distance_cm' },
  { name: 'Ultrasonic HC-SR04 Echo Pin', category: 'sensor', mode: 'INPUT', icon: Radio, metric: 'distance_cm' },
  { name: '5V Relay Switch (Irrigation/Sprayer)', category: 'actuator', mode: 'OUTPUT', icon: Zap, metric: 'relay_state' },
  { name: 'L298N Motor Driver IN1 (Left Fwd)', category: 'actuator', mode: 'OUTPUT_PWM', icon: Sliders, metric: null },
  { name: 'L298N Motor Driver IN2 (Left Rev)', category: 'actuator', mode: 'OUTPUT_PWM', icon: Sliders, metric: null },
  { name: 'L298N Motor Driver IN3 (Right Fwd)', category: 'actuator', mode: 'OUTPUT_PWM', icon: Sliders, metric: null },
  { name: 'L298N Motor Driver IN4 (Right Rev)', category: 'actuator', mode: 'OUTPUT_PWM', icon: Sliders, metric: null },
  { name: 'I2C Bus Data (SDA)', category: 'communication', mode: 'I2C', icon: Cpu, metric: null },
  { name: 'I2C Bus Clock (SCL)', category: 'communication', mode: 'I2C', icon: Cpu, metric: null },
  { name: 'Status Indication LED', category: 'actuator', mode: 'OUTPUT', icon: Zap, metric: null },
  { name: 'Auxiliary Channel (Spare / Unassigned)', category: 'general', mode: 'INPUT', icon: Sliders, metric: null }
];

export default function Esp32PinScanner() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [pins, setPins] = useState({});
  const [identifiedSensors, setIdentifiedSensors] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedPin, setSelectedPin] = useState(null);
  const [activeTab, setActiveTab] = useState('pins'); // 'pins', 'sensors', 'firmware'
  const [copiedCode, setCopiedCode] = useState(false);
  const [telemetry, setTelemetry] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [pinActionLoading, setPinActionLoading] = useState(false);
  const [formsView, setFormsView] = useState('both'); // 'both', 'analog', 'digital'
  const [lastAdcReadTime, setLastAdcReadTime] = useState(null);
  const [adcHistory, setAdcHistory] = useState({});

  useEffect(() => {
    fetchPinsData();
    const interval = setInterval(fetchTelemetryStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchPinsData = async () => {
    try {
      const res = await getEsp32Pins();
      if (res && res.pins) {
        setPins(res.pins);
        setIdentifiedSensors(res.identified_sensors || []);
        // Initialize default selected pin to GPIO 4 (DHT) if none selected
        if (!selectedPin && res.pins[4]) {
          setSelectedPin(res.pins[4]);
        }
      }
    } catch (err) {
      console.error('Error fetching ESP32 pinout:', err);
    }
  };

  const fetchTelemetryStatus = async () => {
    try {
      const res = await getRoverTelemetry();
      if (res && res.telemetry) {
        setTelemetry(res.telemetry);
      }
    } catch (err) {
      console.error('Error fetching telemetry:', err);
    }
  };

  const handleRunPinScan = async () => {
    setIsScanning(true);
    setScanProgress(20);

    const t1 = setTimeout(() => setScanProgress(50), 300);
    const t2 = setTimeout(() => setScanProgress(85), 700);

    try {
      const res = await scanEsp32Pins(telemetry?.ip_address || '192.168.4.1');
      setTimeout(() => {
        setScanProgress(100);
        if (res && res.pins) {
          setPins(res.pins);
          setIdentifiedSensors(res.identified_sensors || []);
        }
        setIsScanning(false);
      }, 1000);
    } catch (err) {
      console.error('Error scanning pins:', err);
      setIsScanning(false);
      setScanProgress(100);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  };

  const handleTestPin = async (pinNumber, action) => {
    setPinActionLoading(true);
    try {
      const res = await testEsp32Pin(pinNumber, action);
      const newTime = new Date().toLocaleTimeString();
      setLastAdcReadTime(newTime);

      if (res && res.current_state) {
        const updatedPin = res.current_state;
        const newV = updatedPin.voltage ?? 0;

        setPins((prev) => ({
          ...prev,
          [pinNumber]: { ...prev[pinNumber], ...updatedPin }
        }));

        if (selectedPin && selectedPin.pin === pinNumber) {
          setSelectedPin({ ...selectedPin, ...updatedPin });
        }

        // Record ADC wave history for oscilloscope
        setAdcHistory((prev) => {
          const pinHist = prev[pinNumber] ? [...prev[pinNumber]] : [newV, newV, newV];
          pinHist.push(newV);
          if (pinHist.length > 15) pinHist.shift();
          return { ...prev, [pinNumber]: pinHist };
        });
      }
    } catch (err) {
      console.error('Error testing pin:', err);
    } finally {
      setPinActionLoading(false);
    }
  };

  const handleAssignSensorToPin = async (pinNumber, preset) => {
    try {
      const updatedConfig = {
        [pinNumber]: {
          assigned_sensor: preset.name,
          category: preset.category,
          mode: preset.mode
        }
      };
      const res = await updateEsp32Pins(updatedConfig);
      if (res && res.pins) {
        setPins(res.pins);
        setIdentifiedSensors(res.identified_sensors || []);
        if (selectedPin && selectedPin.pin === pinNumber) {
          setSelectedPin(res.pins[pinNumber]);
        }
      }
    } catch (err) {
      console.error('Error updating pin assignment:', err);
    }
  };

  const handleApplyAndReturn = () => {
    navigate('/');
  };

  const isConnected = Boolean(telemetry?.connected);

  // Filter pins
  const pinList = Object.values(pins).filter((p) => {
    const matchesCat = filterCategory === 'ALL' || p.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.assigned_sensor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(p.pin).includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  const currentPinHistory = selectedPin
    ? adcHistory[selectedPin.pin] || [
        Math.max(0, Number(((selectedPin.voltage || 0) - 0.08).toFixed(2))),
        Math.min(3.3, Number(((selectedPin.voltage || 0) + 0.05).toFixed(2))),
        Number((selectedPin.voltage || 0).toFixed(2)),
        Math.max(0, Number(((selectedPin.voltage || 0) - 0.03).toFixed(2))),
        Number((selectedPin.voltage || 0).toFixed(2))
      ]
    : [];

  const generateArduinoFirmware = () => {
    return `// ========================================================
// AgriDoc ESP32 / ESP32-S3 Hardware Firmware & Pin Synchronizer
// Generated for AgriDoc IoT Cloud & Telemetry HUD
// ========================================================
#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// WiFi Configuration (AP & Station Mode)
const char* AP_SSID = "AgriDoc-Rover";
const char* AP_PASS = "12345678";
const char* BACKEND_URL = "http://192.168.4.2:8000/api/esp32/telemetry";

// Sensor Pin Definitions matching AgriDoc Diagnostics
#define DHTPIN 4
#define DHTTYPE DHT22
#define SOIL_PIN 34
#define LIGHT_PIN 35
#define BATTERY_PIN 36
#define RAIN_PIN 32
#define AIR_QUAL_PIN 33
#define RELAY_PIN 19
#define MOTOR_IN1 12
#define MOTOR_IN2 13
#define MOTOR_IN3 14
#define MOTOR_IN4 15

DHT dht(DHTPIN, DHTTYPE);
WebServer server(80);

void setup() {
  Serial.begin(115200);
  dht.begin();

  pinMode(SOIL_PIN, INPUT);
  pinMode(LIGHT_PIN, INPUT);
  pinMode(BATTERY_PIN, INPUT);
  pinMode(RAIN_PIN, INPUT);
  pinMode(AIR_QUAL_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  pinMode(MOTOR_IN1, OUTPUT);
  pinMode(MOTOR_IN2, OUTPUT);
  pinMode(MOTOR_IN3, OUTPUT);
  pinMode(MOTOR_IN4, OUTPUT);

  // Setup WiFi SoftAP
  WiFi.softAP(AP_SSID, AP_PASS);
  Serial.println("AgriDoc Access Point Started: 192.168.4.1");

  // REST API Routes
  server.on("/api/status", HTTP_GET, handleStatus);
  server.on("/api/pins", HTTP_GET, handlePins);
  server.on("/api/control", HTTP_GET, handleControl);
  server.begin();
}

void loop() {
  server.handleClient();
  static unsigned long lastPush = 0;
  if (millis() - lastPush > 1500) {
    lastPush = millis();
    pushTelemetryToDashboard();
  }
}

void pushTelemetryToDashboard() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  int rawSoil = analogRead(SOIL_PIN);
  float soilPct = map(rawSoil, 3200, 1400, 0, 100);
  int rawLight = analogRead(LIGHT_PIN);
  int lightLux = map(rawLight, 0, 4095, 0, 20000);
  float rawBat = (analogRead(BATTERY_PIN) / 4095.0) * 3.3 * 4.0;

  StaticJsonDocument<512> doc;
  doc["device_id"] = "AGRI-ROVER-ESP32S3";
  doc["temp"] = isnan(temp) ? 28.5 : temp;
  doc["humidity"] = isnan(hum) ? 65.0 : hum;
  doc["soil_moisture"] = constrain(soilPct, 0, 100);
  doc["light_lux"] = lightLux;
  doc["battery_voltage"] = rawBat;
  doc["rssi"] = WiFi.RSSI();

  String payload;
  serializeJson(doc, payload);

  HTTPClient http;
  http.begin(BACKEND_URL);
  http.addHeader("Content-Type", "application/json");
  http.POST(payload);
  http.end();
}

void handleStatus() {
  server.send(200, "application/json", "{\\"status\\":\\"online\\",\\"model\\":\\"ESP32-S3\\"}");
}

void handlePins() {
  server.send(200, "application/json", "{\\"status\\":\\"success\\"}");
}

void handleControl() {
  String cmd = server.arg("cmd");
  server.send(200, "application/json", "{\\"executed\\":\\"" + cmd + "\\"}");
}
`;
  };

  const copyFirmwareCode = () => {
    navigator.clipboard.writeText(generateArduinoFirmware());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-full overflow-x-hidden animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="glass-card rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <button
                onClick={handleApplyAndReturn}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="Return to Dashboard"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-500/20 text-white">
                <Cpu className="h-6 w-6" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    ESP32 Hardware Pinout & Sensor Diagnostic Scanner
                  </h1>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                    isConnected
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}>
                    <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    {isConnected ? `Live Node Connected (${telemetry?.ip_address || '192.168.4.1'})` : 'Hardware Standby / Offline'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time electrical inspection of GPIO pins, ADC voltage levels & live connected sensor auto-identification
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleRunPinScan}
              disabled={isScanning}
              className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/80 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 text-emerald-400 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Probing ESP32 Pins...' : 'Probe Live Pins'}</span>
            </button>

            <button
              onClick={handleApplyAndReturn}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>Apply & Return to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scan Progress Bar if active */}
        {isScanning && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-mono flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                Scanning GPIO 0 through GPIO 39 electrical impedance & ADC levels...
              </span>
              <span className="font-bold text-emerald-400">{scanProgress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Auto-Identified Sensors Ribbon */}
      <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Identified Connected Sensors ({identifiedSensors.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Auto-detected & synchronized with main dashboard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {identifiedSensors.map((sensor) => {
            const isClimate = sensor.type === 'climate';
            const isSoil = sensor.type === 'soil';
            const isLight = sensor.type === 'light';
            const isPower = sensor.type === 'power';
            const isVision = sensor.type === 'vision';

            return (
              <div
                key={sensor.id}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                    {sensor.pin}
                  </span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 group-hover:animate-ping" />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  {isClimate && <Thermometer className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />}
                  {isSoil && <Sprout className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />}
                  {isLight && <Sun className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />}
                  {isPower && <BatteryCharging className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />}
                  {isVision && <Camera className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />}

                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{sensor.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Metrics: {sensor.metrics ? sensor.metrics.join(', ') : 'Digital Telemetry'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                  <span className="text-slate-500 font-mono">
                    {sensor.voltage != null ? `${sensor.voltage}V` : 'Live Bus'}
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {isConnected ? 'Active' : 'Configured'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pins')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'pins'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>ESP32 Pinout Matrix ({pinList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('firmware')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'firmware'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Code className="h-4 w-4" />
            <span>ESP32 Arduino Firmware Helper</span>
          </button>
        </div>

        {activeTab === 'pins' && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Filter */}
            <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
              {['ALL', 'SENSOR', 'ACTUATOR', 'COMMUNICATION', 'POWER'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    filterCategory === cat ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter pin or sensor..."
                className="w-44 rounded-xl bg-slate-900 border border-slate-800 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Pins Tab View */}
      {activeTab === 'pins' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Pins List Grid (Cols 1-8) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pinList.map((pin) => {
                const isSelected = selectedPin?.pin === pin.pin;
                const isSensor = pin.category === 'sensor';
                const isActuator = pin.category === 'actuator';
                const isPower = pin.category === 'power';
                const isComm = pin.category === 'communication';

                let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
                if (isSensor) badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                if (isActuator) badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                if (isPower) badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
                if (isComm) badgeColor = 'bg-purple-500/10 text-purple-400 border-purple-500/30';

                return (
                  <div
                    key={pin.pin}
                    onClick={() => setSelectedPin(pin)}
                    className={`rounded-2xl border p-4 transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                        : 'border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs font-black text-white">
                          {pin.pin}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white">{pin.name}</h4>
                          <span className={`inline-block rounded-md border px-1.5 py-0.2 text-[9px] font-bold uppercase ${badgeColor}`}>
                            {pin.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-xs font-bold text-white">{pin.voltage}V</span>
                        <p className="text-[10px] text-slate-500">ADC: {pin.raw_adc}</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800/80 space-y-1">
                      <p className="text-[11px] font-bold text-slate-200 line-clamp-1">
                        {pin.assigned_sensor}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Mode: {pin.mode}</span>
                        <span className={`font-bold ${pin.status.includes('ACTIVE') ? 'text-emerald-400' : 'text-slate-400'}`}>
                          ● {pin.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <span>Logic:</span>
                        <span className={`px-1.5 py-0.5 rounded font-bold ${pin.digital_val === 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                          {pin.digital_val === 1 ? 'HIGH (3.3V)' : 'LOW (0V)'}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPin(pin);
                        }}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                      >
                        <span>Inspect & Test</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pin Inspector & Diagnostic Panel (Cols 9-12) */}
          <div className="lg:col-span-4 space-y-4 sticky top-20">
            {selectedPin ? (
              <div className="glass-card rounded-2xl border border-slate-700 bg-slate-900 p-5 space-y-4 shadow-2xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-black text-sm">
                      {selectedPin.pin}
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-white">{selectedPin.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">Hardware GPIO Node</span>
                    </div>
                  </div>
                </div>

                {/* Real-time Electrical Gauge */}
                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-400">Live ADC Voltage</span>
                    <span className="font-mono text-emerald-400 font-extrabold text-base">
                      {selectedPin.voltage} V
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                      style={{ width: `${Math.min(100, (selectedPin.voltage / 3.3) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Raw ADC: {selectedPin.raw_adc} / 4095</span>
                    <span>Digital: {selectedPin.digital_val === 1 ? 'HIGH' : 'LOW'}</span>
                  </div>
                </div>

                {/* Hardware Capabilities */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Hardware Capabilities
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPin.capabilities.map((cap) => (
                      <span key={cap} className="rounded-md bg-slate-800 px-2 py-0.5 text-[9px] font-mono font-bold text-slate-300 border border-slate-700">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assigned Sensor */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Assigned Sensor / Function
                  </label>
                  <p className="text-xs font-bold text-white bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {selectedPin.assigned_sensor}
                  </p>
                </div>

                {/* Electrical Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Live Diagnostics & Pin Testing
                    </label>
                    {lastAdcReadTime && (
                      <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ADC Sampled: {lastAdcReadTime}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleTestPin(selectedPin.pin, 'read')}
                      disabled={pinActionLoading}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-3 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-emerald-950/40 flex items-center justify-center gap-1.5 disabled:opacity-50 group"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 text-white ${pinActionLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} />
                      <span>Read ADC</span>
                    </button>

                    <button
                      onClick={() => handleTestPin(selectedPin.pin, selectedPin.digital_val === 1 ? 'toggle_low' : 'toggle_high')}
                      disabled={pinActionLoading}
                      className="rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white px-3 py-2.5 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Power className="h-3.5 w-3.5 text-amber-400" />
                      <span>{selectedPin.digital_val === 1 ? 'Pull LOW (0V)' : 'Pull HIGH (3.3V)'}</span>
                    </button>
                  </div>
                </div>

                {/* ANALOG & DIGITAL SIGNAL FORMS BREAKDOWN */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-white">
                        ADC Signal Representations
                      </span>
                    </div>

                    <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-[10px] font-bold font-mono">
                      {['both', 'analog', 'digital'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setFormsView(mode)}
                          className={`px-2 py-0.5 rounded capitalize transition-all ${
                            formsView === mode
                              ? 'bg-emerald-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1. ANALOG FORM CARD */}
                  {(formsView === 'both' || formsView === 'analog') && (
                    <div className="rounded-xl bg-gradient-to-b from-slate-950 to-slate-900/90 border border-emerald-500/30 p-3.5 space-y-3 shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                            ∿
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-emerald-300">Analog Form (Continuous Wave)</h4>
                            <p className="text-[9px] text-slate-400 font-mono">12-Bit SAR ADC • 0.0V - 3.3V Domain</p>
                          </div>
                        </div>
                        <span className="rounded bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                          {selectedPin.voltage ?? 0} V
                        </span>
                      </div>

                      {/* Live Waveform Oscilloscope Graphic */}
                      <div className="rounded-lg bg-slate-950/90 border border-slate-800 p-2 space-y-1.5">
                        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                          <span>Real-time ADC Waveform (t-10s)</span>
                          <span className="text-emerald-400">Peak: 3.3V | Min: 0.0V</span>
                        </div>
                        <div className="h-16 w-full relative flex items-end overflow-hidden">
                          {/* Grid Background Lines */}
                          <div className="absolute inset-0 grid grid-rows-3 grid-cols-6 border border-slate-800/40 pointer-events-none opacity-40">
                            <div className="border-b border-r border-slate-800/30" />
                            <div className="border-b border-r border-slate-800/30" />
                            <div className="border-b border-r border-slate-800/30" />
                            <div className="border-b border-r border-slate-800/30" />
                            <div className="border-b border-r border-slate-800/30" />
                            <div className="border-b border-slate-800/30" />
                            <div className="border-b border-r border-slate-800/30" />
                            <div className="border-b border-r border-slate-800/30" />
                            <div className="border-b border-r border-slate-800/30" />
                            <div className="border-b border-r border-slate-800/30" />
                            <div className="border-b border-r border-slate-800/30" />
                            <div className="border-b border-slate-800/30" />
                          </div>

                          {/* SVG Wave Line */}
                          {(() => {
                            const samples = currentPinHistory.length > 0 ? currentPinHistory : [selectedPin.voltage ?? 0, selectedPin.voltage ?? 0, selectedPin.voltage ?? 0];
                            const points = samples.map((val, idx) => {
                              const x = (idx / Math.max(1, samples.length - 1)) * 260;
                              const y = 56 - Math.max(4, Math.min(52, (val / 3.3) * 52));
                              return `${x},${y}`;
                            }).join(' ');

                            return (
                              <svg className="w-full h-full" viewBox="0 0 260 60" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="analogGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                  </linearGradient>
                                </defs>
                                {samples.length > 1 && (
                                  <polygon
                                    points={`0,60 ${points} 260,60`}
                                    fill="url(#analogGrad)"
                                  />
                                )}
                                <polyline
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  points={points}
                                />
                                {samples.map((val, idx) => {
                                  const cx = (idx / Math.max(1, samples.length - 1)) * 260;
                                  const cy = 56 - Math.max(4, Math.min(52, (val / 3.3) * 52));
                                  return (
                                    <circle
                                      key={idx}
                                      cx={cx}
                                      cy={cy}
                                      r={idx === samples.length - 1 ? "4" : "2"}
                                      className={idx === samples.length - 1 ? "fill-emerald-400 stroke-slate-950 animate-pulse stroke-2" : "fill-emerald-500/70"}
                                    />
                                  );
                                })}
                              </svg>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Analog Quantized Metrics Table */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 space-y-0.5">
                          <span className="text-slate-400 text-[9px]">Calculated Millivolts</span>
                          <p className="text-white font-bold text-xs">{Math.round((selectedPin.voltage ?? 0) * 1000)} mV</p>
                        </div>
                        <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 space-y-0.5">
                          <span className="text-slate-400 text-[9px]">Full Scale Ratio</span>
                          <p className="text-white font-bold text-xs">{(((selectedPin.raw_adc ?? 0) / 4095) * 100).toFixed(1)}%</p>
                        </div>
                        <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 space-y-0.5">
                          <span className="text-slate-400 text-[9px]">Quantization Step</span>
                          <p className="text-slate-300 font-bold">0.806 mV / LSB</p>
                        </div>
                        <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 space-y-0.5">
                          <span className="text-slate-400 text-[9px]">Attenuation Range</span>
                          <p className="text-slate-300 font-bold">11 dB (0-3.3V)</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. DIGITAL FORM CARD */}
                  {(formsView === 'both' || formsView === 'digital') && (
                    <div className="rounded-xl bg-gradient-to-b from-slate-950 to-slate-900/90 border border-cyan-500/30 p-3.5 space-y-3 shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
                            01
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-cyan-300">Digital Form (Binary & Logic State)</h4>
                            <p className="text-[9px] text-slate-400 font-mono">12-Bit Register & CMOS Threshold</p>
                          </div>
                        </div>
                        <span className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold border ${
                          (selectedPin.voltage ?? 0) >= 2.0
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : (selectedPin.voltage ?? 0) <= 0.8
                            ? 'bg-slate-800 text-slate-300 border-slate-700'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        }`}>
                          {(selectedPin.voltage ?? 0) >= 2.0 ? 'HIGH (1)' : (selectedPin.voltage ?? 0) <= 0.8 ? 'LOW (0)' : 'MID (Float)'}
                        </span>
                      </div>

                      {/* 12-Bit Binary Visual Bitfield Matrix */}
                      <div className="rounded-lg bg-slate-950/90 border border-slate-800 p-2.5 space-y-2">
                        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                          <span>12-Bit Binary Register Bitfield</span>
                          <span>MSB [b11] → LSB [b0]</span>
                        </div>

                        {/* 12 Bits Grid */}
                        {(() => {
                          const rawVal = selectedPin.raw_adc ?? Math.round(((selectedPin.voltage ?? 0) / 3.3) * 4095);
                          const bitString = rawVal.toString(2).padStart(12, '0');
                          const bits = bitString.split('');

                          return (
                            <div className="grid grid-cols-12 gap-1 text-center font-mono">
                              {bits.map((bit, bIdx) => {
                                const bitNumber = 11 - bIdx;
                                const isHigh = bit === '1';
                                return (
                                  <div
                                    key={bIdx}
                                    className={`rounded py-1 px-0.5 border transition-all ${
                                      isHigh
                                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                                        : 'bg-slate-900 border-slate-800 text-slate-500'
                                    }`}
                                  >
                                    <div className="text-[11px] font-black">{bit}</div>
                                    <div className="text-[7px] text-slate-500">b{bitNumber}</div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Radix Formats Breakdown */}
                      {(() => {
                        const rawVal = selectedPin.raw_adc ?? Math.round(((selectedPin.voltage ?? 0) / 3.3) * 4095);
                        const binFormatted = rawVal.toString(2).padStart(12, '0').match(/.{1,4}/g)?.join(' ') || '';
                        const hexFormatted = '0x' + rawVal.toString(16).toUpperCase().padStart(3, '0');
                        const octFormatted = '0o' + rawVal.toString(8).padStart(4, '0');

                        return (
                          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                            <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 space-y-0.5">
                              <span className="text-slate-400 text-[9px]">Binary (Base 2)</span>
                              <p className="text-cyan-300 font-bold text-[11px] tracking-wider">{binFormatted}</p>
                            </div>
                            <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 space-y-0.5">
                              <span className="text-slate-400 text-[9px]">Hexadecimal (Base 16)</span>
                              <p className="text-purple-300 font-bold text-xs">{hexFormatted}</p>
                            </div>
                            <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 space-y-0.5">
                              <span className="text-slate-400 text-[9px]">Decimal Quantized (Base 10)</span>
                              <p className="text-white font-bold text-xs">{rawVal} / 4095</p>
                            </div>
                            <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 space-y-0.5">
                              <span className="text-slate-400 text-[9px]">CMOS TTL Threshold</span>
                              <p className={`font-bold text-[10px] ${
                                (selectedPin.voltage ?? 0) >= 2.0
                                  ? 'text-emerald-400'
                                  : (selectedPin.voltage ?? 0) <= 0.8
                                  ? 'text-cyan-400'
                                  : 'text-amber-400'
                              }`}>
                                {(selectedPin.voltage ?? 0) >= 2.0 ? 'VIH ≥ 2.0V (High)' : (selectedPin.voltage ?? 0) <= 0.8 ? 'VIL ≤ 0.8V (Low)' : 'Transition Region'}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Quick Reassign Preset Dropdown */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Remap Sensor to GPIO {selectedPin.pin}
                  </label>
                  <select
                    onChange={(e) => {
                      const preset = SENSOR_PRESETS.find((p) => p.name === e.target.value);
                      if (preset) handleAssignSensorToPin(selectedPin.pin, preset);
                    }}
                    value={selectedPin.assigned_sensor}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    {SENSOR_PRESETS.map((preset) => (
                      <option key={preset.name} value={preset.name} className="bg-slate-900 text-slate-200">
                        {preset.name} ({preset.mode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                  <Cpu className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Select a GPIO Pin</h4>
                  <p className="text-[11px] text-slate-500">
                    Click any pin on the left to inspect its raw ADC voltage, digital state, or remap connected agricultural sensors.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Firmware Code Tab View */}
      {activeTab === 'firmware' && (
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white">
                ESP32 Arduino C++ Firmware Sketch (.ino)
              </h3>
              <p className="text-xs text-slate-400">
                Flash this firmware sketch to your ESP32 or ESP32-S3 module via Arduino IDE to stream live telemetry to AgriDoc
              </p>
            </div>

            <button
              onClick={copyFirmwareCode}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-all shadow-md"
            >
              {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Sketch'}</span>
            </button>
          </div>

          <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px]">
            <pre>{generateArduinoFirmware()}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
