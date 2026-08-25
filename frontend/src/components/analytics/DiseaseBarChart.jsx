import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { BarChart2, Inbox } from 'lucide-react';

const COLORS = ['#10b981', '#16a34a', '#059669', '#d97706', '#dc2626'];

export default function DiseaseBarChart({ data }) {
  const { t } = useTranslation();
  const chartData = data || [];

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <BarChart2 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{t('analytics.topDiseases')}</h3>
          <p className="text-[11px] text-slate-400">Live scan metrics from Supabase DB</p>
        </div>
      </div>

      <div className="h-64 w-full flex items-center justify-center">
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Inbox className="h-8 w-8 text-slate-600" />
            <p className="text-xs font-semibold">No live scan data recorded yet.</p>
            <p className="text-[11px]">Scan a crop leaf to generate live charts.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="disease" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
