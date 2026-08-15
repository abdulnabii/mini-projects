'use client';

import { getQualityDescriptor } from '@/lib/sm2';
import { Award, Zap } from 'lucide-react';

interface Props {
  onRate: (qualityScore: number) => void;
  disabled?: boolean;
}

export default function SM2RatingBar({ onRate, disabled }: Props) {
  const scores = [0, 1, 2, 3, 4, 5];

  return (
    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs text-slate-300">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          SM-2 Recall Quality Rating (How well did you remember?)
        </label>
        <span className="text-[10px] text-emerald-400 font-bold">+10 XP Earned</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
        {scores.map((score) => {
          const desc = getQualityDescriptor(score);
          return (
            <button
              key={score}
              type="button"
              disabled={disabled}
              onClick={() => onRate(score)}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 text-left transition-all group flex flex-col justify-between gap-1 disabled:opacity-40"
            >
              <div className="flex items-center justify-between">
                <span className={`w-6 h-6 rounded-lg ${desc.color} text-white font-black flex items-center justify-center text-xs font-outfit shadow-md`}>
                  {score}
                </span>
              </div>
              <span className="font-bold text-white text-[11px] group-hover:text-emerald-400 transition-colors">
                {desc.label.split('—')[1]?.trim() || desc.label}
              </span>
              <span className="text-[9px] text-slate-500 line-clamp-1">{desc.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
