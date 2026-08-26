'use client';

import { useState, useEffect } from 'react';
import {
  Currency,
  Debt,
  DebtOptimizationResult,
  FIREAnalysis,
  FinancialHealthGrade,
  FinancialSummary,
  Transaction,
} from '@/types';
import { DEMO_PRESETS, getStoredTransactions, saveTransactionsToStorage } from '@/lib/storage';
import {
  calculateFinancialSummary,
  calculateFIREAnalysis,
  optimizeDebtPayoff,
} from '@/lib/finance';
import StatementUploader from '@/components/StatementUploader';
import FinancialOverview from '@/components/FinancialOverview';
import FIRECalculator from '@/components/FIRECalculator';
import DebtOptimizer from '@/components/DebtOptimizer';
import AIAdvisorChat from '@/components/AIAdvisorChat';
import {
  Wallet,
  PieChart,
  UploadCloud,
  Flame,
  Zap,
  Bot,
  Sparkles,
  ShieldCheck,
  Globe,
  TrendingUp,
} from 'lucide-react';

export default function HomePage() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_PRESETS[0].transactions);
  const [debts, setDebts] = useState<Debt[]>(DEMO_PRESETS[0].debts);
  const [cashAssets, setCashAssets] = useState<number>(DEMO_PRESETS[0].cashAssets);
  const [investmentAssets, setInvestmentAssets] = useState<number>(DEMO_PRESETS[0].investmentAssets);

  const [activeTab, setActiveTab] = useState<'overview' | 'fire' | 'debt' | 'advisor' | 'import'>('overview');
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
    newInvest?: number,
    newCurrency?: Currency
  ) => {
    setTransactions(newTxs);
    if (newDebts) setDebts(newDebts);
    if (newCash !== undefined) setCashAssets(newCash);
    if (newInvest !== undefined) setInvestmentAssets(newInvest);
    if (newCurrency) setCurrency(newCurrency);

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
          currency,
        }),
      });

      const data = await res.json();
      return (
        data.text ||
        'I have analyzed your portfolio cash flow and recommend prioritizing high-APR debt while keeping regular monthly investments active.'
      );
    } catch (err) {
      console.error('Advisor chat error:', err);
      return 'I recommend directing available extra cash flow to high-APR balances first while maintaining consistent broad index fund savings.';
    } finally {
      setIsAdvisorLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 py-4 px-2 sm:px-6 max-w-7xl mx-auto w-full font-mono">
      {/* Centered Hero Section */}
      <section className="text-center space-y-3 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <Wallet className="w-3.5 h-3.5" />
          <span>AI FINANCIAL INDEPENDENCE &amp; FIRE PLATFORM</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-mono">
          Transform Statements into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
            Financial Freedom (FIRE)
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed prose-text">
          Track real-time net worth, compute 12-month linear regression forecasts, project exact FIRE retirement dates using the 4% rule, and optimize debt payoff via Avalanche vs. Snowball engines.
        </p>
      </section>

      {/* Navigation Tabs - Unified Component Styling */}
      <div className="flex items-center justify-center">
        <div className="p-1 rounded-xl bg-[#0d1117] border border-slate-800 flex items-center gap-1 max-w-full overflow-x-auto shadow-lg text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Financial Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fire')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'fire'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>FIRE Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('debt')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'debt'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Debt Optimizer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('advisor')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'advisor'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI CFP Advisor Chat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'import'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import Statement</span>
          </button>
        </div>
      </div>

      {/* Tab Content Rendering */}
      {activeTab === 'overview' && (
        <div className="animate-in fade-in duration-200">
          <FinancialOverview
            summary={summary}
            narrative={narrative}
            isLoadingNarrative={isLoadingNarrative}
            currency={currency}
            onToggleCurrency={setCurrency}
          />
        </div>
      )}

      {activeTab === 'fire' && (
        <div className="animate-in fade-in duration-200">
          <FIRECalculator fire={fire} currency={currency} />
        </div>
      )}

      {activeTab === 'debt' && (
        <div className="animate-in fade-in duration-200">
          <DebtOptimizer debts={debts} currency={currency} />
        </div>
      )}

      {activeTab === 'advisor' && (
        <div className="animate-in fade-in duration-200">
          <AIAdvisorChat onAskQuestion={handleAskAdvisor} isLoading={isAdvisorLoading} />
        </div>
      )}

      {activeTab === 'import' && (
        <div className="animate-in fade-in duration-200">
          <StatementUploader onLoadTransactions={handleLoadTransactions} isLoading={isLoadingNarrative} />
        </div>
      )}
    </div>
  );
}
