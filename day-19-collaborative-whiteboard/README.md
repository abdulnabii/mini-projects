# 🎨 Day 19 — ScribbleAI
> **Collaborative AI Whiteboard & Diagram Synthesis Engine**

[![Next.js](https://img.shields.io/badge/Next.js-16%2F14-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-2.5%20%2F%201.5-orange?style=flat&logo=google)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Live-brightgreen?style=flat&logo=vercel)](https://day-19-collaborative-whiteboard.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

---

## 🌐 Quick Links

- **Live Production URL**: [day-19-collaborative-whiteboard.vercel.app](https://day-19-collaborative-whiteboard.vercel.app)
- **Monorepo Repository**: [github.com/abdulnabii/mini-projects](https://github.com/abdulnabii/mini-projects)
- **Author**: Abdul Nabi ([@abdulnabii](https://github.com/abdulnabii))
- **Challenge Series**: **Day 19 of 30 Days 30 AI Projects**

---

## 🎥 Live Demo Preview

![ScribbleAI Demo](public/canvasflow_demo.gif)

## 💡 Overview

Infinite vector canvas supporting freehand drawing, geometric shape snapping, sticky notes, and AI-driven sketch-to-diagram conversion.

---

## ✨ Key Features

- **Infinite Pan & Zoom Canvas**: Smooth 60 FPS viewport with unlimited 2D space for creative brainstorming.
- **Smart Geometric Shape Snapping**: Automatically cleans rough freehand circles, rectangles, and arrows into sharp vector geometries.
- **Coloured Sticky Notes & Text**: Organize thoughts with draggable, color-coded virtual sticky cards.
- **AI Sketch-to-Diagram Synthesizer**: Translates hand-drawn boxes and wireframes into clean software architecture diagrams.
- **High-Resolution PNG / SVG Export**: Export your completed whiteboard directly to high-res image formats.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology | Description |
|:---|:---|:---|
| **Framework** | Next.js (App Router + Turbopack) | Modern React Server Components architecture |
| **Language** | TypeScript | Strict type safety and predictable interfaces |
| **AI Intelligence** | Google Gemini API | Natural language understanding, vision analysis & code synthesis |
| **Styling** | Tailwind CSS | High-contrast obsidian dark mode & responsive ergonomics |
| **Deployment** | Vercel | Global edge CDN deployment with automated CI/CD |

**Detailed Stack**: `Next.js 16, HTML5 Infinite Canvas, TypeScript, Tailwind CSS, Gemini API`

---

## 💻 Local Development Setup

Follow these steps to run **ScribbleAI** locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abdulnabii/mini-projects.git
   cd mini-projects/day-19-collaborative-whiteboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root of `day-19-collaborative-whiteboard`:
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
3. Set the **Root Directory** to `day-19-collaborative-whiteboard`.
4. Add the `GEMINI_API_KEY` environment variable in Vercel settings.
5. Click **Deploy**!

---

## 🗺️ 30 Days of AI Navigation

| ⬅️ Previous Project | 🏠 Central Monorepo | ➡️ Next Project |
|:---:|:---:|:---:|
| [🧘 Day 18: MindReflect.AI](../day-18-mental-health-journal) | [📂 View All 30 Projects](https://github.com/abdulnabii/mini-projects#readme) | [🥗 Day 20: MacroBite.AI](../day-20-ai-nutrition-planner) |

---

## 👤 Author & Acknowledgements

- **Developer**: Abdul Nabi
- **GitHub**: [@abdulnabii](https://github.com/abdulnabii)
- **Monorepo**: [30 Days 30 AI Projects](https://github.com/abdulnabii/mini-projects)

*Built with passion as part of the 30 Days 30 AI Projects challenge.*
