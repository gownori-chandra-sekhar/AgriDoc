import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from '../hooks/useHistory';
import { useScan } from '../hooks/useScan';
import {
  History as HistoryIcon,
  Filter,
  Volume2,
  Eye,
  MapPin,
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

  const { playVoiceAdvice } = useScan();
  const [selectedReport, setSelectedReport] = useState(null);

  const columns = [
    {
      header: 'Date & Time',
      field: 'scanned_at',
      sortable: true,
      render: (row) => (
        <div className="space-y-0.5">
          <div className="font-mono text-slate-900 font-bold">
            {row.scanned_at ? new Date(row.scanned_at).toLocaleDateString() : 'Today'}
          </div>
          <div className="text-[10px] text-slate-500">
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
        <span className="font-bold text-slate-900">{row.crop_type || 'Field Crop'}</span>
      ),
    },
    {
      header: 'Detected Issue',
      field: 'disease_name',
      sortable: true,
      render: (row) => (
        <div className="space-y-0.5">
          <div className="font-bold text-emerald-800">{row.disease_name || 'Healthy Leaf'}</div>
          {row.confidence && (
            <div className="text-[10px] text-slate-500 font-mono">
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
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 bg-white shadow-canva-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-300">
            <HistoryIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t('history.title') || 'Scan History & Outbreak Logs'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
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
      <Card className="p-4 border-slate-200 bg-white shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700">
          <Filter className="h-3.5 w-3.5 text-emerald-600" />
          <span>Advanced Diagnostic Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-600 mb-1 block">Crop Specimen</label>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              {uniqueCrops.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-600 mb-1 block">Pathogen / Issue</label>
            <select
              value={diseaseFilter}
              onChange={(e) => setDiseaseFilter(e.target.value)}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              {uniqueDiseases.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-600 mb-1 block">Severity Level</label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
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
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={selectedReport.image_url}
                  alt={selectedReport.disease_name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase text-emerald-800">Treatment Plan</h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {selectedReport.treatment_advice || 'Apply standard organic preventative sprays.'}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-medium">
              <span className="flex items-center gap-1 font-mono">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
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
