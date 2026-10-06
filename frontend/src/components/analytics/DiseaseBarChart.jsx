import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const DEFAULT_DISEASE_DATA = [
  { disease: 'Tomato Early Blight', cases: 42, color: '#f59e0b' },
  { disease: 'Paddy Blast', cases: 35, color: '#e11d48' },
  { disease: 'Leaf Mold', cases: 28, color: '#059669' },
  { disease: 'Corn Rust', cases: 19, color: '#d97706' },
  { disease: 'Cotton Blight', cases: 14, color: '#0284c7' },
];

export default function DiseaseBarChart({ data = DEFAULT_DISEASE_DATA }) {
  const chartData = data && data.length > 0 ? data : DEFAULT_DISEASE_DATA;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
        <XAxis
          dataKey="disease"
          stroke="#64748b"
          tick={{ fontSize: 10, fill: '#475569' }}
          angle={-15}
          textAnchor="end"
          interval={0}
        />
        <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#475569' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            borderColor: '#e2e8f0',
            borderRadius: '16px',
            color: '#0f172a',
            fontSize: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value) => [`${value} detections`, 'Scans']}
        />
        <Bar dataKey="cases" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#059669'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
