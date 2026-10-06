import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, AlertTriangle, ShieldCheck, CheckCircle, FileText, Share2, Sparkles, Activity, Award } from 'lucide-react';
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
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-glow-rose';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glow-sm';
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
      const speechText = `${disease}. ${t('scanner.urgency') || 'Urgency'}: ${urgency}. ${t('scanner.cause') || 'Cause'}: ${cause}. ${t('scanner.solution') || 'Treatment Plan'}: ${solution}`;
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
    <div className="glass-card rounded-3xl border border-slate-800/90 p-5 sm:p-7 shadow-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-glow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">{t('scanner.resultTitle') || 'Diagnosis & Prescription Report'}</h3>
            <p className="text-xs text-slate-400">YOLOv8 Autonomous Neural Inference Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-black uppercase tracking-wider ${getUrgencyBadge(urgency)}`}>
            <AlertTriangle className="h-3.5 w-3.5" />
            {t('scanner.urgency') || 'Urgency'}: {urgency}
          </span>
          <span className="rounded-full bg-slate-900 px-3.5 py-1 text-xs font-bold text-slate-200 border border-slate-800">
            {crop}
          </span>
        </div>
      </div>

      {/* Main Grid: Bounding Box Image + Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Scanned Image with Bounding Box Overlay */}
        <div className="md:col-span-5 relative group overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950 min-h-[240px] shadow-xl">
          <img
            src={image_url || '/leaf-scan-mock.jpg'}
            alt={disease}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/leaf-scan-mock.jpg';
            }}
            className="h-72 w-full object-cover rounded-3xl"
          />
          
          {/* Bounding Box Overlay */}
          <div
            className="absolute border-2 border-emerald-400 bg-emerald-500/20 rounded-xl pointer-events-none transition-all shadow-glow-sm animate-pulse"
            style={{
              top: bbox ? `${(bbox[1] / 400) * 100}%` : '20%',
              left: bbox ? `${(bbox[0] / 400) * 100}%` : '20%',
              width: bbox ? `${((bbox[2] - bbox[0]) / 400) * 100}%` : '60%',
              height: bbox ? `${((bbox[3] - bbox[1]) / 400) * 100}%` : '60%',
            }}
          >
            <span className="absolute -top-6 left-0 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase">
              {disease} ({Math.round(confidence * 100)}%)
            </span>
          </div>

          <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex justify-between items-center text-xs text-slate-300">
            <span className="font-bold flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-400" /> Model Confidence
            </span>
            <span className="font-mono font-black text-emerald-400 text-sm">{Math.round(confidence * 100)}%</span>
          </div>
        </div>

        {/* Diagnosis Text, Cause, Solution */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              {t('scanner.diseaseName') || 'Identified Disease'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-400 text-glow-emerald mt-0.5">
              {disease}
            </h2>
          </div>

          {/* Voice Guidance Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayVoice}
              className={`flex items-center gap-2.5 rounded-2xl px-5 py-3 text-xs font-black transition-all shadow-xl ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/40 animate-pulse shadow-lg'
                  : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-slate-950 hover:scale-105 shadow-glow-md'
              }`}
            >
              {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span>{isPlaying ? (t('scanner.playing') || 'Playing Voice Remedy...') : (t('scanner.playVoice') || 'Listen to Voice Remedy in Active Language')}</span>
            </button>

            <button
              onClick={triggerConfetti}
              className="flex items-center gap-1.5 rounded-2xl bg-slate-900 border border-slate-700/80 px-4 py-3 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Share2 className="h-4 w-4 text-emerald-400" />
              <span>Share</span>
            </button>
          </div>

          {/* Cause Card */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-1.5 shadow-sm">
            <span className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertTriangle className="h-3.5 w-3.5" />
              {t('scanner.cause') || 'Pathogen Etiology & Contributing Causes'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{cause}</p>
          </div>

          {/* Solution Action Plan */}
          <div className="rounded-2xl bg-emerald-950/30 border border-emerald-500/30 p-4 space-y-1.5 shadow-glow-sm">
            <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle className="h-3.5 w-3.5" />
              {t('scanner.solution') || 'Agronomist Action Plan & Organic Remedy'}
            </span>
            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-medium">
              {solution}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

