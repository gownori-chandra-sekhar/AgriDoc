import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useTelemetry } from '../../hooks/useTelemetry';
import {
  Sprout,
  Bot,
  Battery,
  LogOut,
  Activity,
  WifiOff,
  Cpu,
  Sparkles,
  Settings as SettingsIcon,
  UserCheck
} from 'lucide-react';
import LanguageSwitcher from '../common/LanguageSwitcher';
import Badge from '../common/Badge';
import Esp32WifiScannerModal from '../dashboard/Esp32WifiScannerModal';

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, switchRole, logout } = useAuth();
  const { telemetry, isConnected, toggleConnection } = useTelemetry(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const getRoleBadgeVariant = () => {
    switch (role) {
      case ROLES.OPERATOR:
        return 'info';
      case ROLES.ADMIN:
        return 'default';
      default:
        return 'success';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/90 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 shadow-glow-sm ring-2 ring-emerald-400/30 group-hover:scale-105 transition-transform">
              <Sprout className="h-6 w-6 text-white" />
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                  Agri<span className="text-emerald-400 text-glow-emerald">Doc</span>
                </h1>
                <Badge variant={getRoleBadgeVariant()} size="sm">
                  {role?.toUpperCase()}
                </Badge>
              </div>
              <p className="hidden text-[11px] text-slate-400 sm:block">
                {t('header.tagline') || 'AI Precision Agriculture & Robot Telemetry'}
              </p>
            </div>
          </div>

          {/* Center Hardware Telemetry Ribbon (Visible on md+) */}
          <div className="hidden items-center gap-3 rounded-2xl bg-slate-900/90 px-4 py-2 border border-slate-800 shadow-sm md:flex">
            {isConnected ? (
              <>
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-slate-400 font-bold">{t('header.robotStatus') || 'Robot'}:</span>
                  <span className="inline-flex items-center rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 text-xs font-black text-emerald-300 animate-pulse">
                    <Activity className="mr-1 h-3 w-3" />
                    {telemetry?.status || 'Online'}
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-800" />
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                  <Battery className="h-4 w-4 text-emerald-400" />
                  <span>{telemetry?.battery_pct != null ? `${telemetry.battery_pct}%` : '85%'}</span>
                </div>
              </>
            ) : (
              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-2 text-xs font-black text-rose-400 hover:text-rose-300 transition-colors"
              >
                <WifiOff className="h-4 w-4 text-rose-400 animate-pulse" />
                <span>ESP32 Disconnected (Scan WiFi)</span>
              </button>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Showcase Quick Link */}
            <button
              onClick={() => navigate('/showcase')}
              className="hidden lg:flex items-center gap-1.5 rounded-xl bg-slate-900 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 hover:text-white transition-all shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Showcase</span>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Settings Link */}
            <button
              onClick={() => navigate('/settings')}
              title="Settings & Role Config"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500/50 transition-all shadow-sm"
            >
              <SettingsIcon className="h-4 w-4" />
            </button>

            {/* User Profile & Logout */}
            {user && (
              <button
                onClick={logout}
                title="Logout"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-slate-700 text-slate-400 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-400 transition-all shadow-sm"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Global WiFi Discovery Modal */}
      <Esp32WifiScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSelectNode={async (node) => {
          await toggleConnection(true, node.deviceId, node.ipAddress);
          setIsScannerOpen(false);
        }}
        isConnected={isConnected}
        connectedDeviceId={telemetry?.robot_id}
      />
    </>
  );
}
