import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, ROLES } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Sprout,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Bot,
  UserCheck,
  Zap,
  Activity,
  Award,
  Globe
} from 'lucide-react';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

export default function Login({ onLoginSuccess }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [phone, setPhone] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLES.FARMER);
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile phone number.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      toast.info(`Verification code sent to ${phone}. (Demo code: 123456)`, 'OTP Dispatched');
    }, 350);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error('Please enter the verification code.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userObj = {
        id: `user_${phone.replace(/\D/g, '')}`,
        name:
          selectedRole === ROLES.FARMER
            ? 'Ramesh Patel (Farmer)'
            : selectedRole === ROLES.OPERATOR
            ? 'Vikram Singh (Rover Pilot)'
            : 'Dr. Ananya Rao (Agronomist)',
        phone,
        role: selectedRole,
        farmLocation: 'Guntur, Andhra Pradesh',
      };
      login(userObj);
      toast.success(t('login.loginSuccess') || 'Welcome to AgriDoc!');
      if (onLoginSuccess) onLoginSuccess(userObj);
      navigate('/');
    }, 350);
  };

  const handleQuickDemo = (roleChoice) => {
    const roleMap = {
      [ROLES.FARMER]: { name: 'Ramesh Patel (Farmer)', phone: '+91 98765 43210', role: ROLES.FARMER },
      [ROLES.OPERATOR]: { name: 'Vikram Singh (Operator)', phone: '+91 98765 43211', role: ROLES.OPERATOR },
      [ROLES.ADMIN]: { name: 'Dr. Ananya Rao (Agronomist)', phone: '+91 98765 43212', role: ROLES.ADMIN },
    };
    const userObj = roleMap[roleChoice] || roleMap[ROLES.FARMER];
    login(userObj);
    toast.success(`Welcome back, ${userObj.name}`);
    if (onLoginSuccess) onLoginSuccess(userObj);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-agri-grid text-slate-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-canva-emerald selection:text-slate-950 font-sans">
      {/* Top Header Ribbon */}
      <header className="w-full px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-canva-emerald flex items-center justify-center shadow-glow-sm">
            <Sprout className="h-6 w-6 text-slate-950 font-bold" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Agri<span className="text-canva-emerald text-glow-emerald">Doc</span>
          </span>
          <span className="hidden sm:inline-block rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-mono font-black text-emerald-300 uppercase">
            Canva v3.0 Edition
          </span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Split Layout: Left Luxury Graphic & Right Glassmorphic Form */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Side: Hero AI Graphic Artwork & Value Props */}
        <div className="lg:col-span-7 space-y-6 hidden lg:block">
          <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl group bg-slate-950">
            <img
              src="/login-hero.jpg"
              alt="AgriDoc Autonomous Rover Vision"
              className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Hologram Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#031710] via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/80 border border-emerald-500/40 px-3.5 py-1 text-xs font-mono font-bold text-emerald-300 backdrop-blur-md shadow-glow-sm">
                <Activity className="h-3.5 w-3.5 text-canva-emerald animate-pulse" />
                <span>AUTONOMOUS PRECISION ROVER TELEMETRY ACTIVE</span>
              </div>

              <h2 className="text-3xl font-black text-white leading-tight">
                AI Vision, Autonomous Robotics & <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent text-glow-emerald">
                  Multilingual Farmer Guidance
                </span>
              </h2>

              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Empowering farmers across 6 native Indian dialects with instant leaf pathogen scanning, sub-meter GPS robot navigation, and real-time cloud data telemetry.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Canva Glassmorphic Sign-In Portal */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto space-y-5">
          {/* Card Container */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden space-y-6">
            {/* Top Accent Glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Portal Title */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-canva-emerald to-teal-300 shadow-glow-md mb-1">
                <Sprout className="h-8 w-8 text-slate-950" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Agri<span className="text-canva-emerald text-glow-emerald">Doc</span> Portal
              </h1>
              <p className="text-xs text-slate-300">
                Sign in with mobile number or experience instant role demo
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-300 px-0.5">
                <span>Select Operational Role</span>
                <span className="text-canva-emerald font-mono">1-CLICK</span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.FARMER)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 ${
                    selectedRole === ROLES.FARMER
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-glow-sm ring-1 ring-emerald-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">👨‍🌾</span>
                  <span>Farmer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.OPERATOR)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 ${
                    selectedRole === ROLES.OPERATOR
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-glow-cyan ring-1 ring-cyan-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">🤖</span>
                  <span>Operator</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.ADMIN)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 ${
                    selectedRole === ROLES.ADMIN
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-glow-sm ring-1 ring-teal-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">🔬</span>
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Phone OTP Form */}
            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-200">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-canva-emerald" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full rounded-2xl bg-slate-950/90 border border-emerald-500/30 py-3.5 pl-11 pr-4 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-canva-emerald focus:ring-2 focus:ring-canva-emerald/30 shadow-inner"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-canva-emerald to-teal-400 text-slate-950 font-black text-sm tracking-wide shadow-glow-md hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Send Phone OTP</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-200">
                    Enter Verification OTP Code
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-canva-emerald" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      required
                      className="w-full rounded-2xl bg-slate-950/90 border border-emerald-500/40 py-3.5 pl-11 pr-4 text-center font-mono text-xl font-black tracking-widest text-white focus:outline-none focus:border-canva-emerald focus:ring-2 focus:ring-canva-emerald/40"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-canva-emerald to-teal-400 text-slate-950 font-black text-sm shadow-glow-md hover:scale-[1.02] transition-all"
                  >
                    Verify & Launch
                  </button>
                </div>
              </form>
            )}

            {/* Instant Demo Role Launcher Button */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="text-[11px] text-center font-bold text-slate-400">
                Instant 1-Click Access (No Code Required):
              </div>
              <button
                type="button"
                onClick={() => handleQuickDemo(selectedRole)}
                className="w-full py-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 text-emerald-300 font-black text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 group"
              >
                <Sparkles className="h-4 w-4 text-canva-emerald group-hover:rotate-12 transition-transform" />
                <span>Launch Interactive Demo as {selectedRole.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-900/80 bg-slate-950/80 z-20">
        <p>© 2026 AgriDoc Platform • Autonomous Precision Farming & AI Crop Diagnostics</p>
      </footer>
    </div>
  );
}
