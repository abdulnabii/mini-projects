'use client';

import { useState } from 'react';
import { GeneratedQuery } from '@/types';
import {
  Copy,
  Check,
  Play,
  Bookmark,
  Sparkles,
  Zap,
  Info,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Code2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  queryData: GeneratedQuery;
  onExecute: () => void;
  onSave: () => void;
  isExecuting: boolean;
}

export default function QueryOutput({
  queryData,
  onExecute,
  onSave,
  isExecuting,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const copyQuery = () => {
    navigator.clipboard.writeText(queryData.query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4'],
    });
  };

  const getComplexityBadge = (c: GeneratedQuery['estimatedComplexity']) => {
    switch (c) {
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'HIGH':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Query Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/30 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase">
                {queryData.dialect.toUpperCase()} GENERATED QUERY
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${getComplexityBadge(
                  queryData.estimatedComplexity
                )}`}
              >
                {queryData.estimatedComplexity} COMPLEXITY
              </span>
            </div>
            <h4 className="text-sm font-bold text-white font-outfit truncate max-w-xl">
              "{queryData.question}"
            </h4>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={copyQuery}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'text-amber-400 fill-amber-400' : ''}`} />
              <span>{saved ? 'Saved in Library!' : 'Bookmark'}</span>
            </button>

            <button
              type="button"
              disabled={isExecuting}
              onClick={onExecute}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{isExecuting ? 'Running Query...' : 'Run Query Sandbox'}</span>
            </button>
          </div>
        </div>

        {/* Code Editor Preview Box */}
        <div className="relative rounded-2xl bg-[#04080e] border border-slate-800 p-5 overflow-x-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Formatted {queryData.dialect.toUpperCase()} Syntax</span>
            </span>
            <span>Estimated Latency: {queryData.executionTimeEstimate || '~30ms'}</span>
          </div>

          <pre className="text-xs text-emerald-300 font-mono leading-relaxed whitespace-pre-wrap selection:bg-emerald-500/40">
            {queryData.query}
          </pre>
        </div>

        {/* 2-Sentence Plain English Explanation Card */}
        {queryData.explanation && (
          <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1.5 text-xs font-sans">
            <div className="font-bold text-white font-mono flex items-center gap-1.5 text-[11px]">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Query Execution Logic &amp; Relational Map:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {queryData.explanation}
            </p>
          </div>
        )}

        {/* Index Optimization & Performance Tips */}
        {queryData.optimizationTips && queryData.optimizationTips.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#161b22] border border-emerald-500/20 space-y-2 text-xs">
            <div className="font-bold text-emerald-400 font-mono flex items-center gap-1.5 text-[11px] uppercase">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Production Indexes &amp; Optimizations:</span>
            </div>

            <ul className="space-y-1.5 text-slate-300 font-sans">
              {queryData.optimizationTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-mono font-bold">→</span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
