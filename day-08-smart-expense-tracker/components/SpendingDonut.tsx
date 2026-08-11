'use client';

import { Transaction, ExpenseCategory } from '@/types';
import { PieChart, DollarSign } from 'lucide-react';

interface Props {
  transactions: Transaction[];
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

export default function SpendingDonut({ transactions }: Props) {
  const totals: Record<string, number> = {};
  let overall = 0;

  transactions.forEach((t) => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
    overall += t.amount;
  });

  const sortedCategories = Object.entries(totals)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-[#0b1616] border border-emerald-500/20 rounded-3xl p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
          <PieChart className="w-4 h-4 text-emerald-400" />
          Category Breakdown
        </h3>
        <span className="text-xs font-mono text-slate-400 tabular-nums">
          Total: ${overall.toFixed(2)}
        </span>
      </div>

      {sortedCategories.length === 0 ? (
        <div className="text-center py-8 text-xs font-mono text-slate-500">
          No expense entries logged yet.
        </div>
      ) : (
        <div className="space-y-3">
          {sortedCategories.map(([cat, amt]) => {
            const pct = overall > 0 ? (amt / overall) * 100 : 0;
            const color = CATEGORY_COLORS[cat as ExpenseCategory] || '#10b981';

            return (
              <div key={cat} className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
                    <span className="font-medium text-white">{cat}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 tabular-nums">{pct.toFixed(1)}%</span>
                    <span className="font-bold text-white tabular-nums">${amt.toFixed(2)}</span>
                  </div>
                </div>

                {/* Progress bar fill */}
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
