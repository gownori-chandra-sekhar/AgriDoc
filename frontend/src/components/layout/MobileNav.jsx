import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bot, ScanLine, History, BarChart3 } from 'lucide-react';

export default function MobileNav() {
  const { t } = useTranslation();

  const navItems = [
    { to: '/', label: t('nav.dashboard'), icon: Bot },
    { to: '/scan', label: t('nav.scan'), icon: ScanLine },
    { to: '/history', label: t('nav.history'), icon: History },
    { to: '/analytics', label: t('nav.analytics'), icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-slate-800 bg-slate-900/95 backdrop-blur-lg px-2 py-2 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center py-1.5 text-[11px] font-medium transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Icon className="h-5 w-5 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
