import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import { useTelemetry } from '../hooks/useTelemetry';
import { useScan } from '../hooks/useScan';
import { useHistory } from '../hooks/useHistory';
import {
  Sprout,
  Bot,
  ScanLine,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  History as HistoryIcon,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ImageUploader from '../components/scanner/ImageUploader';
import DiagnosisCard from '../components/scanner/DiagnosisCard';
import TelemetryPanel from '../components/telemetry/TelemetryPanel';
import ModeSwitch from '../components/telemetry/ModeSwitch';
import FieldMap from '../components/map/FieldMap';
import RoverStreamControl from '../components/dashboard/RoverStreamControl';
import DiseaseBarChart from '../components/analytics/DiseaseBarChart';
import HealthPieChart from '../components/analytics/HealthPieChart';
import Esp32WifiScannerModal from '../components/dashboard/Esp32WifiScannerModal';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const {
    telemetry,
    alerts,
    isConnected,
    lastUpdated,
    toggleConnection,
    sendCommand,
    triggerSnapshot,
  } = useTelemetry(true, 1500);

  const {
    scan,
    isScanning,
    uploadProgress,
    scanResult,
    isPlayingAudio,
    playVoiceAdvice,
    stopVoiceAdvice,
  } = useScan();

  const { reports } = useHistory();

  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [operatorViewMode, setOperatorViewMode] = useState('hud');

  const handleGrabEsp32Frame = async () => {
    try {
      await triggerSnapshot();
      navigate('/scan');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectEspNode = async (node) => {
    await toggleConnection(true, node.deviceId, node.ipAddress);
  };

  /* =========================================================================
     1. FARMER ROLE VIEW (CANVA LIGHT THEME)
     ========================================================================= */
  if (role === ROLES.FARMER) {
    return (
      <div className="space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto overflow-x-hidden">
        {/* Welcome Hero Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-200 bg-gradient-to-r from-white via-emerald-50/60 to-teal-50/60 relative overflow-hidden shadow-canva-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">FARMER COMMAND</Badge>
                <span className="text-xs text-slate-500 font-bold">Field Sector A-4</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Namaste, <span className="text-emerald-600">{user?.name || 'Farmer'}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Photograph your crop leaf for instantaneous YOLOv8 disease diagnosis and step-by-step voice guidance in your native language.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  const uploadZone = document.getElementById('farmer-scan-section');
                  uploadZone?.scrollIntoView({ behavior: 'smooth' });
                }}
                icon={ScanLine}
              >
                Scan Crop Leaf
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/history')}
                icon={HistoryIcon}
              >
                View Logs ({reports.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Scan Leaf Action */}
        <div id="farmer-scan-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScanLine className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Instant Leaf Disease Diagnosis
              </h2>
            </div>
            <span className="text-xs text-emerald-700 font-bold hidden sm:inline">
              10+ Major Crop Pathogen Models Active
            </span>
          </div>

          <ImageUploader
            onScan={scan}
            isScanning={isScanning}
            uploadProgress={uploadProgress}
            onGrabEsp32Frame={handleGrabEsp32Frame}
          />

          {/* Diagnosis Result Card with Audio Guidance */}
          {scanResult && (
            <div className="animate-scale-up">
              <DiagnosisCard
                result={scanResult}
                isPlayingAudio={isPlayingAudio}
                onPlayVoice={playVoiceAdvice}
                onStopVoice={stopVoiceAdvice}
              />
            </div>
          )}
        </div>

        {/* Field Health & Recent Outbreak Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-slate-200 bg-white space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Total Field Scans</span>
              <ScanLine className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{reports.length}</div>
            <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Synced with Supabase Cloud
            </p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Active Crop Alerts</span>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-600">{alerts.length}</div>
            <p className="text-[11px] text-slate-500 font-medium">
              {alerts.length > 0 ? 'Review latest outbreak reports' : 'All field sectors healthy'}
            </p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Robot Field Status</span>
              <Bot className="h-4 w-4 text-cyan-600" />
            </div>
            <div className="text-xl font-black text-slate-900">{isConnected ? 'Online & Cruising' : 'Docked at Station'}</div>
            <p className="text-[11px] text-slate-500 font-medium">
              {isConnected ? `${telemetry?.battery_pct || 85}% Battery • ${telemetry?.speed_kmh || 2.4} km/h` : 'Ready for mission deployment'}
            </p>
          </Card>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. FIELD OPERATOR ROLE VIEW (CANVA LIGHT THEME)
     ========================================================================= */
  if (role === ROLES.OPERATOR) {
    return (
      <div className="space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto overflow-x-hidden">
        {/* Operator Command Header */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 bg-white shadow-canva-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">AgriRover Teleoperation HUD</h1>
              <Badge variant="info" size="sm">OPERATOR</Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Low-latency ESP32-CAM stream, directional teleoperation, GPS waypoints & sensor diagnostics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-2xl bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setOperatorViewMode('hud')}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  operatorViewMode === 'hud'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                HUD Stream
              </button>
              <button
                onClick={() => setOperatorViewMode('map')}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  operatorViewMode === 'map'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Field Map
              </button>
            </div>
          </div>
        </div>

        {/* Live Robot Telemetry Gauges Bar */}
        <TelemetryPanel
          telemetry={telemetry}
          isConnected={isConnected}
          lastUpdated={lastUpdated}
          onToggleConnect={() => toggleConnection(!isConnected)}
          onOpenScanner={() => setIsScannerModalOpen(true)}
        />

        {/* Autonomous Mission Mode Switcher */}
        <Card className="p-5 border-slate-200 bg-white shadow-sm">
          <ModeSwitch
            currentStatus={telemetry?.status || 'Idle'}
            isConnected={isConnected}
            onModeChange={(cmd) => sendCommand(cmd, 'STANDARD')}
          />
        </Card>

        {/* Main View: Camera HUD vs GPS Field Map */}
        {operatorViewMode === 'hud' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <RoverStreamControl
                telemetry={telemetry}
                onSendControl={sendCommand}
                onCaptureSnapshot={triggerSnapshot}
                isConnected={isConnected}
              />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <FieldMap telemetry={telemetry} isConnected={isConnected} />
            </div>
          </div>
        ) : (
          <FieldMap telemetry={telemetry} isConnected={isConnected} />
        )}

        {/* ESP32 Hardware WiFi Discovery Scanner Modal */}
        <Esp32WifiScannerModal
          isOpen={isScannerModalOpen}
          onClose={() => setIsScannerModalOpen(false)}
          onSelectNode={handleSelectEspNode}
          isConnected={isConnected}
          connectedDeviceId={telemetry?.robot_id}
        />
      </div>
    );
  }

  /* =========================================================================
     3. ADMIN / AGRONOMIST ROLE VIEW (CANVA LIGHT THEME)
     ========================================================================= */
  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto overflow-x-hidden">
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 bg-white shadow-canva-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Agronomist Intelligence Center</h1>
            <Badge variant="default" size="sm">ADMIN</Badge>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Geospatial outbreak trends, pathogen analytics, telemetry diagnostics & exportable field logs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/analytics')}
            icon={BarChart3}
          >
            Detailed Analytics
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/history')}
            icon={HistoryIcon}
          >
            Reports Database
          </Button>
        </div>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 border-slate-200 bg-white space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              Top Pathogens Detected
            </h3>
            <span className="text-xs text-slate-500 font-bold">This Season</span>
          </div>
          <div className="h-64 w-full">
            <DiseaseBarChart />
          </div>
        </Card>

        <Card className="p-5 border-slate-200 bg-white space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Sprout className="h-4 w-4 text-teal-600" />
              Field Health Breakdown
            </h3>
            <span className="text-xs text-emerald-700 font-bold">82% Optimal</span>
          </div>
          <div className="h-64 w-full">
            <HealthPieChart />
          </div>
        </Card>
      </div>

      {/* Field Map Overview */}
      <FieldMap telemetry={telemetry} isConnected={isConnected} />
    </div>
  );
}
