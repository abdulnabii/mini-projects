# 🤖 Day 02 — Real-Time Code Review Bot (CodeReview.AI)

A real-time static code review bot and security vulnerability scanner built with **Next.js 14**, **Monaco Editor**, **Tailwind CSS**, and **Google Gemini API**. Features a **Cyberpunk Developer IDE Theme**, AST quality score index (0–100), categorized issue breakdown, side-by-side code diff, and 1-click GitHub PR Markdown export.

🌐 **Production Vercel URL**: [day-02-code-review-bot.vercel.app](https://day-02-code-review-bot.vercel.app)  
🐙 **Monorepo Directory**: `day-02-code-review-bot/`

---

## ✨ Features

- **Cyberpunk Developer IDE Theme**: Deep obsidian black, matrix emerald green, and security violet UI.
- **13+ Language Support**: Automatic heuristic language detection & sample vulnerability presets (SQL Injection Python, React memory leak, C++ buffer overflow).
- **0–100 AST Quality Score Gauge**: Animated circular quality index ring.
- **Categorized Issue Badges**: 🔴 Critical, 🟠 Major, 🟡 Minor, 🟢 Info feedback with line numbers and 1-click copyable fixes.
- **Side-by-Side Code Diff**: Interactive split view comparing original code vs AI clean refactored code.
- **GitHub PR Markdown Exporter**: 1-click button to copy formatted PR review comments.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Editor**: Line-numbered developer editor with language auto-detector
- **Styling**: Tailwind CSS, Framer Motion, Lucide React icons
- **AI Model**: Google Gemini API (`@google/generative-ai`)
- **Deployment**: Vercel Production

---

## 💻 Local Setup

1. Navigate to directory:
   ```bash
   cd day-02-code-review-bot
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variable in `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Run dev server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in browser.
