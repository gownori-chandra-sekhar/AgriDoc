import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RobotMap from '../components/dashboard/RobotMap';
import RobotStats from '../components/dashboard/RobotStats';
import { getRobotStatus, sendRobotCommand, getReports, toggleRobotConnection } from '../services/api';
import { AlertTriangle, Volume2, VolumeX, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [robotStatus, setRobotStatus] = useState(null);
  const [reports, setReports] = useState([]);
  const [latestReport, setLatestReport] = useState(null);
  const [isPlayingAlert, setIsPlayingAlert] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const status = await getRobotStatus();
      setRobotStatus(status);

      // Fetch live reports from Supabase DB
      const res = await getReports();
      const liveList = res.reports || [];
      setReports(liveList);
      if (liveList.length > 0) {
        setLatestReport(liveList[0]);
      } else {
        setLatestReport(null);
      }
    } catch (err) {
      console.error('Error fetching live telemetry:', err);
    }
  };

  const handleToggleConnect = async () => {
    try {
      const isConnected = robotStatus?.connected || false;
      const res = await toggleRobotConnection(!isConnected);
      setRobotStatus(res.current_state);
    } catch (err) {
      console.error('Error toggling robot connection:', err);
    }
  };

  const handleControlCommand = async (cmd) => {
    try {
      const res = await sendRobotCommand(cmd);
      setRobotStatus(res.current_state);
    } catch (err) {
      console.error('Error sending command:', err);
    }
  };

  const handlePlayLatestAlertVoice = () => {
    if (!latestReport) return;
    setIsPlayingAlert(!isPlayingAlert);

    if ('speechSynthesis' in window) {
      if (isPlayingAlert) {
        window.speechSynthesis.cancel();
      } else {
        const text = `Live Disease Alert: ${latestReport.disease_name}. Crop: ${latestReport.crop}. Urgency: ${latestReport.urgency}. Recommended action: ${latestReport.solution}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsPlayingAlert(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const activeAlertsCount = reports.filter((r) => (r.urgency || '').toLowerCase() === 'high').length;

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            {t('nav.dashboard')}
          </h1>
          <p className="text-xs text-slate-400">
            Real-time AgriRobot field telemetry, GPS location & live disease alerts synced with Supabase
          </p>
        </div>

        <button
          onClick={() => navigate('/scan')}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-green-400 transition-all"
        >
          <span>Scan Plant Now</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Top Telemetry & Control Stats */}
      <RobotStats
        robotStatus={robotStatus}
        liveReportsCount={reports.length}
        activeAlertsCount={activeAlertsCount}
        onControlCommand={handleControlCommand}
        onToggleConnect={handleToggleConnect}
      />

      {/* Main Grid: Interactive Map + Live Latest Disease Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Robot Map */}
        <div className="lg:col-span-8">
          <RobotMap robotStatus={robotStatus} />
        </div>

        {/* Right: Live Outbreak Alert Card (Synced with Supabase) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`h-5 w-5 ${activeAlertsCount > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
                <h3 className="text-sm font-bold text-white">Latest Live Outbreak Alert</h3>
              </div>
              {latestReport && (
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  latestReport.urgency === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {latestReport.urgency || 'Live'}
                </span>
              )}
            </div>

            {latestReport ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Detected Issue:</span>
                    <span className="font-bold text-emerald-400">{latestReport.disease_name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Crop Type:</span>
                    <span className="font-semibold text-slate-200">{latestReport.crop}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">GPS Coordinates:</span>
                    <span className="font-semibold text-slate-200">{latestReport.gps || '16.5062, 80.6480'}</span>
                  </div>
                </div>

                {/* Alert Audio Trigger */}
                <div className="pt-2">
                  <button
                    onClick={handlePlayLatestAlertVoice}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all shadow ${
                      isPlayingAlert
                        ? 'bg-amber-600 text-white ring-2 ring-amber-400 animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                    }`}
                  >
                    {isPlayingAlert ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    <span>{isPlayingAlert ? 'Playing Voice...' : 'Play Voice Advisory'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-500/60" />
                <p className="text-xs font-bold text-slate-300">No active disease alerts in database.</p>
                <p className="text-[11px] text-slate-500">Scan a crop leaf to log live records in Supabase.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
