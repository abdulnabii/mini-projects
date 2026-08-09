# 🚀 Day 03 — Smart Resume Builder Deployment Guide

Follow this guide to deploy Day 03 to Vercel and map the subdomain `resume-builder.aiwithab.site`.

---

## 1. 🐙 Commit and Push to GitHub Monorepo

Open PowerShell in the root directory:

```bash
cd "c:\Users\nabi4\OneDrive\Desktop\New folder\30-days-30-projects"

git add .
git commit -m "feat: Day 03 - Smart Resume Builder & ATS Optimizer"
git push origin main
```

---

## 2. 🌐 Deploy to Vercel via CLI

Run in PowerShell:

```bash
cd "c:\Users\nabi4\OneDrive\Desktop\New folder\30-days-30-projects\day-03-smart-resume-builder"

# Deploy to Vercel Production using API token
npx vercel --token <VERCEL_TOKEN> --prod --yes

# Attach subdomain resume-builder.aiwithab.site
npx vercel domains add resume-builder.aiwithab.site day-03-smart-resume-builder --token <VERCEL_TOKEN>
```

---

## 3. 🔗 Subdomain CNAME DNS Record

In your Hostinger / Cloudflare DNS Manager for `aiwithab.site`:
- **Type**: `CNAME`
- **Name**: `resume-builder`
- **Target**: `cname.vercel-dns.com`
- **TTL**: Auto / 3600
