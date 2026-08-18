'use client';

import { useEffect, useState } from 'react';
import { Transaction, CoachReport, ExpenseCategory, SupportedCurrency } from '@/types';
import {
  getStoredTransactions,
  saveTransaction,
  deleteTransaction,
  getStoredBudgets,
  saveBudget,
} from '@/lib/storage';
import { formatMoney } from '@/lib/mock-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReceiptScanner from '@/components/ReceiptScanner';
import SpendingDonut from '@/components/SpendingDonut';
import BudgetProgress from '@/components/BudgetProgress';
import TransactionTable from '@/components/TransactionTable';
import AICoachPanel from '@/components/AICoachPanel';
import CoachChat from '@/components/CoachChat';
import { DollarSign, TrendingDown, PiggyBank, Target, Sparkles, Wallet } from 'lucide-react';

export default function ExpenseDashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Record<ExpenseCategory, number>>({} as Record<ExpenseCategory, number>);
  const [coachReport, setCoachReport] = useState<CoachReport | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
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
  const monthlyIncome = currency === 'PKR' ? 1450000 : 5200;
  const netBalance = Math.max(0, monthlyIncome - totalSpent);
  const savingsRate = Math.round((netBalance / monthlyIncome) * 100);

  if (!initialized) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#060e0e] text-slate-200">
      <Navbar currency={currency} onToggleCurrency={setCurrency} />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 font-mono text-xs text-slate-300">
        {/* Header Hero Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6 pt-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI FINANCIAL INTELLIGENCE &amp; VISION OCR</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-outfit">
              Financial Dashboard &amp; <span className="text-emerald-400">Expense Diary</span>
            </h1>
            <p className="text-xs text-slate-400">
              Track receipts, audit monthly outflows, and receive actionable AI cutback recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0b1616] border border-emerald-500/20 px-4 py-2.5 rounded-2xl text-xs shadow-lg shrink-0">
            <span className="text-slate-400 font-bold">Monthly Net Income:</span>
            <span className="text-emerald-400 font-black text-sm font-outfit">
              {formatMoney(monthlyIncome, currency)}
            </span>
          </div>
        </div>

        {/* 4 Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0b1616] border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase text-[10px]">Total Logged Outflow</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white font-outfit tabular-nums">
              {formatMoney(totalSpent, currency)}
            </div>
            <div className="text-[10px] text-slate-500">{transactions.length} receipts &amp; entries</div>
          </div>

          <div className="bg-[#0b1616] border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase text-[10px]">Monthly Budget Cap</span>
              <Target className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white font-outfit tabular-nums">
              {formatMoney(totalBudgetCap, currency)}
            </div>
            <div className="text-[10px] text-slate-500">Across 12 category targets</div>
          </div>

          <div className="bg-[#0b1616] border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase text-[10px]">Surplus Net Balance</span>
              <PiggyBank className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-outfit tabular-nums">
              {formatMoney(netBalance, currency)}
            </div>
            <div className="text-[10px] text-slate-500">Estimated remaining cashflow</div>
          </div>

          <div className="bg-[#0b1616] border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase text-[10px]">Savings Rate Ratio</span>
              <TrendingDown className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white font-outfit tabular-nums">{savingsRate}%</div>
            <div className="text-[10px] text-emerald-400 font-bold">Target: ≥ 35% monthly savings</div>
          </div>
        </div>

        {/* AI Receipt Scanner */}
        <ReceiptScanner onAddTransaction={handleAddTransaction} currency={currency} />

        {/* Gemini AI Financial Coach */}
        <AICoachPanel
          report={coachReport}
          isLoading={coachLoading}
          onRefresh={() => fetchCoachReport(transactions, budgets)}
          currency={currency}
        />

        {/* Interactive Advisor Q&A Chat */}
        <CoachChat transactions={transactions} budgets={budgets} />

        {/* Analytics Grid: Category Donut & Budget Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SpendingDonut transactions={transactions} currency={currency} />
          <BudgetProgress
            transactions={transactions}
            budgets={budgets}
            onUpdateBudget={handleUpdateBudget}
            currency={currency}
          />
        </div>

        {/* Expense History Table */}
        <TransactionTable
          transactions={transactions}
          onAddTransaction={handleAddTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          currency={currency}
        />
      </main>

      <Footer />
    </div>
  );
}
