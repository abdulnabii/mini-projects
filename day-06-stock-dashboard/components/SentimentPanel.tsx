'use client';

import { SentimentResult } from '@/types';
import { TrendingUp, TrendingDown, Minus, Sparkles, Loader2, Target, ShieldAlert, ArrowUpRight, Zap } from 'lucide-react';

interface SentimentPanelProps {
  ticker: string;
  sentiment: SentimentResult | null;
  headlines: string[];
  loading: boolean;
  onAnalyze: () => void;
}

export default function SentimentPanel({
  ticker,
  sentiment,
  headlines,
  loading,
  onAnalyze,
}: SentimentPanelProps) {
  const getSignalBadge = (signal: SentimentResult['tradeSignal']) => {
    if (signal === 'STRONG BUY' || signal === 'ACCUMULATE') {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10';
    }
    if (signal === 'HOLD') {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10';
    }
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/10';
  };

  return (
    <div className="bg-[#0b0f19] border border-green-500/20 rounded-3xl p-5 sm:p-6 space-y-4 font-mono text-xs text-slate-300 shadow-2xl shadow-green-500/5">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-green-400" />
          <h3 className="font-bold text-white uppercase tracking-wider font-outfit text-sm">
            AI Quant Intelligence
          </h3>
        </div>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-black font-extrabold text-[11px] font-outfit uppercase tracking-wider hover:opacity-95 transition-all disabled:opacity-50 shadow-md shadow-green-500/20"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
          <span>{loading ? 'Evaluating...' : 'Run Analysis'}</span>
        </button>
      </div>

      {sentiment ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Signal Pill & Confidence */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Institutional Signal</span>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-xl text-xs font-black font-outfit border ${getSignalBadge(
                  sentiment.tradeSignal
                )}`}
              >
                {sentiment.tradeSignal}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">AI Confidence</span>
              <span className="text-xl font-black text-green-400 font-outfit">
                {Math.round(sentiment.confidence * 100)}%
              </span>
            </div>
          </div>

          {/* Support & Resistance Levels */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                <Target className="w-3 h-3 text-green-400" />
                Support (S1)
              </span>
              <span className="text-sm font-black text-green-300 font-outfit">
                ${sentiment.supportLevel.toFixed(2)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                Resistance (R1)
              </span>
              <span className="text-sm font-black text-amber-300 font-outfit">
                ${sentiment.resistanceLevel.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Rationale */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Analyst Thesis</span>
            <p className="text-slate-200 leading-relaxed text-[11px]">{sentiment.rationale}</p>
          </div>

          {/* Key Signals */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Catalyst Highlights</span>
            <div className="space-y-1">
              {sentiment.keySignals.map((sig, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] text-slate-300 pl-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                  <span className="truncate">{sig}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-white text-xs block font-outfit">Quantitative AI Assistant Ready</span>
            <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
              Click "Run Analysis" to compute trade signals, key price levels, and catalyst sentiment for {ticker}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
