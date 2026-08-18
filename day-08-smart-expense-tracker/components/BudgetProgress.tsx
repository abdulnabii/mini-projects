'use client';

import { useState } from 'react';
import { Transaction, ExpenseCategory, SupportedCurrency } from '@/types';
import { CATEGORIES, formatMoney } from '@/lib/mock-data';
import { Target, AlertTriangle, CheckCircle2, Edit3 } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  budgets: Record<ExpenseCategory, number>;
  onUpdateBudget: (category: ExpenseCategory, amount: number) => void;
  currency: SupportedCurrency;
}

export default function BudgetProgress({
  transactions,
  budgets,
  onUpdateBudget,
  currency,
}: Props) {
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');

  const categorySpent: Record<string, number> = {};
  transactions.forEach((t) => {
    categorySpent[t.category] = (categorySpent[t.category] || 0) + t.amount;
  });

  const handleStartEdit = (cat: ExpenseCategory, currentBudget: number) => {
    setEditingCategory(cat);
    setEditAmount(currentBudget.toString());
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editAmount || isNaN(Number(editAmount))) return;
    onUpdateBudget(editingCategory, Number(editAmount));
    setEditingCategory(null);
  };

  return (
    <div className="bg-[#0b1616] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6 font-mono text-xs text-slate-300 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-outfit">
          <Target className="w-4 h-4 text-teal-400" />
          Budget Allocation &amp; Target Limits
        </h3>
        <span className="text-[10px] text-slate-500">Tap budget to customize limit</span>
      </div>

      {/* Edit Budget Modal */}
      {editingCategory && (
        <form
          onSubmit={handleSaveBudget}
          className="p-4 rounded-2xl bg-[#060e0e] border border-emerald-500/40 space-y-3 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-white font-outfit text-xs">
              Edit Monthly Cap: {editingCategory}
            </span>
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="text-slate-500 hover:text-rose-400 text-[10px]"
            >
              Cancel
            </button>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-bold"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-outfit uppercase transition-all shadow-md shadow-emerald-500/20"
            >
              Save Cap
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
        {CATEGORIES.map((cat) => {
          const spent = categorySpent[cat] || 0;
          const budget = budgets[cat] || 300;
          const pct = Math.min(200, Math.round((spent / budget) * 100));
          const isOver = spent > budget;

          return (
            <div
              key={cat}
              className="p-3.5 rounded-2xl bg-[#060e0e] border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-outfit text-xs">{cat}</span>
                  {isOver && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[9px] font-bold">
                      OVER LIMIT
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-300">
                    <strong className={isOver ? 'text-rose-400' : 'text-white'}>{formatMoney(spent, currency)}</strong>
                    <span className="text-slate-500"> / {formatMoney(budget, currency)}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(cat, budget)}
                    className="p-1 text-slate-500 hover:text-emerald-400 rounded-lg hover:bg-slate-900 transition-colors"
                    title="Edit Budget Cap"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOver
                      ? 'bg-rose-500'
                      : pct > 80
                      ? 'bg-amber-400'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
