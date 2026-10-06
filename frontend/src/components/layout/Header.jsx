import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Sparkles,
  Settings as SettingsIcon,
} from 'lucide-react';
import LanguageSwitcher from '../common/LanguageSwitcher';
import Badge from '../common/Badge';
import Esp32WifiScannerModal from '../dashboard/Esp32WifiScannerModal';

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
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
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 bg-white/95 px-4 py-3 sm:px-6 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 shadow-glow-sm group-hover:scale-105 transition-transform">
              <Sprout className="h-6 w-6 text-white" />
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  Agri<span className="text-emerald-600">Doc</span>
                </h1>
                <Badge variant={getRoleBadgeVariant()} size="sm">
                  {role?.toUpperCase()}
                </Badge>
              </div>
              <p className="hidden text-[11px] text-slate-500 sm:block font-medium">
                {t('header.tagline') || 'AI Precision Agriculture & Robot Telemetry'}
              </p>
            </div>
          </div>

          {/* Center Hardware Telemetry Ribbon */}
          <div className="hidden items-center gap-3 rounded-2xl bg-slate-50 px-4 py-2 border border-slate-200 shadow-inner md:flex">
            {isConnected ? (
              <>
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs text-slate-500 font-bold">{t('header.robotStatus') || 'Robot'}:</span>
                  <span className="inline-flex items-center rounded-lg border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800 animate-pulse">
                    <Activity className="mr-1 h-3 w-3 text-emerald-600" />
                    {telemetry?.status || 'Online'}
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-mono font-bold">
                  <Battery className="h-4 w-4 text-emerald-600" />
                  <span>{telemetry?.battery_pct != null ? `${telemetry.battery_pct}%` : '85%'}</span>
                </div>
              </>
            ) : (
              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
              >
                <WifiOff className="h-4 w-4 text-rose-500 animate-pulse" />
                <span>ESP32 Disconnected (Scan WiFi)</span>
              </button>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Home Quick Link */}
            <button
              onClick={() => navigate('/home')}
              className="hidden lg:flex items-center gap-1.5 rounded-xl bg-white border border-emerald-300 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-all shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Home Page</span>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Settings Link */}
            <button
              onClick={() => navigate('/settings')}
              title="Settings & Role Config"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-all shadow-sm"
            >
              <SettingsIcon className="h-4 w-4" />
            </button>

            {/* User Profile & Logout */}
            {user && (
              <button
                onClick={logout}
                title="Logout"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all shadow-sm"
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
