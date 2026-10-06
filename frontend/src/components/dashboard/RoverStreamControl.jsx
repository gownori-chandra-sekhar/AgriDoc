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
  Sparkles,
  Play,
  RotateCcw,
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isConnected) return;
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
      <div className="glass-card relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-canva-card group">
        {/* Stream Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600" />
            </div>
            <span className="text-xs font-black tracking-widest text-emerald-800 uppercase">
              ESP32-CAM HUD LIVE STREAM
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-mono font-bold text-slate-700 border border-slate-200 shadow-sm">
              640x480 • 30 FPS • H.264
            </span>
            <button
              onClick={refreshStream}
              title="Refresh Camera Feed"
              className="rounded-xl bg-white border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Camera Viewport */}
        <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden">
          {!streamError ? (
            <img
              src={streamUrl}
              alt="ESP32-CAM Live Feed"
              onError={() => setStreamError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
              <img 
                src="/login-hero.jpg" 
                alt="AgriRover HUD Simulation" 
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-3 p-6 text-center text-white">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                  <Camera className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">ESP32-CAM Stream Standby</p>
                  <p className="text-[11px] text-slate-300">Live AI disease detection & frame sampling ready</p>
                </div>
                <button
                  onClick={refreshStream}
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-black text-white hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md"
                >
                  Reconnect Live Feed
                </button>
              </div>
            </div>
          )}

          {/* HUD Overlay */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-black text-slate-800 border border-emerald-200 backdrop-blur-md shadow-md">
                <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                <span>STATE: <strong className="text-emerald-700 uppercase">{currentStatus}</strong></span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-black text-slate-800 border border-sky-200 backdrop-blur-md shadow-md">
                <Compass className="h-3.5 w-3.5 text-sky-600" />
                <span>HEADING: <strong className="text-sky-700 font-mono">{heading}°</strong></span>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div className="rounded-xl bg-white/90 px-3 py-1.5 text-[11px] font-mono text-slate-800 border border-slate-200 backdrop-blur-md shadow-md font-bold">
                LAST COMMAND: <span className="text-amber-700 font-black">{lastCmd}</span>
              </div>

              <button
                onClick={handleTriggerSnapshot}
                disabled={isCapturing}
                className={`pointer-events-auto flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black text-slate-950 transition-all shadow-md ${
                  isCapturing
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-emerald-400 hover:bg-emerald-300'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>{isCapturing ? 'Analyzing Leaf...' : 'AI Snap & Detect'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Controls Pad */}
      <div className="glass-card rounded-3xl border border-slate-200 bg-white p-5 shadow-canva-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-wide uppercase flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-600" />
              Manual Rover Control HUD
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Control rover via touch buttons or keyboard (<kbd className="rounded bg-slate-100 px-1 py-0.5 text-slate-800 font-bold border border-slate-300">W</kbd>, <kbd className="rounded bg-slate-100 px-1 py-0.5 text-slate-800 font-bold border border-slate-300">A</kbd>, <kbd className="rounded bg-slate-100 px-1 py-0.5 text-slate-800 font-bold border border-slate-300">S</kbd>, <kbd className="rounded bg-slate-100 px-1 py-0.5 text-slate-800 font-bold border border-slate-300">D</kbd>, <kbd className="rounded bg-slate-100 px-1 py-0.5 text-slate-800 font-bold border border-slate-300">SPACE</kbd>)
            </p>
          </div>

          <div className="flex items-center rounded-2xl bg-slate-100 p-1 border border-slate-200 self-start sm:self-auto">
            {['ECO', 'STANDARD', 'TURBO'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSpeedPreset(mode)}
                className={`rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                  speedPreset === mode
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Directional Pad */}
          <div className="flex flex-col items-center justify-center space-y-2.5 py-2">
            <button
              onClick={() => handleControl('FORWARD')}
              disabled={!isConnected}
              className={`flex h-14 w-24 items-center justify-center rounded-2xl border font-bold shadow-sm transition-all active:scale-95 ${
                activeKey === 'FORWARD' || lastCmd === 'FORWARD'
                  ? 'border-emerald-500 bg-emerald-600 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300'
              } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col items-center">
                <ArrowUp className="h-6 w-6 text-emerald-600" />
                <span className="text-[10px] font-black tracking-widest text-slate-600">FWD (W)</span>
              </div>
            </button>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => handleControl('LEFT')}
                disabled={!isConnected}
                className={`flex h-14 w-24 items-center justify-center rounded-2xl border font-bold shadow-sm transition-all active:scale-95 ${
                  activeKey === 'LEFT' || lastCmd === 'LEFT'
                    ? 'border-emerald-500 bg-emerald-600 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300'
                } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <ArrowLeft className="h-6 w-6 text-emerald-600" />
                  <span className="text-[10px] font-black tracking-widest text-slate-600">LEFT (A)</span>
                </div>
              </button>

              <button
                onClick={() => handleControl('STOP')}
                disabled={!isConnected}
                className={`flex h-14 w-24 items-center justify-center rounded-2xl border font-bold shadow-sm transition-all active:scale-95 ${
                  activeKey === 'STOP' || lastCmd === 'STOP'
                    ? 'border-rose-500 bg-rose-600 text-white'
                    : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <Octagon className="h-5 w-5 text-rose-600" />
                  <span className="text-[10px] font-black tracking-widest text-rose-700">STOP</span>
                </div>
              </button>

              <button
                onClick={() => handleControl('RIGHT')}
                disabled={!isConnected}
                className={`flex h-14 w-24 items-center justify-center rounded-2xl border font-bold shadow-sm transition-all active:scale-95 ${
                  activeKey === 'RIGHT' || lastCmd === 'RIGHT'
                    ? 'border-emerald-500 bg-emerald-600 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300'
                } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <ArrowRight className="h-6 w-6 text-emerald-600" />
                  <span className="text-[10px] font-black tracking-widest text-slate-600">RIGHT (D)</span>
                </div>
              </button>
            </div>

            <button
              onClick={() => handleControl('BACKWARD')}
              disabled={!isConnected}
              className={`flex h-14 w-24 items-center justify-center rounded-2xl border font-bold shadow-sm transition-all active:scale-95 ${
                activeKey === 'BACKWARD' || lastCmd === 'BACKWARD'
                  ? 'border-emerald-500 bg-emerald-600 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300'
              } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col items-center">
                <ArrowDown className="h-6 w-6 text-emerald-600" />
                <span className="text-[10px] font-black tracking-widest text-slate-600">REV (S)</span>
              </div>
            </button>
          </div>

          {/* Autonomous Operational Modes */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Autonomous Operational Modes
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => handleControl('START_SCAN')}
                disabled={!isConnected}
                className={`flex items-center justify-between rounded-2xl p-3.5 text-xs font-bold border transition-all ${
                  currentStatus === 'Scanning'
                    ? 'border-emerald-400 bg-emerald-100 text-emerald-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300'
                } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-emerald-600" />
                  <span>Auto AI Patrol</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-mono bg-emerald-100 px-2 py-0.5 rounded">2.4 km/h</span>
              </button>

              <button
                onClick={() => handleControl('START_CUTTING')}
                disabled={!isConnected}
                className={`flex items-center justify-between rounded-2xl p-3.5 text-xs font-bold border transition-all ${
                  currentStatus === 'Cutting'
                    ? 'border-amber-400 bg-amber-100 text-amber-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-amber-50 hover:border-amber-300'
                } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  <span>Weed Arm Active</span>
                </span>
                <span className="text-[10px] text-amber-700 font-mono bg-amber-100 px-2 py-0.5 rounded">1.2 km/h</span>
              </button>

              <button
                onClick={() => handleControl('RETURN_DOCK')}
                disabled={!isConnected}
                className="flex items-center justify-between rounded-2xl p-3.5 text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-sky-600" />
                  <span>Return to Station</span>
                </span>
                <span className="text-[10px] text-sky-700 font-mono bg-sky-100 px-2 py-0.5 rounded">Dock</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
