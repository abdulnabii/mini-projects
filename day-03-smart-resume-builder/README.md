# 📄 Day 03 — Smart Resume Builder & ATS Optimizer (SmartResume.AI)

An executive resume builder and real-time ATS match optimizer built with **Next.js 14**, **Tailwind CSS**, **Framer Motion**, and **Google Gemini API**. Features a **Deep Indigo & Champagne Gold Executive Theme**, real-time A4 live document canvas, 3 switchable templates, AI STAR-bullet point rewriter, and 1-click PDF download.

🌐 **Live Production URL**: [resume-builder.aiwithab.site](https://resume-builder.aiwithab.site)  
🐙 **Monorepo Directory**: `day-03-smart-resume-builder/`

---

## ✨ Features

- **Executive HR Tech Theme**: Deep Indigo & Gold Canvas design system.
- **3 Professional Templates**: Modern Accent (colored header), Minimalist Clean (typography), and Tech Monospace (developer matrix).
- **Real-Time A4 Live Document Canvas**: Split-screen live preview that updates instantly as you edit form fields.
- **AI STAR-Method Bullet Optimizer**: Rewrites raw bullets into high-impact action-verb statements with quantified metrics (%, $, scale).
- **Real-Time ATS Keyword Match Engine**: Computes 0–100% compatibility match score, letter grade (A/B/C/D/F), matched keywords, and missing high-value terms against target job descriptions.
- **1-Click PDF Export & Saved History**: Native print CSS rules for clean PDF output + local draft version control.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, Lucide React icons
- **AI Model**: Google Gemini API (`@google/generative-ai`)
- **Deployment**: Vercel & custom subdomain `resume-builder.aiwithab.site`

---

## 💻 Local Setup

1. Navigate to directory:
   ```bash
   cd day-03-smart-resume-builder
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
