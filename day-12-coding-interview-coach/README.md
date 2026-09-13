# 🧑‍💻 Day 12 — AlgoCoach.AI
> **AI Coding Interview Simulator & Technical Assessor**

[![Next.js](https://img.shields.io/badge/Next.js-16%2F14-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-2.5%20%2F%201.5-orange?style=flat&logo=google)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Live-brightgreen?style=flat&logo=vercel)](https://day-12-coding-interview-coach.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

---

## 🌐 Quick Links

- **Live Production URL**: [day-12-coding-interview-coach.vercel.app](https://day-12-coding-interview-coach.vercel.app)
- **Monorepo Repository**: [github.com/abdulnabii/mini-projects](https://github.com/abdulnabii/mini-projects)
- **Author**: Abdul Nabi ([@abdulnabii](https://github.com/abdulnabii))
- **Challenge Series**: **Day 12 of 30 Days 30 AI Projects**

---

## 💡 Overview

Interactive technical interview simulator evaluating algorithmic problem solving, Big-O time/space complexity, edge-case coverage, and code design in real-time.

---

## ✨ Key Features

- **Realistic Mock Interview Dialogue**: Simulates a senior FAANG technical interviewer who guides with hints without giving away solutions.
- **Big-O Runtime Profiler**: Analyzes submitted code AST to calculate theoretical Big-O time and space complexity.
- **Edge-Case Stress Tester**: Evaluates empty arrays, integer overflows, cyclical graphs, and extreme constraints.
- **Multi-Tier Scoring Matrix**: Scores candidates on Correctness, Code Quality, Time Efficiency, and Communication.
- **Curated Problem Catalog**: Built-in challenges ranging from LeetCode Medium/Hard graphs, dynamic programming, and two pointers.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology | Description |
|:---|:---|:---|
| **Framework** | Next.js (App Router + Turbopack) | Modern React Server Components architecture |
| **Language** | TypeScript | Strict type safety and predictable interfaces |
| **AI Intelligence** | Google Gemini API | Natural language understanding, vision analysis & code synthesis |
| **Styling** | Tailwind CSS | High-contrast obsidian dark mode & responsive ergonomics |
| **Deployment** | Vercel | Global edge CDN deployment with automated CI/CD |

**Detailed Stack**: `Next.js 16, Monaco Editor, TypeScript, Tailwind CSS, Google Gemini API`

---

## 💻 Local Development Setup

Follow these steps to run **AlgoCoach.AI** locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abdulnabii/mini-projects.git
   cd mini-projects/day-12-coding-interview-coach
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root of `day-12-coding-interview-coach`:
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
3. Set the **Root Directory** to `day-12-coding-interview-coach`.
4. Add the `GEMINI_API_KEY` environment variable in Vercel settings.
5. Click **Deploy**!

---

## 🗺️ 30 Days of AI Navigation

| ⬅️ Previous Project | 🏠 Central Monorepo | ➡️ Next Project |
|:---:|:---:|:---:|
| [🩻 Day 11: RadVision.AI](../day-11-medical-image-classifier) | [📂 View All 30 Projects](https://github.com/abdulnabii/mini-projects#readme) | [🔥 Day 13: WealthPulse.AI](../day-13-personal-finance-ai) |

---

## 👤 Author & Acknowledgements

- **Developer**: Abdul Nabi
- **GitHub**: [@abdulnabii](https://github.com/abdulnabii)
- **Monorepo**: [30 Days 30 AI Projects](https://github.com/abdulnabii/mini-projects)

*Built with passion as part of the 30 Days 30 AI Projects challenge.*
