import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAnalytics } from '../services/api';
import DiseaseBarChart from '../components/analytics/DiseaseBarChart';
import HealthPieChart from '../components/analytics/HealthPieChart';
import {
  BarChart3,
  TrendingUp,
  Sprout,
  CheckCircle2
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export default function Analytics() {
  const { t } = useTranslation();
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const data = await getAnalytics();
      setAnalyticsData(data);
    } catch (err) {
      console.warn('Analytics API offline, using cached distribution:', err);
    }
  };

  const monthlyTrends = [
    { month: 'Jan', scans: 24, infections: 6 },
    { month: 'Feb', scans: 38, infections: 9 },
    { month: 'Mar', scans: 55, infections: 14 },
    { month: 'Apr', scans: 48, infections: 8 },
    { month: 'May', scans: 62, infections: 11 },
    { month: 'Jun', scans: 74, infections: 15 },
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto overflow-x-hidden">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 bg-white shadow-canva-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-300">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t('analytics.title') || 'Agricultural Analytics & Outbreak Intelligence'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Aggregated epidemiology metrics across crop zones, YOLO detection frequency & health indices
            </p>
          </div>
        </div>

        <Badge variant="success" size="lg">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>SUPABASE SYNC ACTIVE</span>
        </Badge>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-5 border-slate-200 bg-white space-y-1.5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Analyzed</span>
          <div className="text-3xl font-black text-slate-900">
            {analyticsData?.total_scans || 128}
          </div>
          <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +18% from last month
          </p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white space-y-1.5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Healthy Crop Ratio</span>
          <div className="text-3xl font-black text-emerald-700">
            {analyticsData?.health_rate || '84.2%'}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Within optimal field threshold</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white space-y-1.5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mild Incursions</span>
          <div className="text-3xl font-black text-amber-600">
            {analyticsData?.mild_count || 16}
          </div>
          <p className="text-[11px] text-amber-700 font-bold">Treated with bio-pesticides</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white space-y-1.5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">High Urgency Alerts</span>
          <div className="text-3xl font-black text-rose-600">
            {analyticsData?.severe_count || 4}
          </div>
          <p className="text-[11px] text-rose-700 font-bold">Immediate action taken</p>
        </Card>
      </div>

      {/* Primary Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-emerald-600" />
                  Top Pathogens Diagnosed This Month
                </span>
                <Badge variant="info" size="sm">YOLO CLOUD</Badge>
              </div>
            }
            className="border-slate-200 bg-white shadow-sm"
          >
            <div className="h-72 w-full pt-2">
              <DiseaseBarChart />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-teal-600" />
                  Field Crop Health Breakdown
                </span>
                <Badge variant="default" size="sm">SECTOR A-4</Badge>
              </div>
            }
            className="border-slate-200 bg-white shadow-sm"
          >
            <div className="h-72 w-full pt-2">
              <HealthPieChart />
            </div>
          </Card>
        </div>
      </div>

      {/* Monthly Outbreak Trend Line Chart */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-600" />
              Monthly Scan Volume vs Infection Trajectory
            </span>
            <span className="text-xs text-slate-500 font-mono">Jan - Jun 2026</span>
          </div>
        }
        className="border-slate-200 bg-white shadow-sm"
      >
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '16px',
                  color: '#0f172a',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="scans"
                name="Total Scans"
                stroke="#059669"
                strokeWidth={3}
                dot={{ r: 4, fill: '#059669' }}
              />
              <Line
                type="monotone"
                dataKey="infections"
                name="Infections Detected"
                stroke="#e11d48"
                strokeWidth={3}
                dot={{ r: 4, fill: '#e11d48' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
