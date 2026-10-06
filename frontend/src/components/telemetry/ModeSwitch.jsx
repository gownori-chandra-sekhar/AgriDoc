import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Scissors, Pause, Home, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import ConfirmationModal from '../common/ConfirmationModal';
import Button from '../common/Button';

export default function ModeSwitch({ currentStatus = 'Idle', isConnected = false, onModeChange, disabled = false }) {
  const { t } = useTranslation();
  const [pendingMode, setPendingMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const MODES = [
    {
      id: 'START_SCAN',
      label: t('robot.statusScanning') || 'AI Crop Scan',
      sublabel: 'Autonomous Visual Inspection',
      icon: Play,
      statusMatch: 'Scanning',
      color: 'emerald',
      confirmMsg: 'Are you sure you want to start autonomous AI crop scanning? The rover will follow GPS waypoints at 2.4 km/h.',
    },
    {
      id: 'START_CUTTING',
      label: t('robot.statusCutting') || 'Weed Cutting',
      sublabel: 'Active Blade Engagement',
      icon: Scissors,
      statusMatch: 'Cutting',
      color: 'amber',
      confirmMsg: 'CAUTION: Activating weed cutting blades. Ensure no personnel or obstacles are within 3 meters of the rover.',
      variant: 'warning',
    },
    {
      id: 'PAUSE',
      label: t('robot.pause') || 'Pause Rover',
      sublabel: 'Hold Current Coordinates',
      icon: Pause,
      statusMatch: 'Paused',
      color: 'slate',
      confirmMsg: 'Pause rover navigation and halt tool attachments?',
    },
    {
      id: 'RETURN_DOCK',
      label: t('robot.returnDock') || 'Return to Dock',
      sublabel: 'Auto-Docking Station',
      icon: Home,
      statusMatch: 'Docked',
      color: 'cyan',
      confirmMsg: 'Command rover to navigate back to the solar charging station?',
    },
  ];

  const handleSelectMode = (modeObj) => {
    if (!isConnected) return;
    setPendingMode(modeObj);
    setIsModalOpen(true);
  };

  const handleConfirmMode = async () => {
    if (!pendingMode) return;
    setIsExecuting(true);
    try {
      await onModeChange(pendingMode.id);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Mode switch error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
          Autonomous Mission Control Switch
        </h3>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          CURRENT STATE: {currentStatus.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentStatus.toLowerCase() === mode.statusMatch.toLowerCase();

          return (
            <button
              key={mode.id}
              onClick={() => handleSelectMode(mode)}
              disabled={!isConnected || disabled}
              className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                !isConnected
                  ? 'opacity-40 cursor-not-allowed bg-slate-950 border-slate-800 text-slate-500'
                  : isActive
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-500 text-white border-emerald-400 shadow-glow-sm ring-2 ring-emerald-400/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-850 hover:border-emerald-500/40 hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-emerald-400'}`}>
                  <Icon className="h-4 w-4" />
                </div>
                {isActive && <CheckCircle2 className="h-4 w-4 text-white" />}
              </div>
              <div className="text-xs font-black">{mode.label}</div>
              <div className="text-[10px] opacity-75 mt-0.5">{mode.sublabel}</div>
            </button>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {pendingMode && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmMode}
          title={`Confirm: ${pendingMode.label}`}
          message={pendingMode.confirmMsg}
          confirmText={`Activate ${pendingMode.label}`}
          variant={pendingMode.variant || 'warning'}
          loading={isExecuting}
        />
      )}
    </div>
  );
}
