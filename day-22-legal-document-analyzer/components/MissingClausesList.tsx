'use client';

import { MissingClause } from '@/types';
import { AlertOctagon, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  missing: MissingClause[];
}

export default function MissingClausesList({ missing }: Props) {
  if (missing.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-[#0d1117] border border-slate-800 text-center space-y-2 font-mono">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
        <h4 className="font-bold text-white text-base font-outfit">Standard Protections Present</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          No critical standard clauses appear to be omitted from this document.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>Missing Standard Protections ({missing.length})</span>
        </h3>
        <span className="text-xs text-slate-400">Omission Analysis</span>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {missing.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-5 rounded-2xl bg-[#0d1117] border border-amber-500/30 space-y-3 hover:border-amber-500/50 transition-all shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
                <h4 className="font-bold text-white text-sm font-outfit">{item.clause}</h4>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                  item.importance === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : item.importance === 'IMPORTANT'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                }`}
              >
                {item.importance}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Danger of Omission:</span>
              <p className="text-slate-200 font-sans leading-relaxed">{item.risk}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#161b22] border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                Standard Industry Benchmark:
              </span>
              <p className="text-slate-300 font-sans leading-relaxed">{item.standardRecommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
