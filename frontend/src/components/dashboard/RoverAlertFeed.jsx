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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
            <ShieldAlert className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-wide uppercase">
              AI Disease Alert Feed & Log
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Live leaf disease snapshots saved by rover vision pipeline
            </p>
          </div>
        </div>

        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-extrabold text-rose-700 border border-rose-200">
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
                    ? 'border-rose-200 bg-rose-50/80 hover:border-rose-300 hover:bg-rose-100/80'
                    : 'border-slate-200 bg-slate-50/90 hover:border-slate-300 hover:bg-slate-100/90'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-3.5 items-start sm:items-center justify-between">
                  {/* Thumbnail Image + Basic Info */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      <img
                        src={item.image_url || '/api/esp32/frame'}
                        alt={item.disease_name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <span
                        className={`absolute top-1 right-1 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                          isHigh ? 'bg-rose-500 animate-ping' : 'bg-amber-400'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {item.disease_name}
                        </h4>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                            isHigh
                              ? 'bg-rose-100 text-rose-700 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {item.severity || 'Alert'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                        <span className="font-semibold text-slate-700">Crop: {item.crop}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">{item.confidence}% Conf.</span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                        <MapPin className="h-3 w-3 ml-2 text-sky-600" />
                        <span className="text-slate-600 font-medium">{item.gps}</span>
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
                          ? 'bg-amber-500 text-white ring-2 ring-amber-400 animate-pulse'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {isPlaying ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      <span className="text-[10px]">{isPlaying ? 'Playing...' : 'Voice'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedAlert(item)}
                      title="View Snapshot Details"
                      className="rounded-xl bg-white border border-slate-200 p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-10 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <p className="text-xs font-bold text-slate-700">No disease alerts logged yet</p>
            <p className="text-[11px] text-slate-500">Click "AI Snap & Detect" on live stream to test snapshot capture</p>
          </div>
        )}
      </div>

      {/* Snapshot Modal View */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {selectedAlert.disease_name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Snapshot ID: {selectedAlert.id} • Crop: {selectedAlert.crop}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAlert(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <img
                  src={selectedAlert.image_url || '/api/esp32/frame'}
                  alt={selectedAlert.disease_name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 left-2 rounded-lg bg-white/95 px-2 py-1 text-[10px] font-mono font-bold text-sky-700 border border-slate-200">
                  CONFIDENCE: {selectedAlert.confidence}%
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Severity:</span>
                    <span className="font-bold text-rose-700">{selectedAlert.severity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">GPS Location:</span>
                    <span className="font-semibold text-slate-800">{selectedAlert.gps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Logged Time:</span>
                    <span className="font-semibold text-slate-800">{new Date(selectedAlert.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 space-y-1.5">
                  <h4 className="font-black text-emerald-900 uppercase text-[11px]">
                    Recommended Agronomist Action
                  </h4>
                  <p className="text-emerald-950 leading-relaxed text-[11px] font-medium">
                    {selectedAlert.remedy}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAlert(null)}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-md"
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
