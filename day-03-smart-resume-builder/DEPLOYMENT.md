# 🚀 Day 03 — Smart Resume Builder Vercel Deployment Guide

Follow this guide to commit Day 03 to the monorepo and deploy to Vercel production.

---

## 1. 🐙 Commit and Push to GitHub Monorepo

```bash
cd "c:\Users\nabi4\OneDrive\Desktop\New folder\30-days-30-projects"

git add .
git commit -m "feat: Day 03 - Smart Resume Builder & ATS Optimizer"
git push origin main
```

---

## 2. 🌐 Deploy to Vercel via CLI

```bash
cd "c:\Users\nabi4\OneDrive\Desktop\New folder\30-days-30-projects\day-03-smart-resume-builder"

# Deploy to Vercel Production using API token
npx vercel --token <VERCEL_TOKEN> --prod --yes
```

Production URL: `https://day-03-smart-resume-builder.vercel.app`
