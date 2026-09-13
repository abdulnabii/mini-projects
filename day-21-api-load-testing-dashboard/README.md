# ⚡ Day 21 — LoadPulse.AI
> **Distributed API Load Testing & Latency Benchmarking Dashboard**

[![Next.js](https://img.shields.io/badge/Next.js-16%2F14-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-2.5%20%2F%201.5-orange?style=flat&logo=google)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Live-brightgreen?style=flat&logo=vercel)](https://day-21-api-load-testing-dashboard.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

---

## 🌐 Quick Links

- **Live Production URL**: [day-21-api-load-testing-dashboard.vercel.app](https://day-21-api-load-testing-dashboard.vercel.app)
- **Monorepo Repository**: [github.com/abdulnabii/mini-projects](https://github.com/abdulnabii/mini-projects)
- **Author**: Abdul Nabi ([@abdulnabii](https://github.com/abdulnabii))
- **Challenge Series**: **Day 21 of 30 Days 30 AI Projects**

---

## 🎥 Live Demo Preview

![LoadPulse.AI Demo](public/loadpulse_demo.gif)

## 💡 Overview

High-throughput API performance tester simulating concurrent virtual users, p50/p95/p99 latency percentiles, error rate spikes, and AI bottleneck diagnoses.

---

## ✨ Key Features

- **Multi-Threaded Web Worker Virtual Users**: Spawns parallel browser worker threads generating real HTTP load without blocking the main UI thread.
- **Latency Percentile Telemetry**: Precise live tracking of p50, p90, p95, and p99 latency percentiles with milliseconds accuracy.
- **Real-Time Requests Per Second (RPS) Meter**: Live throughput visualization with dynamic error-rate tracking.
- **AI Performance Diagnosis**: Analyzes response headers and latency curves to surface database connection bottlenecks and caching deficiencies.
- **Downloadable Performance Audit**: Export test results in JSON and CSV for engineering team retrospectives.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology | Description |
|:---|:---|:---|
| **Framework** | Next.js (App Router + Turbopack) | Modern React Server Components architecture |
| **Language** | TypeScript | Strict type safety and predictable interfaces |
| **AI Intelligence** | Google Gemini API | Natural language understanding, vision analysis & code synthesis |
| **Styling** | Tailwind CSS | High-contrast obsidian dark mode & responsive ergonomics |
| **Deployment** | Vercel | Global edge CDN deployment with automated CI/CD |

**Detailed Stack**: `Next.js 16, Web Workers Multi-Threading, Chart.js, Tailwind CSS, Gemini API`

---

## 💻 Local Development Setup

Follow these steps to run **LoadPulse.AI** locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abdulnabii/mini-projects.git
   cd mini-projects/day-21-api-load-testing-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root of `day-21-api-load-testing-dashboard`:
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
3. Set the **Root Directory** to `day-21-api-load-testing-dashboard`.
4. Add the `GEMINI_API_KEY` environment variable in Vercel settings.
5. Click **Deploy**!

---

## 🗺️ 30 Days of AI Navigation

| ⬅️ Previous Project | 🏠 Central Monorepo | ➡️ Next Project |
|:---:|:---:|:---:|
| [🥗 Day 20: MacroBite.AI](../day-20-ai-nutrition-planner) | [📂 View All 30 Projects](https://github.com/abdulnabii/mini-projects#readme) | [⚖️ Day 22: LexiGuard.AI](../day-22-legal-document-analyzer) |

---

## 👤 Author & Acknowledgements

- **Developer**: Abdul Nabi
- **GitHub**: [@abdulnabii](https://github.com/abdulnabii)
- **Monorepo**: [30 Days 30 AI Projects](https://github.com/abdulnabii/mini-projects)

*Built with passion as part of the 30 Days 30 AI Projects challenge.*
