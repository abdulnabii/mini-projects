'use client';

import { TrendingUp, TrendingDown, Globe } from 'lucide-react';

interface MarketIndex {
  label: string;
  value: string;
  change: string;
  changePercent: number;
}

const INDICES: MarketIndex[] = [
  { label: 'S&P 500', value: '5,864.67', change: '+24.18', changePercent: 0.41 },
  { label: 'NASDAQ', value: '18,485.20', change: '+118.50', changePercent: 0.65 },
  { label: 'DOW JONES', value: '43,275.91', change: '+36.80', changePercent: 0.09 },
  { label: 'BTC / USD', value: '$64,850.00', change: '+1,420.00', changePercent: 2.24 },
  { label: 'ETH / USD', value: '$2,640.50', change: '+52.10', changePercent: 2.01 },
  { label: 'CRUDE OIL', value: '$70.85', change: '-0.45', changePercent: -0.63 },
  { label: '10Y YIELD', value: '4.08%', change: '+0.02', changePercent: 0.49 },
];

export default function MarketOverview() {
  return (
    <div className="rounded-2xl bg-[#0b0f19] border border-green-500/20 p-2.5 overflow-x-auto font-mono text-xs shadow-lg">
      <div className="flex items-center gap-3 min-w-max">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-[10px] uppercase shrink-0">
          <Globe className="w-3 h-3" />
          <span>Global Indices</span>
        </div>

        {INDICES.map((idx) => {
          const isUp = idx.changePercent >= 0;
          return (
            <div
              key={idx.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/80 shrink-0"
            >
              <span className="text-[10px] text-slate-400 font-bold">{idx.label}</span>
              <span className="text-white font-bold font-outfit text-xs">{idx.value}</span>
              <span
                className={`flex items-center text-[10px] font-bold ${
                  isUp ? 'text-green-400' : 'text-rose-400'
                }`}
              >
                {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {isUp ? '+' : ''}
                {idx.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
