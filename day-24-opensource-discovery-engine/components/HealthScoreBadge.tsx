'use client';

import { HealthScore } from '@/types';
import { Activity, CheckCircle2, Clock, GitMerge, FileText } from 'lucide-react';

interface Props {
  health: HealthScore;
  showDetails?: boolean;
}

export default function HealthScoreBadge({ health, showDetails = false }: Props) {
  const getGradeColor = (grade: HealthScore['grade']) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
      case 'B':
        return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
      case 'C':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      default:
        return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
    }
  };

  return (
    <div className="space-y-2 font-mono">
      {/* Pill Badge */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border text-xs font-bold ${getGradeColor(
          health.grade
        )}`}
      >
        <Activity className="w-3.5 h-3.5 animate-pulse" />
        <span>Health Score: {health.score}/100</span>
        <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] uppercase font-black">
          Grade {health.grade}
        </span>
      </div>

      {showDetails && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px] text-slate-300">
          <div className="p-2 rounded-lg bg-[#161b22] border border-slate-800 space-y-0.5">
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> Last Commit
            </span>
            <span className="font-bold text-white">
              {health.daysSinceLastCommit}d ago
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#161b22] border border-slate-800 space-y-0.5">
            <span className="text-slate-500 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" /> PR Turnaround
            </span>
            <span className="font-bold text-emerald-300">
              ~{health.avgPrReviewDays} days
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#161b22] border border-slate-800 space-y-0.5">
            <span className="text-slate-500 flex items-center gap-1">
              <GitMerge className="w-3 h-3 text-indigo-400" /> PR Merge Rate
            </span>
            <span className="font-bold text-indigo-300">
              {health.prAcceptanceRate}%
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#161b22] border border-slate-800 space-y-0.5">
            <span className="text-slate-500 flex items-center gap-1">
              <FileText className="w-3 h-3 text-amber-400" /> Docs Rating
            </span>
            <span className="font-bold text-amber-300">
              {health.docQualityRating}/100
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
