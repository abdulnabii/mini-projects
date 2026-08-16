'use client';

import { ReadabilityMetric } from '@/types';
import { BookOpen, Compass, CheckCircle2, Lightbulb, AlertCircle } from 'lucide-react';

interface Props {
  readability: ReadabilityMetric;
}

export default function ReadabilityCard({ readability }: Props) {
  const getFleschColor = (score: number) => {
    if (score >= 65) return 'from-emerald-400 to-teal-500 text-emerald-400';
    if (score >= 50) return 'from-amber-400 to-amber-500 text-amber-400';
    return 'from-rose-500 to-rose-600 text-rose-400';
  };

  return (
    <div className="bg-[#0e1424] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">Flesch-Kincaid Readability Analysis</h3>
            <p className="text-xs text-slate-400">Mathematical linguistic ease &amp; sentence complexity formula</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 font-bold text-[10px]">
          Target: 60–70 (Plain English)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Flesch Score Gauge */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-slate-400 text-[10px] font-bold uppercase">Reading Ease Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-outfit text-white">{readability.fleschScore}</span>
            <span className="text-xs font-bold text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getFleschColor(readability.fleschScore)} rounded-full`}
              style={{ width: `${Math.min(100, Math.max(5, readability.fleschScore))}%` }}
            />
          </div>
          <span className="text-[10px] text-teal-400 font-bold block">{readability.label}</span>
        </div>

        {/* Grade Level */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] font-bold uppercase">US School Grade Level</span>
          <p className="text-2xl font-black text-indigo-300 font-outfit">{readability.gradeLevel}</p>
          <p className="text-[10px] text-slate-500">Ideal for technical and SaaS B2B blogs</p>
        </div>

        {/* Sentence & Syllable Metrics */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] font-bold uppercase">Linguistic Averages</span>
          <div className="space-y-0.5 pt-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Sentence Length:</span>
              <strong className="text-white">{readability.avgSentenceLength} words</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Syllables/Word:</span>
              <strong className="text-white">{readability.avgSyllablesPerWord}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Advice */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-bold block">Editorial Readability Recommendation:</strong>
          <p className="text-slate-300 text-[11px] mt-0.5">{readability.improvementTip}</p>
        </div>
      </div>
    </div>
  );
}
