'use client';

import { FilterRule, ColumnProfile } from '@/types';
import { Filter, X, RotateCcw } from 'lucide-react';

interface Props {
  totalRows: number;
  filteredCount: number;
  profiles: ColumnProfile[];
  filters: FilterRule[];
  globalSearch: string;
  onUpdateFilters: (filters: FilterRule[]) => void;
  onUpdateSearch: (search: string) => void;
  onClearAll: () => void;
}

export default function FilterPanel({
  totalRows,
  filteredCount,
  profiles,
  filters,
  globalSearch,
  onUpdateFilters,
  onUpdateSearch,
  onClearAll,
}: Props) {
  const numericCols = profiles.filter((p) => p.dataType === 'numeric' && p.min !== undefined && p.max !== undefined);
  const catCols = profiles.filter((p) => p.dataType === 'categorical' && p.uniqueCount <= 12);

  const handleNumericFilterChange = (colName: string, minVal: number, maxVal: number) => {
    const existing = filters.filter((f) => f.column !== colName);
    onUpdateFilters([
      ...existing,
      {
        column: colName,
        type: 'numeric',
        operator: 'between',
        numMin: minVal,
        numMax: maxVal,
      },
    ]);
  };

  const handleRemoveFilter = (colName: string) => {
    onUpdateFilters(filters.filter((f) => f.column !== colName));
  };

  return (
    <div className="p-4 rounded-2xl bg-[#0d1527] border border-[#1e293b] shadow-xl space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1e293b] pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Dataset Filter Engine
          </h4>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
            Showing {filteredCount.toLocaleString()} of {totalRows.toLocaleString()} records
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Global Search Input */}
          <input
            type="text"
            placeholder="Search rows..."
            value={globalSearch}
            onChange={(e) => onUpdateSearch(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs w-full sm:w-48 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />

          {(filters.length > 0 || globalSearch) && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] hover:border-red-500/40 text-slate-300 hover:text-red-400 text-xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
              title="Clear all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Numeric Sliders / Filters */}
      {numericCols.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {numericCols.slice(0, 3).map((col) => {
            const activeRule = filters.find((f) => f.column === col.name);
            const currentMin = activeRule?.numMin ?? col.min ?? 0;
            const currentMax = activeRule?.numMax ?? col.max ?? 100;

            return (
              <div key={col.name} className="p-3 rounded-xl bg-[#111827] border border-[#1e293b] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px] truncate">{col.name}</span>
                  {activeRule && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFilter(col.name)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Min: {currentMin}</span>
                  <span>Max: {currentMax}</span>
                </div>
                <input
                  type="range"
                  min={col.min}
                  max={col.max}
                  value={currentMin}
                  onChange={(e) => handleNumericFilterChange(col.name, parseFloat(e.target.value), currentMax)}
                  className="w-full h-1 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
