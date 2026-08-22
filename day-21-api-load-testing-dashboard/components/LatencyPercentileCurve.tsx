'use client';

import { LatencyPercentiles, MetricPoint } from '@/types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Clock, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

interface Props {
  percentiles: LatencyPercentiles;
  timeSeries: MetricPoint[];
}

export default function LatencyPercentileCurve({ percentiles, timeSeries }: Props) {
  const p = percentiles;
  const tailRatio = p.p50 > 0 ? Math.round((p.p99 / p.p50) * 10) / 10 : 1;
  const isTailDegraded = tailRatio >= 4 && p.p99 > 500;

  return (
    <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-base font-outfit">
              Response Time Percentiles &amp; Tail Latency
            </h3>
            <p className="text-xs text-slate-400">P50 (Median), P90, P95, and P99 latency curve</p>
          </div>
        </div>

        {isTailDegraded ? (
          <div className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>P99 is {tailRatio}x of P50 (Tail Degraded)</span>
          </div>
        ) : (
          <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Consistent Latency Distribution</span>
          </div>
        )}
      </div>

      {/* Percentile Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">P50 (Median)</span>
          <div className="text-xl font-black text-emerald-400">
            {p.p50} <span className="text-[10px] font-normal text-slate-500">ms</span>
          </div>
          <span className="text-[9px] text-slate-500 block">50% of users</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">P90 Target</span>
          <div className="text-xl font-black text-cyan-400">
            {p.p90} <span className="text-[10px] font-normal text-slate-500">ms</span>
          </div>
          <span className="text-[9px] text-slate-500 block">90% of users</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">P95 SLA</span>
          <div className="text-xl font-black text-indigo-400">
            {p.p95} <span className="text-[10px] font-normal text-slate-500">ms</span>
          </div>
          <span className="text-[9px] text-slate-500 block">95% of users</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">P99 Tail</span>
          <div className={`text-xl font-black ${isTailDegraded ? 'text-amber-400' : 'text-purple-400'}`}>
            {p.p99} <span className="text-[10px] font-normal text-slate-500">ms</span>
          </div>
          <span className="text-[9px] text-slate-500 block">99% of users</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Max Latency</span>
          <div className="text-xl font-black text-rose-400">
            {p.max} <span className="text-[10px] font-normal text-slate-500">ms</span>
          </div>
          <span className="text-[9px] text-slate-500 block">Min: {p.min}ms</span>
        </div>
      </div>

      {/* Latency Over Time Chart */}
      <div className="h-60 sm:h-64 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="timestampSec"
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(val) => `${val}s`}
            />
            <YAxis stroke="#64748b" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#080d1a',
                border: '1px solid rgba(129,140,248,0.3)',
                borderRadius: '16px',
                fontSize: '12px',
                fontFamily: 'monospace',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
              }}
              formatter={(value: any, name: any) => [`${value}ms`, name]}
              labelFormatter={(label) => `Time: ${label}s`}
            />
            <Line
              type="monotone"
              dataKey="p50Ms"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="P50 (Median)"
            />
            <Line
              type="monotone"
              dataKey="p95Ms"
              stroke="#818cf8"
              strokeWidth={2}
              dot={false}
              name="P95"
            />
            <Line
              type="monotone"
              dataKey="p99Ms"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={false}
              name="P99 (Tail)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
