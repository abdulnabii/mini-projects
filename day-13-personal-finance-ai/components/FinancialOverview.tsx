'use client';

import { FinancialHealthGrade, FinancialSummary } from '@/types';
import { Wallet, DollarSign, TrendingUp, TrendingDown, ShieldAlert, Sparkles, PieChart, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';

interface Props {
  summary: FinancialSummary;
  narrative: FinancialHealthGrade | null;
  isLoadingNarrative: boolean;
}

export default function FinancialOverview({ summary, narrative, isLoadingNarrative }: Props) {
  const getGradeColor = (g: string) => {
    if (g.startsWith('A')) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (g.startsWith('B')) return 'text-teal-400 border-teal-500/30 bg-teal-500/10';
    if (g.startsWith('C')) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="space-y-8 font-mono text-xs text-slate-300">
      {/* 1. Net Worth & Cash Flow Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth */}
        <div className="p-5 rounded-3xl bg-[#0d1117] border border-amber-500/30 space-y-2 shadow-xl shadow-amber-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Net Worth</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white font-outfit">${summary.netWorth.toLocaleString()}</p>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            <span>Assets: <strong className="text-emerald-400">${summary.totalAssets.toLocaleString()}</strong></span>
            <span>Liabilities: <strong className="text-rose-400">${summary.totalLiabilities.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="p-5 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monthly Income</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400 font-outfit">${summary.monthlyIncome.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">Primary Cash Flow Generation</p>
        </div>

        {/* Monthly Expenses */}
        <div className="p-5 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monthly Burn Rate</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-400 font-outfit">${summary.monthlyExpenses.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">Total Fixed &amp; Discretionary Outflow</p>
        </div>

        {/* Savings Rate */}
        <div className="p-5 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Savings Rate</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-purple-400 font-outfit">{(summary.savingsRate * 100).toFixed(1)}%</p>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            Net Savings: <strong className="text-purple-300">${summary.monthlySavings.toLocaleString()}/mo</strong>
          </p>
        </div>
      </div>

      {/* 2. AI Financial Review Narrative & Grade */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-amber-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">AI Certified Financial Planner Review</h3>
              <p className="text-xs text-slate-400">Powered by Gemini 1.5 Flash Financial Intelligence Engine</p>
            </div>
          </div>

          {narrative && (
            <div className={`px-5 py-2.5 rounded-2xl border flex items-center gap-3 ${getGradeColor(narrative.grade)}`}>
              <span className="text-2xl font-black font-outfit">{narrative.grade}</span>
              <span className="text-xs font-bold">Financial Health Score</span>
            </div>
          )}
        </div>

        {isLoadingNarrative ? (
          <div className="flex items-center justify-center gap-3 py-8 text-slate-400">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            <span>Analyzing portfolio cash flow and generating financial diagnosis...</span>
          </div>
        ) : narrative ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-amber-200 font-bold text-sm font-outfit">
              "{narrative.headline}"
            </div>

            <div className="space-y-3 leading-relaxed text-slate-200">
              {narrative.summaryParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* 3 Urgent Action Items */}
            <div className="space-y-3 pt-2">
              <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Priority Financial Action Roadmap
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {narrative.urgentActions.map((action, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                        Priority #{idx + 1} ({action.priority})
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-white text-xs font-outfit">{action.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{action.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* 3. Category Spending Breakdown */}
      <div className="p-6 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm font-outfit flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-400" />
            Monthly Category Spending Breakdown
          </h3>
          <span className="text-slate-500 text-[11px]">{summary.categoryBreakdown.length} Categories</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {summary.categoryBreakdown.map((cat, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs">{cat.category}</span>
                <span className="text-amber-400 font-bold">${cat.amount.toLocaleString()}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                  style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>{cat.percentage.toFixed(1)}% of total expenses</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
