'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { EnergyOverview, Device } from '@/types';
import {
  Zap,
  Flame,
  DollarSign,
  Leaf,
  Sparkles,
  TrendingDown,
  ArrowDownRight,
  Loader2,
  Sliders,
} from 'lucide-react';

interface Props {
  overview: EnergyOverview;
  devices: Device[];
}

export default function EnergyChart({ overview, devices }: Props) {
  const [aiInsights, setAiInsights] = useState<string[]>([
    'HVAC accounts for 53% of daily power draw. Setting cooling setpoints +2°F during peak afternoon hours (2 PM – 6 PM) can reduce monthly electricity expenses by $18.40.',
    'Smart lighting automation can trim phantom idle loads by automatically turning off studio keylights when no motion is detected for 15 minutes.',
    'Preheating your smart espresso maker on an automated schedule rather than leaving it on standby saves ~1.2 kWh daily.',
  ]);
  const [savingsEstimate, setSavingsEstimate] = useState(28.5);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleRefreshInsights = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/energy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kwh: overview.todayKwh,
          cost: overview.estMonthlyCostUsd,
          devices,
        }),
      });

      const data = await res.json();
      if (data.insights && data.insights.length > 0) {
        setAiInsights(data.insights);
        setSavingsEstimate(data.savingsEstimateUsd || 25);
      }
    } catch (e) {
      console.error('Failed to fetch energy insights:', e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* 4 Energy Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0d1117] border border-cyan-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Live Power Draw
          </span>
          <div className="text-2xl font-black text-white">
            {overview.currentDrawWatts.toLocaleString()} <span className="text-xs font-normal text-slate-400">Watts</span>
          </div>
          <span className="text-[10px] text-emerald-400">Real-time smart grid telemetry</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1117] border border-emerald-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5" /> Daily Consumption
          </span>
          <div className="text-2xl font-black text-emerald-400">
            {overview.todayKwh} <span className="text-xs font-normal text-slate-400">kWh</span>
          </div>
          <span className="text-[10px] text-slate-400">vs 21.2 kWh yesterday (-13%)</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1117] border border-amber-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" /> Projected Bill
          </span>
          <div className="text-2xl font-black text-amber-400">
            ${overview.estMonthlyCostUsd} <span className="text-xs font-normal text-slate-400">/ mo</span>
          </div>
          <span className="text-[10px] text-slate-400">Avg tariff $0.15/kWh</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1117] border border-indigo-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-indigo-400 font-bold uppercase flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5" /> Carbon Offset
          </span>
          <div className="text-2xl font-black text-indigo-300">
            {overview.carbonOffsetKg} <span className="text-xs font-normal text-slate-400">kg CO₂</span>
          </div>
          <span className="text-[10px] text-emerald-400">Solar microgrid aligned</span>
        </div>
      </div>

      {/* 24-Hour Power Draw Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 uppercase">
                LOAD PROFILE
              </span>
              <h3 className="text-base font-bold text-white font-outfit">
                24-Hour Energy Telemetry Curve
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Live power consumption timeline &amp; active device correlation
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Power (Watts)
            </span>
          </div>
        </div>

        {/* Recharts Area */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={overview.hourlyBreakdown}>
              <defs>
                <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="W" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d1117',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  borderRadius: '12px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="wattage"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#powerGradient)"
                name="Power Draw"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column Split: Top Consuming Appliances & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Consuming Appliances */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-4 shadow-xl">
          <h4 className="font-bold text-white text-sm font-outfit flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Heavy Energy Consumers Breakdown</span>
          </h4>

          <div className="space-y-3">
            {overview.topConsumingDevices.map((dev, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{dev.deviceName}</span>
                    <span className="text-slate-500 text-[10px] ml-2">({dev.room})</span>
                  </div>
                  <span className="text-cyan-400 font-bold">{dev.kwh} kWh ({dev.percent}%)</span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
                    style={{ width: `${dev.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gemini 1.5 Flash AI Efficiency Insights */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-emerald-500/30 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-white text-sm font-outfit">
                  Gemini AI Efficiency Optimization
                </h4>
              </div>

              <button
                type="button"
                onClick={handleRefreshInsights}
                disabled={isLoadingAi}
                className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Re-evaluate'}
              </button>
            </div>

            <div className="space-y-2.5 font-sans text-xs">
              {aiInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 text-slate-200 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="text-emerald-400 font-mono font-bold">0{idx + 1}.</span>
                  <p>{insight}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#06140e] border border-emerald-500/30 text-xs text-slate-300 flex items-center justify-between">
            <span>Potential Monthly Cost Reduction:</span>
            <strong className="text-emerald-400 text-sm font-mono font-black">
              ~${savingsEstimate} / month
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
