import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { BarChart2, Inbox, Sparkles } from 'lucide-react';

const COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#f59e0b', '#f43f5e'];

const DEFAULT_DEMO_DATA = [
  { disease: 'Early Blight', count: 14 },
  { disease: 'Paddy Blast', count: 10 },
  { disease: 'Leaf Mold', count: 8 },
  { disease: 'Rust', count: 5 },
  { disease: 'Brown Spot', count: 3 }
];

export default function DiseaseBarChart({ data }) {
  const { t } = useTranslation();
  const chartData = (data && data.length > 0) ? data : DEFAULT_DEMO_DATA;

  return (
    <div className="glass-card rounded-3xl border border-slate-800/90 p-5 sm:p-6 shadow-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-glow-sm">
            <BarChart2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">{t('analytics.topDiseases') || 'Top Detected Pathogens'}</h3>
            <p className="text-[11px] text-slate-400">YOLOv8 disease classification distribution</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
          TOP 5 PATHOGENS
        </span>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="disease" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#0b1120', 
                borderColor: 'rgba(16, 185, 129, 0.4)', 
                borderRadius: '1rem', 
                color: '#fff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 0 15px -3px rgba(16, 185, 129, 0.3)'
              }}
              itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
              labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

