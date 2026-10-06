import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Sparkles,
  Leaf,
  FlaskConical,
  CheckCircle2,
  Share2,
  Download
} from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function DiagnosisCard({
  result,
  isPlayingAudio = false,
  onPlayVoice,
  onStopVoice,
}) {
  const { t } = useTranslation();

  if (!result) return null;

  const disease = result.disease || result.disease_name || 'Healthy Leaf';
  const crop = result.crop || result.crop_type || 'Field Crop';
  const confidence = Math.round((result.confidence || 0.95) * 100);
  const urgency = (result.urgency || 'Medium').toUpperCase();
  const solution = result.solution || result.treatment_advice || 'Maintain optimal irrigation and monitor leaf health regularly.';
  const organicAdvice = result.organic_advice || 'Apply diluted Neem oil spray (5ml/L) in the evening hours to strengthen natural leaf defense.';
  const chemicalAdvice = result.chemical_advice || 'If outbreak spreads, spray Mancozeb or Copper Oxychloride at 2.5g per litre of water.';
  const gps = result.gps || result.gps_location || '16.5062, 80.6480';
  const imageUrl = result.image_url;

  const getUrgencyBadge = () => {
    switch (urgency.toLowerCase()) {
      case 'high':
      case 'severe':
        return <Badge variant="high" pulse size="lg">HIGH URGENCY</Badge>;
      case 'medium':
      case 'moderate':
        return <Badge variant="medium" size="lg">MEDIUM URGENCY</Badge>;
      default:
        return <Badge variant="low" size="lg">LOW URGENCY</Badge>;
    }
  };

  return (
    <Card className="border-emerald-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-glow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 font-mono">
                {crop} DIAGNOSIS
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs font-mono font-bold text-cyan-400">{confidence}% CONFIDENCE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{disease}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getUrgencyBadge()}
          <Button
            variant={isPlayingAudio ? 'danger' : 'primary'}
            size="md"
            onClick={isPlayingAudio ? onStopVoice : () => onPlayVoice(solution, result.audio_url)}
            icon={isPlayingAudio ? VolumeX : Volume2}
          >
            {isPlayingAudio ? 'Stop Audio' : t('scanner.playVoice') || 'Listen Voice Guidance'}
          </Button>
        </div>
      </div>

      {/* Main Diagnosis Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image with YOLO Detection Boxes */}
        {imageUrl && (
          <div className="md:col-span-5 space-y-2">
            <div className="relative aspect-video sm:aspect-square w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl group">
              <img
                src={imageUrl}
                alt={disease}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 border border-emerald-500/40 rounded-xl px-2.5 py-1 text-[11px] font-mono text-emerald-300 backdrop-blur-md">
                YOLOv8 Analyzed
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span>GPS Tag: <strong className="text-slate-200 font-mono">{gps}</strong></span>
            </div>
          </div>
        )}

        {/* Right Column: Treatment & Action Plans */}
        <div className={`${imageUrl ? 'md:col-span-7' : 'md:col-span-12'} space-y-4`}>
          {/* Main Action Plan */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Recommended Field Remedy
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">{solution}</p>
          </div>

          {/* Organic vs Chemical Treatment Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-3.5 space-y-1">
              <span className="text-[11px] font-black uppercase text-emerald-300 flex items-center gap-1">
                <Leaf className="h-3.5 w-3.5 text-emerald-400" />
                Organic Remedy
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{organicAdvice}</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-3.5 space-y-1">
              <span className="text-[11px] font-black uppercase text-cyan-300 flex items-center gap-1">
                <FlaskConical className="h-3.5 w-3.5 text-cyan-400" />
                Chemical Control
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{chemicalAdvice}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
