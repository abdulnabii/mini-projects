'use client';

import { useState } from 'react';
import { ExecutionResult } from '@/types';
import {
  BarChart2,
  TrendingUp,
  PieChart,
  Layers,
  Sparkles,
  LayoutGrid,
  Percent,
} from 'lucide-react';

interface Props {
  result: ExecutionResult;
}

export default function AutoChart({ result }: Props) {
  const [viewType, setViewType] = useState<'bars' | 'columns' | 'cards' | 'donut'>('bars');

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

  // Calculate summary metrics
  const values = result.rows.map((r) => Number(r[numericCol]) || 0);
  const totalSum = values.reduce((a, b) => a + b, 0);
  const avgVal = totalSum / (values.length || 1);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values);

  const formatNumber = (num: number) => {
    if (numericCol.includes('amount') || numericCol.includes('revenue') || numericCol.includes('mrr') || numericCol.includes('fee')) {
      return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return num.toLocaleString();
  };

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
              Auto-Generated Data Visualization Studio
            </h3>
            <p className="text-xs text-slate-400">
              Metric: <strong className="text-emerald-400">{numericCol.toUpperCase()}</strong> by <strong className="text-cyan-400">{labelCol.toUpperCase()}</strong>
            </p>
          </div>
        </div>

        {/* 4 Multi-View Switcher Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs flex-wrap">
          <button
            type="button"
            onClick={() => setViewType('bars')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewType === 'bars'
                ? 'bg-purple-500 text-black font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bars
          </button>

          <button
            type="button"
            onClick={() => setViewType('columns')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewType === 'columns'
                ? 'bg-purple-500 text-black font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Columns
          </button>

          <button
            type="button"
            onClick={() => setViewType('cards')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewType === 'cards'
                ? 'bg-purple-500 text-black font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            KPI Cards
          </button>

          <button
            type="button"
            onClick={() => setViewType('donut')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewType === 'donut'
                ? 'bg-purple-500 text-black font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Share %
          </button>
        </div>
      </div>

      {/* Aggregate Metric Summary Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[10px] text-purple-400 font-bold uppercase">Aggregate Total</span>
          <div className="text-base sm:text-lg font-black text-white">{formatNumber(totalSum)}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[10px] text-cyan-400 font-bold uppercase">Mean Average</span>
          <div className="text-base sm:text-lg font-black text-cyan-300">{formatNumber(avgVal)}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[10px] text-emerald-400 font-bold uppercase">Peak Maximum</span>
          <div className="text-base sm:text-lg font-black text-emerald-300">{formatNumber(maxVal)}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[10px] text-amber-400 font-bold uppercase">Total Records</span>
          <div className="text-base sm:text-lg font-black text-amber-300">{result.rows.length} Items</div>
        </div>
      </div>

      {/* VIEW 1: HORIZONTAL BARS */}
      {viewType === 'bars' && (
        <div className="space-y-3.5 pt-2">
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
                    {formatNumber(val)}
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-[#161b22] overflow-hidden border border-slate-800/80">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: VERTICAL COLUMNS */}
      {viewType === 'columns' && (
        <div className="flex items-end gap-3 h-56 pt-6 overflow-x-auto pb-4">
          {result.rows.map((row, idx) => {
            const val = Number(row[numericCol]) || 0;
            const heightPct = Math.min(100, Math.max(12, Math.round((val / maxVal) * 100)));

            return (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1 min-w-[70px] h-full justify-end text-xs">
                <span className="text-[10px] text-cyan-300 font-mono font-bold">
                  {formatNumber(val)}
                </span>
                <div className="w-full rounded-t-xl bg-[#161b22] overflow-hidden flex flex-col justify-end border border-slate-800" style={{ height: `${heightPct}%` }}>
                  <div className="w-full h-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-xl" />
                </div>
                <span className="text-[10px] text-slate-400 truncate max-w-[65px] font-sans">
                  {String(row[labelCol])}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: METRIC CARDS */}
      {viewType === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {result.rows.map((row, idx) => {
            const val = Number(row[numericCol]) || 0;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1.5 text-xs shadow-md"
              >
                <span className="text-[10px] text-slate-400 font-bold truncate block">
                  {String(row[labelCol])}
                </span>
                <div className="text-xl font-black text-white font-outfit">
                  {formatNumber(val)}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  {totalSum > 0 ? `${((val / totalSum) * 100).toFixed(1)}% of total sum` : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 4: SHARE PERCENTAGES */}
      {viewType === 'donut' && (
        <div className="space-y-3 pt-2">
          {result.rows.map((row, idx) => {
            const val = Number(row[numericCol]) || 0;
            const sharePct = totalSum > 0 ? (val / totalSum) * 100 : 0;

            return (
              <div key={idx} className="p-3 rounded-2xl bg-[#161b22] border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 truncate">
                  <div className="font-bold text-white truncate">{String(row[labelCol])}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{formatNumber(val)}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-base font-black text-cyan-300 font-mono">
                    {sharePct.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
