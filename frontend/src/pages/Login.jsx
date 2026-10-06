import React, { useState, useEffect } from 'react';
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
  UserCheck
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

export default function Login({ onLoginSuccess }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, login } = useAuth();
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
      toast.info(`Verification code sent to ${phone}. (Use test code: 123456)`, 'OTP Sent');
    }, 400);
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
        name: selectedRole === ROLES.FARMER ? 'Farmer Ramesh' : selectedRole === ROLES.OPERATOR ? 'Rover Operator' : 'Chief Agronomist',
        phone,
        role: selectedRole,
        farmLocation: 'Guntur, Andhra Pradesh',
      };
      login(userObj);
      toast.success(t('login.loginSuccess') || 'Logged in successfully!');
      if (onLoginSuccess) onLoginSuccess(userObj);
      navigate('/');
    }, 400);
  };

  const handleQuickDemo = (roleChoice) => {
    const roleMap = {
      [ROLES.FARMER]: { name: 'Ramesh Patel (Farmer)', phone: '+91 98765 43210', role: ROLES.FARMER },
      [ROLES.OPERATOR]: { name: 'Vikram Singh (Operator)', phone: '+91 98765 43211', role: ROLES.OPERATOR },
      [ROLES.ADMIN]: { name: 'Dr. Ananya Rao (Agronomist)', phone: '+91 98765 43212', role: ROLES.ADMIN },
    };
    const userObj = roleMap[roleChoice] || roleMap[ROLES.FARMER];
    login(userObj);
    toast.success(`Logged in as ${userObj.name}`);
    if (onLoginSuccess) onLoginSuccess(userObj);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-agri-grid flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Aurora Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Language Switcher Top Bar */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-glow-md ring-4 ring-emerald-400/30">
            <Sprout className="h-9 w-9" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Agri<span className="text-emerald-400">Doc</span> Portal
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {t('login.subtitle') || 'Sign in with your registered phone number or launch instant demo'}
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8 space-y-5">
          {/* Role Selection Tabs */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Select Your Operational Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole(ROLES.FARMER)}
                className={`py-2 px-1 rounded-xl text-xs font-black transition-all border ${
                  selectedRole === ROLES.FARMER
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-glow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                👨‍🌾 Farmer
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole(ROLES.OPERATOR)}
                className={`py-2 px-1 rounded-xl text-xs font-black transition-all border ${
                  selectedRole === ROLES.OPERATOR
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-glow-cyan'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🤖 Operator
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole(ROLES.ADMIN)}
                className={`py-2 px-1 rounded-xl text-xs font-black transition-all border ${
                  selectedRole === ROLES.ADMIN
                    ? 'bg-teal-500/20 border-teal-400 text-white shadow-glow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🔬 Admin
              </button>
            </div>
          </div>

          {/* Form Content */}
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {t('login.phoneLabel') || 'Mobile Phone Number'}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full rounded-2xl bg-slate-950 border border-slate-700/80 py-3.5 pl-10 pr-4 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={ArrowRight}
                className="w-full"
              >
                {t('login.sendOtp') || 'Send Verification Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {t('login.enterOtp') || 'Enter 6-Digit OTP Code'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    required
                    className="w-full rounded-2xl bg-slate-950 border border-slate-700/80 py-3.5 pl-10 pr-4 text-center font-mono text-lg font-black tracking-widest text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setStep('phone')}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="flex-1"
                >
                  {t('login.verifyOtp') || 'Verify & Login'}
                </Button>
              </div>
            </form>
          )}

          {/* Quick Demo Instant Access */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <div className="text-[11px] text-center font-bold text-slate-400">
              Or test immediately without verification:
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemo(selectedRole)}
                icon={Sparkles}
                className="w-full"
              >
                Launch Demo as {selectedRole.toUpperCase()}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
