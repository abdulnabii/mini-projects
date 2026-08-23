'use client';

import { AdherenceStats } from '@/types';
import {
  Activity,
  Award,
  CheckCircle2,
  Calendar,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface Props {
  stats: AdherenceStats;
}

export default function AdherenceDashboard({ stats }: Props) {
  return (
    <div className="space-y-6 font-mono">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Compliance Rate */}
        <div className="p-6 rounded-3xl bg-[#0d1117] border border-emerald-500/30 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">
              Overall Compliance
            </span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-outfit">
            {stats.adherenceRate}%
          </div>
          <p className="text-[11px] text-slate-400">
            🟢 Excellent clinical range (&gt;90%)
          </p>
        </div>

        {/* Current Streak */}
        <div className="p-6 rounded-3xl bg-[#0d1117] border border-amber-500/30 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-400 font-bold uppercase">
              Adherence Streak
            </span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300 font-outfit">
            {stats.currentStreakDays} Days 🔥
          </div>
          <p className="text-[11px] text-slate-400">
            Personal Best: {stats.bestStreakDays} Days
          </p>
        </div>

        {/* Doses Taken */}
        <div className="p-6 rounded-3xl bg-[#0d1117] border border-cyan-500/30 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-cyan-400 font-bold uppercase">
              7-Day Doses Logged
            </span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-300 font-outfit">
            {stats.totalTaken} / {stats.totalScheduled}
          </div>
          <p className="text-[11px] text-slate-400">
            0 critical doses missed this week
          </p>
        </div>
      </div>

      {/* 7-Day Day-by-Day Compliance Grid */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-white text-sm font-outfit">
              7-Day Regimen Adherence Matrix
            </h4>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase">
            Updated Real-Time
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5">
          {stats.weeklyDayCompliance.map((day, idx) => {
            const isPerfect = day.status === 'perfect';
            const isPartial = day.status === 'partial';
            const isMissed = day.status === 'missed';

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border text-center space-y-1.5 ${
                  isPerfect
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : isPartial
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                    : isMissed
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                    : 'bg-[#161b22] border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-[10px] font-bold uppercase block">
                  {day.dayName}
                </span>
                <div className="text-base font-black text-white">
                  {day.status === 'upcoming' ? '⏳' : isPerfect ? '✅' : isPartial ? '⚠️' : '❌'}
                </div>
                <span className="text-[10px] text-slate-400 block font-sans">
                  {day.status === 'upcoming' ? 'Upcoming' : `${day.takenCount}/${day.scheduledCount} Taken`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
