'use client';

import { Transaction, ExpenseCategory } from '@/types';
import { CATEGORIES } from '@/lib/mock-data';
import { Target, AlertTriangle, CheckCircle2, Edit2, Save } from 'lucide-react';
import { useState } from 'react';

interface Props {
  transactions: Transaction[];
  budgets: Record<ExpenseCategory, number>;
  onUpdateBudget: (category: ExpenseCategory, amount: number) => void;
}

export default function BudgetProgress({ transactions, budgets, onUpdateBudget }: Props) {
  const [editingCat, setEditingCat] = useState<ExpenseCategory | null>(null);
  const [editVal, setEditVal] = useState('');

  // Calculate actual spending per category
  const actuals: Record<string, number> = {};
  transactions.forEach((t) => {
    actuals[t.category] = (actuals[t.category] || 0) + t.amount;
  });

  const handleStartEdit = (cat: ExpenseCategory) => {
    setEditingCat(cat);
    setEditVal(String(budgets[cat] || 300));
  };

  const handleSaveEdit = (cat: ExpenseCategory) => {
    const num = Number(editVal);
    if (!isNaN(num) && num >= 0) {
      onUpdateBudget(cat, num);
    }
    setEditingCat(null);
  };

  return (
    <div className="bg-[#0b1616] border border-emerald-500/20 rounded-3xl p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          Budget Allocation &amp; Alert Targets
        </h3>
        <span className="text-xs font-mono text-slate-400">Monthly Caps</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CATEGORIES.slice(0, 6).map((cat) => {
          const spent = actuals[cat] || 0;
          const cap = budgets[cat] || 300;
          const pct = Math.min(100, (spent / cap) * 100);

          let statusColor = 'bg-emerald-500';
          let statusText = 'On Track';
          let statusBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

          if (pct >= 100) {
            statusColor = 'bg-rose-500';
            statusText = 'Over Budget';
            statusBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
          } else if (pct >= 80) {
            statusColor = 'bg-amber-500';
            statusText = 'Warning (>80%)';
            statusBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
          }

          return (
            <div
              key={cat}
              className="bg-[#060e0e] border border-slate-800 rounded-2xl p-4 space-y-3 font-mono text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{cat}</span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] ${statusBadge}`}>
                  {statusText}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Spent: <strong className="text-white">${spent.toFixed(2)}</strong></span>
                <div className="flex items-center gap-1">
                  <span>Cap:</span>
                  {editingCat === cat ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editVal}
                        onChange={(e) => setEditVal(e.target.value)}
                        className="w-16 bg-slate-900 border border-emerald-500/50 rounded px-1 text-white text-xs"
                      />
                      <button
                        onClick={() => handleSaveEdit(cat)}
                        className="text-emerald-400 hover:text-white"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="flex items-center gap-1 font-bold text-white hover:text-emerald-400"
                    >
                      <span>${cap}</span>
                      <Edit2 className="w-3 h-3 text-slate-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
