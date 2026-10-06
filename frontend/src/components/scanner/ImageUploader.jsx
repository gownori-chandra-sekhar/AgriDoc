import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadCloud, Camera, Sparkles, Image as ImageIcon, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import Button from '../common/Button';

const SAMPLE_LEAF_IMAGES = [
  { name: 'Tomato Early Blight', url: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&auto=format&fit=crop&q=80', crop: 'Tomato' },
  { name: 'Paddy Blast Disease', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', crop: 'Paddy' },
  { name: 'Healthy Corn Leaf', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80', crop: 'Corn' },
];

export default function ImageUploader({ onScan, isScanning, uploadProgress = 0, onGrabEsp32Frame }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [gpsLocation, setGpsLocation] = useState('16.5062, 80.6480');

  // Request browser GPS coords
  const captureGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => console.warn('Could not retrieve browser GPS, using field default.')
      );
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    captureGps();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleSampleSelect = async (sample) => {
    try {
      setPreviewUrl(sample.url);
      const res = await fetch(sample.url);
      const blob = await res.blob();
      const file = new File([blob], `${sample.crop.toLowerCase()}_sample.jpg`, { type: 'image/jpeg' });
      setSelectedFile(file);
    } catch (err) {
      console.warn('Could not load sample directly, using preview:', err);
    }
  };

  const handleTriggerScan = () => {
    if (selectedFile) {
      onScan(selectedFile, gpsLocation);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Hidden File & Camera Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files[0])}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFileChange(e.target.files[0])}
        className="hidden"
      />

      {/* Main Drag-and-Drop / Preview Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-3xl border-2 border-dashed p-6 sm:p-10 transition-all text-center flex flex-col items-center justify-center min-h-[300px] overflow-hidden ${
          dragActive
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
            : 'border-slate-800 bg-slate-900/80 hover:border-emerald-500/50 hover:bg-slate-900/95'
        }`}
      >
        {previewUrl ? (
          <div className="relative w-full max-w-md space-y-4">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-emerald-500/40 shadow-2xl bg-slate-950">
              <img
                src={previewUrl}
                alt="Selected Crop Leaf"
                className="h-full w-full object-cover"
              />
              {isScanning && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-3">
                  <div className="relative h-14 w-14">
                    <div className="animate-spin rounded-full h-14 w-14 border-4 border-emerald-500 border-t-transparent shadow-glow-sm" />
                    <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="text-sm font-black text-white">{t('scanner.scanningBtn') || 'Analyzing Leaf with YOLOv8...'}</h4>
                    <p className="text-xs text-emerald-300">Extracting fungal, viral & pest pathogen features</p>
                  </div>

                  {/* Upload Progress Bar */}
                  {uploadProgress > 0 && (
                    <div className="w-full max-w-xs h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Preview Action Buttons */}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={handleTriggerScan}
                disabled={isScanning}
                loading={isScanning}
                icon={Sparkles}
                className="w-full sm:w-auto"
              >
                {t('scanner.scanNow') || 'Run AI Diagnosis'}
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={clearSelection}
                disabled={isScanning}
                icon={RefreshCw}
              >
                Retake Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-glow-sm">
              <UploadCloud className="h-8 w-8" />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {t('scanner.dragDrop') || 'Drag & Drop Plant Leaf Photo'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Supports JPG, PNG or WebP (auto-compressed on device before transmission)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => cameraInputRef.current?.click()}
                icon={Camera}
              >
                Take Camera Photo
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => fileInputRef.current?.click()}
                icon={ImageIcon}
              >
                Browse Gallery
              </Button>

              {onGrabEsp32Frame && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={onGrabEsp32Frame}
                  icon={Layers}
                >
                  {t('scanner.captureEsp32') || 'Grab from ESP32-CAM'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 1-Click Sample Leaf Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span>Or test instantly with verified sample diseased leaves:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_LEAF_IMAGES.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => handleSampleSelect(sample)}
              className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 hover:border-emerald-500/50 hover:bg-slate-850/80 transition-all cursor-pointer shadow-sm group"
            >
              <img
                src={sample.url}
                alt={sample.name}
                className="h-12 w-12 rounded-xl object-cover border border-slate-700 group-hover:scale-105 transition-transform"
              />
              <div className="space-y-0.5">
                <div className="text-xs font-black text-white line-clamp-1">{sample.name}</div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase">{sample.crop}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
