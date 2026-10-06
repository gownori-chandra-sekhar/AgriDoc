import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChart as PieIcon, Activity } from 'lucide-react';

const DEFAULT_DEMO_HEALTH = [
  { name: 'Healthy Crops', value: 68, color: '#10b981' },
  { name: 'Early Warning', value: 20, color: '#f59e0b' },
  { name: 'High Urgency Outbreak', value: 12, color: '#f43f5e' }
];

export default function HealthPieChart({ data }) {
  const { t } = useTranslation();
  const chartData = (data && data.length > 0) ? data : DEFAULT_DEMO_HEALTH;

  return (
    <div className="glass-card rounded-3xl border border-slate-800/90 p-5 sm:p-6 shadow-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-glow-sm">
            <PieIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">{t('analytics.cropHealth') || 'Field Health Ratio'}</h3>
            <p className="text-[11px] text-slate-400">Crop diagnostics status breakdown</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/30">
          HEALTH STATUS
        </span>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="48%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={6}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#070b14" strokeWidth={3} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#0b1120', 
                borderColor: 'rgba(20, 184, 166, 0.4)', 
                borderRadius: '1rem', 
                color: '#fff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 0 15px -3px rgba(20, 184, 166, 0.3)'
              }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

