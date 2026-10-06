import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  Bot, 
  ScanLine, 
  Volume2, 
  BarChart3, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Cpu, 
  Layers, 
  Zap, 
  Activity, 
  Radio, 
  Compass, 
  CheckCircle,
  Wifi,
  LayoutDashboard
} from 'lucide-react';
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
  const navigate = useNavigate();
  const { user, loginWithDemo } = useAuth();
  const { t, i18n } = useTranslation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeVoiceDemo, setActiveVoiceDemo] = useState(null);

  const handleLaunchDashboard = () => {
    if (user) {
      navigate('/');
    } else {
      loginWithDemo('farmer');
      if (onLoginSuccess) onLoginSuccess({ role: 'farmer' });
      navigate('/');
    }
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const playVoiceSample = (langCode, sampleText) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.onend = () => setActiveVoiceDemo(null);
      setActiveVoiceDemo(langCode);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f9f5] bg-agri-grid text-slate-800 flex flex-col relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* Botanical Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-emerald-100/60 via-teal-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-cyan-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full glass-panel bg-white/90 border-b border-emerald-100/80 px-4 py-3.5 sm:px-8 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 shadow-md shadow-emerald-500/20">
              <Sprout className="h-6 w-6 text-white" />
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  Agri<span className="text-emerald-700">Doc</span>
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  AI v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">AI Precision Agriculture & Autonomous Field Robotics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Multi-Language Selector */}
            <div className="relative flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-slate-700 hover:border-emerald-400 transition-colors shadow-sm">
              <Globe className="h-4 w-4 text-emerald-600 shrink-0" />
              <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-white text-slate-900">
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {user ? (
              <button
                onClick={() => navigate('/')}
                className="group relative inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-black text-white shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Go to Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="group relative inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-black text-white shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Farmer Login</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-8 py-10 lg:py-16 space-y-20">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-xs font-bold text-emerald-800 shadow-sm">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>Next-Gen Agricultural Intelligence & ESP32 Rover Telemetry</span>
          </div>

          {/* Hero Title */}
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Empowering Farmers With <br />
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              AI Vision & Field Robotics
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
            AgriDoc unifies automated crop disease detection, live ESP32 rover telemetry, and instant voice-guided remedies in 6 Indian languages with real-time cloud data logging.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={handleLaunchDashboard}
              className="flex items-center gap-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-8 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sprout className="h-5 w-5" />
              <span>Launch Live Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => playVoiceSample(i18n.language || 'en', 'Welcome to AgriDoc. Your tomato field scan indicates early blight. Apply copper fungicide at two grams per litre.')}
              className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-6 py-4 text-sm font-bold text-slate-700 hover:border-emerald-400 hover:text-emerald-800 transition-all shadow-sm cursor-pointer"
            >
              <Volume2 className={`h-5 w-5 ${activeVoiceDemo ? 'text-emerald-600 animate-bounce' : 'text-slate-500'}`} />
              <span>{activeVoiceDemo ? 'Playing Voice Advisory...' : 'Listen to Voice Demo'}</span>
            </button>
          </div>

          {/* Key Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-4 text-center border border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">98.2%</div>
              <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">AI Accuracy</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-sky-700">&lt; 400ms</div>
              <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Scan Latency</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-teal-700">6 Dialects</div>
              <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Voice Advisory</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">ESP32-S3</div>
              <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">IoT Hardware</div>
            </div>
          </div>
        </div>

        {/* Live Interface Preview Hero Card */}
        <div className="relative rounded-3xl p-2 bg-gradient-to-b from-emerald-100 via-slate-100 to-white shadow-xl overflow-hidden group border border-slate-200">
          <div className="relative rounded-[22px] overflow-hidden bg-slate-100 border border-slate-200">
            <img 
              src="/hero-banner.jpg" 
              alt="AgriDoc Autonomous Rover & AI Vision Dashboard" 
              className="w-full h-auto max-h-[520px] object-cover object-top opacity-95 group-hover:scale-[1.01] transition-transform duration-700"
            />
            
            {/* Holographic Overlay Badges on Banner */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 pointer-events-auto">
              <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-200 shadow-lg">
                <Activity className="h-5 w-5 text-emerald-600 animate-pulse" />
                <div>
                  <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                    ESP32 Telemetry Link Active
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Sub-meter GPS waypoint tracking & sensor streams</div>
                </div>
              </div>

              <button
                onClick={handleLaunchDashboard}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-black text-white shadow-md transition-colors cursor-pointer"
              >
                <span>Explore Live Rover HUD</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Core Pillars Feature Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Engineered For Autonomous Precision Farming</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Integrated hardware, computer vision algorithms, and local dialect voice assistance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 space-y-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:scale-110 transition-transform">
                <Bot className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-black text-slate-900">Autonomous Rover Control</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Stream low-latency ESP32-CAM video HUD, control motor speeds, monitor battery voltage, and execute weeding or harvesting tasks.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 space-y-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 group-hover:scale-110 transition-transform">
                <ScanLine className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-black text-slate-900">YOLOv8 Plant Scanner</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Analyze plant leaves for 10+ major crop pathogens (Tomato Blight, Paddy Blast, Rust) with exact bounding boxes and confidence scores.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 space-y-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 border border-cyan-200 group-hover:scale-110 transition-transform">
                <Volume2 className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-black text-slate-900">6-Language Voice Advisory</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Step-by-step organic and chemical treatment instructions read aloud in English, Telugu, Hindi, Tamil, Kannada, and Marathi.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 space-y-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-black text-slate-900">Cloud Outbreak Analytics</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Real-time geospatial hotspot logging and disease distribution statistics synchronized with Supabase database.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-700 font-bold">
          <Sprout className="h-4 w-4 text-emerald-600" />
          <span>AgriDoc • Smart Crop Health & Autonomous Robot Telemetry</span>
        </div>
        <p>© 2026 AgriDoc Ecosystem. Designed for precision agriculture, IoT diagnostics & field robotics.</p>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-rose-600 hover:text-white font-bold transition-colors shadow-md"
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

