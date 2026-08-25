import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getReports } from '../services/api';
import ReportModal from '../components/reports/ReportModal';
import { History as HistoryIcon, Search, Filter, Volume2, VolumeX, Eye, Calendar, MapPin, Sparkles } from 'lucide-react';

export default function History() {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedDisease, setSelectedDisease] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportModal, setSelectedReportModal] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [selectedCrop, selectedDisease]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getReports(selectedCrop, selectedDisease);
      setReports(res.reports || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowVoicePlay = (rep) => {
    if (playingAudioId === rep.id) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(rep.id);
      if ('speechSynthesis' in window) {
        const text = `${rep.disease_name}. Crop: ${rep.crop}. Solution: ${rep.solution}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setPlayingAudioId(null);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const filteredReports = reports.filter((r) => {
    const query = searchQuery.toLowerCase();
    return (
      (r.disease_name || '').toLowerCase().includes(query) ||
      (r.crop || '').toLowerCase().includes(query) ||
      (r.cause || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-full overflow-x-hidden">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl flex items-center gap-2">
          <HistoryIcon className="h-7 w-7 text-emerald-400 shrink-0" />
          {t('history.title')}
        </h1>
        <p className="text-xs text-slate-400">
          Live historical database of plant scans, disease logs & voice advisories (Synced with Supabase)
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl border border-slate-800 p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('history.searchPlaceholder')}
            className="w-full rounded-xl bg-slate-950 border border-slate-700 py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Crop Filter Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Filter className="h-4 w-4 text-emerald-400 shrink-0" />
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="rounded-xl bg-slate-950 border border-slate-700 py-2 px-3 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="All">{t('history.allCrops')}</option>
            <option value="Paddy">Paddy / Rice</option>
            <option value="Tomato">Tomato</option>
            <option value="Wheat">Wheat</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Cotton">Cotton</option>
          </select>
        </div>
      </div>

      {/* Desktop Data Table (hidden on small mobile screens) */}
      <div className="hidden sm:block glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">{t('history.date')}</th>
                <th className="px-4 py-3.5">{t('history.crop')}</th>
                <th className="px-4 py-3.5">{t('history.disease')}</th>
                <th className="px-4 py-3.5">{t('history.urgency')}</th>
                <th className="px-4 py-3.5 text-right">{t('history.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                    Fetching live reports from Supabase...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                    No scan reports found.
                  </td>
                </tr>
              ) : (
                filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(rep.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {rep.crop}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={rep.image_url} alt="" className="h-8 w-8 rounded-lg object-cover border border-slate-700 shrink-0" />
                        <span className="font-bold text-emerald-400">{rep.disease_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        rep.urgency === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {rep.urgency}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRowVoicePlay(rep)}
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                            playingAudioId === rep.id ? 'bg-amber-600 text-white animate-pulse' : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                          }`}
                        >
                          {playingAudioId === rep.id ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                          <span>{t('history.playVoice')}</span>
                        </button>

                        <button
                          onClick={() => setSelectedReportModal(rep)}
                          className="flex items-center gap-1 rounded-lg bg-emerald-600/20 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>{t('history.viewReport')}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List View (auto-matches smartphones & mobile screens) */}
      <div className="block sm:hidden space-y-3">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-500">Fetching live reports from Supabase...</div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">No scan reports found.</div>
        ) : (
          filteredReports.map((rep) => (
            <div key={rep.id} className="glass-card rounded-xl border border-slate-800 p-3.5 space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <img src={rep.image_url} alt="" className="h-9 w-9 rounded-lg object-cover border border-slate-700 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400">{rep.disease_name}</h4>
                    <p className="text-[10px] text-slate-400">{rep.crop}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                  rep.urgency === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {rep.urgency}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-500" />
                  {new Date(rep.created_at || Date.now()).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-500" />
                  {rep.gps || '16.5062, 80.6480'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
                <button
                  onClick={() => handleRowVoicePlay(rep)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                    playingAudioId === rep.id ? 'bg-amber-600 text-white animate-pulse' : 'bg-slate-800 text-emerald-400'
                  }`}
                >
                  {playingAudioId === rep.id ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  <span>Voice</span>
                </button>

                <button
                  onClick={() => setSelectedReportModal(rep)}
                  className="flex items-center gap-1 rounded-lg bg-emerald-600/20 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-400"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detailed Report Modal */}
      {selectedReportModal && (
        <ReportModal
          report={selectedReportModal}
          onClose={() => setSelectedReportModal(null)}
        />
      )}
    </div>
  );
}
