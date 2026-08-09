# 🚀 Day 02 — Real-Time Code Review Bot Deployment Guide

Follow this guide to deploy Day 02 to Vercel and attach the subdomain `code-review.aiwithab.site`.

---

## 1. 🐙 Commit and Push to GitHub Monorepo

Open PowerShell in the root directory:

```bash
cd "c:\Users\nabi4\OneDrive\Desktop\New folder\30-days-30-projects"

git add .
git commit -m "feat: Day 02 - Real-Time Code Review Bot"
git push origin main
```

---

## 2. 🌐 Deploy to Vercel via CLI

Run in PowerShell:

```bash
cd "c:\Users\nabi4\OneDrive\Desktop\New folder\30-days-30-projects\day-02-code-review-bot"

# Deploy to Vercel Production using API token
npx vercel --token <VERCEL_TOKEN> --prod --yes

# Attach subdomain code-review.aiwithab.site
npx vercel domains add code-review.aiwithab.site day-02-code-review-bot --token <VERCEL_TOKEN>
```

---

## 3. 🔗 Subdomain CNAME DNS Record

In your DNS provider (Hostinger / Cloudflare / GoDaddy) for `aiwithab.site`:
- **Type**: `CNAME`
- **Name**: `code-review`
- **Target**: `cname.vercel-dns.com`
- **TTL**: Auto / 3600
