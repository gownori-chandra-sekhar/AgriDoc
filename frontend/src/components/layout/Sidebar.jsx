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
  Sparkles,
  Settings as SettingsIcon,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import Badge from '../common/Badge';

export default function Sidebar() {
  const { t } = useTranslation();
  const { role, switchRole } = useAuth();

  // Role-Specific Navigation Menu Items
  const getNavItems = () => {
    switch (role) {
      case ROLES.OPERATOR:
        return [
          { to: '/', label: 'Rover Teleoperation', icon: Bot, badge: 'LIVE' },
          { to: '/hardware-scan', label: 'ESP32 Pin Diagnostics', icon: Cpu, badge: 'GPIO' },
          { to: '/scan', label: 'ESP32 Frame Scanner', icon: ScanLine },
          { to: '/history', label: 'Operation Logs', icon: History },
          { to: '/settings', label: 'Settings & Modes', icon: SettingsIcon },
        ];
      case ROLES.ADMIN:
        return [
          { to: '/', label: 'Command Overview', icon: Bot },
          { to: '/analytics', label: 'Outbreak Analytics', icon: BarChart3, badge: 'RECHARTS' },
          { to: '/history', label: 'Reports Database', icon: History, badge: 'CSV' },
          { to: '/hardware-scan', label: 'Hardware Telemetry', icon: Cpu },
          { to: '/settings', label: 'System Settings', icon: SettingsIcon },
        ];
      default: // FARMER
        return [
          { to: '/', label: 'Farmer Dashboard', icon: Bot, badge: 'HUB' },
          { to: '/scan', label: 'AI Leaf Health Scan', icon: ScanLine, badge: 'YOLOv8' },
          { to: '/history', label: 'My Scan Records', icon: History },
          { to: '/showcase', label: 'Canva Showcase', icon: Sparkles },
          { to: '/settings', label: 'Dialect & Profile', icon: SettingsIcon },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="hidden md:flex w-64 flex-col glass-panel border-r border-slate-800/90 p-4 min-h-[calc(100vh-65px)]">
      {/* Role Indicator Banner */}
      <div className="mb-4 px-3 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-[11px] font-black uppercase text-white tracking-wider">
            {role === ROLES.OPERATOR ? 'Operator Mode' : role === ROLES.ADMIN ? 'Agronomist Mode' : 'Farmer Mode'}
          </span>
        </div>
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-2xl px-4 py-3 text-xs font-black transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 text-white shadow-glow-sm ring-1 ring-emerald-400/40'
                    : 'text-slate-300 hover:bg-slate-850 hover:text-white border border-transparent hover:border-slate-800'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-black/20 text-emerald-300 border border-white/10">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Role Switcher Shortcut */}
      <div className="mt-auto pt-4 border-t border-slate-800/80">
        <NavLink
          to="/settings"
          className="block rounded-2xl bg-slate-900/80 border border-slate-800 p-3 hover:border-emerald-500/50 transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Switch Role</span>
            <ChevronRight className="h-3.5 w-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Test as Farmer, Operator, or Admin</p>
        </NavLink>
      </div>
    </aside>
  );
}
