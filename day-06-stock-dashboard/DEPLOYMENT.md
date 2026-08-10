# Deployment Guide — StockPulse.AI

## Prerequisites

- Node.js 18+
- Vercel account
- Google Gemini API key (from [Google AI Studio](https://aistudio.google.com))

## Environment Variables

Set these in your Vercel project settings:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key for sentiment analysis |

## Deploy to Vercel

```bash
cd day-06-stock-dashboard
npx vercel --prod
```

### Live URL
```
https://stock-pulse-ai.vercel.app
```

## Local Development

```bash
npm install
cp .env.example .env.local
# Add GEMINI_API_KEY to .env.local
npm run dev
# Open http://localhost:3000
```

## Notes

- Prices are simulated — no live market data API required
- AI sentiment works without API key (falls back to heuristic analysis)
- Portfolio and alerts persist in localStorage
