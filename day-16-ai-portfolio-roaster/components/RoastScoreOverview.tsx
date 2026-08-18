'use client';

import { RoastResult } from '@/types';
import { Flame, Trophy, Sparkles, AlertOctagon, CheckCircle2, ShieldAlert, Award, ArrowUpRight } from 'lucide-react';

interface Props {
  roast: RoastResult;
  onOpenFixModal: () => void;
}

export default function RoastScoreOverview({ roast, onOpenFixModal }: Props) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 shadow-emerald-500/20';
    if (s >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-amber-500/20';
    if (s >= 40) return 'text-orange-400 border-orange-500/40 bg-orange-500/10 shadow-orange-500/20';
    return 'text-rose-500 border-rose-500/40 bg-rose-500/10 shadow-rose-500/20';
  };

  const getHeatEmoji = (intensity: string) => {
    if (intensity === 'nuclear') return '💀 NUCLEAR BLAST';
    if (intensity === 'spicy') return '🔥 SPICY GORDON RAMSAY';
    return '🛡️ MILD CONSTRUCTIVE';
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* 1. Main Score Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1420] border-2 border-orange-500/40 space-y-6 shadow-2xl shadow-orange-500/10 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-800 pb-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                {getHeatEmoji(roast.intensity)}
              </span>
              <span className="text-slate-500 text-[11px]">• {new Date(roast.createdAt).toLocaleDateString()}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white font-outfit">
              {roast.developerName}’s Portfolio Audit
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-sans italic">&quot;{roast.overallVerdict}&quot;</p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Overall Score Pill */}
            <div className="px-5 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-0.5 shadow-xl">
              <span className="text-3xl sm:text-5xl font-black font-outfit text-white">
                {roast.overallScore}
                <span className="text-sm font-normal text-slate-500">/100</span>
              </span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Portfolio Score</span>
            </div>

            {/* Survival Badge Icon */}
            <div
              className={`px-4 py-3 rounded-2xl border-2 flex flex-col items-center justify-center font-outfit font-black shadow-xl text-center max-w-[140px] ${getScoreColor(
                roast.overallScore
              )}`}
            >
              <Award className="w-6 h-6 mb-1" />
              <span className="text-[10px] leading-tight font-mono uppercase">{roast.survivalBadge}</span>
            </div>
          </div>
        </div>

        {/* 2. Top Roast Punchline Callout Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/60 via-red-950/40 to-slate-950 border border-orange-500/50 space-y-2 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-orange-400 flex items-center gap-1.5 font-mono">
              <Flame className="w-4 h-4 fill-orange-400 text-orange-400 animate-pulse" />
              Chief Roaster&apos;s Devastating Truth
            </span>
            <button
              type="button"
              onClick={onOpenFixModal}
              className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Fix My Bio &amp; Hero</span>
            </button>
          </div>
          <p className="text-sm sm:text-base text-white font-serif font-bold leading-relaxed">
            &quot;{roast.topRoastPunchline}&quot;
          </p>
        </div>

        {/* 3. 5-Dimension Mini Scorecards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Design &amp; Layout</span>
            <p className="text-xl font-black text-orange-400 font-outfit">
              {roast.categories.design.score}
              <span className="text-xs text-slate-500 font-normal"> ({roast.categories.design.grade})</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Projects &amp; Depth</span>
            <p className="text-xl font-black text-amber-400 font-outfit">
              {roast.categories.projects.score}
              <span className="text-xs text-slate-500 font-normal"> ({roast.categories.projects.grade})</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase">About Section</span>
            <p className="text-xl font-black text-rose-400 font-outfit">
              {roast.categories.aboutBio.score}
              <span className="text-xs text-slate-500 font-normal"> ({roast.categories.aboutBio.grade})</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase">UX &amp; Speed</span>
            <p className="text-xl font-black text-teal-400 font-outfit">
              {roast.categories.uxAndSpeed.score}
              <span className="text-xs text-slate-500 font-normal"> ({roast.categories.uxAndSpeed.grade})</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase">ATS Hireability</span>
            <p className="text-xl font-black text-indigo-300 font-outfit">
              {roast.categories.recruiterAppeal.score}
              <span className="text-xs text-slate-500 font-normal"> ({roast.categories.recruiterAppeal.grade})</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
