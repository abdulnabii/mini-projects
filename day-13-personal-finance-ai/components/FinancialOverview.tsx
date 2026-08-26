'use client';

import { useState } from 'react';
import { Currency, FinancialHealthGrade, FinancialSummary } from '@/types';
import { formatCurrency } from '@/lib/storage';
import {
  Wallet,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Calendar,
  Layers,
  Download,
  Check,
  Award,
  Globe,
  Sliders,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  summary: FinancialSummary;
  narrative: FinancialHealthGrade | null;
  isLoadingNarrative: boolean;
  currency: Currency;
  onToggleCurrency: (c: Currency) => void;
}

const CURRENCIES: { code: Currency; label: string; symbol: string }[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'PKR', label: 'Pakistani Rupee', symbol: 'Rs.' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
];

export default function FinancialOverview({
  summary,
  narrative,
  isLoadingNarrative,
  currency,
  onToggleCurrency,
}: Props) {
  const [copiedReport, setCopiedReport] = useState(false);

  const getGradeColor = (g: string) => {
    if (g.startsWith('A')) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (g.startsWith('B')) return 'text-teal-400 border-teal-500/30 bg-teal-500/10';
    if (g.startsWith('C')) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const fmt = (amt: number) => formatCurrency(amt, currency);

  const exportFinancialReport = () => {
    const reportText = `# 📊 WealthPulse.AI — Comprehensive Financial Health Report
Generated: ${new Date().toLocaleDateString()}
Primary Currency: ${currency}

## 1. Executive Summary
- Net Worth: ${fmt(summary.netWorth)}
- Total Assets: ${fmt(summary.totalAssets)} (Cash: ${fmt(summary.cashAssets)}, Investments: ${fmt(summary.investmentAssets)})
- Total Liabilities: ${fmt(summary.totalLiabilities)}
- Monthly Net Cashflow: ${fmt(summary.monthlyIncome)} Income - ${fmt(summary.monthlyExpenses)} Expenses = ${fmt(summary.monthlySavings)}/mo (${(summary.savingsRate * 100).toFixed(1)}% Savings Rate)

## 2. CFP Diagnostic Grade: ${narrative?.grade || 'A'}
"${narrative?.headline || 'Strong wealth building trajectory with high savings cadence.'}"

## 3. Priority Action Items
${narrative?.urgentActions?.map((a, i) => `${i + 1}. [${a.priority}] ${a.title}: ${a.detail}`).join('\n') || '1. Continue consistent index fund accumulation.'}

---
Built with WealthPulse.AI by Abdul Nabi
`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#f59e0b'],
    });
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* Top Header Bar: Multi-Currency Switcher & 1-Click Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0d1117] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400 font-bold text-xs uppercase font-mono">
            Display Currency:
          </span>
          <div className="flex items-center gap-1 flex-wrap p-0.5 rounded-xl bg-[#161b22] border border-slate-800">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => onToggleCurrency(c.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  currency === c.code
                    ? 'bg-emerald-500 text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{c.code} ({c.symbol})</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={exportFinancialReport}
          className="px-3.5 py-1.5 rounded-lg bg-[#161b22] border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{copiedReport ? 'Report Copied to Clipboard!' : 'Export Financial Health Report'}</span>
        </button>
      </div>

      {/* 1. Core Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Net Worth */}
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-emerald-500/30 space-y-1.5 shadow-xl hover:border-emerald-500/60 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
              Total Net Worth
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white font-mono">{fmt(summary.netWorth)}</p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            <span>Assets: <strong className="text-emerald-400">{fmt(summary.totalAssets)}</strong></span>
            <span>Debts: <strong className="text-rose-400">{fmt(summary.totalLiabilities)}</strong></span>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
              Monthly Inflow
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{fmt(summary.monthlyIncome)}</p>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            Salary &amp; Capital Inflow
          </p>
        </div>

        {/* Monthly Expenses */}
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
              Monthly Burn Rate
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-400 font-mono">{fmt(summary.monthlyExpenses)}</p>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            Fixed &amp; Discretionary Outflow
          </p>
        </div>

        {/* Savings Rate */}
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
              Savings Rate
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-400 font-mono">
            {(summary.savingsRate * 100).toFixed(1)}%
          </p>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            Invested: <strong className="text-purple-300">{fmt(summary.monthlySavings)}/mo</strong>
          </p>
        </div>
      </div>

      {/* 2. AI Certified Financial Planner Diagnostic Narrative */}
      <div className="p-6 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono">
                AI Certified Financial Planner Diagnostic
              </h3>
              <p className="text-xs text-slate-400 prose-text">
                Context-grounded portfolio review powered by Gemini 1.5 Flash
              </p>
            </div>
          </div>

          {narrative && (
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2.5 ${getGradeColor(narrative.grade)}`}>
              <span className="text-xl font-bold font-mono">{narrative.grade}</span>
              <span className="text-[10px] font-bold font-mono">FINANCIAL HEALTH GRADE</span>
            </div>
          )}
        </div>

        {isLoadingNarrative ? (
          <div className="flex items-center justify-center gap-3 py-8 text-slate-400 font-mono">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Analyzing portfolio cash flow and generating financial diagnosis...</span>
          </div>
        ) : narrative ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#161b22] border border-emerald-500/20 text-emerald-200 font-mono font-medium text-xs">
              "{narrative.headline}"
            </div>

            <div className="space-y-2.5 leading-relaxed text-slate-200 text-xs prose-text">
              {narrative.summaryParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* 3 Urgent Action Items */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Priority Financial Action Roadmap:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {narrative.urgentActions.map((action, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#161b22] border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono">
                        PRIORITY #{idx + 1} ({action.priority})
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-white text-xs font-mono">{action.title}</h4>
                    <p className="text-[10px] text-slate-400 prose-text leading-relaxed">{action.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* 3. 12-Month Forward Net Worth Forecast Grid */}
      <div className="p-6 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm font-mono">
              12-Month Compound Net Worth Forecast
            </h3>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">
            +8% Annualized Index Return + {fmt(summary.monthlySavings)}/mo
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {summary.monthlyForecast.map((fc, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#161b22] border border-slate-800/80 space-y-1 hover:border-emerald-500/40 transition-colors"
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono block">
                Month +{idx + 1} ({fc.month})
              </span>
              <div className="text-xs font-bold text-white font-mono truncate">
                {fmt(fc.projectedNetWorth)}
              </div>
              <span className="text-[9px] text-emerald-400 font-mono block">
                +{fmt(fc.projectedSavings)} saved
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Category Spending Breakdown Grid */}
      <div className="p-6 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white text-sm font-mono">
              Monthly Category Outflow Allocation
            </h3>
          </div>
          <span className="text-slate-400 text-[10px] font-mono">
            {summary.categoryBreakdown.length} Active Categories
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {summary.categoryBreakdown.map((cat, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#161b22] border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-200 text-xs font-mono">{cat.category}</span>
                <span className="text-emerald-400 font-bold font-mono">{fmt(cat.amount)}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                  style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{cat.percentage.toFixed(1)}% of total burn rate</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
