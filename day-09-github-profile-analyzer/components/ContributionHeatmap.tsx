'use client';

import { ContributionDay } from '@/types';
import { Calendar, Activity } from 'lucide-react';

interface Props {
  contributions: ContributionDay[];
  totalCommits: number;
}

export default function ContributionHeatmap({ contributions, totalCommits }: Props) {
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-emerald-950 border-emerald-800';
      case 2: return 'bg-emerald-700 border-emerald-600';
      case 3: return 'bg-emerald-500 border-emerald-400';
      case 4: return 'bg-emerald-400 border-emerald-300 shadow-sm shadow-emerald-400/50';
      case 0:
      default: return 'bg-[#0d1117] border-slate-800/80';
    }
  };

  return (
    <div className="bg-[#161b22] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-5 font-mono">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          52-Week Contribution Activity Grid
        </h3>
        <span className="text-xs text-emerald-400 font-bold tabular-nums">
          {totalCommits} Contributions in Past Year
        </span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[700px]">
          {contributions.map((day) => (
            <div
              key={day.date}
              className={`w-3 h-3 rounded-sm border ${getLevelColor(day.level)} transition-all hover:scale-125`}
              title={`${day.date}: ${day.count} commits`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
        <span>365 Days Activity History</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <span className="w-3 h-3 rounded-sm bg-[#0d1117] border border-slate-800" />
          <span className="w-3 h-3 rounded-sm bg-emerald-950 border border-emerald-800" />
          <span className="w-3 h-3 rounded-sm bg-emerald-700 border border-emerald-600" />
          <span className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-400" />
          <span className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-300" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
