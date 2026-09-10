'use client';

import { useState } from 'react';
import { ColumnProfile } from '@/types';
import { BarChart3, TrendingUp, ScatterChart, BarChart } from 'lucide-react';

interface Props {
  rows: Record<string, any>[];
  headers: string[];
  profiles: ColumnProfile[];
}

export default function Chart2DFallback({ rows, headers, profiles }: Props) {
  const [activeChart, setActiveChart] = useState<'BAR' | 'RANK' | 'SCATTER'>('BAR');

  const numericCols = profiles.filter((p) => p.dataType === 'numeric').map((p) => p.name);
  const catCols = profiles
    .filter((p) => p.dataType === 'categorical' || p.dataType === 'text' || p.dataType === 'geographic')
    .map((p) => p.name);

  const [selectedCatCol, setSelectedCatCol] = useState<string>(catCols[0] || headers[0]);
  const [selectedNumCol, setSelectedNumCol] = useState<string>(numericCols[0] || headers[1]);
  const [selectedNumCol2, setSelectedNumCol2] = useState<string>(numericCols[1] || numericCols[0]);

  // Aggregate data for Bar and Rank charts
  const aggregatedData = (() => {
    const map: Record<string, number> = {};
    for (const r of rows) {
      const cat = String(r[selectedCatCol] || 'Other');
      const val = parseFloat(r[selectedNumCol]);
      if (!isNaN(val)) {
        map[cat] = (map[cat] || 0) + val;
      }
    }
    return Object.entries(map)
      .map(([label, val]) => ({ label, val: Math.round(val * 10) / 10 }))
      .sort((a, b) => b.val - a.val)
      .slice(0, 10);
  })();

  const maxAggVal = Math.max(...aggregatedData.map((d) => d.val), 1);

  // Scatter plot points
  const scatterPoints = rows
    .map((r, i) => ({
      x: parseFloat(r[selectedNumCol]),
      y: parseFloat(r[selectedNumCol2]),
      label: String(r[selectedCatCol] || `Item #${i + 1}`),
    }))
    .filter((p) => !isNaN(p.x) && !isNaN(p.y));

  const minX = Math.min(...scatterPoints.map((p) => p.x), 0);
  const maxX = Math.max(...scatterPoints.map((p) => p.x), 100);
  const minY = Math.min(...scatterPoints.map((p) => p.y), 0);
  const maxY = Math.max(...scatterPoints.map((p) => p.y), 100);

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#0d1527] border border-[#1e293b] shadow-xl space-y-4 font-mono">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1e293b] pb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>2D Analytical Fallback Charts</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Exact metric comparison without 3D perspective foreshortening.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#111827] border border-[#1e293b]">
          <button
            type="button"
            onClick={() => setActiveChart('BAR')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              activeChart === 'BAR' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Column Comparison
          </button>
          <button
            type="button"
            onClick={() => setActiveChart('RANK')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              activeChart === 'RANK' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Top-10 Ranking
          </button>
          <button
            type="button"
            onClick={() => setActiveChart('SCATTER')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              activeChart === 'SCATTER' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            2D Scatter
          </button>
        </div>
      </div>

      {/* Metric Selectors */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div>
          <label className="text-[10px] text-slate-400 uppercase mr-2">Category:</label>
          <select
            value={selectedCatCol}
            onChange={(e) => setSelectedCatCol(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
          >
            {allHeaders(headers, catCols).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 uppercase mr-2">Metric 1 (Y / Value):</label>
          <select
            value={selectedNumCol}
            onChange={(e) => setSelectedNumCol(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
          >
            {numericCols.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {activeChart === 'SCATTER' && (
          <div>
            <label className="text-[10px] text-slate-400 uppercase mr-2">Metric 2 (X):</label>
            <select
              value={selectedNumCol2}
              onChange={(e) => setSelectedNumCol2(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
            >
              {numericCols.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chart Canvas Area */}
      <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] min-h-[300px] flex items-center justify-center">
        {activeChart === 'BAR' && (
          <div className="w-full flex items-end justify-around gap-2 h-64 pt-6 px-4">
            {aggregatedData.map((d, i) => {
              const heightPct = Math.round((d.val / maxAggVal) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.val}
                  </span>
                  <div
                    style={{ height: `${Math.max(4, heightPct)}%` }}
                    className="w-full max-w-[48px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all duration-300 group-hover:brightness-125"
                  />
                  <span className="text-[10px] text-slate-400 truncate max-w-[60px] text-center">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {activeChart === 'RANK' && (
          <div className="w-full space-y-2.5 py-2">
            {aggregatedData.map((d, i) => {
              const widthPct = Math.round((d.val / maxAggVal) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-medium flex items-center gap-2">
                      <span className="text-slate-500 text-[10px]">#{i + 1}</span>
                      <span>{d.label}</span>
                    </span>
                    <span className="font-bold text-emerald-400">{d.val}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#1e293b] overflow-hidden">
                    <div
                      style={{ width: `${Math.max(2, widthPct)}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeChart === 'SCATTER' && (
          <div className="w-full h-64 relative border-l border-b border-[#1e293b] p-2">
            <div className="absolute left-2 top-2 text-[10px] text-slate-500 uppercase">
              ↑ {selectedNumCol2}
            </div>
            <div className="absolute right-2 bottom-2 text-[10px] text-slate-500 uppercase">
              {selectedNumCol} →
            </div>

            {scatterPoints.slice(0, 100).map((p, i) => {
              const xPct = maxX > minX ? ((p.x - minX) / (maxX - minX)) * 90 + 5 : 50;
              const yPct = maxY > minY ? ((p.y - minY) / (maxY - minY)) * 90 + 5 : 50;

              return (
                <div
                  key={i}
                  style={{ left: `${xPct}%`, bottom: `${yPct}%` }}
                  title={`${p.label}: (${p.x}, ${p.y})`}
                  className="absolute w-3 h-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-400/80 border border-cyan-200 cursor-pointer hover:scale-150 hover:bg-emerald-400 transition-all shadow-sm"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function allHeaders(headers: string[], preferred: string[]): string[] {
  return Array.from(new Set([...preferred, ...headers]));
}
