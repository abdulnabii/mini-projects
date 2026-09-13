# 🚨 Day 29 — OpsPulse.AI
> **AI DevOps Incident Response & SRE Triage Assistant**

[![Next.js](https://img.shields.io/badge/Next.js-16%2F14-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-2.5%20%2F%201.5-orange?style=flat&logo=google)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Live-brightgreen?style=flat&logo=vercel)](https://day-29-devops-incident-assistant.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

---

## 🌐 Quick Links

- **Live Production URL**: [day-29-devops-incident-assistant.vercel.app](https://day-29-devops-incident-assistant.vercel.app)
- **Monorepo Repository**: [github.com/abdulnabii/mini-projects](https://github.com/abdulnabii/mini-projects)
- **Author**: Abdul Nabi ([@abdulnabii](https://github.com/abdulnabii))
- **Challenge Series**: **Day 29 of 30 Days 30 AI Projects**

---

## 🎥 Live Demo Preview

![OpsPulse.AI Demo](opspulse_ai_demo.gif)

## 💡 Overview

Enterprise Site Reliability Engineering (SRE) war room platform diagnosing production outages, analyzing Kubernetes pod telemetry, calculating revenue burn, and executing automated runbooks.

---

## ✨ Key Features

- **Real-Time Incident War Room**: Live P1/P2/P3 severity classification with automated incident commander assignment.
- **SLO Error Budget Burn Rate**: Real-time gauge calculating SLA impact, remaining error budget, and estimated time to exhaustion.
- **Interactive Service Mesh Topology**: Visual dependency map highlighting degraded services, latency spikes, and 5xx errors.
- **Automated CLI Runbook Execution**: Terminal runner providing one-click rollbacks, pod restarts, and database connection pool flushes.
- **AI Post-Mortem Generator**: Generates blameless post-mortem documentation complete with timeline, root cause, and preventative action items.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology | Description |
|:---|:---|:---|
| **Framework** | Next.js (App Router + Turbopack) | Modern React Server Components architecture |
| **Language** | TypeScript | Strict type safety and predictable interfaces |
| **AI Intelligence** | Google Gemini API | Natural language understanding, vision analysis & code synthesis |
| **Styling** | Tailwind CSS | High-contrast obsidian dark mode & responsive ergonomics |
| **Deployment** | Vercel | Global edge CDN deployment with automated CI/CD |

**Detailed Stack**: `Next.js 16, TypeScript, SVG Telemetry Curves, Tailwind CSS, Gemini API`

---

## 💻 Local Development Setup

Follow these steps to run **OpsPulse.AI** locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abdulnabii/mini-projects.git
   cd mini-projects/day-29-devops-incident-assistant
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root of `day-29-devops-incident-assistant`:
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
3. Set the **Root Directory** to `day-29-devops-incident-assistant`.
4. Add the `GEMINI_API_KEY` environment variable in Vercel settings.
5. Click **Deploy**!

---

## 🗺️ 30 Days of AI Navigation

| ⬅️ Previous Project | 🏠 Central Monorepo | ➡️ Next Project |
|:---:|:---:|:---:|
| [🌐 Day 28: OmniData.3D](../day-28-3d-data-visualization) | [📂 View All 30 Projects](https://github.com/abdulnabii/mini-projects#readme) | [🏆 Day 30: SaaSForge.AI](../day-30-ai-saas-boilerplate) |

---

## 👤 Author & Acknowledgements

- **Developer**: Abdul Nabi
- **GitHub**: [@abdulnabii](https://github.com/abdulnabii)
- **Monorepo**: [30 Days 30 AI Projects](https://github.com/abdulnabii/mini-projects)

*Built with passion as part of the 30 Days 30 AI Projects challenge.*
