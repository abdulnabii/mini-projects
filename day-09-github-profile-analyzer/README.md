# GitPulse.AI

**AI GitHub Developer Portfolio & Impact Analyzer** — Transform any public GitHub username into a visual developer portfolio analysis: repository impact scores, language DNA radar, 52-week contribution heatmap, and AI developer persona synthesis.

## Features

- **Impact Score Rankings** — Repositories ranked by composite impact score (stars, forks, open issues, readme documentation, and growth momentum)
- **Language DNA Radar** — Top language breakdown weighted by code volume with percentage pills
- **52-Week Contribution Grid** — GitHub-style contribution calendar with daily intensity levels and commit streak tracking
- **AI Developer Persona** — Gemini 1.5 Flash generates a 3-paragraph developer persona, traits, fun coding habit fact, and core technical strengths
- **Shareable Developer Card** — Downloadable developer summary card for Twitter/LinkedIn sharing
- **1-Click Preset Profiles** — Quick demo presets for `abdulnabii`, `torvalds`, and `gaearon`

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
