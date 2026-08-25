import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ImageUploader from '../components/scanner/ImageUploader';
import ResultCard from '../components/scanner/ResultCard';
import { scanPlant } from '../services/api';
import { ScanLine, CheckCircle2 } from 'lucide-react';

export default function ScanPlant() {
  const { t, i18n } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleScanPlant = async (imageFile, gps) => {
    setIsScanning(true);
    setErrorMsg('');
    try {
      const activeLang = i18n.language || 'en';
      const result = await scanPlant(imageFile, activeLang, gps);
      setScanResult(result);

      // Trigger browser push notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`🚨 AgriDoc Disease Alert: ${result.disease}`, {
          body: `Urgency: ${result.urgency}. Tap to view full localized treatment plan.`,
          icon: result.image_url,
        });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    } catch (err) {
      console.error('Scan Error:', err);
      setErrorMsg('Failed to process image scan. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl flex items-center gap-2">
          <ScanLine className="h-7 w-7 text-emerald-400" />
          {t('nav.scan')}
        </h1>
        <p className="text-xs text-slate-400">
          Upload leaf photo or grab live ESP32 camera frame for instant YOLOv8 disease prediction & voice advisory
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-400 font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Image Uploader & ESP32 Grabber */}
      <ImageUploader onScan={handleScanPlant} isScanning={isScanning} />

      {/* Result Display Card */}
      {scanResult && <ResultCard result={scanResult} />}
    </div>
  );
}
