'use client';

import React from 'react';
import { Award, AlertOctagon, CheckCircle2, Flame, Terminal } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  const getRating = (score: number) => {
    if (score >= 90) return { label: 'Clean Code (Production Ready)', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-500/40', icon: CheckCircle2 };
    if (score >= 70) return { label: 'Good Quality (Minor Tweaks)', color: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-500/40', icon: Award };
    if (score >= 45) return { label: 'Needs Refactoring', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-500/40', icon: AlertOctagon };
    return { label: 'CRITICAL VULNERABILITY / UNSAFE', color: 'text-red-400', bg: 'bg-red-950/50 border-red-500/50', icon: Flame };
  };

  const rating = getRating(score);
  const Icon = rating.icon;

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${rating.bg} backdrop-blur-xl transition-all shadow-xl font-mono`}>
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-zinc-800"
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
                  ? 'stroke-purple-400'
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
          <div className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 mb-1 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>AST Code Quality Index</span>
          </div>
          <h4 className={`text-sm sm:text-base font-bold flex items-center gap-1.5 ${rating.color}`}>
            <Icon className="w-4 h-4" />
            <span>{rating.label}</span>
          </h4>
          <p className="text-[11px] text-zinc-400 mt-1">
            {score >= 70 ? 'Static checks passed with minor notes' : 'Pull Request review blocking concerns detected'}
          </p>
        </div>
      </div>

      <div className="hidden sm:block text-right">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Target Benchmark</span>
        <span className="text-xs font-bold text-emerald-400">≥ 85 / 100</span>
      </div>
    </div>
  );
}
