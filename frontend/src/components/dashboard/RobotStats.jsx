import React from 'react';
import { useTranslation } from 'react-i18next';
import { BatteryCharging, Gauge, ScanLine, Scissors, Pause, Home, AlertTriangle, CheckCircle2, WifiOff, Power } from 'lucide-react';

export default function RobotStats({ robotStatus, liveReportsCount = 0, activeAlertsCount = 0, onControlCommand, onToggleConnect }) {
  const { t } = useTranslation();

  const isConnected = robotStatus?.connected || false;
  const battery = isConnected ? robotStatus?.battery_pct || 0 : 0;
  const status = isConnected ? robotStatus?.status || 'Idle' : 'Offline';
  const speed = isConnected ? robotStatus?.speed_kmh || 0.0 : 0.0;

  return (
    <div className="space-y-4">
      {/* Robot Hardware Connection Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
            isConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            {isConnected ? <CheckCircle2 className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {isConnected ? 'AgriRobot Hardware Connected' : 'No Robot Connected (Hardware Offline)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isConnected ? 'Receiving IoT telemetry & GPS streams' : 'Connect physical robot or click simulator toggle to test telemetry'}
            </p>
          </div>
        </div>

        <button
          onClick={onToggleConnect}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow ${
            isConnected
              ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 ring-2 ring-emerald-400/40'
          }`}
        >
          <Power className="h-4 w-4" />
          <span>{isConnected ? 'Disconnect Robot' : 'Connect Robot Telemetry'}</span>
        </button>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Battery Power */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 transition-all hover:border-emerald-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t('robot.battery')}</span>
            <BatteryCharging className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-white">{battery}%</span>
            <span className="text-[10px] text-slate-400 font-medium">{isConnected ? 'Optimal' : 'Offline'}</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                !isConnected ? 'bg-slate-700' : battery > 50 ? 'bg-emerald-500' : battery > 20 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${battery}%` }}
            />
          </div>
        </div>

        {/* Operating Speed */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 transition-all hover:border-emerald-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t('robot.speed')}</span>
            <Gauge className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-white">{speed}</span>
            <span className="text-xs text-slate-400 font-medium">km/h</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400">{!isConnected ? 'Offline' : status === 'Idle' ? 'Docked' : 'Autonomous Mode'}</p>
        </div>

        {/* Total Crop Scans */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 transition-all hover:border-emerald-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t('robot.totalScans')}</span>
            <ScanLine className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-white">{liveReportsCount}</span>
            <span className="text-xs text-slate-400 font-medium">Scans</span>
          </div>
          <p className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Live Supabase Records
          </p>
        </div>

        {/* Active Outbreak Alerts */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 transition-all hover:border-rose-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t('robot.activeAlerts')}</span>
            <AlertTriangle className={`h-4 w-4 ${activeAlertsCount > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-extrabold ${activeAlertsCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {activeAlertsCount}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">High Urgency</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400">{activeAlertsCount > 0 ? 'Action Required' : 'No Outbreaks'}</p>
        </div>
      </div>

      {/* Robot Telemetry Control Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Robot Remote Controls {!isConnected && '(Connect hardware to enable)'}
        </h4>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <button
            onClick={() => onControlCommand('start_scan')}
            disabled={!isConnected}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all shadow-md ${
              !isConnected
                ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                : status === 'Scanning'
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <ScanLine className="h-4 w-4" />
            <span>{t('robot.startScan')}</span>
          </button>

          <button
            onClick={() => onControlCommand('start_cutting')}
            disabled={!isConnected}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all shadow-md ${
              !isConnected
                ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                : status === 'Cutting'
                ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Scissors className="h-4 w-4" />
            <span>{t('robot.startCutting')}</span>
          </button>

          <button
            onClick={() => onControlCommand('pause')}
            disabled={!isConnected}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all ${
              !isConnected
                ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Pause className="h-4 w-4 text-amber-400" />
            <span>{t('robot.pause')}</span>
          </button>

          <button
            onClick={() => onControlCommand('return_dock')}
            disabled={!isConnected}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all ${
              !isConnected
                ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Home className="h-4 w-4 text-emerald-400" />
            <span>{t('robot.returnDock')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
