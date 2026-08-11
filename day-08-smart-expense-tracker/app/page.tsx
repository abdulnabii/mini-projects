'use client';

import { useEffect, useState } from 'react';
import { Transaction, CoachReport, ExpenseCategory } from '@/types';
import {
  getStoredTransactions,
  saveTransaction,
  deleteTransaction,
  getStoredBudgets,
  saveBudget,
} from '@/lib/storage';
import ReceiptScanner from '@/components/ReceiptScanner';
import SpendingDonut from '@/components/SpendingDonut';
import BudgetProgress from '@/components/BudgetProgress';
import TransactionTable from '@/components/TransactionTable';
import AICoachPanel from '@/components/AICoachPanel';
import { Wallet, DollarSign, TrendingDown, PiggyBank, Target, Sparkles } from 'lucide-react';

export default function ExpenseDashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Record<ExpenseCategory, number>>({} as Record<ExpenseCategory, number>);
  const [coachReport, setCoachReport] = useState<CoachReport | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadedTx = getStoredTransactions();
    const loadedBudgets = getStoredBudgets();
    setTransactions(loadedTx);
    setBudgets(loadedBudgets);
    setInitialized(true);
    fetchCoachReport(loadedTx, loadedBudgets);
  }, []);

  const fetchCoachReport = async (txList: Transaction[], bList: Record<ExpenseCategory, number>) => {
    setCoachLoading(true);
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: txList, budgets: bList }),
      });
      const data = await res.json();
      setCoachReport(data);
    } catch (err) {
      console.error('Coach report fetch error:', err);
    } finally {
      setCoachLoading(false);
    }
  };

  const handleAddTransaction = (newTx: Transaction) => {
    const updated = saveTransaction(newTx);
    setTransactions(updated);
    fetchCoachReport(updated, budgets);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = deleteTransaction(id);
    setTransactions(updated);
    fetchCoachReport(updated, budgets);
  };

  const handleUpdateBudget = (category: ExpenseCategory, amount: number) => {
    const updated = saveBudget(category, amount);
    setBudgets(updated);
    fetchCoachReport(transactions, updated);
  };

  // Metrics
  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalBudgetCap = Object.values(budgets).reduce((acc, b) => acc + b, 0) || 4500;
  const netBalance = Math.max(0, 5200 - totalSpent);
  const savingsRate = Math.round((netBalance / 5200) * 100);

  if (!initialized) return null;

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 font-mono">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Personal Financial Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Financial Dashboard &amp; <span className="text-emerald-400">Expense Diary</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-[#0b1616] border border-emerald-500/20 px-4 py-2 rounded-2xl text-xs">
          <span className="text-slate-400">Monthly Net Income:</span>
          <span className="text-emerald-400 font-bold text-sm">$5,200.00</span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0b1616] border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Logged Outflow</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">${totalSpent.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500">{transactions.length} receipts &amp; entries</div>
        </div>

        <div className="bg-[#0b1616] border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monthly Budget Cap</span>
            <Target className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">${totalBudgetCap.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500">Across 12 category targets</div>
        </div>

        <div className="bg-[#0b1616] border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Surplus Net Balance</span>
            <PiggyBank className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">${netBalance.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500">Estimated remaining cash flow</div>
        </div>

        <div className="bg-[#0b1616] border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Savings Rate Ratio</span>
            <TrendingDown className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{savingsRate}%</div>
          <div className="text-[10px] text-emerald-400">Target: ≥ 35% monthly savings</div>
        </div>
      </div>

      {/* Receipt Scanner */}
      <ReceiptScanner onAddTransaction={handleAddTransaction} />

      {/* AI Spending Coach Panel */}
      <AICoachPanel
        report={coachReport}
        isLoading={coachLoading}
        onRefresh={() => fetchCoachReport(transactions, budgets)}
      />

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SpendingDonut transactions={transactions} />
        <BudgetProgress
          transactions={transactions}
          budgets={budgets}
          onUpdateBudget={handleUpdateBudget}
        />
      </div>

      {/* Expense History Table */}
      <TransactionTable
        transactions={transactions}
        onAddTransaction={handleAddTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />
    </div>
  );
}
