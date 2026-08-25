import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Camera, Image as ImageIcon, MapPin, Sparkles, RefreshCw } from 'lucide-react';

export default function ImageUploader({ onScan, isScanning }) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [gpsLocation, setGpsLocation] = useState('16.5062, 80.6480');
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleCaptureEsp32 = async () => {
    try {
      // Fetch simulated ESP32 frame from backend
      const response = await fetch('/api/esp32/frame');
      const blob = await response.blob();
      const file = new File([blob], 'esp32_frame.jpg', { type: 'image/jpeg' });
      handleFileSelect(file);
    } catch (err) {
      console.error('ESP32 Capture Error:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile && !isScanning) {
      onScan(selectedFile, gpsLocation);
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          {t('scanner.title')}
        </h3>
        <p className="text-xs text-slate-400">{t('scanner.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropzone Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
            isDragOver
              ? 'border-emerald-400 bg-emerald-500/10 scale-[0.99]'
              : previewUrl
              ? 'border-emerald-500/40 bg-slate-900/60'
              : 'border-slate-700 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />

          {previewUrl ? (
            <div className="relative group w-full max-w-xs overflow-hidden rounded-lg border border-slate-700">
              <img src={previewUrl} alt="Crop Preview" className="h-44 w-full object-cover rounded-lg" />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <RefreshCw className="h-4 w-4" /> Change Image
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">{t('scanner.dragDrop')}</p>
                <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP up to 10MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & ESP32 Camera Grabber */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCaptureEsp32}
              className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-emerald-400 hover:bg-slate-700 hover:border-emerald-500/40 transition-all"
            >
              <Camera className="h-4 w-4" />
              <span>{t('scanner.captureEsp32')}</span>
            </button>

            <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg">
              <MapPin className="h-3 w-3 text-emerald-400" />
              <span>GPS: 16.5062, 80.6480</span>
            </span>
          </div>

          <button
            type="submit"
            disabled={!selectedFile || isScanning}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-extrabold transition-all shadow-lg ${
              !selectedFile || isScanning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-500 hover:to-green-400 shadow-emerald-500/20 ring-2 ring-emerald-400/40'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>{t('scanner.scanningBtn')}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{t('scanner.scanNow')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
