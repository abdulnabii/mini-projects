# 📈 Day 06 — PulseMarket.AI
> **Real-Time Stock Terminal & AI Market Sentiment Engine**

[![Next.js](https://img.shields.io/badge/Next.js-16%2F14-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-2.5%20%2F%201.5-orange?style=flat&logo=google)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Live-brightgreen?style=flat&logo=vercel)](https://day-06-stock-dashboard.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

---

## 🌐 Quick Links

- **Live Production URL**: [day-06-stock-dashboard.vercel.app](https://day-06-stock-dashboard.vercel.app)
- **Monorepo Repository**: [github.com/abdulnabii/mini-projects](https://github.com/abdulnabii/mini-projects)
- **Author**: Abdul Nabi ([@abdulnabii](https://github.com/abdulnabii))
- **Challenge Series**: **Day 06 of 30 Days 30 AI Projects**

---

## 💡 Overview

Institutional-grade financial analytics terminal featuring SVG candlestick charting, technical indicators (RSI, MACD, Bollinger Bands), simulated paper trading portfolio, and AI earnings sentiment analysis.

---

## ✨ Key Features

- **Interactive SVG Candlestick Charts**: Smooth financial time-series rendering with volume histograms and price zoom.
- **Technical Indicator Engine**: Real-time computation of RSI (14), 20/50/200-day Simple Moving Averages, and MACD crossovers.
- **Paper Trading Portfolio**: Simulate buy/sell trades, track unrealized P&L, and manage virtual cash balances with persistent local storage.
- **AI Earnings Sentiment Scanner**: Summarizes breaking news, 10-K filings, and analyst ratings into bullish/bearish confidence scores.
- **Watchlist & Price Alerts**: Set customizable trigger limits for instant browser notifications.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology | Description |
|:---|:---|:---|
| **Framework** | Next.js (App Router + Turbopack) | Modern React Server Components architecture |
| **Language** | TypeScript | Strict type safety and predictable interfaces |
| **AI Intelligence** | Google Gemini API | Natural language understanding, vision analysis & code synthesis |
| **Styling** | Tailwind CSS | High-contrast obsidian dark mode & responsive ergonomics |
| **Deployment** | Vercel | Global edge CDN deployment with automated CI/CD |

**Detailed Stack**: `Next.js 14, SVG Charts, Zustand, Tailwind CSS, Google Gemini API`

---

## 💻 Local Development Setup

Follow these steps to run **PulseMarket.AI** locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abdulnabii/mini-projects.git
   cd mini-projects/day-06-stock-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root of `day-06-stock-dashboard`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Get your free API key from [Google AI Studio](https://aistudio.google.com/))*

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to explore the application.

---

## 🚀 Production Deployment on Vercel

This project is pre-configured for instant zero-configuration deployment on **Vercel**:

1. Push your repository to GitHub.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. Set the **Root Directory** to `day-06-stock-dashboard`.
4. Add the `GEMINI_API_KEY` environment variable in Vercel settings.
5. Click **Deploy**!

---

## 🗺️ 30 Days of AI Navigation

| ⬅️ Previous Project | 🏠 Central Monorepo | ➡️ Next Project |
|:---:|:---:|:---:|
| [🎙️ Day 05: MeetingMind.AI](../day-05-ai-meeting-summarizer) | [📂 View All 30 Projects](https://github.com/abdulnabii/mini-projects#readme) | [🎨 Day 07: BrandForge.AI](../day-07-ai-logo-generator) |

---

## 👤 Author & Acknowledgements

- **Developer**: Abdul Nabi
- **GitHub**: [@abdulnabii](https://github.com/abdulnabii)
- **Monorepo**: [30 Days 30 AI Projects](https://github.com/abdulnabii/mini-projects)

*Built with passion as part of the 30 Days 30 AI Projects challenge.*
