'use client';

import { useState } from 'react';
import { PriceTick } from '@/types';
import { BarChart3, LineChart, Activity, Layers, Maximize2 } from 'lucide-react';

interface PriceChartProps {
  ticks: PriceTick[];
  ticker: string;
  currentPrice: number;
  change: number;
}

export default function PriceChart({ ticks, ticker, currentPrice, change }: PriceChartProps) {
  const [chartMode, setChartMode] = useState<'line' | 'candles'>('candles');
  const [timeframe, setTimeframe] = useState<'1M' | '5M' | '15M' | '1H' | '1D'>('5M');
  const [hoveredTick, setHoveredTick] = useState<PriceTick | null>(null);

  if (ticks.length < 2) {
    return (
      <div className="bg-[#0b0f19] border border-green-500/20 rounded-3xl h-80 flex flex-col items-center justify-center text-slate-500 text-xs font-mono space-y-2">
        <Activity className="w-6 h-6 animate-pulse text-green-400" />
        <span>Streaming live market data ticks...</span>
      </div>
    );
  }

  const prices = ticks.map((t) => t.price);
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;
  const range = maxPrice - minPrice || 1;
  const isUp = change >= 0;

  const W = 700;
  const H = 220;
  const VOL_H = 40;
  const PAD = 16;

  // Max volume for scaling
  const maxVolume = Math.max(...ticks.map((t) => t.volume || 10000), 10000);

  // Line points
  const points = ticks.map((t, i) => {
    const x = PAD + (i / (ticks.length - 1)) * (W - PAD * 2);
    const y = H - VOL_H - PAD - ((t.price - minPrice) / range) * (H - VOL_H - PAD * 2);
    return `${x},${y}`;
  });

  const polyline = points.join(' ');
  const areaClose = `${PAD + (W - PAD * 2)},${H - VOL_H - PAD} ${PAD},${H - VOL_H - PAD}`;
  const areaPath = `${points[0]} ${points.slice(1).join(' ')} ${areaClose}`;

  const strokeColor = isUp ? '#00d084' : '#ef4444';
  const fillId = isUp ? 'chartGreenFill' : 'chartRedFill';
  const fillColor = isUp ? '#00d084' : '#ef4444';

  const activeTick = hoveredTick || ticks[ticks.length - 1];

  return (
    <div className="bg-[#0b0f19] border border-green-500/20 rounded-3xl p-5 sm:p-6 space-y-4 font-mono text-xs shadow-2xl shadow-green-500/5">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-black text-white font-outfit tabular-nums">
              ${(activeTick.close || activeTick.price || currentPrice).toFixed(2)}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isUp
                  ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isUp ? '+' : ''}{change.toFixed(2)} ({isUp ? '+' : ''}
              {((change / (currentPrice - change)) * 100).toFixed(2)}%)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
            <span>O: <strong className="text-white">${(activeTick.open || activeTick.price).toFixed(2)}</strong></span>
            <span>H: <strong className="text-white">${(activeTick.high || activeTick.price).toFixed(2)}</strong></span>
            <span>L: <strong className="text-white">${(activeTick.low || activeTick.price).toFixed(2)}</strong></span>
            <span>Vol: <strong className="text-purple-300">{(activeTick.volume || 25000).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Chart View Toggles & Timeframe */}
        <div className="flex items-center gap-2">
          {/* Mode Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setChartMode('candles')}
              className={`p-1.5 rounded-lg transition-all ${
                chartMode === 'candles' ? 'bg-green-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Candlestick Chart"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setChartMode('line')}
              className={`p-1.5 rounded-lg transition-all ${
                chartMode === 'line' ? 'bg-green-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Area Line Chart"
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timeframe Chips */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['1M', '5M', '15M', '1H', '1D'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  timeframe === tf ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative cursor-crosshair">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-56 sm:h-64 overflow-visible"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredTick(null)}
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={fillColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0.25, 0.5, 0.75].map((pct, idx) => {
            const y = PAD + pct * (H - VOL_H - PAD * 2);
            const pVal = maxPrice - pct * range;
            return (
              <g key={idx}>
                <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
                <text x={W - PAD + 4} y={y + 3} fill="#475569" fontSize="8" fontFamily="monospace">
                  ${pVal.toFixed(1)}
                </text>
              </g>
            );
          })}

          {chartMode === 'line' ? (
            <>
              {/* Area Fill */}
              <polygon points={areaPath} fill={`url(#${fillId})`} />
              {/* Stroke Line */}
              <polyline points={polyline} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : (
            /* Candlestick Rendering */
            ticks.map((t, i) => {
              const x = PAD + (i / (ticks.length - 1)) * (W - PAD * 2);
              const candleW = Math.max(3, (W - PAD * 2) / ticks.length - 2);

              const open = t.open || t.price;
              const close = t.close || t.price;
              const high = t.high || Math.max(open, close);
              const low = t.low || Math.min(open, close);

              const isCandleGreen = close >= open;
              const cColor = isCandleGreen ? '#00d084' : '#ef4444';

              const yHigh = H - VOL_H - PAD - ((high - minPrice) / range) * (H - VOL_H - PAD * 2);
              const yLow = H - VOL_H - PAD - ((low - minPrice) / range) * (H - VOL_H - PAD * 2);
              const yOpen = H - VOL_H - PAD - ((open - minPrice) / range) * (H - VOL_H - PAD * 2);
              const yClose = H - VOL_H - PAD - ((close - minPrice) / range) * (H - VOL_H - PAD * 2);

              const bodyY = Math.min(yOpen, yClose);
              const bodyH = Math.max(2, Math.abs(yOpen - yClose));

              return (
                <g key={i} onMouseEnter={() => setHoveredTick(t)}>
                  {/* High-Low Wick */}
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={cColor} strokeWidth="1" opacity="0.8" />
                  {/* Candle Body */}
                  <rect
                    x={x - candleW / 2}
                    y={bodyY}
                    width={candleW}
                    height={bodyH}
                    fill={cColor}
                    rx="1"
                    opacity="0.9"
                  />
                </g>
              );
            })
          )}

          {/* Volume Histogram Bars */}
          {ticks.map((t, i) => {
            const x = PAD + (i / (ticks.length - 1)) * (W - PAD * 2);
            const vW = Math.max(2, (W - PAD * 2) / ticks.length - 2);
            const v = t.volume || 15000;
            const vHeight = (v / maxVolume) * (VOL_H - 6);
            const vY = H - vHeight;
            const isGreen = (t.close || t.price) >= (t.open || t.price);

            return (
              <rect
                key={`vol_${i}`}
                x={x - vW / 2}
                y={vY}
                width={vW}
                height={vHeight}
                fill={isGreen ? '#00d084' : '#ef4444'}
                opacity="0.35"
                rx="1"
              />
            );
          })}
        </svg>
      </div>

      {/* Footer Info Bar */}
      <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          <span className="text-green-400 font-bold">2.0s Live Ticks Stream</span>
        </span>
        <span className="text-slate-600">Simulated Real-Time Quantitative Engine</span>
      </div>
    </div>
  );
}
