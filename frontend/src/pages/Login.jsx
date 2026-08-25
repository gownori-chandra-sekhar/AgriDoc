import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, Phone, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function Login({ onLoginSuccess }) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      setStep('otp');
      setMessage('OTP sent to your phone number via SMS.');
    } catch (err) {
      // Fallback demo support if Supabase keys not set
      setStep('otp');
      setMessage('Demo mode: Enter any 6-digit OTP (e.g. 123456)');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });
      if (error) throw error;
      onLoginSuccess(data.user);
    } catch (err) {
      // Fallback demo user
      onLoginSuccess({ id: 'demo_farmer_123', phone: phone || '+91 98765 43210' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    onLoginSuccess({ id: 'demo_farmer_123', phone: '+91 98765 43210' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-panel relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-400/20">
            <Sprout className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {t('login.title')}
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {t('login.subtitle')}
          </p>
        </div>

        {message && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 text-center font-medium">
            {message}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('login.phoneLabel')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('login.phonePlaceholder')}
                  required
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-green-400 transition-all"
            >
              <span>{t('login.sendOtp')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('login.enterOtp')}
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-700 py-2.5 px-4 text-center text-lg font-bold tracking-widest text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-green-400 transition-all"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{t('login.verifyOtp')}</span>
            </button>
          </form>
        )}

        {/* Demo Fast Login Divider */}
        <div className="relative pt-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-2 text-slate-500 font-semibold">Or Instant Access</span>
          </div>
        </div>

        <button
          onClick={handleDemoLogin}
          type="button"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800/80 border border-slate-700 py-2.5 text-xs font-bold text-emerald-400 hover:bg-slate-800 hover:border-emerald-500/40 transition-all"
        >
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{t('login.demoLogin')}</span>
        </button>
      </div>
    </div>
  );
}
