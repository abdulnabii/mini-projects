# 🚀 Day 01 — Deployment & Domain Setup Guide

Follow this guide to push your project to GitHub, deploy to Vercel, and attach the custom sub-domain `symptom-checker.aiwithab.site`.

---

## 1. 🐙 Push Code to GitHub

Open PowerShell or Command Prompt inside the `day-01-ai-symptom-checker` folder:

```bash
cd "c:\Users\nabi4\OneDrive\Desktop\New folder\30-days-30-projects\day-01-ai-symptom-checker"

# Initialize local git repository (if not initialized)
git init

# Stage all files
git add .

# Create initial commit
git commit -m "feat: Day 01 - AI Symptom Checker & Triage Assistant web app"

# Create repository on GitHub
# Go to https://github.com/new and create a repository named "day-01-ai-symptom-checker"

# Link remote repository and push (replace YOUR_GITHUB_USERNAME with your username)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/day-01-ai-symptom-checker.git
git branch -M main
git push -u origin main
```

---

## 2. 🌐 Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Import the `day-01-ai-symptom-checker` GitHub repository.
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = `[Your Google Gemini API Key]`
5. Click **Deploy**.

### Option B: Using Vercel CLI
```bash
npx vercel
```
Follow the interactive prompts to link and deploy.

---

## 3. 🔗 Attach Custom Sub-Domain `symptom-checker.aiwithab.site`

1. In your Vercel Project, navigate to **Settings** -> **Domains**.
2. Enter `symptom-checker.aiwithab.site` and click **Add**.
3. Log into your DNS provider for `aiwithab.site` (e.g. Hostinger, Cloudflare, Namecheap, GoDaddy).
4. Add the following DNS record:
   - **Type**: `CNAME`
   - **Name / Host**: `symptom-checker`
   - **Target / Value**: `cname.vercel-dns.com`
   - **TTL**: Auto or 3600
5. Vercel will automatically issue a free SSL certificate once DNS propagates!

---

## 🔒 Environment Variable Setup

For local development:
Create `.env.local` inside `day-01-ai-symptom-checker`:

```env
GEMINI_API_KEY=your_actual_gemini_api_key
```

If `GEMINI_API_KEY` is not provided, the application automatically uses the built-in WHO clinical decision decision engine with intelligent mock responses.
