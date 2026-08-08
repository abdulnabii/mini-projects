'use client';

import React from 'react';
import { TriageAssessment } from '@/types';
import RiskBadge from './RiskBadge';
import { Activity, CheckCircle2, Clock, Info, AlertOctagon, Download } from 'lucide-react';

interface TriageCardProps {
  assessment: TriageAssessment;
  onExport?: () => void;
}

export default function TriageCard({ assessment, onExport }: TriageCardProps) {
  const { riskLevel, possibleConditions, nextSteps, urgency, summary, disclaimer } = assessment;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 backdrop-blur-xl relative overflow-hidden">
      {/* Background ambient glow according to risk level */}
      <div
        className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 ${
          riskLevel === 'EMERGENCY'
            ? 'bg-red-600'
            : riskLevel === 'HIGH'
            ? 'bg-orange-500'
            : riskLevel === 'MEDIUM'
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        }`}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-slate-400 mb-1">
            Clinical Triage Assessment
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Preliminary Evaluation</span>
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <RiskBadge level={riskLevel} size="lg" />
          {onExport && (
            <button
              onClick={onExport}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Export Report"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Urgency Highlight Banner */}
      <div
        className={`p-4 rounded-xl border flex items-start gap-3 ${
          riskLevel === 'EMERGENCY'
            ? 'bg-red-950/60 border-red-500/50 text-red-200'
            : riskLevel === 'HIGH'
            ? 'bg-orange-950/40 border-orange-500/40 text-orange-200'
            : riskLevel === 'MEDIUM'
            ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
            : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
        }`}
      >
        <Clock className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm">Recommended Care Timeframe:</h4>
          <p className="text-sm mt-0.5 font-medium">{urgency}</p>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="text-sm text-slate-300 bg-slate-950/50 p-4 rounded-xl border border-slate-800/60">
          <p>{summary}</p>
        </div>
      )}

      {/* Possible Conditions */}
      <div>
        <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Possible Conditions Evaluated ({possibleConditions.length})</span>
        </h4>
        <div className="space-y-3">
          {possibleConditions.map((cond, idx) => {
            const percentage = Math.round(cond.confidence * 100);
            return (
              <div
                key={idx}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-slate-100 text-sm">{cond.name}</span>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    {percentage}% match
                  </span>
                </div>
                {/* Confidence Bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-teal-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{cond.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      <div>
        <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Recommended Next Actions</span>
        </h4>
        <ul className="space-y-2">
          {nextSteps.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40"
            >
              <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-cyan-800/50">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Legal Footer Note */}
      <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
        <AlertOctagon className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <p>{disclaimer}</p>
      </div>
    </div>
  );
}
