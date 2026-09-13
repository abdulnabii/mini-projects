# 🌍 Day 14 — LingoPulse.AI
> **AI Language Flashcards & SM-2 Spaced Repetition Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16%2F14-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-2.5%20%2F%201.5-orange?style=flat&logo=google)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Live-brightgreen?style=flat&logo=vercel)](https://day-14-language-flashcard-ai.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

---

## 🌐 Quick Links

- **Live Production URL**: [day-14-language-flashcard-ai.vercel.app](https://day-14-language-flashcard-ai.vercel.app)
- **Monorepo Repository**: [github.com/abdulnabii/mini-projects](https://github.com/abdulnabii/mini-projects)
- **Author**: Abdul Nabi ([@abdulnabii](https://github.com/abdulnabii))
- **Challenge Series**: **Day 14 of 30 Days 30 AI Projects**

---

## 🎥 Live Demo Preview

![LingoPulse.AI Demo](public/lingopulse_demo.gif)

## 💡 Overview

Multi-sensory language acquisition engine combining the SuperMemo-2 (SM-2) algorithm, 3D interactive flashcards, AI deck generation across 5 languages (with RTL Arabic/Urdu support), and live speech pronunciation scoring.

---

## ✨ Key Features

- **Scientific SM-2 Spaced Repetition**: Dynamic interval scheduling (Ease Factor, Repetitions, Interval) preventing memory decay.
- **3D Interactive Flip Cards**: Smooth CSS 3D card flipping with keyboard navigation (Space, 1-5 recall ratings).
- **Multi-Language AI Deck Generator**: Create rich vocabulary decks with translations, IPA phonetic transcriptions, and context sentences.
- **Full RTL Support**: Native bidirectional rendering for Arabic and Urdu with bespoke typography.
- **Speech Recognition & Audio Pronunciation**: Native browser Web Speech API for automated audio playback and pronunciation evaluation.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology | Description |
|:---|:---|:---|
| **Framework** | Next.js (App Router + Turbopack) | Modern React Server Components architecture |
| **Language** | TypeScript | Strict type safety and predictable interfaces |
| **AI Intelligence** | Google Gemini API | Natural language understanding, vision analysis & code synthesis |
| **Styling** | Tailwind CSS | High-contrast obsidian dark mode & responsive ergonomics |
| **Deployment** | Vercel | Global edge CDN deployment with automated CI/CD |

**Detailed Stack**: `Next.js 16, Web Speech API, SM-2 Algorithm, Tailwind CSS, Gemini API`

---

## 💻 Local Development Setup

Follow these steps to run **LingoPulse.AI** locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abdulnabii/mini-projects.git
   cd mini-projects/day-14-language-flashcard-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root of `day-14-language-flashcard-ai`:
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
3. Set the **Root Directory** to `day-14-language-flashcard-ai`.
4. Add the `GEMINI_API_KEY` environment variable in Vercel settings.
5. Click **Deploy**!

---

## 🗺️ 30 Days of AI Navigation

| ⬅️ Previous Project | 🏠 Central Monorepo | ➡️ Next Project |
|:---:|:---:|:---:|
| [🔥 Day 13: WealthPulse.AI](../day-13-personal-finance-ai) | [📂 View All 30 Projects](https://github.com/abdulnabii/mini-projects#readme) | [🎯 Day 15: RankCraft.AI](../day-15-ai-blog-seo-optimizer) |

---

## 👤 Author & Acknowledgements

- **Developer**: Abdul Nabi
- **GitHub**: [@abdulnabii](https://github.com/abdulnabii)
- **Monorepo**: [30 Days 30 AI Projects](https://github.com/abdulnabii/mini-projects)

*Built with passion as part of the 30 Days 30 AI Projects challenge.*
