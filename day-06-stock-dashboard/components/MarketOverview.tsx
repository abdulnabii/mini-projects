'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketIndex { label: string; value: number; change: number; changePercent: number; }

const INITIAL_INDICES: MarketIndex[] = [
  { label: 'S&P 500', value: 5421.03, change: 18.42, changePercent: 0.34 },
  { label: 'NASDAQ', value: 17089.27, change: -42.18, changePercent: -0.25 },
  { label: 'DOW JONES', value: 39873.56, change: 124.79, changePercent: 0.31 },
];

export default function MarketOverview() {
  return (
    <div className="flex items-center gap-4 px-2 overflow-x-auto">
      {INITIAL_INDICES.map((idx) => {
        const isUp = idx.change >= 0;
        return (
          <div key={idx.label} className="flex items-center gap-2.5 bg-[#0d1117] border border-slate-800 rounded-xl px-4 py-2 min-w-fit">
            <div>
              <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">{idx.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-mono tabular-nums">{idx.value.toLocaleString()}</span>
                <span className={`flex items-center gap-0.5 text-[11px] font-mono font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                  {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isUp ? '+' : ''}{idx.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
