# EmailPulse.AI

**AI Writing Assistant & Subject Line Optimizer** — Convert bullet-point intent into 3 A/B email variants and 5 subject line candidates with predicted open rate analytics.

## Features

- **Bullet-to-Email Conversion** — Input 3–5 core message bullets to generate complete, send-ready email copy
- **A/B Variant Generator** — Generates 3 stylistically distinct drafts per request (*Variant A Bold, Variant B Balanced, Variant C Formal*)
- **Subject Line Open Rate Predictor** — 5 candidate subject lines with open rate prediction scores (0–100%) & strategy labels
- **1-Click Clipboard & Gmail Deep Link** — Copy full email or launch pre-populated Gmail compose window directly
- **Saved History Manager** — Persistence for past generated email drafts

## Tech Stack

- **Framework**: Next.js 14 + TypeScript + Tailwind CSS
- **AI Engine**: Google Gemini 1.5 Flash (`@google/generative-ai`)
- **Icons & UI**: Lucide React, Framer Motion
- **Deployment**: Vercel

## Getting Started

```bash
npm install
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local
npm run dev
```

---

Built by [Abdul Nabi](https://github.com/abdulnabii)
