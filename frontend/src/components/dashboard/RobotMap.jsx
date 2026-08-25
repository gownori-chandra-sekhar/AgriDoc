import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigation, MapPin, Radio, Cpu, Layers, WifiOff } from 'lucide-react';

export default function RobotMap({ robotStatus }) {
  const { t } = useTranslation();

  const isConnected = robotStatus?.connected || false;
  const lat = isConnected && robotStatus?.gps?.lat ? robotStatus.gps.lat : 16.5062;
  const lng = isConnected && robotStatus?.gps?.lng ? robotStatus.gps.lng : 80.6480;

  return (
    <div className="glass-card relative flex flex-col rounded-2xl border border-slate-800 overflow-hidden shadow-xl min-h-[380px]">
      {/* Map Header Overlay */}
      <div className="z-20 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{t('robot.title')}</h3>
            <p className="text-[11px] text-slate-400">
              {isConnected ? `GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E` : 'GPS Tracking Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
              <Radio className="h-3 w-3 animate-ping text-emerald-400" />
              Live GPS Tracking
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 text-[11px] font-semibold text-rose-400">
              <WifiOff className="h-3 w-3" />
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Field Map Viewport */}
      <div className="relative flex-1 bg-slate-950 p-4 flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#16a34a_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Synthetic Farm Field Layout SVG Map */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center py-6">
          <div className="relative h-64 w-full max-w-xl rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner flex flex-col justify-between overflow-hidden">
            {/* Field Crop Rows */}
            <div className="absolute inset-0 flex justify-around opacity-20">
              <div className="w-1 border-r border-dashed border-emerald-400 h-full" />
              <div className="w-1 border-r border-dashed border-emerald-400 h-full" />
              <div className="w-1 border-r border-dashed border-emerald-400 h-full" />
              <div className="w-1 border-r border-dashed border-emerald-400 h-full" />
            </div>

            {/* Field Label */}
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1"><Layers className="h-3 w-3 text-emerald-400" /> Field Sector A-4</span>
              <span>12.5 Acres</span>
            </div>

            {/* Robot Marker / Offline Indicator */}
            <div className="relative flex flex-col justify-center items-center my-auto space-y-2">
              <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl transition-all duration-700 ${
                isConnected
                  ? 'bg-gradient-to-tr from-emerald-600 to-green-400 text-white shadow-emerald-500/40 ring-4 ring-emerald-400/30'
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}>
                <Cpu className={`h-8 w-8 ${isConnected ? 'animate-pulse' : ''}`} />
                {isConnected && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                  </span>
                )}
              </div>
              {!isConnected && (
                <span className="text-xs font-bold text-rose-400 bg-slate-900/90 px-3 py-1 rounded-lg border border-rose-500/30">
                  Robot Offline — Connect Telemetry to Start
                </span>
              )}
            </div>

            {/* Coordinates & Status Footer */}
            <div className="flex justify-between items-center text-xs text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800 backdrop-blur-sm">
              <span className="flex items-center gap-1 font-bold text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" /> AgriBot V2 #084
              </span>
              <span>Status: <strong className={isConnected ? 'text-emerald-400' : 'text-rose-400'}>{isConnected ? robotStatus?.status || 'Scanning' : 'Offline'}</strong></span>
              <span>Speed: <strong className="text-white">{isConnected ? robotStatus?.speed_kmh || 0.0 : 0.0} km/h</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
