# 🚀 Day 01 — AI Symptom Checker Vercel Deployment Guide

Follow this guide to commit Day 01 to the monorepo and deploy to Vercel production.

---

## 1. 🐙 Commit and Push to GitHub Monorepo

```bash
cd "c:\Users\nabi4\OneDrive\Desktop\New folder\30-days-30-projects"

git add .
git commit -m "feat: Day 01 - AI Symptom Checker & Triage Assistant"
git push origin main
```

---

## 2. 🌐 Deploy to Vercel via CLI

```bash
cd "c:\Users\nabi4\OneDrive\Desktop\New folder\30-days-30-projects\day-01-ai-symptom-checker"

# Deploy to Vercel Production using API token
npx vercel --token <VERCEL_TOKEN> --prod --yes
```

Production URL: `https://day-01-ai-symptom-checker.vercel.app`
