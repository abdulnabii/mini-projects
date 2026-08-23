'use client';

import { EngagementRadar as EngagementRadarType } from '@/types';
import {
  Activity,
  Sparkles,
  Clock,
  CheckCircle2,
  TrendingUp,
  Zap,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  radar: EngagementRadarType;
  postingTime?: string;
}

export default function EngagementRadar({ radar, postingTime }: Props) {
  const getGradeColor = (grade: EngagementRadarType['grade']) => {
    switch (grade) {
      case 'VIRAL':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
      case 'HIGH':
        return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
      case 'MODERATE':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      default:
        return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-5 font-mono shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            AI Viral Potential &amp; Timing Analytics
          </h4>
        </div>

        <div className={`px-3 py-1 rounded-xl border text-xs font-bold ${getGradeColor(radar.grade)}`}>
          Score: {radar.score}/100 • {radar.grade}
        </div>
      </div>

      {/* 4 Metric Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Hook Strength</span>
          <div className="text-base font-black text-emerald-400">{radar.hookStrength}%</div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${radar.hookStrength}%` }} />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Readability Index</span>
          <div className="text-base font-black text-cyan-400">{radar.readability}%</div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${radar.readability}%` }} />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Emotional Trigger</span>
          <div className="text-base font-black text-purple-400">{radar.emotionalResonance}%</div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full" style={{ width: `${radar.emotionalResonance}%` }} />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Formatting Spacing</span>
          <div className="text-base font-black text-amber-400">{radar.formattingSpacing}%</div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${radar.formattingSpacing}%` }} />
          </div>
        </div>
      </div>

      {/* Recommended Time Window */}
      {postingTime && (
        <div className="p-3.5 rounded-2xl bg-[#06140e] border border-emerald-500/30 text-xs text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Optimal Posting Window:</span>
          </span>
          <strong className="text-emerald-300 font-bold">{postingTime}</strong>
        </div>
      )}

      {/* Algorithmic Optimization Tips */}
      {radar.tips && radar.tips.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">
            ⚡ Algorithmic Retention Factors:
          </span>
          <div className="space-y-1">
            {radar.tips.map((tip, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
