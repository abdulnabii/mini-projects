'use client';

import { useState, useEffect } from 'react';
import { PerformanceAnalysis } from '@/types';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Zap,
  Layers,
  Database,
  Cpu,
  ArrowUpRight,
  Lightbulb,
  Loader2,
  BrainCircuit,
} from 'lucide-react';

interface Props {
  analysis?: PerformanceAnalysis;
  isLoading?: boolean;
}

const STREAM_PHASES = [
  'Parsing latency percentiles & P99/P50 tail ratio...',
  'Evaluating connection pool queues & socket saturation...',
  'Synthesizing architectural remediation with Gemini 1.5 Flash...',
];

export default function AIBottleneckDiagnostic({ analysis, isLoading }: Props) {
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentPhaseIdx((prev) => (prev + 1) % STREAM_PHASES.length);
      }, 1800);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="p-12 sm:p-16 rounded-3xl bg-[#09152b] border-2 border-cyan-500/40 shadow-2xl flex flex-col items-center justify-center text-center space-y-6 font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-indigo-500/5 to-purple-500/5 animate-pulse" />

        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-xl shadow-cyan-500/20 animate-neural-pulse">
          <BrainCircuit className="w-10 h-10" />
        </div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
              Gemini 1.5 Flash AI Engine Active
            </span>
          </div>

          <h4 className="text-xl sm:text-2xl font-black text-white font-outfit">
            Diagnosing Root Causes &amp; System Bottlenecks...
          </h4>

          <p className="text-xs text-slate-300 font-mono transition-all duration-300 h-6">
            {STREAM_PHASES[currentPhaseIdx]}
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const getVerdictStyle = (v: string) => {
    if (v === 'PASS')
      return {
        label: 'PASSED BENCHMARK SLA',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        icon: ShieldCheck,
      };
    if (v === 'WARNING')
      return {
        label: 'WARNING — LATENCY DEGRADATION',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        icon: AlertTriangle,
      };
    return {
      label: 'CRITICAL FAILURE — BOTTLENECK DETECTED',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: XCircle,
    };
  };

  const vInfo = getVerdictStyle(analysis.verdict);
  const VerdictIcon = vInfo.icon;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#09152b] border-2 border-cyan-500/40 shadow-2xl space-y-6 font-sans">
      {/* Header & Verdict */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-black border flex items-center gap-1.5 ${vInfo.badge}`}>
              <VerdictIcon className="w-4 h-4" />
              <span>{vInfo.label}</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-outfit">
            AI Performance &amp; Root-Cause Diagnostics
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Reliability Score */}
        <div className="p-4 px-6 rounded-2xl bg-slate-950 border border-white/10 text-center shrink-0">
          <span className="text-3xl font-black font-mono text-cyan-400 leading-none">
            {analysis.performanceScore}
            <span className="text-xs text-slate-400">/100</span>
          </span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mt-1">
            Reliability Score
          </span>
        </div>
      </div>

      {/* Identified Bottlenecks */}
      {analysis.bottlenecks && analysis.bottlenecks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Identified System Bottlenecks ({analysis.bottlenecks.length})
          </h4>

          <div className="grid grid-cols-1 gap-4">
            {analysis.bottlenecks.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-slate-950/90 border border-white/10 space-y-3 hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wide">
                      {b.type.replace(/_/g, ' ')}
                    </span>
                    <h5 className="font-extrabold text-white text-base font-outfit">{b.title}</h5>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black uppercase border ${
                      b.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : b.severity === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}
                  >
                    {b.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  <strong className="text-white">Evidence:</strong> {b.evidence}
                </p>

                {/* Remediation & Expected Gain */}
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold font-mono text-[11px]">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Actionable Remediation Step:</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{b.remediationStep}</p>
                  <div className="text-[11px] font-mono text-emerald-400 font-bold pt-1">
                    Expected Gain: {b.estimatedGain}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Architectural Recommendations */}
      {analysis.architecturalSuggestions && analysis.architecturalSuggestions.length > 0 && (
        <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2.5 text-xs">
          <span className="text-[10px] font-bold text-indigo-300 uppercase font-mono flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            Architectural Engineering Best Practices
          </span>

          <ul className="text-slate-200 space-y-1.5 list-disc list-inside leading-relaxed">
            {analysis.architecturalSuggestions.map((sug, i) => (
              <li key={i}>{sug}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
