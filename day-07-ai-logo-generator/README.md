# BrandCrafter.AI

**AI Brand Identity & Logo System** — Generate scalable vector logo concepts, WCAG 2.1 compliant color palettes, Google Font typography pairings, and real-time product mockup previews in seconds.

## Features

- **Vector Logo Generation** — 4 distinct vector logo marks customized to your style preferences (Minimalist, Bold, Playful, Corporate, Tech)
- **Extracted Color Palette** — 5 brand swatches (Primary, Secondary, Accent, Neutral, Background) with HEX/RGB values and contrast scores
- **WCAG Contrast Checker** — Validates text contrast accessibility against WCAG 2.1 AA/AAA standards
- **Typography Pairings** — Curated Google Fonts pairings (Heading + Body) matched to industry & style
- **Real-Time Mockups** — Interactive previews on Business Cards, iOS App Icon, Website Header, and Tote Merchandise
- **1-Click Presets** — Quick demo presets for NovaCare, AetherPay, and BloomBites
- **Brand Kit Export** — SVG vector mark downloads & full JSON brand identity package

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
