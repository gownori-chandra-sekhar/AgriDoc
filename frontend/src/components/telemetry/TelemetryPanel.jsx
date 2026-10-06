import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BatteryCharging,
  Gauge,
  MapPin,
  Wifi,
  Activity,
  Power,
  Zap,
  Clock,
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
      {/* Top Connection Bar */}
      <Card className="border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border ${
                isConnected
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300 shadow-sm'
                  : 'bg-rose-100 text-rose-700 border-rose-300'
              }`}
            >
              {isConnected ? <Activity className="h-6 w-6 animate-pulse" /> : <Power className="h-6 w-6" />}
              <div
                className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${
                  isConnected ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'
                } ring-2 ring-white`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  {isConnected ? `AgriRover: ${telemetry?.robot_id || 'ESP32-S3'}` : 'Rover Hardware Offline'}
                </h3>
                <Badge variant={isConnected ? 'success' : 'danger'} size="sm">
                  {isConnected ? 'STREAMING' : 'OFFLINE'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                {lastUpdated ? (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-emerald-600" />
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                ) : (
                  <span>Connect ESP32 node or simulate telemetry stream</span>
                )}
              </div>
            </div>
          </div>

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

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-2xl p-4 border border-slate-200 bg-white space-y-1.5 hover:border-emerald-400 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Battery Power</span>
            <BatteryCharging className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{battery}%</span>
            <span className="text-[10px] text-emerald-700 font-bold uppercase">{isConnected ? 'Nominal' : 'Offline'}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${battery}%` }}
            />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-200 bg-white space-y-1.5 hover:border-cyan-400 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Cruising Speed</span>
            <Gauge className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-cyan-700 font-mono">{speed}</span>
            <span className="text-xs text-slate-500 font-bold">km/h</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium truncate">
            {isConnected ? `Mode: ${status}` : 'Offline'}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-200 bg-white space-y-1.5 hover:border-teal-400 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Sub-Meter GPS</span>
            <MapPin className="h-4 w-4 text-teal-600" />
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900 font-mono truncate">
            {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
          </div>
          <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Sector A-4
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-200 bg-white space-y-1.5 hover:border-indigo-400 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>WiFi Signal</span>
            <Wifi className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {isConnected && rssi != null ? rssi : '--'}
            </span>
            <span className="text-xs text-indigo-600 font-bold">dBm</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            {isConnected ? '2.4 GHz ESP32 Link' : 'Disconnected'}
          </p>
        </div>
      </div>
    </div>
  );
}
