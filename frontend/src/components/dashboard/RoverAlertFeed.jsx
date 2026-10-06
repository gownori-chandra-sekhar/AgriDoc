import React, { useState } from 'react';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export default function RoverAlertFeed({ alerts = [], onRefreshAlerts }) {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  const handleToggleVoice = (alertItem, e) => {
    e.stopPropagation();

    if ('speechSynthesis' in window) {
      if (playingId === alertItem.id) {
        window.speechSynthesis.cancel();
        setPlayingId(null);
      } else {
        window.speechSynthesis.cancel();
        setPlayingId(alertItem.id);

        const text = `Disease Advisory for ${alertItem.crop}. Detected issue: ${alertItem.disease_name} with ${alertItem.confidence}% confidence. Severity is ${alertItem.severity}. Recommended remedy: ${alertItem.remedy}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setPlayingId(null);
        utterance.onerror = () => setPlayingId(null);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wide uppercase">
              AI Disease Alert Feed & Log
            </h3>
            <p className="text-[11px] text-slate-400">
              Live leaf disease snapshots saved by rover vision pipeline
            </p>
          </div>
        </div>

        <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-extrabold text-rose-400 border border-rose-500/30">
          {alerts.length} Captured Snapshots
        </span>
      </div>

      {/* Snapshot Alerts Grid / List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
        {alerts && alerts.length > 0 ? (
          alerts.map((item) => {
            const isHigh = (item.severity || '').toLowerCase() === 'high';
            const isPlaying = playingId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedAlert(item)}
                className={`group cursor-pointer rounded-2xl border p-3.5 transition-all duration-200 hover:scale-[1.01] ${
                  isHigh
                    ? 'border-rose-500/40 bg-rose-950/20 hover:border-rose-400 hover:bg-rose-950/30'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-3.5 items-start sm:items-center justify-between">
                  {/* Thumbnail Image + Basic Info */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                      <img
                        src={item.image_url || '/api/esp32/frame'}
                        alt={item.disease_name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <span
                        className={`absolute top-1 right-1 h-2.5 w-2.5 rounded-full ring-2 ring-slate-900 ${
                          isHigh ? 'bg-rose-500 animate-ping' : 'bg-amber-400'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors">
                          {item.disease_name}
                        </h4>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                            isHigh
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {item.severity || 'Alert'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                        <span className="font-semibold text-slate-200">Crop: {item.crop}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{item.confidence}% Conf.</span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                        <MapPin className="h-3 w-3 ml-2 text-cyan-400" />
                        <span className="text-slate-400">{item.gps}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Voice & Expand View */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={(e) => handleToggleVoice(item, e)}
                      title="Play Audio Advisory"
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                        isPlaying
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 animate-pulse'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {isPlaying ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      <span className="text-[10px]">{isPlaying ? 'Playing...' : 'Voice'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedAlert(item)}
                      title="View Snapshot Details"
                      className="rounded-xl bg-slate-800 p-2 text-slate-400 hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-10 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-500/50" />
            <p className="text-xs font-bold text-slate-300">No disease alerts logged yet</p>
            <p className="text-[11px] text-slate-500">Click "AI Snap & Detect" on live stream to test snapshot capture</p>
          </div>
        )}
      </div>

      {/* Snapshot Modal View */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-black text-white">
                    {selectedAlert.disease_name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Snapshot ID: {selectedAlert.id} • Crop: {selectedAlert.crop}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAlert(null)}
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
                <img
                  src={selectedAlert.image_url || '/api/esp32/frame'}
                  alt={selectedAlert.disease_name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 left-2 rounded-lg bg-slate-950/80 px-2 py-1 text-[10px] font-mono font-bold text-cyan-400 border border-slate-800">
                  CONFIDENCE: {selectedAlert.confidence}%
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Severity:</span>
                    <span className="font-bold text-rose-400">{selectedAlert.severity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GPS Location:</span>
                    <span className="font-semibold text-slate-200">{selectedAlert.gps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Logged Time:</span>
                    <span className="font-semibold text-slate-200">{new Date(selectedAlert.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-emerald-950/30 border border-emerald-500/30 p-3.5 space-y-1.5">
                  <h4 className="font-black text-emerald-400 uppercase text-[11px]">
                    Recommended Agronomist Action
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {selectedAlert.remedy}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAlert(null)}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
