export interface StockQuote {
  ticker: string;
  name: string;
  price: number;
  open: number;
  prevClose: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  marketCap: string;
  sector?: string;
  peRatio?: number;
}

export interface PriceTick {
  time: number;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export interface SentimentResult {
  ticker: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  tradeSignal: 'STRONG BUY' | 'ACCUMULATE' | 'HOLD' | 'TAKE PROFIT' | 'STRONG SELL';
  score: number;
  confidence: number;
  rationale: string;
  supportLevel: number;
  resistanceLevel: number;
  keySignals: string[];
}

export interface Holding {
  id: string;
  ticker: string;
  shares: number;
  purchasePrice: number;
}

export interface PriceAlert {
  id: string;
  ticker: string;
  condition: 'above' | 'below';
  threshold: number;
  triggered: boolean;
  createdAt: string;
}

export interface PortfolioMetrics {
  cashBalance: number;
  totalInvested: number;
  currentValue: number;
  totalPnL: number;
  pnlPercent: number;
  topPerformer: { ticker: string; pnlPercent: number } | null;
  worstPerformer: { ticker: string; pnlPercent: number } | null;
}
