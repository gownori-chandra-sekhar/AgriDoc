import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BatteryCharging,
  Gauge,
  MapPin,
  Wifi,
  Activity,
  Power,
  RotateCcw,
  Zap,
  Radio,
  Clock,
  Cpu
} from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function TelemetryPanel({
  telemetry,
  isConnected,
  lastUpdated,
  onToggleConnect,
  onOpenScanner,
  onSimulateToggle,
}) {
  const { t } = useTranslation();

  const battery = isConnected ? telemetry?.battery_pct ?? 85 : 0;
  const speed = isConnected ? telemetry?.speed_kmh ?? 0.0 : 0.0;
  const status = isConnected ? telemetry?.status || 'Idle' : 'Offline';
  const rssi = isConnected ? telemetry?.rssi_dbm ?? -62 : null;
  const lat = isConnected && telemetry?.gps?.lat ? telemetry.gps.lat : 16.5062;
  const lng = isConnected && telemetry?.gps?.lng ? telemetry.gps.lng : 80.6480;

  return (
    <div className="space-y-4">
      {/* Top Connection HUD Bar */}
      <Card className="border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border ${
                isConnected
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-glow-sm'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-glow-rose'
              }`}
            >
              {isConnected ? <Activity className="h-6 w-6 animate-pulse" /> : <Power className="h-6 w-6" />}
              <div
                className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${
                  isConnected ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'
                } ring-2 ring-slate-950`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  {isConnected ? `AgriRover: ${telemetry?.robot_id || 'ESP32-S3'}` : 'Rover Hardware Offline'}
                </h3>
                <Badge variant={isConnected ? 'success' : 'danger'} size="sm">
                  {isConnected ? 'STREAMING' : 'OFFLINE'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                {lastUpdated ? (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-emerald-400" />
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                ) : (
                  <span>Connect ESP32 node or activate interactive simulation mode</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {!isConnected && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleConnect}
                icon={Zap}
              >
                Simulate Telemetry
              </Button>
            )}

            <Button
              variant={isConnected ? 'danger' : 'primary'}
              size="sm"
              onClick={isConnected ? onToggleConnect : onOpenScanner}
              icon={Power}
            >
              {isConnected ? 'Disconnect Node' : 'Scan WiFi Nodes'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Battery Power */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/90 space-y-1.5 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Battery Power</span>
            <BatteryCharging className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-white">{battery}%</span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase">{isConnected ? 'Nominal' : 'Offline'}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-500"
              style={{ width: `${battery}%` }}
            />
          </div>
        </div>

        {/* Operating Speed */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/90 space-y-1.5 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Cruising Speed</span>
            <Gauge className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">{speed}</span>
            <span className="text-xs text-slate-400 font-bold">km/h</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium truncate">
            {isConnected ? `Mode: ${status}` : 'Offline'}
          </p>
        </div>

        {/* GPS Coordinates */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/90 space-y-1.5 hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Sub-Meter GPS</span>
            <MapPin className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-sm sm:text-base font-black text-white font-mono truncate">
            {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
          </div>
          <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Sector A-4
          </p>
        </div>

        {/* Signal RSSI & Frequency */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/90 space-y-1.5 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>WiFi Signal</span>
            <Wifi className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {isConnected && rssi != null ? rssi : '--'}
            </span>
            <span className="text-xs text-indigo-400 font-bold">dBm</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            {isConnected ? '2.4 GHz ESP32 Link' : 'Disconnected'}
          </p>
        </div>
      </div>
    </div>
  );
}
