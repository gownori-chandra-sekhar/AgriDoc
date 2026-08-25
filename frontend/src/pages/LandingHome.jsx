import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, Bot, ScanLine, Volume2, BarChart3, Globe, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Play, Cpu, Layers } from 'lucide-react';
import Login from './Login';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'te', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'mr', label: 'మరాఠీ (Marathi)', flag: '🇮🇳' },
];

export default function LandingHome({ onLoginSuccess }) {
  const { t, i18n } = useTranslation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-emerald-600/15 via-emerald-900/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                  Agri<span className="text-emerald-400">Doc</span>
                </h1>
                <span className="hidden rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20 sm:inline-block">
                  Farmer Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">AI Precision Agriculture & Robot Telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher Dropdown */}
            <div className="relative flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700/80 px-3 py-1.5 text-slate-200">
              <Globe className="h-4 w-4 text-emerald-400 shrink-0" />
              <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-1"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-green-400 transition-all ring-2 ring-emerald-400/40"
            >
              <span>Sign In / Demo</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-8 py-12 lg:py-20 space-y-20">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 text-xs font-bold text-emerald-400">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Multi-Language Voice Advice: English, తెలుగు, हिंदी, தமிழ், ಕನ್ನಡ, मराठी</span>
          </div>

          {/* Hero Title */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Smart Crop Health & <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
              Autonomous Robot Telemetry
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            AgriDoc empowers farmers with computer vision plant leaf scan diagnosis, real-time field robot tracking, localized voice remedies in 6 Indian languages, and live Supabase outbreak logging.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-8 py-4 text-sm font-black text-white shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all ring-4 ring-emerald-400/30"
            >
              <Sprout className="h-5 w-5" />
              <span>Launch AgriDoc Portal</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Feature Grid (4 Core Pillars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-3xl border border-slate-800 p-6 space-y-3 hover:border-emerald-500/40 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-white">AgriRobot Control</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track live field location, battery levels, operating speed, and remote control modes ("Cutting", "Scanning", "Idle").
            </p>
          </div>

          <div className="glass-card rounded-3xl border border-slate-800 p-6 space-y-3 hover:border-emerald-500/40 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
              <ScanLine className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-white">YOLOv8 Plant Scanner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload leaf photos or grab live frames directly from an ESP32-CAM. Detects 10 major crop diseases with bounding box confidence.
            </p>
          </div>

          <div className="glass-card rounded-3xl border border-slate-800 p-6 space-y-3 hover:border-emerald-500/40 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
              <Volume2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-white">6-Language Voice Advisory</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Listen to step-by-step treatment plans synthesized via Google Text-to-Speech in English, Telugu, Hindi, Tamil, Kannada, or Marathi.
            </p>
          </div>

          <div className="glass-card rounded-3xl border border-slate-800 p-6 space-y-3 hover:border-emerald-500/40 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-white">Live Supabase Database</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All crop disease scans and field analytics are saved directly to your live Supabase database with real-time outbreak metrics.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 AgriDoc Dashboard. AI Precision Agriculture & Autonomous Field Robotics.</p>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
            >
              ✕
            </button>
            <Login onLoginSuccess={(u) => { setShowLoginModal(false); onLoginSuccess(u); }} />
          </div>
        </div>
      )}
    </div>
  );
}
