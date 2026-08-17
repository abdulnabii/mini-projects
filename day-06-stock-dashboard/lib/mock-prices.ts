import { StockQuote, PriceTick } from '@/types';

// Base prices for simulation
const BASE_PRICES: Record<string, number> = {
  NVDA: 892.4,
  AAPL: 196.2,
  TSLA: 254.8,
  MSFT: 428.6,
  GOOGL: 182.3,
  META: 535.8,
  AMZN: 202.5,
  BTC: 64850.0,
};

const COMPANY_NAMES: Record<string, string> = {
  NVDA: 'NVIDIA Corporation',
  AAPL: 'Apple Inc.',
  TSLA: 'Tesla Inc.',
  MSFT: 'Microsoft Corporation',
  GOOGL: 'Alphabet Inc.',
  META: 'Meta Platforms Inc.',
  AMZN: 'Amazon.com Inc.',
  BTC: 'Bitcoin (USD)',
};

const SECTOR_TAGS: Record<string, string> = {
  NVDA: 'Semiconductors / AI',
  AAPL: 'Consumer Hardware',
  TSLA: 'EVs & Autonomous Robotics',
  MSFT: 'Cloud & Enterprise AI',
  GOOGL: 'Search & Generative AI',
  META: 'Social Media & Metaverse',
  AMZN: 'E-Commerce & Cloud Infra',
  BTC: 'Digital Asset / Store of Value',
};

const MARKET_CAPS: Record<string, string> = {
  NVDA: '$2.20T',
  AAPL: '$3.02T',
  TSLA: '$812B',
  MSFT: '$3.18T',
  GOOGL: '$2.29T',
  META: '$1.37T',
  AMZN: '$2.11T',
  BTC: '$1.28T',
};

const PE_RATIOS: Record<string, number> = {
  NVDA: 38.4,
  AAPL: 31.2,
  TSLA: 64.5,
  MSFT: 34.8,
  GOOGL: 24.6,
  META: 27.1,
  AMZN: 42.0,
  BTC: 0,
};

// Current simulated state
let currentPrices: Record<string, number> = { ...BASE_PRICES };
let priceHistory: Record<string, PriceTick[]> = {};

// Initialize history with 50 OHLC ticks
export function initializePriceHistory() {
  Object.keys(BASE_PRICES).forEach((ticker) => {
    const history: PriceTick[] = [];
    let price = BASE_PRICES[ticker];
    const now = Date.now();
    for (let i = 49; i >= 0; i--) {
      const delta = (Math.random() - 0.49) * 0.008 * price;
      const open = price;
      price = Math.max(price * 0.9, price + delta);
      const high = Math.max(open, price) * (1 + Math.random() * 0.003);
      const low = Math.min(open, price) * (1 - Math.random() * 0.003);
      const volume = Math.floor(Math.random() * 40000 + 10000);

      history.push({
        time: now - i * 2000,
        price: Number(price.toFixed(2)),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(price.toFixed(2)),
        volume,
      });
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
    const open = prev;
    const high = Math.max(open, next) * (1 + Math.random() * 0.002);
    const low = Math.min(open, next) * (1 - Math.random() * 0.002);
    const volume = Math.floor(Math.random() * 50000 + 15000);

    priceHistory[ticker].push({
      time: now,
      price: next,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: next,
      volume,
    });

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
    volume: Math.floor(Math.random() * 60_000_000 + 15_000_000),
    high: Number((price * 1.015).toFixed(2)),
    low: Number((price * 0.985).toFixed(2)),
    marketCap: MARKET_CAPS[ticker] || 'N/A',
    sector: SECTOR_TAGS[ticker] || 'Equities',
    peRatio: PE_RATIOS[ticker] || 0,
  };
}

export const DEFAULT_TICKERS = ['NVDA', 'AAPL', 'TSLA', 'MSFT', 'GOOGL', 'META', 'AMZN', 'BTC'];

// Real news headlines per ticker for Gemini analysis
export const STOCK_NEWS: Record<string, string[]> = {
  NVDA: [
    'NVIDIA reports Q4 record revenue of $26.0B, beats EPS estimates by 18%',
    'Jensen Huang announces next-gen Rubin ultra AI architecture at Computex',
    'Hyperscale data center demand for Blackwell B200 accelerators sold out for 12 months',
    'AMD and Intel prepare competitive AI accelerator chips for late 2025',
    'Wall Street upgrades NVDA price target to $1,150 citing sovereign AI contracts',
  ],
  AAPL: [
    'Apple reports record Services revenue and strong iPhone 16 Pro supercycle',
    'Apple Intelligence ecosystem rollout expands with multilingual Siri 2.0',
    'Analysts forecast 15% revenue acceleration from on-device private cloud compute',
    'EU regulators issue compliance inquiry regarding third-party default browser prompts',
    'Morgan Stanley reiterates Overweight rating on Apple with $235 price target',
  ],
  TSLA: [
    'Tesla Robotaxi autonomous ride-hailing pilot launches in Austin and San Francisco',
    'Tesla Energy Megapack deployments surge 125% YoY with record gross margins',
    'Full Self-Driving (Supervised) v13 reaches 2 billion cumulative autonomous miles',
    'EV price competition stabilizes as consumer demand shifts toward autonomous capability',
    'Tesla board proposes new 5-year performance milestone package for leadership',
  ],
  MSFT: [
    'Microsoft Azure AI quarterly revenue hits record $14.2B with 34% annualized growth',
    'Microsoft Copilot enterprise seats surpass 60M active daily knowledge workers',
    'Strategic partnership with OpenAI delivers custom silicon acceleration',
    'Windows 12 AI platform showcases sub-10ms local neural processing benchmarks',
    'Goldman Sachs maintains Strong Buy rating with $490 price objective',
  ],
  GOOGL: [
    'Google DeepMind announces Gemini 2.0 Pro featuring native real-time multimodal voice',
    'Google Cloud reaches $10B quarterly milestone with expanding AI operating margins',
    'Waymo commercial robotaxi driverless trips exceed 150,000 rides per week',
    'Google Search generative experience ad monetisation outpaces legacy SERP revenue',
    'Analysts raise price target to $210 citing AI search efficiency advantages',
  ],
  META: [
    'Meta AI assistant reaches 650M monthly active users across WhatsApp and Instagram',
    'Llama 4 open-weights model achieves parity with proprietary frontier models',
    'Ray-Ban Meta smart glasses surpass 2M units shipped globally',
    'Advantage+ AI advertising suite drives 28% return-on-ad-spend (ROAS) improvement',
    'JPMorgan reiterates Top Pick rating on META with $600 price target',
  ],
  AMZN: [
    'Amazon AWS launches next-generation Trainium3 and Inferentia3 AI chips',
    'Amazon Prime Day shatters previous records with $14.2B in global sales',
    'Amazon Bedrock selected by 85% of Fortune 500 companies for generative AI deployment',
    'Project Kuiper broadband satellites begin commercial enterprise beta service',
    'Bank of America reiterates Buy rating on AMZN with $240 price target',
  ],
  BTC: [
    'Bitcoin institutional spot ETF net inflows surpass $35B year-to-date',
    'Global central banks and public corporations add Bitcoin to reserve treasuries',
    'Bitcoin network hash rate hits record 720 EH/s following halving supply shock',
    'SEC approves in-kind options trading for premier spot Bitcoin ETFs',
    'Macro analysts project continuation of 4-year halving cycle toward new highs',
  ],
};
