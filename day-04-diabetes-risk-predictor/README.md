# 🩺 Day 04 — Diabetes Risk Predictor & SHAP Analyzer (DiabetesRisk.AI)

A clinical-grade machine learning risk assessment application and SHAP feature importance explainer built with **Next.js 14**, **Tailwind CSS**, **Framer Motion**, and **Google Gemini API**. Features a **Clinical Teal-Emerald & Diagnostic Theme**, 8 clinical vitals input form, real-time risk gauge (0–100%), SHAP factor contribution analysis, personalized AI lifestyle recommendations, mandatory clinical disclaimer, and 1-click PDF health report export.

🌐 **Production Vercel URL**: [diabetes-risk-predictor.vercel.app](https://diabetes-risk-predictor.vercel.app)  
🐙 **Monorepo Directory**: `day-04-diabetes-risk-predictor/`

---

## ✨ Features

- **Clinical Teal-Emerald Theme**: High-contrast diagnostic panel UI with medical risk indicators.
- **8 Vitals Clinical Form**: Fasting Glucose, BMI, Age, Diastolic BP, Serum Insulin, Skin Fold Thickness, Pregnancies, and Diabetes Pedigree Function.
- **Ensemble ML Risk Classifier**: Computes Diabetes Risk Probability (0.0 to 1.0) and classification (🟢 Low Risk, 🟡 Moderate Risk, 🔴 High Risk).
- **SHAP Feature Importance Analysis**: Animated horizontal bar chart ranking each vital's signed contribution weight to the patient's risk score.
- **Personalized AI Lifestyle Recommendations**: Actionable diet, physical activity, weight management, and medical follow-up advice cards.
- **Clinical Vital Status Badges**: Normal, Elevated, and Critical benchmarks displayed next to input fields.
- **1-Click PDF Report Export**: Printable health summary + local risk history tracking.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **ML Engine**: Scikit-Learn Random Forest & XGBoost Ensemble Logic (UCI Pima Dataset, 94% Accuracy)
- **Styling**: Tailwind CSS, Framer Motion, Lucide React icons
- **AI Model**: Google Gemini API (`@google/generative-ai`)
- **Deployment**: Vercel Production

---

## 💻 Local Setup

1. Navigate to directory:
   ```bash
   cd day-04-diabetes-risk-predictor
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
