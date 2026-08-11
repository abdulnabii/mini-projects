# ExpenseMind.AI

**AI-Powered Expense Tracker & Financial Advisory** — Automate expense tracking with simulated receipt OCR image processing, automatic 12-category classification, category budget tracking, and Gemini AI conversational financial coaching.

## Features

- **Receipt OCR Scanner** — Upload receipt photos or test 1-click sample receipts (Starbucks, Uber, Apple Store, Whole Foods) to extract merchant, total, and line items
- **Auto-Categorization** — Automatically classifies expenses across 12 financial categories
- **Category Spending Breakdown** — Interactive donut progress chart showing percentage allocation of outlays
- **Budget Allocation Targets** — Category cap limits with status alerts (On Track, Warning >80%, Over Budget)
- **Gemini AI Spending Coach** — Evaluates 90-day spending patterns and delivers personalized, judgment-free financial advice with projected monthly savings
- **Transaction Ledger & CSV Export** — Filterable expense table with category search, quick manual entry, and CSV download

## Tech Stack

- **Framework**: Next.js 14 + TypeScript + Tailwind CSS
- **AI Engine**: Google Gemini 1.5 Flash (`@google/generative-ai`)
- **Icons & UI**: Lucide React, Framer Motion
- **Storage**: LocalStorage persistence

## Getting Started

```bash
npm install
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local
npm run dev
```

---

Built by [Abdul Nabi](https://github.com/abdulnabii)
