# Day 06 — Real-Time Stock Dashboard

| Field | Details |
|---|---|
| **Day** | 06 |
| **Category** | Real-Time Systems / Data Visualization |
| **Difficulty** | Advanced |
| **Estimated Build Time** | 9–12 hours |

---

## 📌 Project Overview

The Real-Time Stock Dashboard is a professional-grade trading terminal built entirely in the browser, featuring live streaming price data via WebSocket, advanced technical analysis charts, and an AI-powered sentiment engine that analyzes the latest news headlines for each tracked stock. This project showcases Abdul Nabi's ability to build high-performance, data-intensive real-time applications — the kind of full-stack complexity that separates senior engineers from the rest.

The dashboard is styled as a dark-mode trading terminal inspired by Bloomberg Terminal and TradingView, with a dense yet readable information architecture. Each stock card displays live bid/ask prices, volume, market cap, day range, and a sparkline mini-chart. The main chart panel shows candlestick price data with overlay technical indicators: RSI (Relative Strength Index), MACD (Moving Average Convergence Divergence), and Bollinger Bands — all computed in real-time on the client from streaming OHLCV data.

A unique differentiator is the AI News Sentiment Engine: for each stock in the user's watchlist, the system fetches the 5 most recent news headlines from NewsAPI and passes them through GPT-4o to produce a sentiment score (-1 to +1), a sentiment label (Bullish / Bearish / Neutral), and a one-sentence rationale. This gives traders a qualitative market signal alongside the quantitative chart data, all in one unified view.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| **Live WebSocket Price Feed** | Streams real-time OHLCV data via Polygon.io WebSocket with sub-second updates |
| **Candlestick Chart** | Full-featured candlestick chart with zoom, pan, and crosshair using lightweight-charts |
| **Technical Indicators** | Overlay RSI, MACD, and Bollinger Bands computed client-side from live data |
| **Portfolio Tracker** | Add holdings with purchase price and quantity; tracks P&L, gain%, and total portfolio value |
| **AI News Sentiment** | Fetches latest headlines per stock and uses GPT-4o to classify Bullish/Bearish/Neutral |
| **Price Alerts** | Set threshold alerts (above/below price); browser notification fires when triggered |
| **Watchlist Management** | Add/remove stocks to a persistent watchlist stored in localStorage |
| **Market Overview Panel** | Shows S&P 500, NASDAQ, and DOW indices status and % change live |
| **Stock Search Autocomplete** | Fuzzy search by ticker or company name with real-time suggestions |
| **Dark Mode Terminal UI** | Bloomberg-inspired dark theme with monospace typography and accent colors |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Charts:** TradingView `lightweight-charts` (candlestick + indicators)
- **WebSocket:** Polygon.io WebSocket API (real-time OHLCV data)
- **Market Data REST:** Polygon.io REST API (historical data, company info)
- **News API:** NewsAPI.org (latest headlines per ticker)
- **AI Sentiment:** OpenAI GPT-4o-mini (fast headline sentiment analysis)
- **Technical Indicators:** `technicalindicators` npm library (RSI, MACD, Bollinger)
- **State Management:** Zustand (watchlist, portfolio, live prices)
- **Notifications:** Browser Notification API (price alerts)
- **Auth:** Clerk (optional for portfolio persistence)
- **Database:** Supabase (portfolio and alert persistence)
- **Deployment:** Vercel (Edge Functions for API proxying)

---

## 🔧 Key Functions

### `connectWebSocket(tickers: string[], onUpdate: (data: OHLCVUpdate) => void): WebSocketConnection`
Establishes a Polygon.io WebSocket connection, authenticates with the API key, and subscribes to real-time aggregate trades (`AM.*`) for the provided ticker list. On each message, parses the OHLCV payload and calls `onUpdate` with a typed `OHLCVUpdate` object. Implements automatic reconnection with exponential backoff on disconnect. Returns a `WebSocketConnection` handle with `subscribe`, `unsubscribe`, and `disconnect` methods.

### `computeTechnicalIndicators(ohlcv: OHLCV[], config: IndicatorConfig): TechnicalIndicators`
Takes a historical OHLCV array and indicator configuration object. Computes RSI (14-period), MACD (12/26/9 EMA), and Bollinger Bands (20-period, 2σ) using the `technicalindicators` library. Returns a `TechnicalIndicators` object with aligned arrays for each indicator keyed by timestamp, ready for direct overlay rendering on the `lightweight-charts` instance.

### `analyzeNewsSentiment(ticker: string, headlines: string[]): Promise<SentimentResult>`
Passes up to 5 recent news headlines for a given ticker to GPT-4o-mini with a structured prompt requesting sentiment classification. Extracts `sentiment` (`"bullish" | "bearish" | "neutral"`), `score` (-1.0 to 1.0), `confidence`, and `rationale` (one sentence) from the JSON response. Results are cached for 15 minutes per ticker to avoid redundant API calls.

### `calculatePortfolioMetrics(holdings: Holding[], livePrices: Record<string, number>): PortfolioMetrics`
Iterates over the user's holdings, fetching the current live price for each ticker from the Zustand price store. Calculates `totalInvested`, `currentValue`, `totalPnL`, `pnlPercent`, `topPerformer`, and `worstPerformer`. Also computes portfolio allocation percentages for the pie chart. Returns a `PortfolioMetrics` object updated on every price tick.

### `triggerPriceAlert(alert: PriceAlert, currentPrice: number): void`
Checks whether `currentPrice` has crossed the alert threshold. If triggered, fires a `Notification` API browser notification with the stock name, price, and direction. Marks the alert as `triggered` in Zustand state to prevent repeat fires. Stores triggered alerts in Supabase for history. Supports both "price above" and "price below" alert types.

