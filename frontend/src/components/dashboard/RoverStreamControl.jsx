import React, { useState, useEffect, useCallback } from 'react';
import {
  Camera,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Octagon,
  Zap,
  ShieldAlert,
  Radio,
  Wifi,
  Sparkles,
  Play,
  RotateCcw,
  Maximize2,
  Crosshair,
  Activity
} from 'lucide-react';

export default function RoverStreamControl({ telemetry, onSendControl, onCaptureSnapshot, isConnected }) {
  const [activeKey, setActiveKey] = useState(null);
  const [speedPreset, setSpeedPreset] = useState('STANDARD');
  const [isCapturing, setIsCapturing] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [streamUrl, setStreamUrl] = useState('/api/rover/stream');

  const currentStatus = telemetry?.status || 'Idle';
  const lastCmd = telemetry?.last_command || 'STOP';
  const heading = telemetry?.heading_deg || 0;

  // Handle directional command execution
  const handleControl = useCallback(
    async (cmd) => {
      if (!isConnected) return;
      try {
        await onSendControl(cmd, speedPreset);
      } catch (err) {
        console.error('Control error:', err);
      }
    },
    [isConnected, onSendControl, speedPreset]
  );

  // Keyboard shortcut listener for manual rover teleoperation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isConnected) return;

      // Avoid capturing hotkeys when typing in inputs/textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      const key = e.key.toLowerCase();
      let cmd = null;

      if (key === 'w' || key === 'arrowup' || key === 'f') {
        cmd = 'FORWARD';
      } else if (key === 's' || key === 'arrowdown' || key === 'b') {
        cmd = 'BACKWARD';
      } else if (key === 'a' || key === 'arrowleft' || key === 'l') {
        cmd = 'LEFT';
      } else if (key === 'd' || key === 'arrowright' || key === 'r') {
        cmd = 'RIGHT';
      } else if (key === ' ' || key === 'escape' || key === 'x') {
        cmd = 'STOP';
        e.preventDefault();
      }

      if (cmd) {
        setActiveKey(cmd);
        handleControl(cmd);
      }
    };

    const handleKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isConnected, handleControl]);

  // Snapshot capture handler
  const handleTriggerSnapshot = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    try {
      await onCaptureSnapshot();
    } catch (err) {
      console.error('Snapshot error:', err);
    } finally {
      setTimeout(() => setIsCapturing(false), 800);
    }
  };

  const refreshStream = () => {
    setStreamError(false);
    setStreamUrl(`/api/rover/stream?t=${Date.now()}`);
  };

  return (
    <div className="space-y-5">
      {/* ESP32-CAM Video Stream Panel */}
      <div className="glass-card relative overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-950 shadow-2xl group">
        {/* Stream Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/90 bg-slate-900/80 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </div>
            <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
              ESP32-CAM HUD LIVE STREAM
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-slate-950 px-2.5 py-1 text-[10px] font-mono font-bold text-cyan-400 border border-slate-800">
              640x480 • 30 FPS • H.264
            </span>
            <button
              onClick={refreshStream}
              title="Refresh Camera Feed"
              className="rounded-xl bg-slate-800/80 p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Camera Viewport Container */}
        <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {!streamError ? (
            <img
              src={streamUrl}
              alt="ESP32-CAM Live Feed"
              onError={() => setStreamError(true)}
              className="h-full w-full object-cover transition-opacity duration-300"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
              <img 
                src="/hero-banner.jpg" 
                alt="AgriRover HUD Simulation" 
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-3 p-6 text-center">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-glow-sm">
                  <Camera className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">ESP32-CAM Video Stream Standby</p>
                  <p className="text-[11px] text-slate-400">Simulation feed ready for live AI disease detection & frame sampling</p>
                </div>
                <button
                  onClick={refreshStream}
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-xs font-black text-white hover:from-emerald-500 hover:to-teal-400 transition-all shadow-glow-sm"
                >
                  Reconnect Live Feed
                </button>
              </div>
            </div>
          )}

          {/* Holographic HUD Overlay Graphics */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40">
            {/* Top HUD Badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-xl bg-slate-950/80 px-3 py-1.5 text-xs font-black text-slate-200 border border-emerald-500/30 backdrop-blur-md shadow-glow-sm">
                <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span>STATE: <strong className="text-emerald-400 uppercase">{currentStatus}</strong></span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-slate-950/80 px-3 py-1.5 text-xs font-black text-slate-200 border border-cyan-500/30 backdrop-blur-md shadow-glow-cyan">
                <Compass className="h-3.5 w-3.5 text-cyan-400" />
                <span>HEADING: <strong className="text-cyan-400 font-mono">{heading}°</strong></span>
              </div>
            </div>

            {/* Crosshair Center Reticle */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="relative h-20 w-20 opacity-70">
                <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-emerald-400 to-transparent" />
                <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/60 shadow-glow-sm animate-pulse" />
              </div>
            </div>

            {/* Bottom HUD Bar & Manual AI Snapshot Trigger */}
            <div className="flex items-end justify-between">
              <div className="rounded-xl bg-slate-950/80 px-3 py-1.5 text-[11px] font-mono text-slate-300 border border-slate-800 backdrop-blur-md">
                LAST COMMAND: <span className="text-amber-400 font-black">{lastCmd}</span>
              </div>

              <button
                onClick={handleTriggerSnapshot}
                disabled={isCapturing}
                className={`pointer-events-auto flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black text-slate-950 transition-all shadow-xl ${
                  isCapturing
                    ? 'bg-amber-400 ring-4 ring-amber-400/40 animate-pulse'
                    : 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:scale-105 active:scale-95 shadow-glow-md'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>{isCapturing ? 'Analyzing Leaf Frame...' : 'AI Snap & Detect'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Directional Rover Controls & Speed Presets */}
      <div className="glass-card rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
          <div>
            <h3 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              Manual Rover Control HUD
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Control rover via touch pad or keyboard hotkeys (<kbd className="rounded bg-slate-800 px-1 py-0.5 text-emerald-400 font-bold">W</kbd>, <kbd className="rounded bg-slate-800 px-1 py-0.5 text-emerald-400 font-bold">A</kbd>, <kbd className="rounded bg-slate-800 px-1 py-0.5 text-emerald-400 font-bold">S</kbd>, <kbd className="rounded bg-slate-800 px-1 py-0.5 text-emerald-400 font-bold">D</kbd>, <kbd className="rounded bg-slate-800 px-1 py-0.5 text-emerald-400 font-bold">SPACE</kbd>)
            </p>
          </div>

          {/* Speed Preset Selector */}
          <div className="flex items-center rounded-2xl bg-slate-950 p-1 border border-slate-800 shadow-inner self-start sm:self-auto">
            {['ECO', 'STANDARD', 'TURBO'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSpeedPreset(mode)}
                className={`rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                  speedPreset === mode
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-glow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Directional Pad Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Column 1: Directional Cross Buttons */}
          <div className="flex flex-col items-center justify-center space-y-2.5 py-2">
            {/* FORWARD */}
            <button
              onClick={() => handleControl('FORWARD')}
              disabled={!isConnected}
              className={`flex h-14 w-24 items-center justify-center rounded-2xl border font-bold shadow-lg transition-all active:scale-95 ${
                activeKey === 'FORWARD' || lastCmd === 'FORWARD'
                  ? 'border-emerald-400 bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/40 shadow-glow-md'
                  : 'border-slate-700 bg-slate-900/90 text-slate-200 hover:bg-slate-850 hover:border-emerald-500/50'
              } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col items-center">
                <ArrowUp className="h-6 w-6 text-emerald-400" />
                <span className="text-[10px] font-black tracking-widest text-slate-300">FWD (W)</span>
              </div>
            </button>

            {/* LEFT / STOP / RIGHT */}
            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => handleControl('LEFT')}
                disabled={!isConnected}
                className={`flex h-14 w-24 items-center justify-center rounded-2xl border font-bold shadow-lg transition-all active:scale-95 ${
                  activeKey === 'LEFT' || lastCmd === 'LEFT'
                    ? 'border-emerald-400 bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/40 shadow-glow-md'
                    : 'border-slate-700 bg-slate-900/90 text-slate-200 hover:bg-slate-850 hover:border-emerald-500/50'
              } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col items-center">
                <ArrowLeft className="h-6 w-6 text-emerald-400" />
                <span className="text-[10px] font-black tracking-widest text-slate-300">LEFT (A)</span>
              </div>
            </button>

            {/* EMERGENCY STOP BUTTON */}
            <button
              onClick={() => handleControl('STOP')}
              disabled={!isConnected}
              className={`flex h-14 w-24 items-center justify-center rounded-2xl border font-bold shadow-lg transition-all active:scale-95 ${
                activeKey === 'STOP' || lastCmd === 'STOP'
                  ? 'border-rose-400 bg-rose-600 text-white ring-4 ring-rose-500/40 shadow-glow-rose'
                  : 'border-rose-500/40 bg-rose-950/30 text-rose-300 hover:bg-rose-900/50'
              } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col items-center">
                <Octagon className="h-5 w-5 text-rose-400 fill-rose-500/20" />
                <span className="text-[10px] font-black tracking-widest text-rose-300">STOP</span>
              </div>
            </button>

            <button
              onClick={() => handleControl('RIGHT')}
              disabled={!isConnected}
              className={`flex h-14 w-24 items-center justify-center rounded-2xl border font-bold shadow-lg transition-all active:scale-95 ${
                activeKey === 'RIGHT' || lastCmd === 'RIGHT'
                  ? 'border-emerald-400 bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/40 shadow-glow-md'
                  : 'border-slate-700 bg-slate-900/90 text-slate-200 hover:bg-slate-850 hover:border-emerald-500/50'
              } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col items-center">
                <ArrowRight className="h-6 w-6 text-emerald-400" />
                <span className="text-[10px] font-black tracking-widest text-slate-300">RIGHT (D)</span>
              </div>
            </button>
          </div>

          {/* BACKWARD */}
          <button
            onClick={() => handleControl('BACKWARD')}
            disabled={!isConnected}
            className={`flex h-14 w-24 items-center justify-center rounded-2xl border font-bold shadow-lg transition-all active:scale-95 ${
              activeKey === 'BACKWARD' || lastCmd === 'BACKWARD'
                ? 'border-emerald-400 bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/40 shadow-glow-md'
                : 'border-slate-700 bg-slate-900/90 text-slate-200 hover:bg-slate-850 hover:border-emerald-500/50'
            } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <div className="flex flex-col items-center">
              <ArrowDown className="h-6 w-6 text-emerald-400" />
              <span className="text-[10px] font-black tracking-widest text-slate-300">REV (S)</span>
            </div>
          </button>
        </div>

        {/* Column 2: Quick Patrol Commands */}
        <div className="space-y-3 pt-2">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Autonomous Operational Modes
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => handleControl('START_SCAN')}
              disabled={!isConnected}
              className={`flex items-center justify-between rounded-2xl p-3.5 text-xs font-black border transition-all ${
                currentStatus === 'Scanning'
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-glow-sm'
                  : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900 hover:border-emerald-500/40'
              } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <span className="flex items-center gap-2">
                <Play className="h-4 w-4 text-emerald-400" />
                <span>Auto AI Patrol</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">2.4 km/h</span>
            </button>

            <button
              onClick={() => handleControl('START_CUTTING')}
              disabled={!isConnected}
              className={`flex items-center justify-between rounded-2xl p-3.5 text-xs font-black border transition-all ${
                currentStatus === 'Cutting'
                  ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-lg'
                  : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900 hover:border-amber-500/40'
              } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <span className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-400" />
                <span>Weed Arm Active</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded">1.2 km/h</span>
            </button>

            <button
              onClick={() => handleControl('RETURN_DOCK')}
              disabled={!isConnected}
              className="flex items-center justify-between rounded-2xl p-3.5 text-xs font-black border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900 hover:border-cyan-500/40 transition-all"
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-cyan-400" />
                <span>Return to Station</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded">Dock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
