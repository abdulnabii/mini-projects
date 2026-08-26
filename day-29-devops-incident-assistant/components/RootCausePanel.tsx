'use client';

import { RootCauseDiagnosis } from '@/types';
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Database,
  Radio,
  GitCommit,
  Layers,
  Activity,
} from 'lucide-react';

interface Props {
  diagnosis: RootCauseDiagnosis;
  isAnalyzing: boolean;
}

export default function RootCausePanel({ diagnosis, isAnalyzing }: Props) {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.9) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (conf >= 0.75) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="bg-[#090d16] border border-white/[0.08] rounded-xl p-4 space-y-3.5 shadow-2xl font-mono text-xs text-slate-300 sre-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
              AI Root Cause Hypothesis &amp; Blast Radius
            </h3>
            <p className="text-[10px] text-slate-400 prose-text">
              Synthesized by Gemini 1.5 Flash SRE Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-[#04080e] border border-white/[0.08] text-rose-400 font-bold text-[10px] font-mono">
            {diagnosis.failureMode}
          </span>

          <div
            className={`px-2.5 py-0.5 rounded border font-bold text-[11px] flex items-center gap-1.5 ${getConfidenceColor(
              diagnosis.confidence
            )}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{(diagnosis.confidence * 100).toFixed(0)}% Confidence</span>
          </div>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="flex items-center justify-center gap-3 py-8 text-slate-400 font-mono">
          <Sparkles className="w-4 h-4 text-rose-400 animate-spin" />
          <span>Analyzing stack traces, connection pools, and recent release diffs...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Main Diagnosis Hypothesis Box */}
          <div className="p-3.5 rounded-lg bg-[#04060a] border border-rose-500/30 text-rose-200 font-mono text-xs leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-bold uppercase">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Primary Diagnosis:</span>
            </div>
            <p className="text-white font-medium text-xs leading-relaxed">{diagnosis.hypothesis}</p>
          </div>

          {/* Evidence from Logs */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Citing Evidence from Ingested Logs:</span>
            </label>
            <div className="space-y-1">
              {diagnosis.evidenceFromLogs.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-[#04080e] border border-white/[0.04] text-slate-300 text-[11px] font-mono select-all flex items-start gap-2"
                >
                  <span className="text-rose-400 font-bold">›</span>
                  <span className="break-words">{ev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Blast Radius Impact Breakdown */}
          <div className="p-3 rounded-lg bg-[#04080e] border border-white/[0.06] space-y-1.5">
            <span className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1 font-mono">
              <Layers className="w-3.5 h-3.5" />
              <span>Blast Radius &amp; Downstream Impact:</span>
            </span>

            <div className="space-y-1 text-xs">
              <p className="text-white">
                <strong className="text-rose-400">Primary:</strong> {diagnosis.blastRadius.primaryImpact}
              </p>
              {diagnosis.blastRadius.secondaryImpact.length > 0 && (
                <div className="text-slate-400 text-[11px] space-y-0.5 pt-0.5">
                  <span className="text-slate-500 font-bold block">Secondary Cascades:</span>
                  {diagnosis.blastRadius.secondaryImpact.map((sec, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 pl-2">
                      <span className="text-amber-400">•</span>
                      <span>{sec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Deployment Correlation Alert */}
          {diagnosis.deploymentCorrelation && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
              <GitCommit className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-[11px]">
                <p className="text-amber-300 font-bold">
                  Correlated Deployment: {diagnosis.deploymentCorrelation.deployment} ({diagnosis.deploymentCorrelation.deployedAt})
                </p>
                <p className="text-slate-300 prose-text text-[10px]">
                  {diagnosis.deploymentCorrelation.riskSignal}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
