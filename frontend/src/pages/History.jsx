import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from '../hooks/useHistory';
import { useScan } from '../hooks/useScan';
import {
  History as HistoryIcon,
  Filter,
  Volume2,
  FileSpreadsheet,
  Eye,
  Calendar,
  Sparkles,
  MapPin,
  Leaf,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { TableSkeleton } from '../components/common/Skeleton';

export default function History() {
  const { t } = useTranslation();
  const {
    filteredReports,
    isLoading,
    cropFilter,
    setCropFilter,
    diseaseFilter,
    setDiseaseFilter,
    urgencyFilter,
    setUrgencyFilter,
    uniqueCrops,
    uniqueDiseases,
    refreshReports,
  } = useHistory();

  const { playVoiceAdvice, isPlayingAudio, stopVoiceAdvice } = useScan();
  const [selectedReport, setSelectedReport] = useState(null);

  const columns = [
    {
      header: 'Date & Time',
      field: 'scanned_at',
      sortable: true,
      render: (row) => (
        <div className="space-y-0.5">
          <div className="font-mono text-white font-bold">
            {row.scanned_at ? new Date(row.scanned_at).toLocaleDateString() : 'Today'}
          </div>
          <div className="text-[10px] text-slate-400">
            {row.scanned_at ? new Date(row.scanned_at).toLocaleTimeString() : '12:00 PM'}
          </div>
        </div>
      ),
    },
    {
      header: 'Crop',
      field: 'crop_type',
      sortable: true,
      render: (row) => (
        <span className="font-extrabold text-white">{row.crop_type || 'Field Crop'}</span>
      ),
    },
    {
      header: 'Detected Issue',
      field: 'disease_name',
      sortable: true,
      render: (row) => (
        <div className="space-y-0.5">
          <div className="font-black text-emerald-300">{row.disease_name || 'Healthy Leaf'}</div>
          {row.confidence && (
            <div className="text-[10px] text-slate-400 font-mono">
              {Math.round(row.confidence * 100)}% Confidence
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Urgency',
      field: 'urgency',
      sortable: true,
      render: (row) => {
        const u = (row.urgency || 'Low').toLowerCase();
        return (
          <Badge variant={u === 'high' ? 'high' : u === 'medium' ? 'medium' : 'low'} size="sm">
            {row.urgency || 'LOW'}
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedReport(row);
            }}
            icon={Eye}
          >
            Details
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              playVoiceAdvice(
                `${row.disease_name}. ${row.treatment_advice || 'Maintain optimal field irrigation.'}`,
                row.audio_url
              );
            }}
            icon={Volume2}
          >
            Audio
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto overflow-x-hidden">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-glow-sm">
            <HistoryIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {t('history.title') || 'Scan History & Outbreak Logs'}
            </h1>
            <p className="text-xs text-slate-400">
              Synchronized agricultural diagnostic archive stored securely in Supabase Cloud
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={refreshReports}
            loading={isLoading}
            icon={RefreshCw}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 border-slate-800 bg-slate-900/90 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-300">
          <Filter className="h-3.5 w-3.5 text-emerald-400" />
          <span>Advanced Diagnostic Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Crop Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 mb-1 block">Crop Specimen</label>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
            >
              {uniqueCrops.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Disease Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 mb-1 block">Pathogen / Issue</label>
            <select
              value={diseaseFilter}
              onChange={(e) => setDiseaseFilter(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
            >
              {uniqueDiseases.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 mb-1 block">Severity Level</label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Urgency Levels</option>
              <option value="High">High Urgency</option>
              <option value="Medium">Medium Urgency</option>
              <option value="Low">Low Urgency</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main DataTable */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : (
        <DataTable
          columns={columns}
          data={filteredReports}
          keyField="id"
          searchPlaceholder="Search by crop, disease, or treatment..."
          pageSize={8}
          exportFilename="agridoc_scan_history"
          emptyMessage="No diagnostic records matched your filter criteria."
          onRowClick={(row) => setSelectedReport(row)}
        />
      )}

      {/* Detailed Report Modal */}
      {selectedReport && (
        <Modal
          isOpen={Boolean(selectedReport)}
          onClose={() => setSelectedReport(null)}
          title={`Detailed Report: ${selectedReport.disease_name}`}
          subtitle={`${selectedReport.crop_type} • Scanned ${new Date(selectedReport.scanned_at || Date.now()).toLocaleString()}`}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  playVoiceAdvice(
                    `${selectedReport.disease_name}. ${selectedReport.treatment_advice}`,
                    selectedReport.audio_url
                  )
                }
                icon={Volume2}
              >
                Listen Voice Advice
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedReport(null)}
              >
                Close Details
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {selectedReport.image_url && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={selectedReport.image_url}
                  alt={selectedReport.disease_name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
              <h4 className="text-xs font-black uppercase text-emerald-400">Treatment Plan</h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedReport.treatment_advice || 'Apply standard organic preventative sprays.'}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="flex items-center gap-1 font-mono">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                GPS: {selectedReport.gps_location || '16.5062, 80.6480'}
              </span>
              <Badge variant={selectedReport.urgency === 'High' ? 'high' : 'low'}>
                {selectedReport.urgency || 'NORMAL'}
              </Badge>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
