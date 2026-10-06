import React from 'react';
import {
  Thermometer,
  Droplets,
  Sprout,
  Sun,
  BatteryCharging,
  Wifi,
  Activity,
  Gauge,
  CloudRain,
  Wind,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function RoverSensorMetrics({ telemetry, history = [], isConnected, identifiedSensors = [] }) {
  const airTemp = isConnected ? telemetry?.air_temp_c : null;
  const humidity = isConnected ? telemetry?.humidity_pct : null;
  const soilMoisture = isConnected ? telemetry?.soil_moisture_pct : null;
  const lightLux = isConnected ? telemetry?.light_lux : null;
  const batteryPct = isConnected ? telemetry?.battery_pct : null;
  const batteryVoltage = isConnected ? telemetry?.battery_voltage : null;
  const rssiDbm = isConnected ? telemetry?.rssi_dbm : null;
  const isLive = Boolean(telemetry?.is_live_stream);

  // Helper to find pin assignment for a sensor
  const getPinLabel = (metricName, defaultPin) => {
    if (identifiedSensors && identifiedSensors.length > 0) {
      const match = identifiedSensors.find(
        (s) => s.metrics && s.metrics.includes(metricName)
      );
      if (match) return match.pin;
    }
    return defaultPin;
  };

  // Custom Canva Light Mode Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white/95 p-3 text-xs shadow-xl backdrop-blur-md">
          <p className="font-mono text-slate-600 font-bold mb-1">{label}</p>
          <div className="space-y-1 font-semibold">
            <p className="text-amber-700 flex items-center justify-between gap-3">
              <span>Air Temp:</span> <span>{payload[0]?.value}°C</span>
            </p>
            <p className="text-cyan-700 flex items-center justify-between gap-3">
              <span>Humidity:</span> <span>{payload[1]?.value}%</span>
            </p>
            <p className="text-emerald-700 flex items-center justify-between gap-3">
              <span>Soil Moisture:</span> <span>{payload[2]?.value}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Live Sync Status Banner */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-emerald-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Live Synchronized ESP32 Sensor Grid
          </h3>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
          isConnected
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-slate-100 text-slate-600 border-slate-200'
        }`}>
          {isConnected ? (isLive ? '● Live Hardware Stream' : '● Node Synced') : '● Sensors Offline'}
        </span>
      </div>

      {/* Real-time Sensor Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Air Temperature Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-amber-400/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold">Air Temp</span>
            <Thermometer className="h-4 w-4 text-amber-600" />
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{isConnected && airTemp != null ? airTemp : '--'}</span>
            <span className="text-xs text-amber-600 font-bold">°C</span>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-medium">
              {isConnected && airTemp != null ? (airTemp > 35 ? 'High Temp' : 'Optimal Field') : 'Offline'}
            </span>
            <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.2 font-mono text-[9px] font-bold text-amber-800">
              {getPinLabel('air_temp_c', 'GPIO 4')}
            </span>
          </div>
        </div>

        {/* Air Humidity Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-cyan-400/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold">Air Humidity</span>
            <Droplets className="h-4 w-4 text-cyan-600" />
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{isConnected && humidity != null ? humidity : '--'}</span>
            <span className="text-xs text-cyan-600 font-bold">%</span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-500"
              style={{ width: `${isConnected && humidity != null ? humidity : 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-medium">
              {isConnected && humidity != null ? `${humidity}% RH` : 'Offline'}
            </span>
            <span className="rounded bg-cyan-50 border border-cyan-200 px-1.5 py-0.2 font-mono text-[9px] font-bold text-cyan-800">
              {getPinLabel('humidity_pct', 'GPIO 4')}
            </span>
          </div>
        </div>

        {/* Soil Moisture Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-emerald-400/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold">Soil Moisture</span>
            <Sprout className="h-4 w-4 text-emerald-600" />
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{isConnected && soilMoisture != null ? soilMoisture : '--'}</span>
            <span className="text-xs text-emerald-600 font-bold">%</span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${isConnected && soilMoisture != null ? soilMoisture : 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-emerald-700 font-semibold">
              {isConnected && soilMoisture != null ? (soilMoisture < 30 ? 'Dry - Water' : 'Optimal') : 'Offline'}
            </span>
            <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-800">
              {getPinLabel('soil_moisture_pct', 'GPIO 34')}
            </span>
          </div>
        </div>

        {/* Ambient Light Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-amber-400/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold">Ambient Light</span>
            <Sun className="h-4 w-4 text-amber-500" />
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900">{isConnected && lightLux != null ? lightLux.toLocaleString() : '--'}</span>
            <span className="text-[10px] text-amber-600 font-bold">Lux</span>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-medium">
              {isConnected && lightLux != null ? (lightLux > 10000 ? 'Full Daylight' : 'Low Light') : 'Offline'}
            </span>
            <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.2 font-mono text-[9px] font-bold text-amber-800">
              {getPinLabel('light_lux', 'GPIO 35')}
            </span>
          </div>
        </div>

        {/* Battery Power & Voltage */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-emerald-400/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold">ESP32 Power</span>
            <BatteryCharging className="h-4 w-4 text-emerald-600" />
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{isConnected && batteryPct != null ? `${batteryPct}%` : '--'}</span>
            <span className="text-[11px] font-mono text-emerald-700 font-bold">{isConnected && batteryVoltage != null ? `${batteryVoltage}V` : '--'}</span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                (batteryPct || 0) > 50 ? 'bg-emerald-500' : (batteryPct || 0) > 20 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${isConnected && batteryPct != null ? batteryPct : 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-medium">
              {isConnected && batteryVoltage != null ? 'Divider 1/4' : 'Offline'}
            </span>
            <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-800">
              {getPinLabel('battery_voltage', 'GPIO 36')}
            </span>
          </div>
        </div>

        {/* WiFi Signal RSSI Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-400/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold">WiFi Link</span>
            <Wifi className="h-4 w-4 text-indigo-600" />
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900">{isConnected && rssiDbm != null ? `${rssiDbm}` : '--'}</span>
            <span className="text-[10px] font-bold text-indigo-600">dBm</span>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-medium">
              {isConnected && rssiDbm != null ? (rssiDbm > -65 ? 'Strong Link' : 'Moderate') : 'Disconnected'}
            </span>
            <span className="rounded bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 font-mono text-[9px] font-bold text-indigo-800">
              2.4 GHz AP
            </span>
          </div>
        </div>
      </div>

      {/* Live Telemetry Trend Sparkline Graph */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600" />
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Real-Time Sensor Telemetry Trend
            </h4>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-bold">
            <span className="flex items-center gap-1 text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Temp (°C)
            </span>
            <span className="flex items-center gap-1 text-cyan-700">
              <span className="h-2 w-2 rounded-full bg-cyan-500" /> Humidity (%)
            </span>
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Soil (%)
            </span>
          </div>
        </div>

        <div className="h-36 w-full pt-1">
          {history && history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSoil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="temp" stroke="#d97706" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} />
                <Area type="monotone" dataKey="humidity" stroke="#0284c7" fillOpacity={1} fill="url(#colorHum)" strokeWidth={2} />
                <Area type="monotone" dataKey="moisture" stroke="#059669" fillOpacity={1} fill="url(#colorSoil)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400 font-semibold">
              Polling live sensor telemetry data points...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
