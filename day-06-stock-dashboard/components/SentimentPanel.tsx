'use client';

import { SentimentResult } from '@/types';
import { TrendingUp, TrendingDown, Minus, Sparkles, Loader2 } from 'lucide-react';

interface SentimentPanelProps {
  ticker: string;
  sentiment: SentimentResult | null;
  headlines: string[];
  loading: boolean;
  onAnalyze: () => void;
}

const SENTIMENT_CONFIG = {
  bullish: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: TrendingUp, label: 'BULLISH' },
  bearish: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: TrendingDown, label: 'BEARISH' },
  neutral: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', icon: Minus, label: 'NEUTRAL' },
};

export default function SentimentPanel({ ticker, sentiment, headlines, loading, onAnalyze }: SentimentPanelProps) {
  const config = sentiment ? SENTIMENT_CONFIG[sentiment.sentiment] : null;
  const SIcon = config?.icon;

  return (
    <div className="bg-[#0d1117] border border-green-500/15 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-green-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">AI Sentiment — {ticker}</span>
        </div>
        <button onClick={onAnalyze} disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all disabled:opacity-50">
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {sentiment && config && SIcon ? (
        <div className="space-y-3">
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${config.bg}`}>
            <SIcon className={`w-5 h-5 ${config.color}`} />
            <div>
              <span className={`text-base font-bold font-mono ${config.color}`}>{config.label}</span>
              <span className="ml-2 text-xs text-slate-400 font-mono">Score: {sentiment.score > 0 ? '+' : ''}{sentiment.score.toFixed(2)}</span>
            </div>
            <div className="ml-auto">
              <div className="text-xs text-slate-500 font-mono">Confidence</div>
              <div className={`text-sm font-bold font-mono ${config.color}`}>{Math.round(sentiment.confidence * 100)}%</div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{sentiment.rationale}</p>

          <div className="flex flex-wrap gap-1.5">
            {sentiment.keySignals.map((s, i) => (
              <span key={i} className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${config.bg} ${config.color}`}>{s}</span>
            ))}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Headlines Analyzed</span>
            {headlines.slice(0, 3).map((h, i) => (
              <p key={i} className="text-[11px] text-slate-400 leading-snug pl-2 border-l border-slate-700">{h}</p>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <Sparkles className="w-8 h-8 text-slate-700" />
          <span className="text-xs text-slate-500 font-mono text-center">Click Analyze to run AI sentiment<br />on the latest {ticker} headlines</span>
        </div>
      )}
    </div>
  );
}
