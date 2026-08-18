'use client';

import { SubjectLineCandidate } from '@/types';
import { Target, Sparkles, Check, TrendingUp } from 'lucide-react';

interface Props {
  candidates: SubjectLineCandidate[];
  selectedIndex: number;
  onSelectSubject: (index: number, subject: string) => void;
}

export default function SubjectOptimizer({ candidates, selectedIndex, onSelectSubject }: Props) {
  return (
    <div className="bg-[#131b2e] border border-indigo-500/20 rounded-3xl p-6 sm:p-8 space-y-5 font-mono text-xs text-slate-300 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-outfit">
            <Target className="w-5 h-5 text-indigo-400" />
            Subject Line Open Rate Optimizer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            5 high-converting subject candidates ranked by predictive NLP open rate algorithm.
          </p>
        </div>
        <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
          PREDICTIVE AI
        </span>
      </div>

      <div className="space-y-3">
        {candidates.map((item, idx) => {
          const isSelected = selectedIndex === idx;

          let scoreColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
          if (item.predictedOpenRate < 55) scoreColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';

          return (
            <div
              key={idx}
              onClick={() => onSelectSubject(idx, item.subject)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-indigo-500/15 border-indigo-400 text-white shadow-lg shadow-indigo-500/10'
                  : 'bg-[#0b0f19] border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 truncate pr-2">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-700'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>

                <div className="space-y-0.5 truncate">
                  <span className="text-xs font-bold block font-outfit truncate">{item.subject}</span>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span>
                      Strategy: <strong className="text-indigo-400">{item.strategy}</strong>
                    </span>
                    <span>• {item.characterCount} chars</span>
                  </div>
                </div>
              </div>

              <div className={`px-3 py-1 rounded-xl border text-xs font-bold tabular-nums shrink-0 font-outfit ${scoreColor}`}>
                {item.predictedOpenRate}% Open Rate
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
