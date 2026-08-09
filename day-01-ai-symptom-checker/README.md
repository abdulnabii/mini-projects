# 🩺 Day 01 — AI Symptom Checker & Triage Assistant

A conversational AI medical triage assistant built with **Next.js 14**, **Tailwind CSS**, **Framer Motion**, and **Google Gemini API**. It provides initial WHO 4-level risk assessment (Low, Medium, High, Emergency), patient intake profile handling, printable PDF/TXT health reports, and local session history.

🌐 **Live Production URL**: [symptom-checker.aiwithab.site](https://symptom-checker.aiwithab.site)  
🐙 **Monorepo Directory**: `day-01-ai-symptom-checker/`

---

## ✨ Features

- **WHO 4-Level Risk Classifier**: Instant risk categorization (🟢 Low Risk, 🟡 Moderate, 🟠 High, 🔴 Emergency / Call 911).
- **Patient Profile Intake**: Intake form collecting age, gender, pre-existing conditions, allergies, and symptom timeline.
- **Health Report Exporter**: Downloadable PDF & TXT clinical summary reports.
- **Healthcare Slate Design System**: Clean medical slate UI with dark mode ergonomics.
- **Local Storage History**: Save and inspect past medical triage sessions.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, Lucide React icons
- **AI Model**: Google Gemini API (`@google/generative-ai`)
- **Deployment**: Vercel & custom subdomain `symptom-checker.aiwithab.site`

---

## 💻 Local Setup

1. Navigate to directory:
   ```bash
   cd day-01-ai-symptom-checker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variable in `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Run development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.
