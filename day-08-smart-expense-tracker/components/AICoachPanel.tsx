'use client';

import { CoachReport, SupportedCurrency } from '@/types';
import { Bot, Sparkles, RefreshCw, CheckCircle2, Award, Zap } from 'lucide-react';
import { formatMoney } from '@/lib/mock-data';

interface Props {
  report: CoachReport | null;
  isLoading: boolean;
  onRefresh: () => void;
  currency: SupportedCurrency;
}

export default function AICoachPanel({ report, isLoading, onRefresh, currency }: Props) {
  const getGradeStyle = (grade?: string) => {
    if (!grade || grade.startsWith('A')) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 shadow-emerald-500/20';
    if (grade.startsWith('B')) return 'text-teal-400 border-teal-500/40 bg-teal-500/10 shadow-teal-500/20';
    if (grade.startsWith('C')) return 'text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-amber-500/20';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10 shadow-rose-500/20';
  };

  return (
    <div className="bg-[#0b1616] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs text-slate-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-outfit">
              Gemini AI Wealth &amp; Expense Advisory
            </h3>
            <p className="text-xs text-slate-400">Personalized financial diagnosis and cashflow optimization</p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold text-xs font-outfit uppercase tracking-wider hover:opacity-95 transition-all disabled:opacity-50 shadow-md shadow-emerald-500/20"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Analyzing Cashflow...' : 'Refresh AI Audit'}</span>
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
          {/* Health Scorecard & Executive Overview */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#060e0e] border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Financial Health Executive Diagnosis</span>
              </div>
              <p className="text-white text-xs leading-relaxed font-sans">{report.overview}</p>
            </div>

            {/* Score & Grade Badges */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-2xl font-black font-outfit text-white block">
                  {report.healthScore || 84}
                  <span className="text-xs font-normal text-slate-500">/100</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Health Score</span>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-outfit font-black shadow-lg ${getGradeStyle(
                  report.healthGrade
                )}`}
              >
                <span className="text-xl leading-none">{report.healthGrade || 'A'}</span>
                <span className="text-[7px] font-bold uppercase tracking-wider mt-0.5">GRADE</span>
              </div>
            </div>
          </div>

          {/* Key Insights & Observations */}
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
                    className="bg-[#060e0e] border border-slate-800 rounded-2xl p-4 space-y-2 text-xs hover:border-slate-700 transition-colors"
                  >
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase inline-block ${badgeClass}`}>
                      {insight.severity}
                    </span>
                    <span className="font-bold text-white block font-outfit text-xs">{insight.title}</span>
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
                Est. Potential Monthly Savings: +{formatMoney(report.projectedMonthlySaving || 355, currency)}/mo
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
                    +{formatMoney(rec.estimatedMonthlySaving, currency)}/mo
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
