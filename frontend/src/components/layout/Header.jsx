import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, Battery, Globe, Bot, ShieldCheck, LogOut, Activity, WifiOff } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'te', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'mr', label: 'మరాఠీ (Marathi)', flag: '🇮🇳' },
];

export default function Header({ robotStatus, user, onLogout }) {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const isConnected = robotStatus?.connected || false;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Cutting':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse';
      case 'Scanning':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse';
      case 'Idle':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30">
            <Sprout className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                Agri<span className="text-emerald-400">Doc</span>
              </h1>
              <span className="hidden rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20 sm:inline-block">
                Dashboard v1.0
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">
              {t('header.tagline')}
            </p>
          </div>
        </div>

        {/* Live Robot Telemetry Bar */}
        <div className="hidden items-center gap-3 rounded-xl bg-slate-900/80 px-3.5 py-1.5 border border-slate-800 md:flex">
          {isConnected ? (
            <>
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-400">{t('header.robotStatus')}:</span>
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${getStatusBadge(robotStatus.status)}`}>
                  <Activity className="mr-1 h-3 w-3" />
                  {robotStatus.status === 'Cutting' ? t('robot.statusCutting') : robotStatus.status === 'Scanning' ? t('robot.statusScanning') : t('robot.statusIdle')}
                </span>
              </div>
              <div className="h-4 w-px bg-slate-800" />
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Battery className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-white">{robotStatus.battery_pct}%</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
              <WifiOff className="h-4 w-4 text-rose-400" />
              <span>Robot Hardware Disconnected</span>
            </div>
          )}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Multi-Language Dropdown */}
          <div className="relative flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 text-slate-200 hover:border-emerald-500/50 transition-colors">
            <Globe className="h-4 w-4 text-emerald-400 shrink-0" />
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer pr-2"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* User Profile Badge */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200">{user.phone || 'Farmer Demo'}</span>
                <span className="text-[10px] text-emerald-400">{t('header.demoMode')}</span>
              </div>
              <button
                onClick={onLogout}
                title={t('nav.logout')}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>{t('header.demoMode')}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
