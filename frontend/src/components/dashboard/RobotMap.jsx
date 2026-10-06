import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigation, MapPin, Radio, Cpu, Layers, WifiOff } from 'lucide-react';

export default function RobotMap({ robotStatus }) {
  const { t } = useTranslation();

  const isConnected = robotStatus?.connected || false;
  const lat = isConnected && robotStatus?.gps?.lat ? robotStatus.gps.lat : 16.5062;
  const lng = isConnected && robotStatus?.gps?.lng ? robotStatus.gps.lng : 80.6480;

  return (
    <div className="relative flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm min-h-[380px]">
      {/* Map Header Overlay */}
      <div className="z-20 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t('robot.title')}</h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {isConnected ? `GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E` : 'GPS Tracking Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
              <Radio className="h-3 w-3 animate-ping text-emerald-600" />
              Live GPS Tracking
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
              <WifiOff className="h-3 w-3" />
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Field Map Viewport */}
      <div className="relative flex-1 bg-slate-50 p-4 flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Synthetic Farm Field Layout SVG Map */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center py-6">
          <div className="relative h-64 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between overflow-hidden">
            {/* Field Crop Rows */}
            <div className="absolute inset-0 flex justify-around opacity-30">
              <div className="w-1 border-r border-dashed border-emerald-400 h-full" />
              <div className="w-1 border-r border-dashed border-emerald-400 h-full" />
              <div className="w-1 border-r border-dashed border-emerald-400 h-full" />
              <div className="w-1 border-r border-dashed border-emerald-400 h-full" />
            </div>

            {/* Field Label */}
            <div className="flex justify-between text-[11px] font-mono text-slate-600 font-medium">
              <span className="flex items-center gap-1"><Layers className="h-3 w-3 text-emerald-600" /> Field Sector A-4</span>
              <span>12.5 Acres</span>
            </div>

            {/* Robot Marker / Offline Indicator */}
            <div className="relative flex flex-col justify-center items-center my-auto space-y-2">
              <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-md transition-all duration-700 ${
                isConnected
                  ? 'bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-emerald-500/20'
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
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
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                  Robot Offline — Connect Telemetry to Start
                </span>
              )}
            </div>

            {/* Coordinates & Status Footer */}
            <div className="flex justify-between items-center text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="flex items-center gap-1 font-bold text-slate-800">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" /> AgriBot V2 #084
              </span>
              <span>Status: <strong className={isConnected ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>{isConnected ? robotStatus?.status || 'Scanning' : 'Offline'}</strong></span>
              <span>Speed: <strong className="text-slate-900 font-bold">{isConnected ? robotStatus?.speed_kmh || 0.0 : 0.0} km/h</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
