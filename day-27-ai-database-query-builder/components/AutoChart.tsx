'use client';

import { useState } from 'react';
import { ExecutionResult } from '@/types';
import {
  BarChart2,
  TrendingUp,
  PieChart,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Props {
  result: ExecutionResult;
}

export default function AutoChart({ result }: Props) {
  const [viewType, setViewType] = useState<'bars' | 'cards'>('bars');

  if (result.rows.length === 0) return null;

  // Find label column (first string column)
  const labelCol =
    result.columns.find((c) => typeof result.rows[0][c] === 'string') ||
    result.columns[0];

  // Find numeric column (first number column)
  const numericCol =
    result.columns.find((c) => typeof result.rows[0][c] === 'number') ||
    result.columns[1];

  if (!numericCol) return null;

  // Calculate max value for relative bar widths
  const maxVal = Math.max(...result.rows.map((r) => Number(r[numericCol]) || 0), 1);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-purple-500/30 shadow-2xl space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              Auto-Generated Data Visualization
            </h3>
            <p className="text-xs text-slate-400">
              Metric: <strong className="text-emerald-400">{numericCol.toUpperCase()}</strong> grouped by <strong className="text-cyan-400">{labelCol.toUpperCase()}</strong>
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setViewType('bars')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewType === 'bars'
                ? 'bg-purple-500 text-black font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Horizontal Bars
          </button>

          <button
            type="button"
            onClick={() => setViewType('cards')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewType === 'cards'
                ? 'bg-purple-500 text-black font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Metric Cards
          </button>
        </div>
      </div>

      {/* Visual Bars Rendering */}
      {viewType === 'bars' ? (
        <div className="space-y-3.5">
          {result.rows.map((row, idx) => {
            const val = Number(row[numericCol]) || 0;
            const pct = Math.min(100, Math.max(8, Math.round((val / maxVal) * 100)));

            return (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-bold truncate max-w-xs sm:max-w-md">
                    {String(row[labelCol])}
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {numericCol.includes('amount') || numericCol.includes('revenue') || numericCol.includes('mrr')
                      ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : val.toLocaleString()}
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-[#161b22] overflow-hidden border border-slate-800/80">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {result.rows.map((row, idx) => {
            const val = Number(row[numericCol]) || 0;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1 text-xs"
              >
                <span className="text-[10px] text-slate-400 font-bold truncate block">
                  {String(row[labelCol])}
                </span>
                <div className="text-xl font-black text-white font-outfit">
                  {numericCol.includes('amount') || numericCol.includes('revenue') || numericCol.includes('mrr')
                    ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                    : val.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
