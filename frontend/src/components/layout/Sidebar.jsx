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
  UserCheck
} from 'lucide-react';

export default function Sidebar() {
  const { t } = useTranslation();
  const { role, sessionId } = useAuth();

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
          { to: '/analytics', label: 'Outbreak Analytics', icon: BarChart3, badge: 'CHARTS' },
          { to: '/history', label: 'Reports Database', icon: History, badge: 'CSV' },
          { to: '/hardware-scan', label: 'Hardware Telemetry', icon: Cpu },
          { to: '/settings', label: 'System Settings', icon: SettingsIcon },
        ];
      default: // FARMER
        return [
          { to: '/', label: 'Farmer Dashboard', icon: Bot, badge: 'HUB' },
          { to: '/scan', label: 'AI Leaf Health Scan', icon: ScanLine, badge: 'YOLOv8' },
          { to: '/history', label: 'My Scan Records', icon: History },
          { to: '/home', label: 'Platform Overview', icon: Sparkles },
          { to: '/settings', label: 'Dialect & Profile', icon: SettingsIcon },
        ];
    }
  };

  const navItems = getNavItems();

  const getTargetUrl = (path) => {
    if (path === '/home') return '/home';
    return sessionId ? `${path}${path.includes('?') ? '&' : '?'}session=${sessionId}` : path;
  };

  return (
    <aside className="hidden md:flex w-64 flex-col glass-panel border-r border-slate-200/80 bg-white/95 p-4 min-h-[calc(100vh-65px)] shadow-sm">
      {/* Role Indicator Banner */}
      <div className="mb-4 px-3 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-emerald-600" />
          <span className="text-[11px] font-black uppercase text-emerald-900 tracking-wider">
            {role === ROLES.OPERATOR ? 'Operator Mode' : role === ROLES.ADMIN ? 'Agronomist Mode' : 'Farmer Mode'}
          </span>
        </div>
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const targetUrl = getTargetUrl(item.to);
          return (
            <NavLink
              key={item.to}
              to={targetUrl}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-2xl px-4 py-3 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm ring-1 ring-emerald-500'
                    : 'text-slate-600 hover:bg-emerald-50/80 hover:text-emerald-800'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Role Switcher Shortcut */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <NavLink
          to={getTargetUrl('/settings')}
          className="block rounded-2xl bg-slate-50 border border-slate-200 p-3 hover:bg-emerald-50 hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Switch Role</span>
            <ChevronRight className="h-3.5 w-3.5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Test as Farmer, Operator, or Admin</p>
        </NavLink>
      </div>
    </aside>
  );
}