---

## 📁 File Structure

```
stock-dashboard/
├── app/
│   ├── page.tsx                    # Main dashboard layout
│   ├── portfolio/page.tsx          # Portfolio detail view
│   └── api/
│       ├── sentiment/route.ts      # GPT-4o sentiment proxy
│       ├── news/route.ts           # NewsAPI proxy
│       └── history/route.ts        # Polygon historical data
├── components/
│   ├── terminal/
│   │   ├── MarketOverview.tsx      # Index summary bar
│   │   ├── WatchlistPanel.tsx      # Left sidebar watchlist
│   │   └── TickerSearch.tsx        # Autocomplete search
│   ├── chart/
│   │   ├── CandlestickChart.tsx    # Main chart component
│   │   ├── IndicatorOverlay.tsx    # RSI / MACD / Bollinger
│   │   └── SparklineCard.tsx       # Mini price sparkline
│   ├── portfolio/
│   │   ├── PortfolioSummary.tsx    # Total P&L card
│   │   ├── HoldingsTable.tsx       # Holdings list with live P&L
│   │   └── AllocationChart.tsx     # Pie chart
│   ├── sentiment/
│   │   ├── SentimentBadge.tsx      # Bullish/Bearish/Neutral tag
│   │   └── NewsHeadlineList.tsx    # Headlines with scores
│   ├── alerts/
│   │   └── PriceAlertManager.tsx   # Alert creation and list
│   └── ui/
├── lib/
│   ├── websocket/polygonWS.ts      # WebSocket connection manager
│   ├── indicators/compute.ts       # Technical indicator calculations
│   ├── zustand/
│   │   ├── priceStore.ts           # Live price state
│   │   ├── portfolioStore.ts
│   │   └── alertStore.ts
│   └── utils/format.ts             # Price/percent formatters
├── types/
│   ├── market.ts
│   └── portfolio.ts
├── .env.local
└── package.json
```

---

## 💡 AI Prompt Used

```
SYSTEM:
You are a professional financial sentiment analyst. Analyze the provided news headlines 
for a given stock ticker and return a structured sentiment assessment. Consider:
- Forward-looking language (bullish signals: "record earnings", "new contract", "FDA approval")
- Risk language (bearish signals: "lawsuit", "guidance cut", "executive departure", "recall")
- Neutral language: routine updates, scheduled events

Return ONLY valid JSON with this schema:
{
  "ticker": string,
  "sentiment": "bullish" | "bearish" | "neutral",
  "score": number,   // -1.0 (very bearish) to +1.0 (very bullish)
  "confidence": number,  // 0.0 to 1.0
  "rationale": string,  // One sentence explaining the sentiment
  "keySignals": string[]  // 2-3 key words/phrases driving the sentiment
}

USER:
Ticker: NVDA
Headlines:
1. "NVIDIA reports record Q4 revenue of $22.1B, beats estimates by 15%"
2. "Jensen Huang signals continued data center demand growth through 2025"
3. "NVIDIA announces new Blackwell GPU architecture for AI workloads"
4. "Competition heats up as AMD launches MI300X challenger"
5. "NVIDIA stock hits all-time high amid AI infrastructure spending boom"
```

---

## 📤 Expected Output (Result)

**Sentiment Analysis (JSON):**
```json
{
  "ticker": "NVDA",
  "sentiment": "bullish",
  "score": 0.87,
  "confidence": 0.94,
  "rationale": "Record revenue beat, CEO growth signals, and new GPU architecture announcements significantly outweigh competitive pressure from AMD.",
  "keySignals": ["record Q4 revenue", "data center demand growth", "Blackwell GPU architecture"]
}
```

**Portfolio Metrics (JSON):**
```json
{
  "totalInvested": 47250.00,
  "currentValue": 53847.32,
  "totalPnL": 6597.32,
  "pnlPercent": 13.96,
  "topPerformer": {"ticker": "NVDA", "pnlPercent": 31.2},
  "worstPerformer": {"ticker": "META", "pnlPercent": -4.7},
  "allocation": [
    {"ticker": "NVDA", "percent": 38.2},
    {"ticker": "AAPL", "percent": 28.1},
    {"ticker": "MSFT", "percent": 21.4},
    {"ticker": "META", "percent": 12.3}
  ]
}
```

**Terminal UI Display:**
```
NVDA  ████  $875.40  +23.18 (+2.72%)  🔺 BULLISH (0.87)  Vol: 48.2M
AAPL  ████  $189.30   -1.42 (-0.74%)  ⚪ NEUTRAL (0.12)  Vol: 52.1M
MSFT  ████  $412.60   +4.30 (+1.05%)  🔺 BULLISH (0.61)  Vol: 21.8M
META  ████  $503.20  -12.40 (-2.40%)  🔻 BEARISH (-0.43) Vol: 18.4M

💼 Portfolio:  $53,847.32  (+$6,597.32 / +13.96%)  [Today: +$892.14]
🔔 Alert Triggered: NVDA crossed $875.00 target ✅
```

---

## 🚀 Stretch Goals

- [ ] Add options chain visualization with Greeks (Delta, Gamma, Theta, Vega)
- [ ] Build a paper trading mode where users can simulate trades with virtual money
- [ ] Implement ML-based price prediction using LSTM on historical data
- [ ] Add earnings calendar integration with historical earnings surprise data
- [ ] Build a backtesting engine for simple moving average crossover strategies
- [ ] Add crypto market support (BTC, ETH, SOL) via Binance WebSocket
- [ ] Create a custom screener with filter criteria (P/E, RSI threshold, volume spike)
