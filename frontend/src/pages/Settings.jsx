import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Settings as SettingsIcon,
  Globe,
  UserCheck,
  Bell,
  Volume2,
  Server,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { pingEsp32Node } from '../services/api';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { user, role, switchRole, ROLES } = useAuth();
  const toast = useToast();

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => 'Notification' in window && Notification.permission === 'granted'
  );
  const [speechRate, setSpeechRate] = useState(1.0);
  const [isPingingBackend, setIsPingingBackend] = useState(false);
  const [backendLatency, setBackendLatency] = useState(null);

  const handleToggleNotifications = async () => {
    if (!('Notification' in window)) {
      toast.error('Browser push notifications not supported on this device.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast.success('Disease outbreak push notifications enabled!');
      } else {
        setNotificationsEnabled(false);
        toast.warning('Notifications permission denied in browser settings.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const testBackendPing = async () => {
    setIsPingingBackend(true);
    const start = performance.now();
    try {
      await pingEsp32Node();
      const duration = Math.round(performance.now() - start);
      setBackendLatency(duration);
      toast.success(`FastAPI Backend Active (${duration}ms latency)`, 'Server Health');
    } catch (e) {
      const duration = Math.round(performance.now() - start);
      setBackendLatency(duration);
      toast.info(`Backend responded in ${duration}ms (Mock mode fallback available)`);
    } finally {
      setIsPingingBackend(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto overflow-x-hidden">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800/90 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-glow-sm">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">System Settings & Profile</h1>
            <p className="text-xs text-slate-400">
              Configure multilingual preferences, active operational role & IoT connectivity
            </p>
          </div>
        </div>
      </div>

      {/* 1. Multi-Language Preferences */}
      <Card
        header={
          <div className="flex items-center gap-2 text-white font-bold">
            <Globe className="h-4 w-4 text-emerald-400" />
            <span>Multilingual Dialect Settings</span>
          </div>
        }
        className="space-y-4"
      >
        <p className="text-xs text-slate-400">
          Select your native dialect for text interface and voice guidance. All audio advisories will automatically synthesize in the selected language.
        </p>
        <LanguageSwitcher variant="pills" />
      </Card>

      {/* 2. Active Operational Role Switcher */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-white font-bold">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span>Active Operational Role</span>
            </div>
            <Badge variant="info" size="md">
              CURRENT: {role.toUpperCase()}
            </Badge>
          </div>
        }
        className="space-y-4"
      >
        <p className="text-xs text-slate-400">
          AgriDoc dynamically customizes navigation, permissions, and toolbars based on your role. Switch between roles instantly for testing:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => {
              switchRole(ROLES.FARMER);
              toast.success('Switched to Farmer View');
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
              role === ROLES.FARMER
                ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-glow-sm ring-1 ring-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black">👨‍🌾 Farmer</span>
              {role === ROLES.FARMER && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Hero leaf scanner, voice guidance, simplified disease remedies & health summary.
            </p>
          </div>

          <div
            onClick={() => {
              switchRole(ROLES.OPERATOR);
              toast.success('Switched to Field Operator View');
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
              role === ROLES.OPERATOR
                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-glow-cyan ring-1 ring-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black">🤖 Field Operator</span>
              {role === ROLES.OPERATOR && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Robot teleoperation panel, Leaflet GPS trajectory, ESP32 camera & mission switcher.
            </p>
          </div>

          <div
            onClick={() => {
              switchRole(ROLES.ADMIN);
              toast.success('Switched to Agronomist / Admin View');
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
              role === ROLES.ADMIN
                ? 'bg-teal-500/20 border-teal-400 text-white shadow-glow-sm ring-1 ring-teal-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black">🔬 Agronomist Admin</span>
              {role === ROLES.ADMIN && <CheckCircle2 className="h-4 w-4 text-teal-400" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Comprehensive analytics, CSV scan exports, outbreak charts & role management.
            </p>
          </div>
        </div>
      </Card>

      {/* 3. Audio & Notification Preferences */}
      <Card
        header={
          <div className="flex items-center gap-2 text-white font-bold">
            <Volume2 className="h-4 w-4 text-emerald-400" />
            <span>Voice Advisory & Outbreak Alerts</span>
          </div>
        }
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="space-y-0.5">
            <div className="text-xs font-black text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-emerald-400" />
              Browser Push Notifications
            </div>
            <p className="text-[11px] text-slate-400">
              Receive instant alerts when robot identifies critical crop infections.
            </p>
          </div>
          <Button
            variant={notificationsEnabled ? 'outline' : 'primary'}
            size="sm"
            onClick={handleToggleNotifications}
          >
            {notificationsEnabled ? 'Notifications Active' : 'Enable Push Alerts'}
          </Button>
        </div>

        {/* Backend Latency Test */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="space-y-0.5">
            <div className="text-xs font-black text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-400" />
              Backend FastAPI Cloud Link
            </div>
            <p className="text-[11px] text-slate-400">
              {backendLatency != null ? `Response time: ${backendLatency}ms` : 'Test API responsiveness (wakes up free sleeping Render instances)'}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={testBackendPing}
            loading={isPingingBackend}
            icon={Zap}
          >
            Ping Server
          </Button>
        </div>
      </Card>
    </div>
  );
}
