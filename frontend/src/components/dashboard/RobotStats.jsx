import React from 'react';
import { useTranslation } from 'react-i18next';
import { BatteryCharging, Gauge, ScanLine, Scissors, Pause, Home, AlertTriangle, CheckCircle2, WifiOff, Power, Zap, Radio, Sparkles, Activity } from 'lucide-react';

export default function RobotStats({ robotStatus, liveReportsCount = 0, activeAlertsCount = 0, onControlCommand, onToggleConnect, onOpenScanner }) {
  const { t } = useTranslation();

  const isConnected = robotStatus?.connected || false;
  const battery = isConnected ? robotStatus?.battery_pct || 0 : 0;
  const status = isConnected ? robotStatus?.status || 'Idle' : 'Offline';
  const speed = isConnected ? robotStatus?.speed_kmh || 0.0 : 0.0;

  return (
    <div className="space-y-4">
      {/* Robot Hardware Connection Bar */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 border border-slate-800/90 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border ${
            isConnected 
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-glow-sm' 
              : 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-glow-rose'
          }`}>
            {isConnected ? <Activity className="h-6 w-6 animate-pulse" /> : <WifiOff className="h-6 w-6 animate-bounce" />}
            <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-rose-500'} ring-2 ring-slate-950 animate-ping`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white">
                {isConnected ? `AgriRobot: ${robotStatus?.robot_id || 'AGRI-ROVER-ESP32S3'}` : 'AgriRover Hardware Offline'}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase ${
                isConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {isConnected ? 'LIVE TELEMETRY' : 'DISCONNECTED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isConnected ? 'ESP32 IoT sensor streams & sub-meter GPS tracking active' : 'Click "Scan ESP32 WiFi Nodes" to discover & pair active agricultural rovers'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!isConnected && (
            <button
              onClick={onToggleConnect}
              className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 px-4 py-3 text-xs font-black text-emerald-300 transition-all shadow-sm group"
            >
              <Zap className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Simulate ESP32 Stream</span>
            </button>
          )}

          <button
            onClick={isConnected ? onToggleConnect : onOpenScanner}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition-all shadow-lg shrink-0 ${
              isConnected
                ? 'bg-rose-600/20 text-rose-400 border border-rose-500/40 hover:bg-rose-600 hover:text-white shadow-glow-rose'
                : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-slate-950 font-black shadow-glow-md hover:shadow-glow-lg hover:scale-105 active:scale-95'
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
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/90 relative overflow-hidden bg-gradient-to-b from-slate-900/80 to-slate-950 hover:border-emerald-500/50 hover:shadow-glow-sm transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{t('robot.battery') || 'Battery Power'}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
              <BatteryCharging className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">{battery}%</span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase">{isConnected ? 'Nominal' : 'Offline'}</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-950 p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                !isConnected 
                  ? 'bg-slate-700' 
                  : battery > 50 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-300 shadow-glow-sm' 
                  : battery > 20 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                  : 'bg-gradient-to-r from-rose-600 to-rose-400'
              }`}
              style={{ width: `${battery}%` }}
            />
          </div>
        </div>

        {/* Operating Speed */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/90 relative overflow-hidden bg-gradient-to-b from-slate-900/80 to-slate-950 hover:border-cyan-500/50 hover:shadow-glow-cyan transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{t('robot.speed') || 'Rover Speed'}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover:scale-110 transition-transform">
              <Gauge className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-cyan-400 font-mono">{speed}</span>
            <span className="text-xs text-slate-400 font-bold">km/h</span>
          </div>
          <p className="mt-2.5 text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
            {!isConnected ? 'Telemetry Offline' : status === 'Idle' ? 'Docked at Station' : 'Field Autonomous Cruise'}
          </p>
        </div>

        {/* Total Crop Scans */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/90 relative overflow-hidden bg-gradient-to-b from-slate-900/80 to-slate-950 hover:border-teal-500/50 hover:shadow-glow-sm transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{t('robot.totalScans') || 'Total Scans'}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 group-hover:scale-110 transition-transform">
              <ScanLine className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">{liveReportsCount}</span>
            <span className="text-xs text-slate-400 font-bold">Scans</span>
          </div>
          <p className="mt-2.5 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Synced with Supabase Cloud
          </p>
        </div>

        {/* Active Outbreak Alerts */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/90 relative overflow-hidden bg-gradient-to-b from-slate-900/80 to-slate-950 hover:border-rose-500/50 hover:shadow-glow-rose transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{t('robot.activeAlerts') || 'Outbreak Alerts'}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 group-hover:scale-110 transition-transform">
              <AlertTriangle className={`h-4 w-4 ${activeAlertsCount > 0 ? 'animate-bounce' : ''}`} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-3xl font-black ${activeAlertsCount > 0 ? 'text-rose-400 text-glow-rose' : 'text-slate-300'}`}>
              {activeAlertsCount}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">High Urgency</span>
          </div>
          <p className="mt-2.5 text-[10px] font-bold text-slate-400">
            {activeAlertsCount > 0 ? 'Immediate Action Advised' : 'No Critical Pathogens'}
          </p>
        </div>
      </div>

      {/* Robot Telemetry Control Bar */}
      <div className="glass-card rounded-3xl p-5 border border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950 shadow-xl">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Autonomous Robot Commands {!isConnected && <span className="text-slate-500 lowercase">(connect hardware to enable)</span>}
            </h4>
          </div>
          {isConnected && (
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              STATE: {status}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            onClick={() => onControlCommand('start_scan')}
            disabled={!isConnected}
            className={`flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-black transition-all shadow-md ${
              !isConnected
                ? 'bg-slate-950 text-slate-600 cursor-not-allowed border border-slate-800'
                : status === 'Scanning'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white ring-2 ring-emerald-400 shadow-glow-sm animate-pulse'
                : 'bg-slate-900 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500'
            }`}
          >
            <ScanLine className="h-4 w-4" />
            <span>{t('robot.startScan') || 'AI Crop Scan'}</span>
          </button>

          <button
            onClick={() => onControlCommand('start_cutting')}
            disabled={!isConnected}
            className={`flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-black transition-all shadow-md ${
              !isConnected
                ? 'bg-slate-950 text-slate-600 cursor-not-allowed border border-slate-800'
                : status === 'Cutting'
                ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white ring-2 ring-amber-400 shadow-lg animate-pulse'
                : 'bg-slate-900 hover:bg-amber-600/20 text-amber-400 border border-amber-500/30 hover:border-amber-500'
            }`}
          >
            <Scissors className="h-4 w-4" />
            <span>{t('robot.startCutting') || 'Weed Cutting'}</span>
          </button>

          <button
            onClick={() => onControlCommand('pause')}
            disabled={!isConnected}
            className={`flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-black transition-all ${
              !isConnected
                ? 'bg-slate-950 text-slate-600 cursor-not-allowed border border-slate-800'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700'
            }`}
          >
            <Pause className="h-4 w-4 text-amber-400" />
            <span>{t('robot.pause') || 'Pause Rover'}</span>
          </button>

          <button
            onClick={() => onControlCommand('return_dock')}
            disabled={!isConnected}
            className={`flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-black transition-all ${
              !isConnected
                ? 'bg-slate-950 text-slate-600 cursor-not-allowed border border-slate-800'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700'
            }`}
          >
            <Home className="h-4 w-4 text-cyan-400" />
            <span>{t('robot.returnDock') || 'Return to Dock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

