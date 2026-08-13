'use client';

import { Problem } from '@/types';
import { FileText, Layers, CheckCircle2, Clock, HelpCircle, Code2 } from 'lucide-react';

interface Props {
  problem: Problem;
  timeRemainingSeconds: number;
}

export default function ProblemPanel({ problem, timeRemainingSeconds }: Props) {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'Medium':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'Hard':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-800';
    }
  };

  return (
    <div className="bg-[#0d1117] border border-emerald-500/20 rounded-3xl p-6 sm:p-7 space-y-6 font-mono text-xs text-slate-300 h-full flex flex-col justify-between overflow-y-auto">
      {/* Problem Header */}
      <div className="space-y-3 border-b border-slate-800 pb-5">
        <div className="flex items-center justify-between gap-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getDifficultyBadge(problem.difficulty)}`}>
            {problem.difficulty}
          </span>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-bold">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Time: {formatTime(timeRemainingSeconds)}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white font-outfit">{problem.title}</h2>
        <p className="text-[11px] text-slate-400">Category: {problem.category}</p>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Problem Description
        </label>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 leading-relaxed text-slate-200 whitespace-pre-wrap">
          {problem.description}
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5" />
          Examples
        </label>
        <div className="space-y-2">
          {problem.examples.map((ex, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
              <div><strong className="text-amber-400">Input:</strong> {ex.input}</div>
              <div><strong className="text-emerald-400">Output:</strong> {ex.output}</div>
              {ex.explanation && (
                <div className="text-slate-400 text-[10px] mt-1">Explanation: {ex.explanation}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Constraints */}
      <div className="space-y-2 pt-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Constraints
        </label>
        <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
          {problem.constraints.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
