'use client';

import { useState } from 'react';
import { StockQuote } from '@/types';
import { TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';

interface WatchlistPanelProps {
  quotes: StockQuote[];
  selectedTicker: string;
  onSelect: (ticker: string) => void;
}

export default function WatchlistPanel({ quotes, selectedTicker, onSelect }: WatchlistPanelProps) {
  const [search, setSearch] = useState('');

  const filteredQuotes = quotes.filter(
    (q) =>
      q.ticker.toLowerCase().includes(search.toLowerCase()) ||
      q.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#0b0f19] border border-green-500/20 rounded-3xl p-5 space-y-4 font-mono text-xs shadow-2xl shadow-green-500/5">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="font-bold text-white uppercase tracking-wider font-outfit text-sm">
          Live Watchlist
        </h3>
        <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/30">
          {quotes.length} Equities
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter ticker or asset..."
          className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-green-500"
        />
      </div>

      {/* Ticker List */}
      <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredQuotes.map((q) => {
          const isSelected = q.ticker === selectedTicker;
          const isUp = q.change >= 0;

          return (
            <button
              key={q.ticker}
              type="button"
              onClick={() => onSelect(q.ticker)}
              className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-green-500/10 border-green-500/50 shadow-md'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="space-y-0.5 truncate pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white font-outfit text-sm">{q.ticker}</span>
                  {q.sector && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 truncate max-w-[80px]">
                      {q.sector}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 truncate">{q.name}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-bold text-white text-xs font-outfit block tabular-nums">
                  ${q.price.toFixed(2)}
                </span>
                <span
                  className={`text-[10px] font-bold flex items-center justify-end gap-0.5 tabular-nums ${
                    isUp ? 'text-green-400' : 'text-rose-400'
                  }`}
                >
                  {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isUp ? '+' : ''}{q.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
