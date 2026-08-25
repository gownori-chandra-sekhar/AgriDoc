import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChart as PieIcon, Inbox } from 'lucide-react';

export default function HealthPieChart({ data }) {
  const { t } = useTranslation();
  const chartData = data || [];
  const totalValue = chartData.reduce((acc, item) => acc + (item.value || 0), 0);

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <PieIcon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{t('analytics.cropHealth')}</h3>
          <p className="text-[11px] text-slate-400">Live health breakdown from database</p>
        </div>
      </div>

      <div className="h-64 w-full flex items-center justify-center">
        {totalValue === 0 ? (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Inbox className="h-8 w-8 text-slate-600" />
            <p className="text-xs font-semibold">No live crop health data yet.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
