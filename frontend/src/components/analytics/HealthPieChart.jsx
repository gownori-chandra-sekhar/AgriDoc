import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const DEFAULT_HEALTH_DATA = [
  { name: 'Healthy Crops', value: 68, color: '#059669' },
  { name: 'Mild Infection', value: 22, color: '#f59e0b' },
  { name: 'Severe Outbreak', value: 10, color: '#e11d48' },
];

export default function HealthPieChart({ data = DEFAULT_HEALTH_DATA }) {
  const chartData = data && data.length > 0 ? data : DEFAULT_HEALTH_DATA;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={4}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            borderColor: '#e2e8f0',
            borderRadius: '16px',
            color: '#0f172a',
            fontSize: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value) => [`${value}% of field`, 'Proportion']}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => <span className="text-xs text-slate-700 font-semibold">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
