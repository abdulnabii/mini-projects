'use client';

import { useState } from 'react';
import { Currency, Debt, DebtOptimizationResult } from '@/types';
import { optimizeDebtPayoff } from '@/lib/finance';
import { formatCurrency } from '@/lib/storage';
import {
  ShieldCheck,
  Zap,
  Award,
  Layers,
  Calendar,
  CheckCircle2,
  TrendingDown,
  Table as TableIcon,
} from 'lucide-react';

interface Props {
  debts: Debt[];
  currency: Currency;
}

export default function DebtOptimizer({ debts, currency }: Props) {
  const [extraPayment, setExtraPayment] = useState<number>(
    currency === 'PKR' ? 25000 : currency === 'INR' ? 10000 : 400
  );
  const [showSchedule, setShowSchedule] = useState(false);

  const fmt = (amt: number) => formatCurrency(amt, currency);

  const optimization: DebtOptimizationResult = optimizeDebtPayoff(debts, extraPayment);
  const { avalanche, snowball } = optimization;

  return (
    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs text-slate-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm font-mono">
                Debt Payoff Optimization Engine: Avalanche vs. Snowball
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                MATHEMATICAL AMORTIZATION
              </span>
            </div>
            <p className="text-xs text-slate-400 prose-text">
              Compares mathematical interest reduction (Avalanche) vs. psychological velocity (Snowball)
            </p>
          </div>
        </div>

        {/* Extra Payment Slider */}
        <div className="flex items-center gap-3 bg-[#161b22] p-2.5 rounded-xl border border-slate-800 shrink-0">
          <label className="text-slate-400 font-bold text-[10px] uppercase font-mono">Extra Payment:</label>
          <span className="text-emerald-400 font-bold font-mono text-xs">{fmt(extraPayment)}/mo</span>
          <input
            type="range"
            min={currency === 'PKR' ? 5000 : currency === 'INR' ? 2000 : 100}
            max={currency === 'PKR' ? 120000 : currency === 'INR' ? 40000 : 1500}
            step={currency === 'PKR' ? 2500 : currency === 'INR' ? 1000 : 50}
            value={extraPayment}
            onChange={(e) => setExtraPayment(Number(e.target.value))}
            className="w-28 accent-emerald-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Strategy Comparison Cards (Avalanche vs Snowball) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Avalanche Card (Recommended) */}
        <div className="p-5 rounded-xl bg-[#161b22] border-2 border-emerald-500 space-y-3.5 relative shadow-xl shadow-emerald-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase font-mono text-emerald-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Avalanche Strategy (Highest APR First)
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-black font-extrabold text-[9px] font-mono">
              RECOMMENDED
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 text-center border-y border-slate-800">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold font-mono">Payoff Time</span>
              <span className="text-lg font-bold text-white font-mono">{avalanche.payoffMonths} Mos</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold font-mono">Total Interest</span>
              <span className="text-lg font-bold text-rose-400 font-mono">{fmt(avalanche.totalInterestPaid)}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold font-mono">Interest Saved</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{fmt(avalanche.interestSavedVsMinimum)}</span>
            </div>
          </div>

          <p className="text-[11px] text-emerald-200 prose-text leading-relaxed">
            Prioritizes debt with highest interest rate first, minimizing compounding interest bleed and total out-of-pocket cost.
          </p>
        </div>

        {/* Snowball Card */}
        <div className="p-5 rounded-xl bg-[#161b22] border border-slate-800 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase font-mono text-purple-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Snowball Strategy (Lowest Balance First)
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-[9px] font-mono">
              BEHAVIORAL
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 text-center border-y border-slate-800">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold font-mono">Payoff Time</span>
              <span className="text-lg font-bold text-white font-mono">{snowball.payoffMonths} Mos</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold font-mono">Total Interest</span>
              <span className="text-lg font-bold text-rose-400 font-mono">{fmt(snowball.totalInterestPaid)}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold font-mono">Interest Saved</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{fmt(snowball.interestSavedVsMinimum)}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 prose-text leading-relaxed">
            Knocks out smaller balance accounts first for psychological quick-wins, but incurs slightly higher total interest.
          </p>
        </div>
      </div>

      {/* Active Debts Table */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">
            Active Liabilities in Optimization ({debts.length})
          </label>
          <button
            type="button"
            onClick={() => setShowSchedule(!showSchedule)}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-mono"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>{showSchedule ? 'Hide Amortization Schedule' : 'View Payoff Schedule'}</span>
          </button>
        </div>

        <div className="space-y-2">
          {debts.map((d) => (
            <div
              key={d.id}
              className="p-3 rounded-xl bg-[#161b22] border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[10px] font-mono">
                  {d.apr}% APR
                </span>
                <span className="font-bold text-white font-mono">{d.name}</span>
              </div>
              <div className="flex items-center gap-4 font-mono">
                <span className="text-slate-400 text-xs">Min: {fmt(d.minPayment)}/mo</span>
                <strong className="text-emerald-400 text-sm">{fmt(d.balance)}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* Amortization Schedule Timeline */}
        {showSchedule && (
          <div className="mt-4 p-4 rounded-xl bg-[#04080e] border border-slate-800 space-y-3 animate-in fade-in duration-150">
            <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono block">
              Avalanche Payoff Progress Schedule:
            </span>
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#161b22] text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                  <tr>
                    <th className="p-2">Month</th>
                    <th className="p-2">Target Payoff Account</th>
                    <th className="p-2">Interest Paid</th>
                    <th className="p-2 text-right">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-[11px]">
                  {avalanche.schedule.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-900/40">
                      <td className="p-2 text-slate-400">Month #{row.month}</td>
                      <td className="p-2 text-emerald-300">{row.targetDebtName}</td>
                      <td className="p-2 text-rose-400">{fmt(row.interestPaidThisMonth)}</td>
                      <td className="p-2 text-right text-white font-bold">{fmt(row.totalRemainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
