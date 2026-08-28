'use client';

import { CompetitorBenchmark } from '@/types';
import { BarChart3, TrendingUp, CheckCircle2, ArrowRight, ShieldCheck, Layers } from 'lucide-react';

interface Props {
  benchmark: CompetitorBenchmark;
}

export default function CompetitorBenchmarkCard({ benchmark }: Props) {
  const wordDiff = benchmark.userWords - benchmark.avgTop10Words;
  const headingDiff = benchmark.userHeadings - benchmark.avgTop10Headings;
  const readabilityDiff = benchmark.userReadability - benchmark.avgTop10Readability;
  const densityDiff = Number((benchmark.userKeywordDensity - benchmark.avgTop10KeywordDensity).toFixed(2));

  return (
    <div className="bg-[#090d16] border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6 font-mono text-xs text-slate-300 shadow-xl sre-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">Top-10 SERP Competitor Benchmark</h3>
            <p className="text-xs text-slate-400">Compares your article against Google Page 1 ranking averages</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold text-[10px]">
          Live SERP Index Baseline
        </span>
      </div>

      {/* Comparison Matrix Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Word Count */}
        <div className="p-4 rounded-2xl bg-[#04080e] border border-white/[0.06] space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Content Depth</span>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-black text-white font-outfit">{benchmark.userWords}</span>
              <span className="text-[10px] text-slate-500 block">Your Word Count</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-400 font-outfit">{benchmark.avgTop10Words}</span>
              <span className="text-[10px] text-slate-500 block">Top-10 Avg</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
            <span>Delta:</span>
            <strong className={wordDiff >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
              {wordDiff >= 0 ? `+${wordDiff} words (Optimal)` : `${wordDiff} words (Needs Expansion)`}
            </strong>
          </div>
        </div>

        {/* Headings */}
        <div className="p-4 rounded-2xl bg-[#04080e] border border-white/[0.06] space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Structural Headings</span>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-black text-white font-outfit">{benchmark.userHeadings}</span>
              <span className="text-[10px] text-slate-500 block">Your H-Tags</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-400 font-outfit">{benchmark.avgTop10Headings}</span>
              <span className="text-[10px] text-slate-500 block">Top-10 Avg</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
            <span>Coverage:</span>
            <strong className={headingDiff >= -2 ? 'text-emerald-400' : 'text-amber-400'}>
              {headingDiff >= 0 ? 'Exceeds Benchmark' : 'Balanced Structure'}
            </strong>
          </div>
        </div>

        {/* Readability */}
        <div className="p-4 rounded-2xl bg-[#04080e] border border-white/[0.06] space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Reading Ease</span>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-black text-white font-outfit">{benchmark.userReadability}</span>
              <span className="text-[10px] text-slate-500 block">Your Flesch Ease</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-400 font-outfit">{benchmark.avgTop10Readability}</span>
              <span className="text-[10px] text-slate-500 block">Top-10 Avg</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
            <span>Linguistic Grade:</span>
            <strong className={readabilityDiff >= 0 ? 'text-emerald-400' : 'text-cyan-400'}>
              {readabilityDiff >= 0 ? `+${readabilityDiff} pts Easier` : 'Technical Complexity'}
            </strong>
          </div>
        </div>

        {/* Keyword Density */}
        <div className="p-4 rounded-2xl bg-[#04080e] border border-white/[0.06] space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Keyword Focus</span>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-black text-white font-outfit">{benchmark.userKeywordDensity}%</span>
              <span className="text-[10px] text-slate-500 block">Your Density</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-400 font-outfit">{benchmark.avgTop10KeywordDensity}%</span>
              <span className="text-[10px] text-slate-500 block">Top-10 Avg</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
            <span>Natural Flow:</span>
            <strong className="text-emerald-400 font-bold">
              {Math.abs(densityDiff) <= 0.8 ? 'Optimal Alignment' : 'Within Threshold'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
