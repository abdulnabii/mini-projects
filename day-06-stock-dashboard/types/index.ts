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
}

export interface PriceTick {
  time: number;
  price: number;
}

export interface SentimentResult {
  ticker: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  confidence: number;
  rationale: string;
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
  totalInvested: number;
  currentValue: number;
  totalPnL: number;
  pnlPercent: number;
  topPerformer: { ticker: string; pnlPercent: number } | null;
  worstPerformer: { ticker: string; pnlPercent: number } | null;
}
