'use client';

import { Transaction, ExpenseCategory, SupportedCurrency } from '@/types';
import { PieChart } from 'lucide-react';
import { formatMoney } from '@/lib/mock-data';

interface Props {
  transactions: Transaction[];
  currency: SupportedCurrency;
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  'Food & Dining': '#10b981',
  'Transport': '#0ea5e9',
  'Housing & Utilities': '#6366f1',
  'Shopping': '#f43f5e',
  'Entertainment': '#f59e0b',
  'Health & Wellness': '#8b5cf6',
  'Subscriptions': '#ec4899',
  'Travel': '#14b8a6',
  'Education': '#3b82f6',
  'Groceries': '#84cc16',
  'Bills & Services': '#64748b',
  'Other': '#94a3b8',
};

export default function SpendingDonut({ transactions, currency }: Props) {
  const totals: Record<string, number> = {};
  let overall = 0;

  transactions.forEach((t) => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
    overall += t.amount;
  });

  const sortedCategories = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-[#0b1616] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-5 font-mono text-xs text-slate-300 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-outfit">
          <PieChart className="w-4 h-4 text-emerald-400" />
          Category Spending Breakdown
        </h3>
        <span className="text-xs text-emerald-400 font-bold tabular-nums">
          Total: {formatMoney(overall, currency)}
        </span>
      </div>

      {sortedCategories.length === 0 ? (
        <div className="text-center py-8 text-slate-500">No expense entries logged yet.</div>
      ) : (
        <div className="space-y-3">
          {sortedCategories.map(([cat, amt]) => {
            const pct = overall > 0 ? (amt / overall) * 100 : 0;
            const color = CATEGORY_COLORS[cat as ExpenseCategory] || '#10b981';

            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: color }} />
                    <span className="font-bold text-white font-outfit truncate">{cat}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-slate-400 tabular-nums">{pct.toFixed(1)}%</span>
                    <span className="font-black text-white font-outfit tabular-nums">{formatMoney(amt, currency)}</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
