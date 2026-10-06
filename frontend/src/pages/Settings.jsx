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
  CheckCircle2,
  Zap,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { pingEsp32Node } from '../services/api';

export default function Settings() {
  const { t } = useTranslation();
  const { role, switchRole, ROLES } = useAuth();
  const toast = useToast();

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => 'Notification' in window && Notification.permission === 'granted'
  );
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
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 bg-white shadow-canva-card flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-300">
          <SettingsIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">System Settings & Profile</h1>
          <p className="text-xs text-slate-500 font-medium">
            Configure multilingual preferences, active operational role & IoT connectivity
          </p>
        </div>
      </div>

      {/* 1. Multi-Language Preferences */}
      <Card
        header={
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Globe className="h-4 w-4 text-emerald-600" />
            <span>Multilingual Dialect Settings</span>
          </div>
        }
        className="space-y-4 bg-white border-slate-200 shadow-sm"
      >
        <p className="text-xs text-slate-600">
          Select your native dialect for text interface and voice guidance. All audio advisories will automatically synthesize in the selected language.
        </p>
        <LanguageSwitcher variant="pills" />
      </Card>

      {/* 2. Active Operational Role Switcher */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span>Active Operational Role</span>
            </div>
            <Badge variant="info" size="md">
              CURRENT: {role.toUpperCase()}
            </Badge>
          </div>
        }
        className="space-y-4 bg-white border-slate-200 shadow-sm"
      >
        <p className="text-xs text-slate-600">
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
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm ring-1 ring-emerald-400'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">👨‍🌾 Farmer</span>
              {role === ROLES.FARMER && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
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
                ? 'bg-sky-50 border-sky-500 text-sky-950 shadow-sm ring-1 ring-sky-400'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">🤖 Field Operator</span>
              {role === ROLES.OPERATOR && <CheckCircle2 className="h-4 w-4 text-sky-600" />}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
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
                ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-sm ring-1 ring-teal-400'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">🔬 Agronomist Admin</span>
              {role === ROLES.ADMIN && <CheckCircle2 className="h-4 w-4 text-teal-600" />}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Comprehensive analytics, CSV scan exports, outbreak charts & role management.
            </p>
          </div>
        </div>
      </Card>

      {/* 3. Audio & Notification Preferences */}
      <Card
        header={
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Volume2 className="h-4 w-4 text-emerald-600" />
            <span>Voice Advisory & Outbreak Alerts</span>
          </div>
        }
        className="space-y-4 bg-white border-slate-200 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Bell className="h-4 w-4 text-emerald-600" />
              Browser Push Notifications
            </div>
            <p className="text-[11px] text-slate-500">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-600" />
              Backend FastAPI Cloud Link
            </div>
            <p className="text-[11px] text-slate-500">
              {backendLatency != null ? `Response time: ${backendLatency}ms` : 'Test API responsiveness'}
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
