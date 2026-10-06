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
  Activity
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
  const [step, setStep] = useState('phone');
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
    toast.success(`Welcome, ${userObj.name}`);
    if (onLoginSuccess) onLoginSuccess(userObj);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-agri-grid text-slate-800 flex flex-col justify-between relative overflow-x-hidden selection:bg-emerald-500 selection:text-white font-sans">
      {/* Top Header Ribbon */}
      <header className="w-full px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
            <Sprout className="h-6 w-6 text-white font-bold" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            Agri<span className="text-emerald-600">Doc</span>
          </span>
          <span className="hidden sm:inline-block rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-800 uppercase">
            Canva Edition
          </span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Side: Artwork & Value Props */}
        <div className="lg:col-span-7 space-y-6 hidden lg:block">
          <div className="relative rounded-3xl overflow-hidden border border-emerald-200 shadow-xl group bg-white">
            <img
              src="/login-hero.jpg"
              alt="AgriDoc Autonomous Rover Vision"
              className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 space-y-2.5 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-emerald-200 px-3.5 py-1 text-xs font-mono font-bold text-emerald-800 backdrop-blur-md shadow-sm">
                <Activity className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                <span>AUTONOMOUS PRECISION ROVER TELEMETRY ACTIVE</span>
              </div>

              <h2 className="text-3xl font-black leading-tight text-white">
                AI Vision, Autonomous Robotics & <br />
                <span className="text-emerald-300">
                  Multilingual Farmer Guidance
                </span>
              </h2>

              <p className="text-xs text-slate-100 max-w-xl leading-relaxed font-medium">
                Empowering farmers across 6 native Indian dialects with instant leaf pathogen scanning, sub-meter GPS robot navigation, and real-time cloud data telemetry.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Canva Light Sign-In Portal */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto space-y-5">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-200 bg-white/95 shadow-canva-card relative overflow-hidden space-y-6">
            {/* Portal Title */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-md mb-1">
                <Sprout className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Agri<span className="text-emerald-600">Doc</span> Portal
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Sign in with mobile number or launch instant demo
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-600 px-0.5">
                <span>Select Operational Role</span>
                <span className="text-emerald-600 font-mono">1-CLICK</span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.FARMER)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    selectedRole === ROLES.FARMER
                      ? 'bg-white text-emerald-800 shadow-sm border border-emerald-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="text-sm">👨‍🌾</span>
                  <span>Farmer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.OPERATOR)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    selectedRole === ROLES.OPERATOR
                      ? 'bg-white text-cyan-800 shadow-sm border border-cyan-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="text-sm">🤖</span>
                  <span>Operator</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.ADMIN)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    selectedRole === ROLES.ADMIN
                      ? 'bg-white text-teal-800 shadow-sm border border-teal-300'
                      : 'text-slate-600 hover:text-slate-900'
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
                  <label className="text-xs font-bold text-slate-700">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full rounded-2xl bg-white border border-slate-300 py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm tracking-wide shadow-md hover:shadow-lg hover:from-emerald-500 hover:to-teal-500 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <span>Send Phone OTP</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Enter Verification OTP Code
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      required
                      className="w-full rounded-2xl bg-white border border-emerald-300 py-3.5 pl-11 pr-4 text-center font-mono text-xl font-black tracking-widest text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="px-4 py-3.5 rounded-2xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-md hover:scale-[1.01] transition-all"
                  >
                    Verify & Launch
                  </button>
                </div>
              </form>
            )}

            {/* Instant Demo Role Launcher Button */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] text-center font-bold text-slate-500">
                Instant 1-Click Access:
              </div>
              <button
                type="button"
                onClick={() => handleQuickDemo(selectedRole)}
                className="w-full py-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 group"
              >
                <Sparkles className="h-4 w-4 text-emerald-600 group-hover:rotate-12 transition-transform" />
                <span>Launch Interactive Demo as {selectedRole.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-200/80 bg-white/80 z-20 font-medium">
        <p>© 2026 AgriDoc Platform • Autonomous Precision Farming & AI Crop Diagnostics</p>
      </footer>
    </div>
  );
}
