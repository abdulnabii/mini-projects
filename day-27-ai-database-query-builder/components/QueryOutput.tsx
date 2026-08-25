'use client';

import { useState } from 'react';
import { GeneratedQuery, DatabaseDialect } from '@/types';
import SqlValidatorBadge from './SqlValidatorBadge';
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
  Download,
  Terminal,
  FileCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  queryData: GeneratedQuery;
  onExecute: () => void;
  onSave: () => void;
  isExecuting: boolean;
  onDialectSwitch?: (dialect: DatabaseDialect) => void;
}

export default function QueryOutput({
  queryData,
  onExecute,
  onSave,
  isExecuting,
  onDialectSwitch,
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

  const downloadQueryFile = () => {
    const ext =
      queryData.dialect === 'prisma' || queryData.dialect === 'drizzle'
        ? 'ts'
        : queryData.dialect === 'mongodb'
        ? 'js'
        : 'sql';
    const blob = new Blob([queryData.query], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_${queryData.dialect}_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
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

  // Line numbers generator
  const lines = queryData.query.split('\n');

  return (
    <div className="space-y-6 font-mono">
      {/* Query Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/30 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
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
              onClick={downloadQueryFile}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download raw query file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'text-amber-400 fill-amber-400' : ''}`} />
              <span>{saved ? 'Saved!' : 'Bookmark'}</span>
            </button>

            <button
              type="button"
              disabled={isExecuting}
              onClick={onExecute}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{isExecuting ? 'Running...' : 'Run Query Sandbox'}</span>
            </button>
          </div>
        </div>

        {/* Safety Audit Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#161b22] border border-slate-800">
          <SqlValidatorBadge dialect={queryData.dialect} hasLimit={true} />
          <span className="text-[10px] text-slate-500">
            Est. Latency: <strong className="text-cyan-300">{queryData.executionTimeEstimate || '~28ms'}</strong>
          </span>
        </div>

        {/* Code Editor Container with Line Numbers */}
        <div className="relative rounded-2xl bg-[#04080e] border border-slate-800 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1117] border-b border-slate-800 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5 font-bold">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{queryData.dialect.toUpperCase()} Code Viewer</span>
            </span>
            <span>{lines.length} lines • UTF-8</span>
          </div>

          <div className="flex p-4 overflow-x-auto text-xs font-mono leading-relaxed">
            {/* Line numbers column */}
            <div className="select-none text-slate-600 text-right pr-4 border-r border-slate-800/80 mr-4 font-mono">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code column */}
            <pre className="text-emerald-300 whitespace-pre-wrap selection:bg-emerald-500/30 flex-1">
              {queryData.query}
            </pre>
          </div>
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
