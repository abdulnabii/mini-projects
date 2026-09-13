# 🩸 Day 04 — GlucoPredict.AI
> **Diabetes Risk Predictor & Machine Learning SHAP Analyzer**

[![Next.js](https://img.shields.io/badge/Next.js-16%2F14-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-2.5%20%2F%201.5-orange?style=flat&logo=google)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Live-brightgreen?style=flat&logo=vercel)](https://diabetes-risk-predictor.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

---

## 🌐 Quick Links

- **Live Production URL**: [diabetes-risk-predictor.vercel.app](https://diabetes-risk-predictor.vercel.app)
- **Monorepo Repository**: [github.com/abdulnabii/mini-projects](https://github.com/abdulnabii/mini-projects)
- **Author**: Abdul Nabi ([@abdulnabii](https://github.com/abdulnabii))
- **Challenge Series**: **Day 04 of 30 Days 30 AI Projects**

---

## 💡 Overview

Clinical metabolic health assessment platform powered by ensemble classification models with SHAP (SHapley Additive exPlanations) feature explainability and personalized preventative lifestyle protocols.

---

## ✨ Key Features

- **Evidence-Based Risk Stratification**: Computes statistical probability of Type 2 Diabetes based on clinical metabolic markers.
- **Transparent SHAP Feature Explainability**: Visual waterfall breakdown showing exact positive and negative contributors (HbA1c, BMI, Glucose, Blood Pressure).
- **Preventative Lifestyle Action Plans**: AI-tailored dietary, exercise, and screening recommendations.
- **Clinical Benchmark Visualizer**: Interactive parameter sliders with immediate re-computation of risk thresholds.
- **Doctor-Ready Assessment PDF**: Downloadable summary formatted for endocrinology and primary care visits.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology | Description |
|:---|:---|:---|
| **Framework** | Next.js (App Router + Turbopack) | Modern React Server Components architecture |
| **Language** | TypeScript | Strict type safety and predictable interfaces |
| **AI Intelligence** | Google Gemini API | Natural language understanding, vision analysis & code synthesis |
| **Styling** | Tailwind CSS | High-contrast obsidian dark mode & responsive ergonomics |
| **Deployment** | Vercel | Global edge CDN deployment with automated CI/CD |

**Detailed Stack**: `Next.js 14, Scikit-Learn Classification, SHAP Explainability, Tailwind CSS, Gemini API`

---

## 💻 Local Development Setup

Follow these steps to run **GlucoPredict.AI** locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abdulnabii/mini-projects.git
   cd mini-projects/day-04-diabetes-risk-predictor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root of `day-04-diabetes-risk-predictor`:
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
3. Set the **Root Directory** to `day-04-diabetes-risk-predictor`.
4. Add the `GEMINI_API_KEY` environment variable in Vercel settings.
5. Click **Deploy**!

---

## 🗺️ 30 Days of AI Navigation

| ⬅️ Previous Project | 🏠 Central Monorepo | ➡️ Next Project |
|:---:|:---:|:---:|
| [📄 Day 03: ResumeCraft.AI](../day-03-smart-resume-builder) | [📂 View All 30 Projects](https://github.com/abdulnabii/mini-projects#readme) | [🎙️ Day 05: MeetingMind.AI](../day-05-ai-meeting-summarizer) |

---

## 👤 Author & Acknowledgements

- **Developer**: Abdul Nabi
- **GitHub**: [@abdulnabii](https://github.com/abdulnabii)
- **Monorepo**: [30 Days 30 AI Projects](https://github.com/abdulnabii/mini-projects)

*Built with passion as part of the 30 Days 30 AI Projects challenge.*
