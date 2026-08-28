'use client';

import { SEOAuditResult } from '@/types';
import {
  Award,
  Compass,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Search,
  MousePointerClick,
  Eye,
  ShieldCheck,
  Target,
  Sparkles,
  Zap,
} from 'lucide-react';

interface Props {
  result: SEOAuditResult;
}

export default function SEOScoreOverview({ result }: Props) {
  const getGradeStyle = (g: string) => {
    if (g.startsWith('A')) return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/15 shadow-lg shadow-emerald-500/25';
    if (g.startsWith('B')) return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/15 shadow-lg shadow-cyan-500/25';
    if (g.startsWith('C')) return 'text-amber-400 border-amber-500/50 bg-amber-500/15 shadow-lg shadow-amber-500/25';
    return 'text-rose-400 border-rose-500/50 bg-rose-500/15 shadow-lg shadow-rose-500/25';
  };

  // SVG Circular Gauge calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.overallScore / 100) * circumference;

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* 1. Main Scorecard Banner with Radial SVG Meter & E-E-A-T Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-emerald-500/30 space-y-6 shadow-2xl shadow-emerald-500/5 sre-card">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/[0.08] pb-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Overall On-Page SEO Health
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                <Target className="w-3 h-3 text-cyan-400" />
                Target Intent: <strong className="text-white">{result.eeat.searchIntent} ({result.eeat.intentConfidence}%)</strong>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit tracking-tight">
              Content Diagnostic Scorecard
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed prose-text">
              {result.headlineSummary}
            </p>
          </div>

          <div className="flex items-center gap-5 shrink-0 w-full sm:w-auto justify-end">
            {/* SVG Radial Score Ring */}
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="7"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-white font-outfit leading-none">
                  {result.overallScore}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">/100</span>
              </div>
            </div>

            {/* Letter Grade Badge */}
            <div
              className={`w-18 h-18 rounded-2xl border-2 flex flex-col items-center justify-center font-outfit font-black ${getGradeStyle(
                result.grade
              )}`}
            >
              <span className="text-3xl leading-none">{result.grade}</span>
              <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">GRADE</span>
            </div>
          </div>
        </div>

        {/* 2. Google E-E-A-T Metric Breakdown Bar */}
        <div className="p-4 rounded-2xl bg-[#04080e] border border-white/[0.06] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Google E-E-A-T Quality Score: {result.eeat.compositeEEAT}/100
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">
              {result.eeat.compositeEEAT >= 80 ? 'Authoritative Trust Signal' : 'Good Foundation'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {/* Experience */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Experience:</span>
                <strong className="text-white font-mono">{result.eeat.experienceScore}%</strong>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${result.eeat.experienceScore}%` }} />
              </div>
            </div>

            {/* Expertise */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Expertise:</span>
                <strong className="text-white font-mono">{result.eeat.expertiseScore}%</strong>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-400 h-full rounded-full" style={{ width: `${result.eeat.expertiseScore}%` }} />
              </div>
            </div>

            {/* Authoritativeness */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Authoritativeness:</span>
                <strong className="text-white font-mono">{result.eeat.authoritativenessScore}%</strong>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${result.eeat.authoritativenessScore}%` }} />
              </div>
            </div>

            {/* Trustworthiness */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Trustworthiness:</span>
                <strong className="text-white font-mono">{result.eeat.trustworthinessScore}%</strong>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${result.eeat.trustworthinessScore}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 4 Health Check Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Keyword Density */}
          <div className="p-4 rounded-2xl bg-[#0f1422] border border-white/[0.06] space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Keyword Density</span>
            <p className="text-lg font-black text-emerald-400 font-outfit">
              {result.keywordDensity.densityPercent}% ({result.keywordDensity.occurrences}x)
            </p>
            <span className="text-[10px] text-slate-500 capitalize">{result.keywordDensity.status}</span>
          </div>

          {/* Flesch Readability */}
          <div className="p-4 rounded-2xl bg-[#0f1422] border border-white/[0.06] space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Readability Ease</span>
            <p className="text-lg font-black text-teal-400 font-outfit">
              {result.readability.fleschScore}/100
            </p>
            <span className="text-[10px] text-slate-500">{result.readability.gradeLevel}</span>
          </div>

          {/* Headings */}
          <div className="p-4 rounded-2xl bg-[#0f1422] border border-white/[0.06] space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Heading Tags</span>
            <p className="text-lg font-black text-amber-400 font-outfit">
              H1:{result.headingStructure.h1Count} • H2:{result.headingStructure.h2Count}
            </p>
            <span className="text-[10px] text-slate-500">
              {result.headingStructure.hasSkippedLevels ? 'Hierarchy warning' : 'Clean hierarchy'}
            </span>
          </div>

          {/* Word Count */}
          <div className="p-4 rounded-2xl bg-[#0f1422] border border-white/[0.06] space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Total Words</span>
            <p className="text-lg font-black text-indigo-300 font-outfit">
              {result.readability.totalWords}
            </p>
            <span className="text-[10px] text-slate-500">~{result.readability.readingTimeMinutes} min read</span>
          </div>
        </div>
      </div>

      {/* 3. Projected Google Search Console (GSC) Performance */}
      <div className="p-6 rounded-3xl bg-[#090d16] border border-white/[0.08] space-y-4 sre-card">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Projected Google Search Console (GSC) Ranking Footprint
          </h3>
          <span className="text-emerald-400 font-bold text-[10px] font-mono">SERP Algorithm Simulator</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#04080e] border border-white/[0.06] space-y-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Estimated SERP Rank</span>
            <p className="text-2xl font-black text-emerald-400 font-outfit">
              Pos #{result.gscPerformance.estimatedPosition}
            </p>
            <span className="text-[10px] text-slate-500">Page {Math.ceil(result.gscPerformance.estimatedPosition / 10)} on Google</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#04080e] border border-white/[0.06] space-y-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Projected CTR</span>
            <p className="text-2xl font-black text-teal-400 font-outfit">
              {result.gscPerformance.projectedCTR}%
            </p>
            <span className="text-[10px] text-slate-500">Click-through probability</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#04080e] border border-white/[0.06] space-y-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Monthly Clicks</span>
            <p className="text-2xl font-black text-indigo-300 font-outfit">
              ~{result.gscPerformance.projectedMonthlyClicks.toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-500">Organic visitors</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#04080e] border border-white/[0.06] space-y-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Search Impressions</span>
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
