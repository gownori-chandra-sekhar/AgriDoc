import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wifi,
  Radio,
  RotateCcw,
  CheckCircle2,
  X,
  Cpu,
  Globe,
  ArrowRight,
  ShieldCheck,
  Signal,
  Check
} from 'lucide-react';
import { scanEsp32Nodes } from '../../services/api';

export default function Esp32WifiScannerModal({ isOpen, onClose, onSelectNode, isConnected, connectedDeviceId }) {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [nodes, setNodes] = useState([]);
  const [manualIp, setManualIp] = useState('localhost:8088');
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' or 'manual'

  useEffect(() => {
    if (isOpen) {
      startNetworkScan();
    }
  }, [isOpen]);

  const startNetworkScan = async () => {
    setIsScanning(true);
    setProgress(15);

    const timer1 = setTimeout(() => setProgress(45), 400);
    const timer2 = setTimeout(() => setProgress(80), 800);

    try {
      const res = await scanEsp32Nodes();
      const discovered = res.nodes || [];

      setTimeout(() => {
        setProgress(100);
        setNodes(discovered);
        setIsScanning(false);
      }, 1200);
    } catch (err) {
      console.error('Error scanning ESP32 nodes:', err);
      setIsScanning(false);
      setProgress(100);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  const handleConnectNode = async (node) => {
    await onSelectNode({
      deviceId: node.device_id,
      ipAddress: node.ip_address,
      ssid: node.ssid
    });
    onClose();
    // Redirect to hardware scanning & pin diagnostics page as requested
    navigate('/hardware-scan');
  };

  const handleManualConnect = async (e) => {
    e.preventDefault();
    if (!manualIp.trim()) return;

    await onSelectNode({
      deviceId: 'AGRI-ROVER-CUSTOM-IP',
      ipAddress: manualIp.trim(),
      ssid: 'Custom-WLAN'
    });
    onClose();
    // Redirect to hardware scanning & pin diagnostics page as requested
    navigate('/hardware-scan');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <Cpu className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 tracking-wide">
                  ESP32 Hardware Discovery
                </h3>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800 border border-emerald-300 uppercase tracking-wider">
                  ESP32 Only
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Filtered strictly for ESP32-S3, ESP32-CAM & Espressif hardware nodes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition-all ${
                activeTab === 'scan'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              <span>ESP32 WiFi Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition-all ${
                activeTab === 'manual'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Direct ESP32 IP / AP</span>
            </button>
          </div>

          <button
            onClick={startNetworkScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all disabled:opacity-50"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Scan ESP32</span>
          </button>
        </div>

        {/* Scan Progress Bar & Radar Overlay */}
        {activeTab === 'scan' && (
          <div className="space-y-4">
            {isScanning ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col items-center justify-center space-y-3 text-center">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-300 animate-ping" />
                  <div className="absolute inset-2 rounded-full border-2 border-emerald-400 animate-pulse" />
                  <Cpu className="h-8 w-8 text-emerald-600 animate-bounce" />
                </div>

                <div>
                  <p className="text-xs font-extrabold text-slate-900">Scanning 2.4GHz Spectrum for ESP32 Nodes...</p>
                  <p className="text-[11px] text-slate-500 font-mono font-medium">Filtering by Espressif MAC OUIs & ESP32 SSID Signatures</p>
                </div>

                <div className="w-full max-w-xs h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {nodes && nodes.length > 0 ? (
                  nodes.map((node) => {
                    const isCurrent = isConnected && connectedDeviceId === node.device_id;

                    return (
                      <div
                        key={node.device_id}
                        className={`rounded-2xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isCurrent
                            ? 'border-emerald-400 bg-emerald-50/70 shadow-sm'
                            : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100/90'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-emerald-600 font-mono text-xs font-bold">
                            <Cpu className="h-5 w-5" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-black text-slate-900">{node.device_id}</h4>
                              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-800 border border-emerald-300">
                                SSID: {node.ssid}
                              </span>
                              {node.chipset && (
                                <span className="rounded-md bg-cyan-100 px-1.5 py-0.5 text-[9px] font-bold text-cyan-800 border border-cyan-300">
                                  {node.chipset}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-600 font-medium">{node.role}</p>

                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono flex-wrap">
                              <span>IP: <strong className="text-slate-800">{node.ip_address}</strong></span>
                              <span>•</span>
                              <span>MAC: {node.mac_address}</span>
                              <span>•</span>
                              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                                <Signal className="h-3 w-3" /> {node.rssi_dbm} dBm ({node.signal_quality})
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleConnectNode(node)}
                          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1.5 ${
                            isCurrent
                              ? 'bg-emerald-700 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          <span>{isCurrent ? 'Scan Pins' : 'Connect & Scan Pins'}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                    <p className="font-bold text-slate-800">No ESP32 Hardware Nodes Found</p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Non-ESP32 WiFi routers are filtered out. Ensure your ESP32-S3 / ESP32-CAM is powered and in AP/WiFi mode.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Manual Static IP / Access Point Tab */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualConnect} className="space-y-4 pt-1">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <label className="block text-xs font-black uppercase text-slate-700">
                Target Rover IP / Host & Port
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={manualIp}
                  onChange={(e) => setManualIp(e.target.value)}
                  placeholder="e.g. localhost:8088 or 192.168.4.1"
                  className="flex-1 rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-xs text-slate-900 font-mono placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-md"
                >
                  <span>Connect & Scan</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[11px] text-slate-500">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => setManualIp('localhost:8088')}
                  className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100"
                >
                  ⚡ localhost:8088 (Rover Live Web)
                </button>
                <button
                  type="button"
                  onClick={() => setManualIp('192.168.4.1')}
                  className="rounded-lg bg-slate-200/80 border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-300"
                >
                  192.168.4.1 (ESP32 AP)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
