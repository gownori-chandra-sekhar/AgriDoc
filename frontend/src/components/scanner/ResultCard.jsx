import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, AlertTriangle, ShieldCheck, CheckCircle, FileText, Share2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResultCard({ result }) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  if (!result) return null;

  const { disease, confidence, cause, solution, urgency, crop, image_url, audio_url, bbox } = result;

  const getUrgencyBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

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
      const speechText = `${disease}. ${t('scanner.urgency')}: ${urgency}. ${t('scanner.cause')}: ${cause}. ${t('scanner.solution')}: ${solution}`;
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">{t('scanner.resultTitle')}</h3>
            <p className="text-xs text-slate-400">YOLOv8 Agriculture Model Scan</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${getUrgencyBadge(urgency)}`}>
            <AlertTriangle className="h-3.5 w-3.5" />
            {t('scanner.urgency')}: {urgency}
          </span>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700">
            {crop}
          </span>
        </div>
      </div>

      {/* Main Grid: Bounding Box Image + Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Scanned Image with Bounding Box Overlay */}
        <div className="md:col-span-5 relative group overflow-hidden rounded-xl border border-slate-700 bg-slate-950 min-h-[220px]">
          <img
            src={image_url}
            alt={disease}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/api/images/fallback_leaf.jpg';
            }}
            className="h-64 w-full object-cover rounded-xl"
          />
          
          {/* Bounding Box Overlay */}
          <div
            className="absolute border-2 border-dashed border-rose-500 bg-rose-500/10 rounded-md pointer-events-none transition-all"
            style={{
              top: bbox ? `${(bbox[1] / 400) * 100}%` : '25%',
              left: bbox ? `${(bbox[0] / 400) * 100}%` : '25%',
              width: bbox ? `${((bbox[2] - bbox[0]) / 400) * 100}%` : '45%',
              height: bbox ? `${((bbox[3] - bbox[1]) / 400) * 100}%` : '45%',
            }}
          >
            <span className="absolute -top-5 left-0 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
              {disease} ({Math.round(confidence * 100)}%)
            </span>
          </div>

          <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex justify-between items-center text-xs text-slate-300">
            <span>Crop Health Confidence</span>
            <span className="font-extrabold text-emerald-400">{Math.round(confidence * 100)}%</span>
          </div>
        </div>

        {/* Diagnosis Text, Cause, Solution */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('scanner.diseaseName')}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
              {disease}
            </h2>
          </div>

          {/* Voice Guidance Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayVoice}
              className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all shadow-lg ring-2 ${
                isPlaying
                  ? 'bg-amber-600 text-white ring-amber-400 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white ring-emerald-400/40 shadow-emerald-500/20'
              }`}
            >
              {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span>{isPlaying ? t('scanner.playing') : t('scanner.playVoice')}</span>
            </button>

            <button
              onClick={triggerConfetti}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <Share2 className="h-4 w-4 text-emerald-400" />
              <span>Share</span>
            </button>
          </div>

          {/* Cause Card */}
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 space-y-1">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              {t('scanner.cause')}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{cause}</p>
          </div>

          {/* Solution Action Plan */}
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 space-y-1.5">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" />
              {t('scanner.solution')}
            </span>
            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {solution}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
