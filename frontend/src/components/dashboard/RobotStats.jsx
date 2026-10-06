import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BatteryCharging,
  Gauge,
  ScanLine,
  Scissors,
  Pause,
  Home,
  AlertTriangle,
  CheckCircle2,
  Power,
  Zap,
  Radio,
  Activity,
  WifiOff
} from 'lucide-react';

export default function RobotStats({
  robotStatus,
  liveReportsCount = 0,
  activeAlertsCount = 0,
  onControlCommand,
  onToggleConnect,
  onOpenScanner
}) {
  const { t } = useTranslation();

  const isConnected = robotStatus?.connected || false;
  const battery = isConnected ? robotStatus?.battery_pct || 0 : 0;
  const status = isConnected ? robotStatus?.status || 'Idle' : 'Offline';
  const speed = isConnected ? robotStatus?.speed_kmh || 0.0 : 0.0;

  return (
    <div className="space-y-4">
      {/* Robot Connection Bar */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 border border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div
            className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border ${
              isConnected
                ? 'bg-emerald-100 text-emerald-700 border-emerald-300 shadow-sm'
                : 'bg-rose-100 text-rose-700 border-rose-300'
            }`}
          >
            {isConnected ? <Activity className="h-6 w-6 animate-pulse" /> : <WifiOff className="h-6 w-6" />}
            <div
              className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${
                isConnected ? 'bg-emerald-500' : 'bg-rose-500'
              } ring-2 ring-white animate-ping`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                {isConnected ? `AgriRobot: ${robotStatus?.robot_id || 'AGRI-ROVER-ESP32S3'}` : 'AgriRover Hardware Offline'}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  isConnected
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {isConnected ? 'LIVE TELEMETRY' : 'DISCONNECTED'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isConnected
                ? 'ESP32 IoT sensor streams & sub-meter GPS tracking active'
                : 'Click "Scan ESP32 WiFi Nodes" to discover & pair active agricultural rovers'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!isConnected && (
            <button
              onClick={onToggleConnect}
              className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 px-4 py-3 text-xs font-bold text-emerald-800 transition-all shadow-sm group"
            >
              <Zap className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Simulate ESP32 Stream</span>
            </button>
          )}

          <button
            onClick={isConnected ? onToggleConnect : onOpenScanner}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all shadow-sm shrink-0 ${
              isConnected
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:from-emerald-500 hover:to-teal-500'
            }`}
          >
            <Power className="h-4 w-4" />
            <span>{isConnected ? 'Disconnect Robot' : 'Scan ESP32 WiFi Nodes'}</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Battery Power */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 bg-white hover:border-emerald-400 transition-all shadow-sm group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('robot.battery') || 'Battery Power'}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:scale-110 transition-transform">
              <BatteryCharging className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900">{battery}%</span>
            <span className="text-[10px] text-emerald-700 font-bold uppercase">
              {isConnected ? 'Nominal' : 'Offline'}
            </span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100 p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                !isConnected
                  ? 'bg-slate-300'
                  : battery > 50
                  ? 'bg-emerald-500'
                  : battery > 20
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${battery}%` }}
            />
          </div>
        </div>

        {/* Operating Speed */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 bg-white hover:border-cyan-400 transition-all shadow-sm group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('robot.speed') || 'Rover Speed'}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-700 border border-sky-200 group-hover:scale-110 transition-transform">
              <Gauge className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-sky-700 font-mono">{speed}</span>
            <span className="text-xs text-slate-500 font-bold">km/h</span>
          </div>
          <p className="mt-2.5 text-[10px] font-bold text-slate-500 flex items-center gap-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-sky-500 animate-ping' : 'bg-slate-300'}`}
            />
            {!isConnected
              ? 'Telemetry Offline'
              : status === 'Idle'
              ? 'Docked at Station'
              : 'Field Autonomous Cruise'}
          </p>
        </div>

        {/* Total Crop Scans */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 bg-white hover:border-teal-400 transition-all shadow-sm group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('robot.totalScans') || 'Total Scans'}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200 group-hover:scale-110 transition-transform">
              <ScanLine className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900">{liveReportsCount}</span>
            <span className="text-xs text-slate-500 font-bold">Scans</span>
          </div>
          <p className="mt-2.5 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Synced with Supabase
          </p>
        </div>

        {/* Active Outbreak Alerts */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 bg-white hover:border-rose-400 transition-all shadow-sm group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('robot.activeAlerts') || 'Outbreak Alerts'}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-700 border border-rose-200 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-3xl font-black ${
                activeAlertsCount > 0 ? 'text-rose-600' : 'text-slate-800'
              }`}
            >
              {activeAlertsCount}
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">High Urgency</span>
          </div>
          <p className="mt-2.5 text-[10px] font-bold text-slate-500">
            {activeAlertsCount > 0 ? 'Immediate Action Advised' : 'No Critical Pathogens'}
          </p>
        </div>
      </div>

      {/* Robot Remote Controls */}
      <div className="glass-card rounded-3xl p-5 border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-600 animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Autonomous Robot Commands {!isConnected && <span className="text-slate-500 lowercase">(connect hardware to enable)</span>}
            </h4>
          </div>
          {isConnected && (
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              STATE: {status}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            onClick={() => onControlCommand('start_scan')}
            disabled={!isConnected}
            className={`flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-bold transition-all shadow-sm ${
              !isConnected
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : status === 'Scanning'
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 animate-pulse'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}
          >
            <ScanLine className="h-4 w-4" />
            <span>{t('robot.startScan') || 'AI Crop Scan'}</span>
          </button>

          <button
            onClick={() => onControlCommand('start_cutting')}
            disabled={!isConnected}
            className={`flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-bold transition-all shadow-sm ${
              !isConnected
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : status === 'Cutting'
                ? 'bg-amber-600 text-white ring-2 ring-amber-400 animate-pulse'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            <Scissors className="h-4 w-4" />
            <span>{t('robot.startCutting') || 'Weed Cutting'}</span>
          </button>

          <button
            onClick={() => onControlCommand('pause')}
            disabled={!isConnected}
            className={`flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-bold transition-all ${
              !isConnected
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
          >
            <Pause className="h-4 w-4 text-amber-600" />
            <span>{t('robot.pause') || 'Pause Rover'}</span>
          </button>

          <button
            onClick={() => onControlCommand('return_dock')}
            disabled={!isConnected}
            className={`flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-bold transition-all ${
              !isConnected
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
          >
            <Home className="h-4 w-4 text-sky-600" />
            <span>{t('robot.returnDock') || 'Return to Dock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
