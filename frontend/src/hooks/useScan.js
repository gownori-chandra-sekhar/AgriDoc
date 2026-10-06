import { useState, useCallback } from 'react';
import { scanPlant } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';

// Client-side image compression helper using HTML5 Canvas
export const compressImage = async (file, maxWidth = 1280, quality = 0.85) => {
  return new Promise((resolve) => {
    // If not an image or SVG, return as-is
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export function useScan() {
  const { i18n } = useTranslation();
  const toast = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const scan = useCallback(
    async (rawFile, gpsCoords = '16.5062, 80.6480') => {
      setIsScanning(true);
      setError(null);
      setUploadProgress(10);

      try {
        // Step 1: Compress image on client side
        setUploadProgress(30);
        const compressedFile = await compressImage(rawFile);
        setUploadProgress(60);

        // Step 2: Call FastAPI YOLO engine
        const activeLang = i18n.language || 'en';
        const result = await scanPlant(compressedFile, activeLang, gpsCoords);
        setUploadProgress(100);
        setScanResult(result);

        toast.success(
          `Detected: ${result.disease || 'Leaf Sample'} (${Math.round((result.confidence || 0.95) * 100)}% confidence)`,
          'Plant Scan Completed'
        );

        // Notify if high urgency
        if ((result.urgency || '').toLowerCase() === 'high') {
          toast.warning('High severity pathogen detected! Immediate treatment advised.');
        }

        return result;
      } catch (err) {
        console.error('Scan Plant Error:', err);
        const errorMsg =
          err.response?.data?.detail ||
          err.message ||
          'Backend is currently processing or warming up. Please retry in a moment.';
        setError(errorMsg);
        toast.error(errorMsg, 'Diagnosis Failed');
        throw err;
      } finally {
        setIsScanning(false);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    [i18n.language, toast]
  );

  // Play voice guidance: first tries gTTS backend audio URL, then falls back to Web Speech Synthesis API
  const playVoiceAdvice = useCallback(
    (customText = null, audioUrl = null) => {
      const textToSpeak =
        customText ||
        (scanResult
          ? `${scanResult.disease}. Urgency level: ${scanResult.urgency}. ${scanResult.solution}`
          : 'No scan advisory available.');

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        setIsPlayingAudio(true);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          fallbackSpeechSynthesis(textToSpeak);
        };
        audio.play().catch(() => {
          fallbackSpeechSynthesis(textToSpeak);
        });
      } else {
        fallbackSpeechSynthesis(textToSpeak);
      }
    },
    [scanResult, i18n.language]
  );

  const fallbackSpeechSynthesis = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap = {
        en: 'en-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        kn: 'kn-IN',
        mr: 'mr-IN',
      };
      utterance.lang = langMap[i18n.language] || 'en-US';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopVoiceAdvice = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  }, []);

  return {
    scan,
    isScanning,
    uploadProgress,
    scanResult,
    setScanResult,
    error,
    isPlayingAudio,
    playVoiceAdvice,
    stopVoiceAdvice,
  };
}

export default useScan;
