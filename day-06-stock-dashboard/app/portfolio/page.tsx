'use client';

import { useEffect, useState } from 'react';
import { Holding, StockQuote } from '@/types';
import {
  initializePriceHistory,
  tickPrices,
  buildQuote,
  DEFAULT_TICKERS,
} from '@/lib/mock-prices';
import { getHoldings, saveHolding, deleteHolding } from '@/lib/storage';
import PortfolioSummary from '@/components/PortfolioSummary';
import { Plus, Trash2, Briefcase } from 'lucide-react';

export default function PortfolioPage() {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [ticker, setTicker] = useState('AAPL');
  const [shares, setShares] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializePriceHistory();
    setQuotes(DEFAULT_TICKERS.map(buildQuote));
    setHoldings(getHoldings());
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const interval = setInterval(() => {
      tickPrices();
      setQuotes(DEFAULT_TICKERS.map(buildQuote));
    }, 2000);
    return () => clearInterval(interval);
  }, [initialized]);

  const refreshHoldings = () => setHoldings(getHoldings());

  const handleAdd = () => {
    if (!shares || !buyPrice || isNaN(Number(shares)) || isNaN(Number(buyPrice))) return;
    const h: Holding = {
      id: crypto.randomUUID(),
      ticker,
      shares: Number(shares),
      purchasePrice: Number(buyPrice),
    };
    saveHolding(h);
    setShares('');
    setBuyPrice('');
    refreshHoldings();
  };

  const priceMap = Object.fromEntries(quotes.map((q) => [q.ticker, q.price]));

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
      <div className="flex items-center gap-3">
        <Briefcase className="w-6 h-6 text-green-400" />
        <h1 className="text-2xl font-bold text-white font-mono">Portfolio Tracker</h1>
      </div>

      <PortfolioSummary holdings={holdings} quotes={quotes} />

      {/* Add Holding */}
      <div className="bg-[#0d1117] border border-green-500/15 rounded-2xl p-5 space-y-4">
        <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Plus className="w-4 h-4 text-green-400" /> Add Position
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-mono uppercase mb-1">Ticker</label>
            <select value={ticker} onChange={(e) => setTicker(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-green-500/50">
              {DEFAULT_TICKERS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-mono uppercase mb-1">Shares</label>
            <input type="number" value={shares} onChange={(e) => setShares(e.target.value)} placeholder="e.g. 10"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-green-500/50" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-mono uppercase mb-1">Buy Price ($)</label>
            <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} placeholder={`Current: $${priceMap[ticker]?.toFixed(2) || '—'}`}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-green-500/50" />
          </div>
        </div>
        <button onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-mono hover:bg-green-500/20 transition-all">
          <Plus className="w-4 h-4" /> Add to Portfolio
        </button>
      </div>

      {/* Holdings Table */}
      {holdings.length > 0 && (
        <div className="bg-[#0d1117] border border-green-500/15 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Holdings</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase border-b border-slate-800 bg-slate-900/40">
                  <th className="px-4 py-2.5 text-left">Ticker</th>
                  <th className="px-4 py-2.5 text-right">Shares</th>
                  <th className="px-4 py-2.5 text-right">Buy Price</th>
                  <th className="px-4 py-2.5 text-right">Current</th>
                  <th className="px-4 py-2.5 text-right">P&L</th>
                  <th className="px-4 py-2.5 text-right">% Chg</th>
                  <th className="px-4 py-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {holdings.map((h) => {
                  const curr = priceMap[h.ticker] || h.purchasePrice;
                  const pnl = (curr - h.purchasePrice) * h.shares;
                  const pct = ((curr - h.purchasePrice) / h.purchasePrice) * 100;
                  const isUp = pnl >= 0;
                  return (
                    <tr key={h.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-4 py-3 font-bold text-white">{h.ticker}</td>
                      <td className="px-4 py-3 text-right text-slate-300 tabular-nums">{h.shares}</td>
                      <td className="px-4 py-3 text-right text-slate-300 tabular-nums">${h.purchasePrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-white tabular-nums">${curr.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-right tabular-nums font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                        {isUp ? '+' : ''}${pnl.toFixed(2)}
                      </td>
                      <td className={`px-4 py-3 text-right tabular-nums ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                        {isUp ? '+' : ''}{pct.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => { deleteHolding(h.id); refreshHoldings(); }}
                          className="text-slate-600 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
