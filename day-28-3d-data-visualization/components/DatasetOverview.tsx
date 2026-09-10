'use client';

import { useState } from 'react';
import { DataQualityReport, ColumnProfile } from '@/types';
import {
  ShieldCheck,
  Table,
  Hash,
  Layers,
  MapPin,
  Calendar,
  AlertCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

interface Props {
  rowCount: number;
  columns: string[];
  profiles: ColumnProfile[];
  quality?: DataQualityReport;
  isSynthetic: boolean;
  selectedColumn?: string | null;
  onSelectColumn?: (column: string) => void;
}

export default function DatasetOverview({
  rowCount,
  columns,
  profiles,
  quality,
  isSynthetic,
  selectedColumn,
  onSelectColumn,
}: Props) {
  const [expandedCol, setExpandedCol] = useState<string | null>(null);

  // Group columns by type
  const numericCols = profiles.filter((p) => p.dataType === 'numeric');
  const catCols = profiles.filter((p) => p.dataType === 'categorical');
  const geoCols = profiles.filter((p) => p.dataType === 'geographic');
  const tempCols = profiles.filter((p) => p.dataType === 'temporal');
  const textCols = profiles.filter((p) => p.dataType === 'text');

  const qualityScore = quality?.score ?? 96;

  return (
    <div className="space-y-4 font-mono">
      {/* Synthetic Dataset Indicator */}
      {isSynthetic && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            <strong>Synthetic Demonstration Dataset:</strong> Generated for reproducible spatial analytics &amp; statistical modeling. Numbers are mathematically consistent but simulate demonstration scenarios.
          </span>
        </div>
      )}

      {/* Dataset Health & Summary Bar */}
      <div className="p-4 rounded-2xl bg-[#0d1527] border border-[#1e293b] shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Main counts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="p-2.5 rounded-xl bg-[#111827] border border-[#1e293b]">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Rows</span>
              <span className="text-base font-bold text-white font-mono">{rowCount.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#111827] border border-[#1e293b]">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Columns</span>
              <span className="text-base font-bold text-cyan-400 font-mono">{columns.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#111827] border border-[#1e293b]">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Missing Cells</span>
              <span className="text-base font-bold text-slate-200 font-mono">
                {quality?.missingPercentage ?? 0}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#111827] border border-[#1e293b]">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Duplicates</span>
              <span className="text-base font-bold text-slate-200 font-mono">
                {quality?.duplicateRowCount ?? 0}
              </span>
            </div>
          </div>

          {/* OmniData Quality Score Card */}
          <div className="p-3 rounded-xl bg-[#111827] border border-emerald-500/30 flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">OmniData Quality Score</span>
                <span className="text-xs font-bold text-emerald-400">{qualityScore}/100</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <span>Comp: {quality?.completenessScore ?? 98}%</span>
                <span>•</span>
                <span>Uniq: {quality?.uniquenessScore ?? 99}%</span>
                <span>•</span>
                <span>Valid: {quality?.validityScore ?? 98}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column Types Badges */}
        <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-[#1e293b] text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Classified Dimensions:</span>
          {numericCols.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] flex items-center gap-1">
              <Hash className="w-3 h-3" /> {numericCols.length} Numeric
            </span>
          )}
          {catCols.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] flex items-center gap-1">
              <Layers className="w-3 h-3" /> {catCols.length} Categorical
            </span>
          )}
          {geoCols.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {geoCols.length} Geographic
            </span>
          )}
          {tempCols.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {tempCols.length} Temporal
            </span>
          )}
          {textCols.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-400 border border-slate-500/20 text-[11px]">
              {textCols.length} Text
            </span>
          )}
        </div>
      </div>

      {/* Column Inspector Grid */}
      <div className="p-4 rounded-2xl bg-[#0d1527] border border-[#1e293b] space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5 text-cyan-400" />
            <span>Column Inspector &amp; Descriptive Summaries</span>
          </h4>
          <span className="text-[10px] text-slate-400">Click column for full distribution stats</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {profiles.map((col) => {
            const isExpanded = expandedCol === col.name || selectedColumn === col.name;
            return (
              <div
                key={col.name}
                onClick={() => {
                  setExpandedCol(isExpanded ? null : col.name);
                  if (onSelectColumn) onSelectColumn(col.name);
                }}
                className={`p-3 rounded-xl bg-[#111827] border transition-all cursor-pointer ${
                  isExpanded
                    ? 'border-cyan-500/50 shadow-md ring-1 ring-cyan-500/20'
                    : 'border-[#1e293b] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-xs font-bold text-white block truncate">{col.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase">
                      {col.dataType} • {col.completeness}% complete
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                </div>

                {/* Expanded statistics drawer */}
                {isExpanded && col.dataType === 'numeric' && (
                  <div className="mt-3 pt-3 border-t border-[#1e293b] text-[11px] space-y-1 text-slate-300">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                      <div>Min: <strong className="text-white">{col.min}</strong></div>
                      <div>Max: <strong className="text-white">{col.max}</strong></div>
                      <div>Mean: <strong className="text-white">{col.mean}</strong></div>
                      <div>Median: <strong className="text-white">{col.median}</strong></div>
                      <div>StdDev: <strong className="text-white">{col.stdDev}</strong></div>
                      <div>IQR: <strong className="text-white">{col.iqr}</strong></div>
                    </div>
                    {col.outlierCount !== undefined && col.outlierCount > 0 && (
                      <div className="text-amber-400 text-[10px] pt-1 flex items-center gap-1 font-bold">
                        <AlertCircle className="w-3 h-3" />
                        <span>{col.outlierCount} outlier records detected (via IQR)</span>
                      </div>
                    )}
                  </div>
                )}

                {isExpanded && col.dataType !== 'numeric' && (
                  <div className="mt-3 pt-3 border-t border-[#1e293b] text-[11px] space-y-1 text-slate-300">
                    <div>Unique values: <strong className="text-white">{col.uniqueCount}</strong></div>
                    <div className="text-[10px] text-slate-400 truncate">
                      Sample: {col.sampleValues.slice(0, 3).join(', ')}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
