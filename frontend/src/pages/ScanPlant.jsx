import React from 'react';
import { useTranslation } from 'react-i18next';
import { useScan } from '../hooks/useScan';
import ImageUploader from '../components/scanner/ImageUploader';
import DiagnosisCard from '../components/scanner/DiagnosisCard';
import { ScanLine, Sparkles, Info } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export default function ScanPlant() {
  const { t } = useTranslation();
  const {
    scan,
    isScanning,
    uploadProgress,
    scanResult,
    error,
    isPlayingAudio,
    playVoiceAdvice,
    stopVoiceAdvice,
  } = useScan();

  const detectedCrops = [
    { name: 'Paddy / Rice', diseases: 'Blast, Brown Spot' },
    { name: 'Tomato', diseases: 'Early Blight, Late Blight, Leaf Mold' },
    { name: 'Wheat', diseases: 'Rust, Powdery Mildew' },
    { name: 'Cotton', diseases: 'Bacterial Blight, Grey Mildew' },
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto overflow-x-hidden">
      {/* Page Header Banner */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 bg-white shadow-canva-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-300">
            <ScanLine className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t('scanner.title') || 'AI Crop Leaf Health Scanner'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {t('scanner.subtitle') || 'YOLOv8 computer vision diagnosis with localized voice guidance'}
            </p>
          </div>
        </div>

        <Badge variant="success" size="lg">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>YOLOv8 ACTIVE</span>
        </Badge>
      </div>

      {/* Supported Crop Models */}
      <Card className="p-4 border-slate-200 bg-white space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-emerald-600" />
            Active Crop Detection Models
          </span>
          <span className="text-[11px] text-emerald-700 font-bold">10+ Pathogen Profiles</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {detectedCrops.map((c, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 space-y-0.5">
              <div className="text-xs font-bold text-slate-900">{c.name}</div>
              <div className="text-[10px] text-emerald-700 font-medium line-clamp-1">{c.diseases}</div>
            </div>
          ))}
        </div>
      </Card>

      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 font-semibold flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          <span>{error}</span>
        </div>
      )}

      {/* Image Uploader */}
      <ImageUploader
        onScan={scan}
        isScanning={isScanning}
        uploadProgress={uploadProgress}
      />

      {/* Diagnosis Result Card */}
      {scanResult && (
        <div className="animate-scale-up">
          <DiagnosisCard
            result={scanResult}
            isPlayingAudio={isPlayingAudio}
            onPlayVoice={playVoiceAdvice}
            onStopVoice={stopVoiceAdvice}
          />
        </div>
      )}
    </div>
  );
}
