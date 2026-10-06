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

  // Custom Dark Mode Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 text-xs shadow-xl backdrop-blur-md">
          <p className="font-mono text-slate-400 font-bold mb-1">{label}</p>
          <div className="space-y-1 font-semibold">
            <p className="text-amber-400 flex items-center justify-between gap-3">
              <span>Air Temp:</span> <span>{payload[0]?.value}°C</span>
            </p>
            <p className="text-cyan-400 flex items-center justify-between gap-3">
              <span>Humidity:</span> <span>{payload[1]?.value}%</span>
            </p>
            <p className="text-emerald-400 flex items-center justify-between gap-3">
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
          <Cpu className="h-4 w-4 text-emerald-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
            Live Synchronized ESP32 Sensor Grid
          </h3>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
          isConnected
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-slate-800 text-slate-500 border-slate-700'
        }`}>
          {isConnected ? (isLive ? '● Live Hardware Stream' : '● Node Synced') : '● Sensors Offline'}
        </span>
      </div>

      {/* Real-time Sensor Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Air Temperature Card */}
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Air Temp</span>
            <Thermometer className="h-4 w-4 text-amber-400" />
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{isConnected && airTemp != null ? airTemp : '--'}</span>
            <span className="text-xs text-amber-400 font-bold">°C</span>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">
              {isConnected && airTemp != null ? (airTemp > 35 ? 'High Temp' : 'Optimal Field') : 'Offline'}
            </span>
            <span className="rounded bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.2 font-mono text-[9px] font-bold text-amber-300">
              {getPinLabel('air_temp_c', 'GPIO 4')}
            </span>
          </div>
        </div>

        {/* Air Humidity Card */}
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Air Humidity</span>
            <Droplets className="h-4 w-4 text-cyan-400" />
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{isConnected && humidity != null ? humidity : '--'}</span>
            <span className="text-xs text-cyan-400 font-bold">%</span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-500"
              style={{ width: `${isConnected && humidity != null ? humidity : 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">
              {isConnected && humidity != null ? `${humidity}% RH` : 'Offline'}
            </span>
            <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.2 font-mono text-[9px] font-bold text-cyan-300">
              {getPinLabel('humidity_pct', 'GPIO 4')}
            </span>
          </div>
        </div>

        {/* Soil Moisture Card */}
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Soil Moisture</span>
            <Sprout className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{isConnected && soilMoisture != null ? soilMoisture : '--'}</span>
            <span className="text-xs text-emerald-400 font-bold">%</span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${isConnected && soilMoisture != null ? soilMoisture : 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-emerald-400 font-semibold">
              {isConnected && soilMoisture != null ? (soilMoisture < 30 ? 'Dry - Water' : 'Optimal') : 'Offline'}
            </span>
            <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-300">
              {getPinLabel('soil_moisture_pct', 'GPIO 34')}
            </span>
          </div>
        </div>

        {/* Ambient Light Card */}
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-yellow-500/30 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Ambient Light</span>
            <Sun className="h-4 w-4 text-yellow-400" />
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white">{isConnected && lightLux != null ? lightLux.toLocaleString() : '--'}</span>
            <span className="text-[10px] text-yellow-400 font-bold">Lux</span>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">
              {isConnected && lightLux != null ? (lightLux > 10000 ? 'Full Daylight' : 'Low Light') : 'Offline'}
            </span>
            <span className="rounded bg-yellow-500/10 border border-yellow-500/30 px-1.5 py-0.2 font-mono text-[9px] font-bold text-yellow-300">
              {getPinLabel('light_lux', 'GPIO 35')}
            </span>
          </div>
        </div>

        {/* Battery Power & Voltage */}
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">ESP32 Power</span>
            <BatteryCharging className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{isConnected && batteryPct != null ? `${batteryPct}%` : '--'}</span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">{isConnected && batteryVoltage != null ? `${batteryVoltage}V` : '--'}</span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                (batteryPct || 0) > 50 ? 'bg-emerald-500' : (batteryPct || 0) > 20 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${isConnected && batteryPct != null ? batteryPct : 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">
              {isConnected && batteryVoltage != null ? 'Divider 1/4' : 'Offline'}
            </span>
            <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-300">
              {getPinLabel('battery_voltage', 'GPIO 36')}
            </span>
          </div>
        </div>

        {/* WiFi Signal RSSI Card */}
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">WiFi Link</span>
            <Wifi className="h-4 w-4 text-indigo-400" />
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-white">{isConnected && rssiDbm != null ? `${rssiDbm}` : '--'}</span>
            <span className="text-[10px] font-bold text-indigo-400">dBm</span>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">
              {isConnected && rssiDbm != null ? (rssiDbm > -65 ? 'Strong Link' : 'Moderate') : 'Disconnected'}
            </span>
            <span className="rounded bg-indigo-500/10 border border-indigo-500/30 px-1.5 py-0.2 font-mono text-[9px] font-bold text-indigo-300">
              2.4 GHz AP
            </span>
          </div>
        </div>
      </div>

      {/* Live Telemetry Trend Sparkline Graph */}
      <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Real-Time Sensor Telemetry Trend
            </h4>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-bold">
            <span className="flex items-center gap-1 text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Temp (°C)
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400" /> Humidity (%)
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Soil (%)
            </span>
          </div>
        </div>

        <div className="h-36 w-full pt-1">
          {history && history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSoil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="temp" stroke="#f59e0b" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} />
                <Area type="monotone" dataKey="humidity" stroke="#06b6d4" fillOpacity={1} fill="url(#colorHum)" strokeWidth={2} />
                <Area type="monotone" dataKey="moisture" stroke="#10b981" fillOpacity={1} fill="url(#colorSoil)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-500 font-semibold">
              Polling live sensor telemetry data points...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
