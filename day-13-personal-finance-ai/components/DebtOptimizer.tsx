'use client';

import { useState } from 'react';
import { Debt, DebtOptimizationResult } from '@/types';
import { optimizeDebtPayoff } from '@/lib/finance';
import { ShieldCheck, Zap, TrendingDown, DollarSign, Award, ArrowRight, Layers } from 'lucide-react';

interface Props {
  debts: Debt[];
}

export default function DebtOptimizer({ debts }: Props) {
  const [extraPayment, setExtraPayment] = useState<number>(400);

  const optimization: DebtOptimizationResult = optimizeDebtPayoff(debts, extraPayment);
  const { avalanche, snowball, recommendation, reasoningNote } = optimization;

  return (
    <div className="bg-[#0d1117] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-amber-500/10 font-mono text-xs text-slate-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">Debt Payoff Engine: Avalanche vs. Snowball</h3>
            <p className="text-xs text-slate-400">Mathematically optimizes interest reduction across active credit cards &amp; loans</p>
          </div>
        </div>

        {/* Extra Payment Slider */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 shrink-0">
          <label className="text-slate-400 font-bold text-[11px]">Extra Payment:</label>
          <span className="text-amber-400 font-bold font-outfit text-sm">${extraPayment}/mo</span>
          <input
            type="range"
            min="100"
            max="1500"
            step="50"
            value={extraPayment}
            onChange={(e) => setExtraPayment(Number(e.target.value))}
            className="w-28 accent-amber-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Strategy Comparison Cards (Avalanche vs Snowball) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Avalanche Card (Recommended) */}
        <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500 space-y-4 relative shadow-xl shadow-amber-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Avalanche Strategy (Highest APR First)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-extrabold text-[10px]">
              RECOMMENDED
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 text-center border-y border-amber-500/20">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold">Payoff Time</span>
              <span className="text-xl font-black text-white font-outfit">{avalanche.payoffMonths} Mos</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold">Total Interest</span>
              <span className="text-xl font-black text-rose-400 font-outfit">${avalanche.totalInterestPaid.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold">Interest Saved</span>
              <span className="text-xl font-black text-emerald-400 font-outfit">${avalanche.interestSavedVsMinimum.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-[11px] text-amber-200 leading-relaxed">
            Directs extra cash flow to the highest APR balance first, minimizing compounding interest bleed.
          </p>
        </div>

        {/* Snowball Card */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Snowball Strategy (Smallest Balance First)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-[10px]">
              PSYCHOLOGICAL
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 text-center border-y border-slate-800">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold">Payoff Time</span>
              <span className="text-xl font-black text-white font-outfit">{snowball.payoffMonths} Mos</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold">Total Interest</span>
              <span className="text-xl font-black text-rose-400 font-outfit">${snowball.totalInterestPaid.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold">Interest Saved</span>
              <span className="text-xl font-black text-emerald-400 font-outfit">${snowball.interestSavedVsMinimum.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Pays off small balances quickly for psychological quick-wins, but incurs slightly higher total interest cost.
          </p>
        </div>
      </div>

      {/* Active Debts Table */}
      <div className="space-y-3 pt-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Active Liability Balances Included in Analysis ({debts.length})
        </label>

        <div className="space-y-2">
          {debts.map((d) => (
            <div key={d.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[10px]">
                  {d.apr}% APR
                </span>
                <span className="font-bold text-white">{d.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-400">Min: ${d.minPayment}/mo</span>
                <strong className="text-amber-400 font-outfit text-sm">${d.balance.toLocaleString()}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
