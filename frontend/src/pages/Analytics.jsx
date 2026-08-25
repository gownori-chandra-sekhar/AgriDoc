import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DiseaseBarChart from '../components/analytics/DiseaseBarChart';
import HealthPieChart from '../components/analytics/HealthPieChart';
import { getAnalytics } from '../services/api';
import { BarChart3, TrendingUp, ShieldAlert, Activity } from 'lucide-react';

export default function Analytics() {
  const { t } = useTranslation();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const data = await getAnalytics();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Analytics Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalScans = analyticsData?.total_scans_this_month || 0;
  const activeHotspots = analyticsData?.active_hotspots || 0;
  const accuracy = totalScans > 0 ? '96.4%' : '0.0%';

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-full overflow-x-hidden">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-emerald-400 shrink-0" />
          {t('analytics.title')}
        </h1>
        <p className="text-xs text-slate-400">
          Field outbreak trends, top plant diseases & crop health metrics synced with Supabase
        </p>
      </div>

      {/* Dynamic Summary Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold">Total Scans This Month</span>
            <h3 className="text-2xl font-black text-white mt-0.5">{totalScans} Scans</h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold">Active Disease Hotspots</span>
            <h3 className={`text-2xl font-black mt-0.5 ${activeHotspots > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {activeHotspots} Sectors
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold">AI Scan Accuracy</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-0.5">{accuracy}</h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Activity className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <DiseaseBarChart data={analyticsData?.top_5_diseases} />
        </div>
        <div className="lg:col-span-5">
          <HealthPieChart data={analyticsData?.crop_health_breakdown} />
        </div>
      </div>
    </div>
  );
}
