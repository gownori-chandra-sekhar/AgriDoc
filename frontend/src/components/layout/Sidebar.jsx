import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bot, ScanLine, History, BarChart3, Radio } from 'lucide-react';

export default function Sidebar() {
  const { t } = useTranslation();

  const navItems = [
    { to: '/', label: t('nav.dashboard'), icon: Bot },
    { to: '/scan', label: t('nav.scan'), icon: ScanLine },
    { to: '/history', label: t('nav.history'), icon: History },
    { to: '/analytics', label: t('nav.analytics'), icon: BarChart3 },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col glass-panel border-r border-slate-800 p-4 min-h-[calc(100vh-65px)]">
      <div className="mb-6 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Navigation</p>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Live System Status Card in Sidebar */}
      <div className="mt-auto rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-emerald-300">ESP32 Telemetry Link</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Connected to AgriRobot hardware module over IoT Gateway.
        </p>
      </div>
    </aside>
  );
}
