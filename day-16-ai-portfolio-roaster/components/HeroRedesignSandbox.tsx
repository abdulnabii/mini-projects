'use client';

import { useState } from 'react';
import { RoastResult } from '@/types';
import { Sparkles, ArrowRight, Download, Check, ShieldCheck, ExternalLink, Flame } from 'lucide-react';

interface Props {
  roast: RoastResult;
}

export default function HeroRedesignSandbox({ roast }: Props) {
  const [viewMode, setViewMode] = useState<'split' | 'before' | 'after'>('split');
  const bioInfo = roast.rewrittenHeroBio;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1420] border border-slate-800 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              Hero Section Transformation: Before vs. S-Tier Redesign
            </h3>
            <p className="text-xs text-slate-400">
              Interactive side-by-side comparison of your unoptimized hero vs. high-converting recruiter architecture
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              viewMode === 'split' ? 'bg-orange-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Split View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('before')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              viewMode === 'before' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Before
          </button>
          <button
            type="button"
            onClick={() => setViewMode('after')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              viewMode === 'after' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            After (S-Tier)
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* BEFORE HERO */}
        {(viewMode === 'split' || viewMode === 'before') && (
          <div className="p-6 rounded-3xl bg-slate-950 border-2 border-rose-500/30 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold uppercase">
                ❌ Current Unoptimized Hero
              </span>
              <span className="text-[10px] text-slate-500">Low Recruiter Retention</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-slate-900 space-y-3">
              <span className="text-xl font-bold text-slate-400 font-sans">
                Hi, I&apos;m {roast.developerName} 👋
              </span>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                &quot;{bioInfo.beforeBio || 'I am a passionate software developer looking for exciting opportunities.'}&quot;
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  disabled
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-500 text-xs opacity-60"
                >
                  Contact Me (Mailto)
                </button>
                <button
                  type="button"
                  disabled
                  className="px-3.5 py-1.5 rounded-lg border border-slate-800 text-slate-600 text-xs opacity-60"
                >
                  View My Work
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-300 text-[11px] space-y-1">
              <p className="font-bold">⚠️ Critical Recruiter Bottlenecks:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[10px] text-rose-200/80">
                <li>No quantified impact or architectural specialty stated</li>
                <li>Zero 1-click ATS PDF resume download button</li>
                <li>Generic greeting with low hook strength</li>
              </ul>
            </div>
          </div>
        )}

        {/* AFTER S-TIER HERO */}
        {(viewMode === 'split' || viewMode === 'after') && (
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0e1726] to-[#070c14] border-2 border-emerald-500/50 space-y-4 relative overflow-hidden shadow-2xl shadow-emerald-500/10">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 text-emerald-400" />
                ✨ S-Tier High-Converting Redesign
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">FAANG Recruiter Magnet</span>
            </div>

            <div className="p-5 rounded-2xl bg-black/60 border border-slate-800 space-y-3.5 shadow-xl">
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{bioInfo.improvedTagline || 'Engineering high-impact web products'}</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white font-outfit tracking-tight">
                {roast.developerName}
              </h4>

              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                {bioInfo.afterBio ||
                  'Software Engineer specialized in high-performance web systems, cloud backends, and low-latency API architectures.'}
              </p>

              {/* Verified Tech Keywords */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {bioInfo.targetKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-teal-300 text-[10px] font-bold"
                  >
                    #{kw}
                  </span>
                ))}
              </div>

              {/* High Converting Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resume (PDF)</span>
                </button>
                <button
                  type="button"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <span>Featured Case Studies</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-[11px]">
              <p className="font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Key High-Impact Additions:
              </p>
              <p className="text-[10px] text-emerald-100/80 mt-0.5">
                Quantified specialty hook • High-contrast typography • Direct ATS PDF resume CTA • Zero-click tech tags
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
