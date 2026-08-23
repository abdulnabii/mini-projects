'use client';

import { useState } from 'react';
import { InteractionReport, DrugInteraction } from '@/types';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  RefreshCw,
  Info,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  report: InteractionReport | null;
  isLoading: boolean;
  onRecheck: () => void;
}

export default function InteractionRadar({
  report,
  isLoading,
  onRecheck,
}: Props) {
  if (isLoading) {
    return (
      <div className="p-8 rounded-3xl bg-[#0d1117] border border-slate-800 text-center space-y-3 font-mono">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
        <h4 className="font-bold text-white text-sm font-outfit">
          Scanning Active Regimen for Drug Interactions...
        </h4>
        <p className="text-xs text-slate-400">
          Cross-checking pharmacology mechanisms with Gemini 1.5 Clinical AI
        </p>
      </div>
    );
  }

  if (!report) return null;

  const isHighRisk = report.overallSafetyRating === 'HIGH_RISK';
  const hasInteractions = report.interactions.length > 0;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-slate-800 shadow-2xl space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
              isHighRisk
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : hasInteractions
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            {isHighRisk ? (
              <ShieldAlert className="w-5 h-5" />
            ) : hasInteractions ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base font-outfit">
                Clinical Drug Interaction Safety Radar
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${
                  isHighRisk
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : hasInteractions
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {report.overallSafetyRating.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {report.totalChecked} active prescriptions cross-referenced
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRecheck}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-Analyze Regimen</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div
        className={`p-4 rounded-2xl border text-xs leading-relaxed font-sans ${
          isHighRisk
            ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
            : hasInteractions
            ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
            : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
        }`}
      >
        <strong>Clinical Recommendation:</strong> {report.recommendedAction}
      </div>

      {/* Interaction Cards List */}
      {hasInteractions ? (
        <div className="space-y-4">
          {report.interactions.map((item, idx) => {
            const isSevere = item.severity === 'SEVERE';
            return (
              <div
                key={item.id || idx}
                className={`p-5 rounded-2xl border space-y-3 ${
                  isSevere
                    ? 'bg-[#1a0f14] border-rose-500/40'
                    : 'bg-[#161b22] border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        isSevere
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {item.severity} INTERACTION
                    </span>
                    <span className="font-bold text-white text-sm font-outfit">
                      {item.drugs.join(' ⚡ ')}
                    </span>
                  </div>
                </div>

                {/* Mechanism & Risk */}
                <div className="space-y-1.5 text-xs text-slate-300 font-sans leading-relaxed">
                  <p>
                    <strong className="text-white">Mechanism:</strong> {item.mechanism}
                  </p>
                  <p>
                    <strong className="text-white">Clinical Risk:</strong> {item.clinicalRisk}
                  </p>
                  <p>
                    <strong className="text-white">Action Required:</strong>{' '}
                    <span className={isSevere ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                      {item.action}
                    </span>
                  </p>
                </div>

                {/* Substitute Suggestion if available */}
                {item.substituteSuggestion && (
                  <div className="p-3 rounded-xl bg-[#0d1117] border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      💡 Safer Alternative: <strong className="text-emerald-400">{item.substituteSuggestion}</strong>
                    </span>
                    <span className="text-[10px] text-slate-500">Ask doctor before substituting</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-[#04080e] border border-emerald-500/30 text-center space-y-1">
          <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
          <h4 className="font-bold text-white text-sm font-outfit">
            All Current Medications are Clinically Compatible
          </h4>
          <p className="text-xs text-slate-400">
            No dangerous drug interactions detected across active doses.
          </p>
        </div>
      )}
    </div>
  );
}
