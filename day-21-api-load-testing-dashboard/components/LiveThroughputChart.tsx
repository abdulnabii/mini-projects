'use client';

import { MetricPoint } from '@/types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Activity, Zap, Users } from 'lucide-react';

interface Props {
  data: MetricPoint[];
  peakRps: number;
  avgRps: number;
}

export default function LiveThroughputChart({ data, peakRps, avgRps }: Props) {
  return (
    <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-base font-outfit">
              Real-Time Throughput &amp; Concurrency (RPS vs VUs)
            </h3>
            <p className="text-xs text-slate-400">Live requests per second telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1 rounded-xl bg-slate-950 border border-white/10">
            <span className="text-slate-400">Avg: </span>
            <span className="text-cyan-400 font-bold">{avgRps} RPS</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-slate-950 border border-white/10">
            <span className="text-slate-400">Peak: </span>
            <span className="text-emerald-400 font-bold">{peakRps} RPS</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rps-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="vu-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

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
                border: '1px solid rgba(6,182,212,0.3)',
                borderRadius: '16px',
                fontSize: '12px',
                fontFamily: 'monospace',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
              }}
              formatter={(value: any, name: any) => [
                `${value} ${name === 'rps' ? 'req/s' : 'VUs'}`,
                name === 'rps' ? 'Throughput' : 'Virtual Users',
              ]}
              labelFormatter={(label) => `Time: ${label}s`}
            />
            <Area
              type="monotone"
              dataKey="rps"
              stroke="#06b6d4"
              strokeWidth={3}
              fill="url(#rps-grad)"
              name="rps"
            />
            <Area
              type="monotone"
              dataKey="activeVus"
              stroke="#818cf8"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="url(#vu-grad)"
              name="activeVus"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
