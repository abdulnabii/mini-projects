'use client';

import { SEOAuditResult } from '@/types';
import { Award, Compass, TrendingUp, CheckCircle2, AlertTriangle, Search, MousePointerClick, Eye } from 'lucide-react';

interface Props {
  result: SEOAuditResult;
}

export default function SEOScoreOverview({ result }: Props) {
  const getGradeColor = (g: string) => {
    if (g.startsWith('A')) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 shadow-emerald-500/20';
    if (g.startsWith('B')) return 'text-teal-400 border-teal-500/40 bg-teal-500/10 shadow-teal-500/20';
    if (g.startsWith('C')) return 'text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-amber-500/20';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10 shadow-rose-500/20';
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* 1. Main Scorecard Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1424] border-2 border-emerald-500/40 space-y-6 shadow-2xl shadow-emerald-500/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              SEO Health Score &amp; SERP Quality Rating
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              Content Optimization Diagnosis
            </h2>
            <p className="text-slate-400 text-xs">{result.headlineSummary}</p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Score Pill */}
            <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-0.5">
              <span className="text-3xl sm:text-4xl font-black font-outfit text-white">
                {result.overallScore}
                <span className="text-sm font-normal text-slate-500">/100</span>
              </span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Composite Score</span>
            </div>

            {/* Grade Badge */}
            <div
              className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-outfit font-black shadow-xl ${getGradeColor(
                result.grade
              )}`}
            >
              <span className="text-2xl leading-none">{result.grade}</span>
              <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">GRADE</span>
            </div>
          </div>
        </div>

        {/* 4 Health Check Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Keyword Density */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Keyword Density</span>
            <p className="text-lg font-black text-emerald-400 font-outfit">
              {result.keywordDensity.densityPercent}% ({result.keywordDensity.occurrences}x)
            </p>
            <span className="text-[10px] text-slate-500 capitalize">{result.keywordDensity.status}</span>
          </div>

          {/* Flesch Readability */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Readability Ease</span>
            <p className="text-lg font-black text-teal-400 font-outfit">
              {result.readability.fleschScore}/100
            </p>
            <span className="text-[10px] text-slate-500">{result.readability.gradeLevel}</span>
          </div>

          {/* Headings */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Heading Tags</span>
            <p className="text-lg font-black text-amber-400 font-outfit">
              H1:{result.headingStructure.h1Count} • H2:{result.headingStructure.h2Count}
            </p>
            <span className="text-[10px] text-slate-500">
              {result.headingStructure.hasSkippedLevels ? 'Hierarchy warning' : 'Clean hierarchy'}
            </span>
          </div>

          {/* Word Count */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Words</span>
            <p className="text-lg font-black text-indigo-300 font-outfit">
              {result.readability.totalWords}
            </p>
            <span className="text-[10px] text-slate-500">~{result.readability.readingTimeMinutes} min read</span>
          </div>
        </div>
      </div>

      {/* 2. Projected Google Search Console (GSC) Performance */}
      <div className="p-6 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm font-outfit flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Projected Google Search Console (GSC) Ranking Potential
          </h3>
          <span className="text-emerald-400 font-bold text-[10px]">SERP Simulation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Estimated SERP Rank</span>
            <p className="text-2xl font-black text-emerald-400 font-outfit">
              Pos #{result.gscPerformance.estimatedPosition}
            </p>
            <span className="text-[10px] text-slate-500">Page {Math.ceil(result.gscPerformance.estimatedPosition / 10)}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Projected CTR</span>
            <p className="text-2xl font-black text-teal-400 font-outfit">
              {result.gscPerformance.projectedCTR}%
            </p>
            <span className="text-[10px] text-slate-500">Click-through probability</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Monthly Clicks</span>
            <p className="text-2xl font-black text-indigo-300 font-outfit">
              ~{result.gscPerformance.projectedMonthlyClicks.toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-500">Organic visitors</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Monthly Impressions</span>
            <p className="text-2xl font-black text-amber-400 font-outfit">
              {result.gscPerformance.projectedImpressions.toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-500">Search volume footprint</span>
          </div>
        </div>
      </div>
    </div>
  );
}
