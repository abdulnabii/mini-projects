'use client';

import { useState, useEffect } from 'react';
import { StockQuote, Holding } from '@/types';
import { getHoldings, saveHolding, deleteHolding } from '@/lib/storage';
import { Briefcase, ArrowUpRight, ArrowDownRight, Plus, Trash2, DollarSign, Wallet, RefreshCw } from 'lucide-react';

interface Props {
  quotes: StockQuote[];
  selectedTicker?: string;
  holdings?: Holding[];
}

export default function PortfolioSummary({ quotes, selectedTicker = 'NVDA', holdings: initialHoldings }: Props) {
  const [holdings, setHoldings] = useState<Holding[]>(() => initialHoldings || getHoldings());
  const [sharesInput, setSharesInput] = useState<string>('10');
  const [cashBalance, setCashBalance] = useState<number>(100000);

  useEffect(() => {
    if (initialHoldings) {
      setHoldings(initialHoldings);
    } else {
      setHoldings(getHoldings());
    }
  }, [initialHoldings]);

  const priceMap = Object.fromEntries(quotes.map((q) => [q.ticker, q.price]));
  const currentSelectedPrice = priceMap[selectedTicker] || 200;

  const totalPortfolioValue = holdings.reduce((acc, h) => {
    const p = priceMap[h.ticker] || h.purchasePrice;
    return acc + p * h.shares;
  }, 0);

  const totalCostBasis = holdings.reduce((acc, h) => acc + h.purchasePrice * h.shares, 0);
  const totalPnL = totalPortfolioValue - totalCostBasis;
  const pnlPercent = totalCostBasis > 0 ? (totalPnL / totalCostBasis) * 100 : 0;

  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(sharesInput);
    if (!qty || qty <= 0) return;

    const totalCost = qty * currentSelectedPrice;
    if (totalCost > cashBalance) {
      alert('Insufficient virtual cash balance for this order.');
      return;
    }

    const newHolding: Holding = {
      id: `h_${Date.now()}`,
      ticker: selectedTicker,
      shares: qty,
      purchasePrice: currentSelectedPrice,
    };

    saveHolding(newHolding);
    setHoldings(getHoldings());
    setCashBalance((prev) => prev - totalCost);
  };

  const handleSell = (id: string, ticker: string, shares: number) => {
    const currentPrice = priceMap[ticker] || 200;
    const saleProceeds = shares * currentPrice;
    deleteHolding(id);
    setHoldings(getHoldings());
    setCashBalance((prev) => prev + saleProceeds);
  };

  return (
    <div className="bg-[#0b0f19] border border-green-500/20 rounded-3xl p-5 sm:p-6 space-y-6 font-mono text-xs text-slate-300 shadow-2xl shadow-green-500/5">
      {/* Portfolio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">Virtual Paper Trading &amp; Portfolio</h3>
            <p className="text-xs text-slate-400">Real-time mock execution with live tick pricing</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Net Liquidation Value</span>
          <span className="text-xl sm:text-2xl font-black text-white font-outfit">
            ${(cashBalance + totalPortfolioValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Cash Balance</span>
          <p className="text-sm font-black text-white font-outfit">
            ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Stock Equity</span>
          <p className="text-sm font-black text-indigo-300 font-outfit">
            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Unrealized P&amp;L</span>
          <p
            className={`text-sm font-black font-outfit flex items-center gap-1 ${
              totalPnL >= 0 ? 'text-green-400' : 'text-rose-400'
            }`}
          >
            {totalPnL >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Total Return %</span>
          <p
            className={`text-sm font-black font-outfit ${
              pnlPercent >= 0 ? 'text-green-400' : 'text-rose-400'
            }`}
          >
            {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Quick Trade Form */}
      <form onSubmit={handleBuy} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white uppercase text-[11px] font-outfit">
            Execute Order — {selectedTicker} @ ${currentSelectedPrice.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-500">Market Order</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="number"
              min="1"
              step="any"
              value={sharesInput}
              onChange={(e) => setSharesInput(e.target.value)}
              placeholder="Shares quantity..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-green-500 font-bold"
            />
            <span className="absolute right-3 top-2.5 text-[10px] text-slate-500">SHARES</span>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-extrabold text-xs font-outfit uppercase tracking-wider transition-all shadow-md shadow-green-500/20"
          >
            Buy {selectedTicker}
          </button>
        </div>
      </form>

      {/* Active Positions Table */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Active Positions ({holdings.length})
        </span>

        {holdings.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {holdings.map((h) => {
              const curP = priceMap[h.ticker] || h.purchasePrice;
              const posVal = curP * h.shares;
              const posPnL = posVal - h.purchasePrice * h.shares;
              const isUp = posPnL >= 0;

              return (
                <div
                  key={h.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-outfit text-sm">{h.ticker}</span>
                      <span className="text-[10px] text-slate-400">{h.shares} shs @ ${h.purchasePrice.toFixed(2)}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Current: ${curP.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-bold text-white text-xs block">${posVal.toFixed(2)}</span>
                      <span className={`text-[10px] font-bold ${isUp ? 'text-green-400' : 'text-rose-400'}`}>
                        {isUp ? '+' : ''}${posPnL.toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSell(h.id, h.ticker, h.shares)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold transition-all"
                    >
                      Sell All
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-4">No active positions. Execute your first buy order above.</p>
        )}
      </div>
    </div>
  );
}
