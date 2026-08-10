'use client';

import { Holding, StockQuote, PortfolioMetrics } from '@/types';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface PortfolioSummaryProps {
  holdings: Holding[];
  quotes: StockQuote[];
}

function calcMetrics(holdings: Holding[], quotes: StockQuote[]): PortfolioMetrics {
  const priceMap: Record<string, number> = {};
  quotes.forEach((q) => { priceMap[q.ticker] = q.price; });

  let totalInvested = 0;
  let currentValue = 0;
  let topPerformer: { ticker: string; pnlPercent: number } | null = null;
  let worstPerformer: { ticker: string; pnlPercent: number } | null = null;

  holdings.forEach((h) => {
    const invested = h.shares * h.purchasePrice;
    const current = h.shares * (priceMap[h.ticker] || h.purchasePrice);
    totalInvested += invested;
    currentValue += current;
    const pnlPct = ((current - invested) / invested) * 100;
    if (!topPerformer || pnlPct > topPerformer.pnlPercent) topPerformer = { ticker: h.ticker, pnlPercent: pnlPct };
    if (!worstPerformer || pnlPct < worstPerformer.pnlPercent) worstPerformer = { ticker: h.ticker, pnlPercent: pnlPct };
  });

  const totalPnL = currentValue - totalInvested;
  const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  return { totalInvested, currentValue, totalPnL, pnlPercent, topPerformer, worstPerformer };
}

interface StatCardProps { label: string; value: string; sub?: string; up?: boolean; }
function StatCard({ label, value, sub, up }: StatCardProps) {
  const color = up === undefined ? 'text-white' : up ? 'text-green-400' : 'text-red-400';
  return (
    <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-3 space-y-1">
      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">{label}</span>
      <div className={`text-lg font-bold font-mono tabular-nums ${color}`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-500 font-mono">{sub}</div>}
    </div>
  );
}

export default function PortfolioSummary({ holdings, quotes }: PortfolioSummaryProps) {
  const m = calcMetrics(holdings, quotes);
  const isUp = m.totalPnL >= 0;

  if (holdings.length === 0) {
    return (
      <div className="bg-[#0d1117] border border-green-500/15 rounded-2xl p-6 text-center">
        <DollarSign className="w-8 h-8 text-slate-700 mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-mono">No holdings yet — add your first position below</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1117] border border-green-500/15 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <DollarSign className="w-4 h-4 text-green-400" />
        <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Portfolio Summary</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Current Value" value={`$${m.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        <StatCard label="Total P&L" value={`${isUp ? '+' : ''}$${m.totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} up={isUp} />
        <StatCard label="Invested" value={`$${m.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        <StatCard label="Return" value={`${isUp ? '+' : ''}${m.pnlPercent.toFixed(2)}%`} up={isUp} />
      </div>
      {m.topPerformer && (
        <div className="flex items-center gap-2 text-xs font-mono text-green-400 bg-green-500/5 border border-green-500/20 rounded-xl px-3 py-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Top performer: <b>{m.topPerformer.ticker}</b> (+{m.topPerformer.pnlPercent.toFixed(1)}%)</span>
        </div>
      )}
      {m.worstPerformer && m.worstPerformer.ticker !== m.topPerformer?.ticker && (
        <div className="flex items-center gap-2 text-xs font-mono text-red-400 bg-red-500/5 border border-red-500/20 rounded-xl px-3 py-2">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Laggard: <b>{m.worstPerformer.ticker}</b> ({m.worstPerformer.pnlPercent.toFixed(1)}%)</span>
        </div>
      )}
    </div>
  );
}
