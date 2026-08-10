# StockPulse.AI

**AI-Powered Market Intelligence Terminal** — A professional-grade stock market dashboard with simulated live prices, interactive candlestick charts, AI sentiment analysis via Gemini, portfolio tracking, and price alerts.

## Features

- **Simulated Live Prices** — Realistic price simulation for AAPL, NVDA, MSFT, GOOGL, META, TSLA, AMZN updating every 2 seconds
- **Interactive Charts** — SVG price chart with area fill and live tick history
- **AI Sentiment Engine** — Gemini 1.5 Flash analyzes news headlines for Bullish/Bearish/Neutral signals
- **Market Overview** — Live S&P 500, NASDAQ, DOW index tracker
- **Portfolio Tracker** — Add holdings, track P&L, top/worst performers
- **Price Alerts** — Set threshold alerts with visual trigger indicators
- **Bloomberg Terminal UI** — Dark theme with financial green accent colors

## Tech Stack

- **Framework**: Next.js 14 + TypeScript + Tailwind CSS
- **AI**: Google Gemini 1.5 Flash (`@google/generative-ai`)
- **UI**: Lucide React, Framer Motion, custom SVG charts
- **Storage**: localStorage for portfolio and alerts

## Getting Started

```bash
npm install
cp .env.example .env.local
# Add your GEMINI_API_KEY
npm run dev
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel deployment instructions.

> **Disclaimer**: Prices are simulated for demonstration purposes only. Not for trading decisions.

---

Built by [Abdul Nabi](https://github.com/abdulnabii)
