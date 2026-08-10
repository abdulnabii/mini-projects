'use client';

import { StockQuote } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WatchlistPanelProps {
  quotes: StockQuote[];
  selectedTicker: string;
  onSelect: (ticker: string) => void;
}

export default function WatchlistPanel({ quotes, selectedTicker, onSelect }: WatchlistPanelProps) {
  return (
    <div className="bg-[#0d1117] border border-green-500/15 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Watchlist</span>
        <span className="text-[10px] text-green-400 font-mono">{quotes.length} stocks</span>
      </div>
      <div className="divide-y divide-slate-800/60">
        {quotes.map((q) => {
          const isUp = q.change >= 0;
          const isSelected = q.ticker === selectedTicker;
          return (
            <button key={q.ticker} onClick={() => onSelect(q.ticker)}
              className={`w-full px-4 py-3 text-left hover:bg-slate-900/60 transition-colors ${isSelected ? 'bg-green-500/5 border-l-2 border-green-400' : 'border-l-2 border-transparent'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white font-mono">{q.ticker}</span>
                  <span className="block text-[10px] text-slate-500 font-sans truncate max-w-[120px]">{q.name.split(' ').slice(0, 2).join(' ')}</span>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-white font-mono tabular-nums">${q.price.toFixed(2)}</span>
                  <span className={`flex items-center justify-end gap-0.5 text-[10px] font-mono font-bold tabular-nums ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                    {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isUp ? '+' : ''}{q.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
