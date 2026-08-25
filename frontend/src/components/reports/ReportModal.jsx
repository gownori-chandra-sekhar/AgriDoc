import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Volume2, VolumeX, MapPin, Calendar, AlertTriangle, CheckCircle2, Download } from 'lucide-react';

export default function ReportModal({ report, onClose }) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  if (!report) return null;

  const { disease_name, crop, cause, solution, urgency, gps, image_url, audio_url, created_at } = report;

  const handlePlayVoice = () => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (audio_url) {
        if (!audioRef.current) {
          audioRef.current = new Audio(audio_url);
          audioRef.current.onended = () => setIsPlaying(false);
          audioRef.current.onerror = () => fallbackSpeech();
        }
        audioRef.current.play().catch(() => fallbackSpeech());
      } else {
        fallbackSpeech();
      }
    }
  };

  const fallbackSpeech = () => {
    if ('speechSynthesis' in window) {
      const speechText = `${disease_name}. Cause: ${cause}. Remedial Plan: ${solution}`;
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              {crop}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
              urgency === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              Urgency: {urgency}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">{disease_name}</h2>
          <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              {new Date(created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              GPS: {gps || '16.5062, 80.6480'}
            </span>
          </div>
        </div>

        {/* Image & Voice Player Bar */}
        <div className="space-y-3">
          <img src={image_url} alt={disease_name} className="h-56 w-full object-cover rounded-xl border border-slate-800" />
          
          <div className="flex items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <button
              onClick={handlePlayVoice}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow ${
                isPlaying ? 'bg-amber-600 text-white ring-2 ring-amber-400' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span>{isPlaying ? 'Playing Voice...' : 'Play Voice Advisory'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <Download className="h-4 w-4 text-emerald-400" />
              <span>Print / Save</span>
            </button>
          </div>
        </div>

        {/* Cause & Solution Details */}
        <div className="space-y-3">
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1 mb-1">
              <AlertTriangle className="h-3.5 w-3.5" /> Cause of Infection
            </h4>
            <p className="text-xs text-slate-300">{cause}</p>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1 mb-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Recommended Remedial Action
            </h4>
            <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
              {solution}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
