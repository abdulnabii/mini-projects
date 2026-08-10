'use client';

import { PriceTick } from '@/types';

interface PriceChartProps {
  ticks: PriceTick[];
  ticker: string;
  currentPrice: number;
  change: number;
}

export default function PriceChart({ ticks, ticker, currentPrice, change }: PriceChartProps) {
  if (ticks.length < 2) return (
    <div className="bg-[#0d1117] border border-green-500/15 rounded-2xl h-64 flex items-center justify-center text-slate-600 text-xs font-mono">
      Waiting for price data...
    </div>
  );

  const prices = ticks.map((t) => t.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;
  const isUp = change >= 0;

  const W = 600;
  const H = 160;
  const PAD = 12;

  const points = ticks.map((t, i) => {
    const x = PAD + (i / (ticks.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((t.price - minPrice) / range) * (H - PAD * 2);
    return `${x},${y}`;
  });

  const polyline = points.join(' ');
  const areaClose = `${PAD + (W - PAD * 2)},${H - PAD} ${PAD},${H - PAD}`;
  const areaPath = `${points[0]} ${points.slice(1).join(' ')} ${areaClose}`;

  const strokeColor = isUp ? '#00d084' : '#ef4444';
  const fillId = isUp ? 'greenFill' : 'redFill';
  const fillColor = isUp ? '#00d084' : '#ef4444';

  return (
    <div className="bg-[#0d1117] border border-green-500/15 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-white font-mono tabular-nums">${currentPrice.toFixed(2)}</span>
          <span className={`ml-3 text-sm font-mono font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
            {isUp ? '+' : ''}{change.toFixed(2)} ({isUp ? '+' : ''}{((change / (currentPrice - change)) * 100).toFixed(2)}%)
          </span>
        </div>
        <div className="text-right text-xs font-mono text-slate-500">
          <span className="block">H: ${Math.max(...prices).toFixed(2)}</span>
          <span className="block">L: ${Math.min(...prices).toFixed(2)}</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40" preserveAspectRatio="none">
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <polygon points={areaPath} fill={`url(#${fillId})`} />
        {/* Price line */}
        <polyline points={polyline} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Current price dot */}
        {ticks.length > 0 && (() => {
          const last = ticks[ticks.length - 1];
          const lx = PAD + ((ticks.length - 1) / (ticks.length - 1)) * (W - PAD * 2);
          const ly = H - PAD - ((last.price - minPrice) / range) * (H - PAD * 2);
          return <circle cx={lx} cy={ly} r="3" fill={strokeColor} />;
        })()}
      </svg>

      <div className="text-[10px] text-slate-600 font-mono flex justify-between">
        <span>← {ticks.length} ticks (2s interval)</span>
        <span>Simulated Data — Not for Trading Decisions →</span>
      </div>
    </div>
  );
}
