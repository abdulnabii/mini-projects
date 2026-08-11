'use client';

import { CoachReport } from '@/types';
import { Bot, Sparkles, AlertTriangle, TrendingDown, DollarSign, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  report: CoachReport | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function AICoachPanel({ report, isLoading, onRefresh }: Props) {
  return (
    <div className="bg-[#0b1616] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-400" />
            Gemini AI Financial Coach &amp; Advisory
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Personalized, judgment-free spending audit and actionable cutback suggestions.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Analyzing Spending...' : 'Refresh AI Audit'}</span>
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-10 space-y-3 animate-pulse">
          <Sparkles className="w-8 h-8 text-emerald-400 animate-bounce mx-auto" />
          <span className="text-xs text-slate-400 block">Evaluating transactions against budget targets...</span>
        </div>
      )}

      {!isLoading && report && (
        <div className="space-y-6">
          {/* Executive Overview Banner */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-200 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Financial Health Executive Summary</span>
            </div>
            <p>{report.overview}</p>
          </div>

          {/* Key Insights & Over-spending Observations */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Spending Insights &amp; Observations
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {report.insights.map((insight, idx) => {
                let badgeClass = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                if (insight.severity === 'critical') badgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                if (insight.severity === 'warning') badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';

                return (
                  <div
                    key={idx}
                    className="bg-[#060e0e] border border-slate-800 rounded-2xl p-4 space-y-2 text-xs"
                  >
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase inline-block ${badgeClass}`}>
                      {insight.severity}
                    </span>
                    <span className="font-bold text-white block">{insight.title}</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{insight.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actionable Cutback Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Actionable Cutback Recommendations
              </span>
              <span className="text-xs text-emerald-400 font-bold tabular-nums">
                Est. Potential Savings: +${report.projectedMonthlySaving}/mo
              </span>
            </div>

            <div className="space-y-2.5">
              {report.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-[#060e0e] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">{rec.action}</span>
                      <span className="text-[10px] text-slate-500 uppercase">Effort: {rec.effort}</span>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold tabular-nums shrink-0">
                    +${rec.estimatedMonthlySaving}/mo
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
