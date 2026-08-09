'use client';

import React from 'react';
import { Award, AlertOctagon, CheckCircle, Flame } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  const getRating = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle };
    if (score >= 70) return { label: 'Good Quality', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', icon: Award };
    if (score >= 45) return { label: 'Needs Refactoring', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', icon: AlertOctagon };
    return { label: 'Vulnerable / Unsafe', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/50', icon: Flame };
  };

  const rating = getRating(score);
  const Icon = rating.icon;

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${rating.bg} backdrop-blur-xl transition-all`}>
      <div className="flex items-center gap-3">
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              className={`transition-all duration-1000 ease-out ${
                score >= 90
                  ? 'stroke-emerald-400'
                  : score >= 70
                  ? 'stroke-cyan-400'
                  : score >= 45
                  ? 'stroke-amber-400'
                  : 'stroke-red-500'
              }`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <span className={`absolute text-xl font-extrabold font-mono ${rating.color}`}>
            {score}
          </span>
        </div>

        <div>
          <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-0.5">
            Code Quality Index
          </div>
          <h4 className={`text-base font-bold flex items-center gap-1.5 ${rating.color}`}>
            <Icon className="w-4 h-4" />
            <span>{rating.label}</span>
          </h4>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {score >= 70 ? 'Passed static review criteria' : 'Review blocking issues before merging'}
          </p>
        </div>
      </div>

      <div className="hidden sm:block text-right">
        <span className="text-xs text-slate-400 font-mono block">Target Score</span>
        <span className="text-sm font-bold text-slate-200 font-mono">≥ 85 / 100</span>
      </div>
    </div>
  );
}
