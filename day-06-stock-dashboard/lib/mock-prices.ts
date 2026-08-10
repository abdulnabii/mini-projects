import { StockQuote, PriceTick } from '@/types';

// Base prices for simulation
const BASE_PRICES: Record<string, number> = {
  AAPL: 193.2,
  NVDA: 875.4,
  MSFT: 412.6,
  GOOGL: 178.3,
  META: 520.8,
  TSLA: 245.1,
  AMZN: 198.5,
};

const COMPANY_NAMES: Record<string, string> = {
  AAPL: 'Apple Inc.',
  NVDA: 'NVIDIA Corporation',
  MSFT: 'Microsoft Corporation',
  GOOGL: 'Alphabet Inc.',
  META: 'Meta Platforms Inc.',
  TSLA: 'Tesla Inc.',
  AMZN: 'Amazon.com Inc.',
};

const MARKET_CAPS: Record<string, string> = {
  AAPL: '2.98T',
  NVDA: '2.16T',
  MSFT: '3.06T',
  GOOGL: '2.24T',
  META: '1.33T',
  TSLA: '781B',
  AMZN: '2.07T',
};

// Current simulated state
let currentPrices: Record<string, number> = { ...BASE_PRICES };
let priceHistory: Record<string, PriceTick[]> = {};

// Initialize history with 50 ticks
export function initializePriceHistory() {
  Object.keys(BASE_PRICES).forEach((ticker) => {
    const history: PriceTick[] = [];
    let price = BASE_PRICES[ticker];
    const now = Date.now();
    for (let i = 49; i >= 0; i--) {
      const delta = (Math.random() - 0.5) * 0.008 * price;
      price = Math.max(price * 0.9, price + delta);
      history.push({ time: now - i * 2000, price: Number(price.toFixed(2)) });
    }
    priceHistory[ticker] = history;
    currentPrices[ticker] = history[history.length - 1].price;
  });
}

// Tick — call every 2s
export function tickPrices(): Record<string, number> {
  const now = Date.now();
  Object.keys(currentPrices).forEach((ticker) => {
    const prev = currentPrices[ticker];
    const delta = (Math.random() - 0.49) * 0.006 * prev; // slight upward bias
    const next = Number(Math.max(prev * 0.97, prev + delta).toFixed(2));
    currentPrices[ticker] = next;
    if (!priceHistory[ticker]) priceHistory[ticker] = [];
    priceHistory[ticker].push({ time: now, price: next });
    // Keep last 100 ticks
    if (priceHistory[ticker].length > 100) priceHistory[ticker].shift();
  });
  return { ...currentPrices };
}

export function getPriceHistory(ticker: string): PriceTick[] {
  return priceHistory[ticker] || [];
}

export function getCurrentPrices(): Record<string, number> {
  return { ...currentPrices };
}

export function buildQuote(ticker: string): StockQuote {
  const price = currentPrices[ticker] || BASE_PRICES[ticker];
  const base = BASE_PRICES[ticker];
  const change = Number((price - base).toFixed(2));
  const changePercent = Number(((change / base) * 100).toFixed(2));
  return {
    ticker,
    name: COMPANY_NAMES[ticker] || ticker,
    price,
    open: Number((base * (1 + (Math.random() - 0.5) * 0.005)).toFixed(2)),
    prevClose: base,
    change,
    changePercent,
    volume: Math.floor(Math.random() * 50_000_000 + 10_000_000),
    high: Number((price * 1.01).toFixed(2)),
    low: Number((price * 0.99).toFixed(2)),
    marketCap: MARKET_CAPS[ticker] || 'N/A',
  };
}

export const DEFAULT_TICKERS = ['AAPL', 'NVDA', 'MSFT', 'GOOGL', 'META', 'TSLA', 'AMZN'];

// Pre-baked news headlines per ticker for Gemini demo
export const STOCK_NEWS: Record<string, string[]> = {
  AAPL: [
    'Apple reports record iPhone 16 Pro sales, beating Q4 estimates by 12%',
    'Apple Vision Pro sees growing enterprise adoption in 2025',
    'Apple expands AI features in iOS 19 with on-device Gemini integration',
    'Analysts raise Apple price target to $220 on services revenue growth',
    'Apple faces EU regulatory pressure over App Store payment monopoly',
  ],
  NVDA: [
    'NVIDIA reports record Q4 revenue of $22.1B, beats estimates by 15%',
    'Jensen Huang signals continued data center demand growth through 2025',
    'NVIDIA announces new Blackwell GPU architecture for AI workloads',
    'Competition heats up as AMD launches MI300X challenger to NVIDIA',
    'NVIDIA stock hits all-time high amid AI infrastructure spending boom',
  ],
  MSFT: [
    'Microsoft Azure AI revenue surges 38% YoY on Copilot adoption',
    'Microsoft acquires AI gaming studio for $2.1B in strategic move',
    'Windows 12 AI PC launch set for Q3 2025 with Copilot+ integration',
    'Microsoft Teams usage hits 350M daily active users globally',
    'Analysts maintain Buy rating on Microsoft with $450 price target',
  ],
  GOOGL: [
    'Google DeepMind announces Gemini Ultra 2.0 with multimodal reasoning',
    'Alphabet advertising revenue beats estimates amid AI-powered search growth',
    'Google Cloud gains market share as enterprise AI demand accelerates',
    'Waymo expands robotaxi service to 5 new US cities',
    'Google faces antitrust ruling in EU over search market dominance',
  ],
  META: [
    'Meta AI assistant reaches 500M monthly active users milestone',
    'Meta reports strong Q3 earnings driven by Reels and AI ad targeting',
    'Ray-Ban Meta smart glasses sell out globally amid VR/AR demand',
    'Meta faces user data privacy lawsuit in California courts',
    'Zuckerberg announces Llama 4 open-source AI model release',
  ],
  TSLA: [
    'Tesla Cybertruck deliveries accelerate with record Q3 production numbers',
    'Tesla Full Self-Driving Version 13 rollout shows improved safety metrics',
    'Elon Musk announces Tesla Robotaxi launch for select US cities in 2025',
    'Tesla faces margin pressure as EV price war intensifies with BYD',
    'Tesla Energy division revenue doubles on Megapack storage demand',
  ],
  AMZN: [
    'Amazon AWS reaches $110B annualized revenue run rate on AI workloads',
    'Amazon Prime membership hits 230M globally with record renewal rates',
    'Amazon Bedrock AI platform sees 300% growth in enterprise adoption',
    'Amazon launches Project Kuiper satellite internet with first 1,000 sats',
    'Amazon faces FTC scrutiny over Prime subscription cancellation practices',
  ],
};
