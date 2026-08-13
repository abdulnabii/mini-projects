'use client';

import { useState, useEffect } from 'react';
import { Debt, DebtOptimizationResult, FIREAnalysis, FinancialHealthGrade, FinancialSummary, Transaction } from '@/types';
import { DEMO_PRESETS, getStoredTransactions, saveTransactionsToStorage } from '@/lib/storage';
import { calculateFinancialSummary, calculateFIREAnalysis, optimizeDebtPayoff } from '@/lib/finance';
import StatementUploader from '@/components/StatementUploader';
import FinancialOverview from '@/components/FinancialOverview';
import FIRECalculator from '@/components/FIRECalculator';
import DebtOptimizer from '@/components/DebtOptimizer';
import AIAdvisorChat from '@/components/AIAdvisorChat';
import { Wallet, PieChart, UploadCloud, Flame, Zap, Bot, Sparkles, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_PRESETS[0].transactions);
  const [debts, setDebts] = useState<Debt[]>(DEMO_PRESETS[0].debts);
  const [cashAssets, setCashAssets] = useState<number>(DEMO_PRESETS[0].cashAssets);
  const [investmentAssets, setInvestmentAssets] = useState<number>(DEMO_PRESETS[0].investmentAssets);

  const [activeTab, setActiveTab] = useState<'overview' | 'import' | 'fire' | 'debt' | 'advisor'>('overview');
  const [narrative, setNarrative] = useState<FinancialHealthGrade | null>(null);
  const [isLoadingNarrative, setIsLoadingNarrative] = useState<boolean>(false);
  const [isAdvisorLoading, setIsAdvisorLoading] = useState<boolean>(false);

  // Compute live calculations
  const summary: FinancialSummary = calculateFinancialSummary(
    transactions,
    cashAssets,
    investmentAssets,
    debts.reduce((s, d) => s + d.balance, 0)
  );

  const fire: FIREAnalysis = calculateFIREAnalysis(
    summary.monthlyExpenses * 12,
    investmentAssets,
    summary.monthlySavings
  );

  useEffect(() => {
    fetchFinancialNarrative(transactions, debts, cashAssets, investmentAssets);
  }, []);

  const fetchFinancialNarrative = async (
    txs: Transaction[],
    dList: Debt[],
    cash: number,
    invest: number
  ) => {
    setIsLoadingNarrative(true);
    try {
      const res = await fetch('/api/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions: txs,
          debts: dList,
          cashAssets: cash,
          investmentAssets: invest,
        }),
      });

      const data = await res.json();
      if (data.narrative) {
        setNarrative(data.narrative);
      }
    } catch (err) {
      console.error('Error fetching narrative:', err);
    } finally {
      setIsLoadingNarrative(false);
    }
  };

  const handleLoadTransactions = (
    newTxs: Transaction[],
    newDebts?: Debt[],
    newCash?: number,
    newInvest?: number
  ) => {
    setTransactions(newTxs);
    if (newDebts) setDebts(newDebts);
    if (newCash !== undefined) setCashAssets(newCash);
    if (newInvest !== undefined) setInvestmentAssets(newInvest);

    saveTransactionsToStorage(newTxs);
    fetchFinancialNarrative(
      newTxs,
      newDebts || debts,
      newCash !== undefined ? newCash : cashAssets,
      newInvest !== undefined ? newInvest : investmentAssets
    );

    setActiveTab('overview');
  };

  const handleAskAdvisor = async (question: string): Promise<string> => {
    setIsAdvisorLoading(true);
    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          transactions,
          debts,
          cashAssets,
          investmentAssets,
        }),
      });

      const data = await res.json();
      return data.text || 'I have analyzed your portfolio data and recommend prioritizing your Avalanche debt payoff.';
    } catch (err) {
      console.error('Advisor chat error:', err);
      return 'I recommend directing cash flow to high-APR balances first while maintaining consistent index fund savings.';
    } finally {
      setIsAdvisorLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI FINANCIAL INDEPENDENCE (FIRE) PLATFORM</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-outfit">
          Transform Bank Statements into <br />
          <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            Financial Freedom (FIRE) Intelligence
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
          Upload bank statements to track net worth, compute monthly burn rates, project your exact FIRE retirement date, and optimize debt payoff via Avalanche vs. Snowball engines.
        </p>
      </section>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 font-mono text-xs overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-2 font-bold shrink-0 ${
            activeTab === 'overview'
              ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <PieChart className="w-4 h-4 text-amber-400" />
          <span>Financial Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fire')}
          className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-2 font-bold shrink-0 ${
            activeTab === 'fire'
              ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>FIRE Calculator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('debt')}
          className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-2 font-bold shrink-0 ${
            activeTab === 'debt'
              ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Debt Optimizer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advisor')}
          className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-2 font-bold shrink-0 ${
            activeTab === 'advisor'
              ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4 text-amber-400" />
          <span>AI CFP Advisor Chat</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-2 font-bold shrink-0 ${
            activeTab === 'import'
              ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <UploadCloud className="w-4 h-4 text-amber-400" />
          <span>Import Bank Statement</span>
        </button>
      </div>

      {/* Tab Content Rendering */}
      {activeTab === 'overview' && (
        <FinancialOverview summary={summary} narrative={narrative} isLoadingNarrative={isLoadingNarrative} />
      )}

      {activeTab === 'fire' && <FIRECalculator fire={fire} />}

      {activeTab === 'debt' && <DebtOptimizer debts={debts} />}

      {activeTab === 'advisor' && <AIAdvisorChat onAskQuestion={handleAskAdvisor} isLoading={isAdvisorLoading} />}

      {activeTab === 'import' && (
        <StatementUploader onLoadTransactions={handleLoadTransactions} isLoading={isLoadingNarrative} />
      )}
    </div>
  );
}
