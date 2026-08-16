'use client';

import { useState } from 'react';
import { RewriteResponse } from '@/lib/gemini';
import { Sparkles, Wand2, ArrowRight, CheckCircle2, TrendingUp, RefreshCw, Copy, Check } from 'lucide-react';

interface Props {
  paragraphs: string[];
  targetKeyword: string;
  onRewrite: (paragraph: string, targetKeyword: string) => Promise<RewriteResponse>;
  isLoading: boolean;
}

export default function AISectionRewriter({
  paragraphs,
  targetKeyword,
  onRewrite,
  isLoading,
}: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [rewriteResult, setRewriteResult] = useState<RewriteResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const activeParagraph = paragraphs[selectedIdx] || paragraphs[0] || '';

  const handleTriggerRewrite = async () => {
    if (!activeParagraph) return;
    const res = await onRewrite(activeParagraph, targetKeyword);
    setRewriteResult(res);
  };

  const handleCopy = () => {
    if (!rewriteResult) return;
    navigator.clipboard.writeText(rewriteResult.rewrittenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0e1424] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center text-black font-bold">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">AI On-Page Section &amp; Paragraph Rewriter</h3>
            <p className="text-xs text-slate-400">Rewrites dense prose to elevate Flesch ease and weave keywords into openings</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTriggerRewrite}
          disabled={isLoading || !activeParagraph}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-extrabold text-xs font-outfit uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
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

      {/* Paragraph Selector Chips */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Select Paragraph to Optimize ({paragraphs.length} detected)
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
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedIdx === idx
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Paragraph #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Original vs Rewritten Before/After Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Paragraph */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Original Prose</span>
            <span className="text-[10px] text-amber-400 font-bold">Current Version</span>
          </div>
          <p className="text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
            {activeParagraph}
          </p>
        </div>

        {/* AI Rewritten Paragraph */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/50 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              SEO-Engineered AI Rewrite
            </span>

            {rewriteResult && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-bold"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {rewriteResult ? (
            <p className="text-white leading-relaxed max-h-48 overflow-y-auto font-medium">
              {rewriteResult.rewrittenText}
            </p>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-2 text-center">
              <Wand2 className="w-6 h-6 text-slate-600" />
              <p>Click "AI Rewrite Paragraph" to generate an optimized version.</p>
            </div>
          )}
        </div>
      </div>

      {/* Improvement Metrics Delta */}
      {rewriteResult && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
          <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
            Linguistic &amp; SEO Gain Breakdown
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block">Readability Score Delta</span>
              <p className="text-xl font-black text-emerald-400 font-outfit">
                {rewriteResult.originalFlesch} → {rewriteResult.newFlesch} (+{rewriteResult.fleschDelta} pts)
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block">Target Grade Level</span>
              <p className="text-xl font-black text-indigo-300 font-outfit">
                {rewriteResult.originalGrade} → {rewriteResult.newGrade}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block">Keyword in Opening</span>
              <p className="text-xl font-black text-teal-300 font-outfit">
                {rewriteResult.hasKeyword ? '✅ Placed' : '⚠️ Omitted'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
