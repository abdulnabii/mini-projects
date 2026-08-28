'use client';

import { useState } from 'react';
import { RewriteMode, RewriteResponse } from '@/lib/gemini';
import {
  Sparkles,
  Wand2,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Copy,
  Check,
  Flame,
  BookOpen,
  Brain,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  paragraphs: string[];
  targetKeyword: string;
  onRewrite: (paragraph: string, targetKeyword: string, mode: RewriteMode) => Promise<RewriteResponse>;
  isLoading: boolean;
}

const REWRITE_MODES: { id: RewriteMode; label: string; icon: any; desc: string }[] = [
  {
    id: 'READABILITY',
    label: 'Flesch Ease Booster',
    icon: BookOpen,
    desc: 'Simpler sentence structures & plain English (65–75 Flesch)',
  },
  {
    id: 'HOOK',
    label: 'Viral Opening Hook',
    icon: Flame,
    desc: 'Punchy introductory engagement to minimize bounce rate',
  },
  {
    id: 'NLP_KEYWORDS',
    label: 'NLP & Keyword Injection',
    icon: Brain,
    desc: 'Natural keyword integration & semantic topical entities',
  },
  {
    id: 'AUTHORITY',
    label: 'E-E-A-T Thought Leadership',
    icon: ShieldCheck,
    desc: 'Authoritative data-backed technical tone',
  },
];

export default function AISectionRewriter({
  paragraphs,
  targetKeyword,
  onRewrite,
  isLoading,
}: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [selectedMode, setSelectedMode] = useState<RewriteMode>('READABILITY');
  const [rewriteResult, setRewriteResult] = useState<RewriteResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const activeParagraph = paragraphs[selectedIdx] || paragraphs[0] || '';

  const handleTriggerRewrite = async () => {
    if (!activeParagraph) return;
    try {
      const res = await onRewrite(activeParagraph, targetKeyword, selectedMode);
      setRewriteResult(res);
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4'],
      });
    } catch (err) {
      console.error('Rewrite failed:', err);
    }
  };

  const handleCopy = () => {
    if (!rewriteResult) return;
    navigator.clipboard.writeText(rewriteResult.rewrittenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#090d16] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 font-mono text-xs text-slate-300 shadow-2xl sre-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center text-black font-bold shadow-lg shadow-emerald-500/20">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              AI On-Page Section &amp; Paragraph Rewriter
            </h3>
            <p className="text-xs text-slate-400">
              Multi-mode AI rewriter powered by Gemini 1.5 Flash to elevate Flesch ease and weave keywords
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTriggerRewrite}
          disabled={isLoading || !activeParagraph}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-black font-extrabold text-xs font-outfit uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-black" />
              <span>Optimizing Section...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black" />
              <span>AI Rewrite Paragraph</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Rewrite Mode Selection */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
          Select AI Optimization Directive:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {REWRITE_MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedMode(mode.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                    : 'bg-[#04080e] border-white/[0.06] text-slate-400 hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="font-bold text-xs font-outfit">{mode.label}</span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">{mode.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Paragraph Selector Chips */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
          Select Target Paragraph ({paragraphs.length} detected in draft):
        </label>
        <div className="flex flex-wrap gap-2">
          {paragraphs.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedIdx(idx);
                setRewriteResult(null);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs ${
                selectedIdx === idx
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-[#04080e] border border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              Paragraph #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Original vs Rewritten Before/After Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Original Paragraph */}
        <div className="p-5 rounded-2xl bg-[#04080e] border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Original Prose</span>
            <span className="text-[10px] text-amber-400 font-bold font-mono">Current Draft</span>
          </div>
          <p className="text-slate-300 leading-relaxed max-h-48 overflow-y-auto font-mono text-xs prose-text">
            {activeParagraph}
          </p>
        </div>

        {/* AI Rewritten Paragraph */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/50 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              AI Engineered Rewrite ({selectedMode})
            </span>

            {rewriteResult && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-bold cursor-pointer font-mono"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {rewriteResult ? (
            <p className="text-white leading-relaxed max-h-48 overflow-y-auto font-medium font-mono text-xs select-all">
              {rewriteResult.rewrittenText}
            </p>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-2 text-center">
              <Wand2 className="w-6 h-6 text-slate-600" />
              <p className="text-xs">Click "AI Rewrite Paragraph" to generate an optimized version.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Improvement Metrics Delta */}
      {rewriteResult && (
        <div className="p-4 rounded-2xl bg-[#04080e] border border-white/[0.06] space-y-3 animate-in fade-in">
          <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">
            Linguistic &amp; SEO Gain Breakdown:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-[#0f1422] border border-white/[0.04] text-center">
              <span className="text-slate-400 text-[10px] block uppercase">Readability Score Delta</span>
              <p className="text-xl font-black text-emerald-400 font-outfit mt-0.5">
                {rewriteResult.originalFlesch} → {rewriteResult.newFlesch} (+{rewriteResult.fleschDelta} pts)
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0f1422] border border-white/[0.04] text-center">
              <span className="text-slate-400 text-[10px] block uppercase">Calibrated Grade Level</span>
              <p className="text-xl font-black text-indigo-300 font-outfit mt-0.5">
                {rewriteResult.originalGrade} → {rewriteResult.newGrade}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0f1422] border border-white/[0.04] text-center">
              <span className="text-slate-400 text-[10px] block uppercase">Keyword Alignment</span>
              <p className="text-xl font-black text-teal-300 font-outfit mt-0.5">
                {rewriteResult.hasKeyword ? '✅ Seamlessly Placed' : '⚠️ Omitted'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
