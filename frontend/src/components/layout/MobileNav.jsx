import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, ROLES } from '../../context/AuthContext';
import {
  Bot,
  ScanLine,
  History,
  BarChart3,
  Cpu,
  Settings as SettingsIcon
} from 'lucide-react';

export default function MobileNav() {
  const { t } = useTranslation();
  const { role } = useAuth();

  const getNavItems = () => {
    switch (role) {
      case ROLES.OPERATOR:
        return [
          { to: '/', label: 'Rover', icon: Bot },
          { to: '/hardware-scan', label: 'ESP32', icon: Cpu },
          { to: '/scan', label: 'Scanner', icon: ScanLine },
          { to: '/history', label: 'Logs', icon: History },
          { to: '/settings', label: 'Settings', icon: SettingsIcon },
        ];
      case ROLES.ADMIN:
        return [
          { to: '/', label: 'Overview', icon: Bot },
          { to: '/analytics', label: 'Analytics', icon: BarChart3 },
          { to: '/history', label: 'Reports', icon: History },
          { to: '/hardware-scan', label: 'Hardware', icon: Cpu },
          { to: '/settings', label: 'Settings', icon: SettingsIcon },
        ];
      default: // FARMER
        return [
          { to: '/', label: 'Dashboard', icon: Bot },
          { to: '/scan', label: 'Scan Leaf', icon: ScanLine },
          { to: '/history', label: 'History', icon: History },
          { to: '/settings', label: 'Settings', icon: SettingsIcon },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden items-center justify-around glass-panel border-t border-slate-200/90 bg-white/95 py-2 px-2 shadow-xl safe-area-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[48px] min-h-[48px] rounded-2xl px-2 py-1 transition-all ${
                isActive
                  ? 'text-emerald-700 bg-emerald-100/80 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
