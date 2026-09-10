# 🚀 Day 28 — OmniData.3D Vercel Deployment Guide

Follow this guide to deploy Day 28 (`day-28-3d-data-visualization`) to Vercel production.

---

## 1. ⚙️ Vercel Project & Team Credentials

- **Project Name**: `day-28-3d-data-visualization`
- **Project ID**: `prj_Bpkd65ITEIa1hKUxiEClwMJZr6UQ`
- **Team / Org ID**: `team_P0AhjcWKoUAspDgtOFE5uujN` (`abdulnabiis-projects`)
- **Production URL**: [https://day-28-3d-data-visualization.vercel.app](https://day-28-3d-data-visualization.vercel.app)

---

## 2. 🔑 Important: Vercel Access Token Scope

Because this project belongs to the team workspace **`abdulnabiis-projects`** (`team_P0AhjcWKoUAspDgtOFE5uujN`), your Vercel Access Token **MUST** have access to the `abdulnabiis-projects` scope.

### How to generate or update the token:
1. Open the [Vercel Token Settings](https://vercel.com/account/tokens).
2. Click **Create Token**.
3. In **Scope**, select **`abdulnabiis-projects`** (or **Full Account**).
4. Copy the new token.
5. In GitHub repository settings:
   - Go to [GitHub Repo Secrets](https://github.com/abdulnabii/mini-projects/settings/secrets/actions).
   - Set or update the `VERCEL_TOKEN` secret with the newly created token.

---

## 3. 🤖 GitHub Actions Automatic CI/CD

Once the `VERCEL_TOKEN` secret is updated with team scope:
1. Pushing changes to `day-28-3d-data-visualization/**` automatically triggers `.github/workflows/deploy-day28.yml`.
2. Alternatively, trigger it manually from the [GitHub Actions tab](https://github.com/abdulnabii/mini-projects/actions/workflows/deploy-day28.yml) using the **Run workflow** button.

---

## 4. 💻 Manual Deployment via CLI

You can also deploy directly from your local terminal:

```bash
cd "c:\Users\nabi4\OneDrive\Desktop\New folder\30-days-30-projects\day-28-3d-data-visualization"

# Link to Vercel project
npx vercel link --project prj_Bpkd65ITEIa1hKUxiEClwMJZr6UQ --token <YOUR_SCOPED_TOKEN>

# Build and deploy to production
npx vercel build --prod --token <YOUR_SCOPED_TOKEN>
npx vercel deploy --prebuilt --prod --token <YOUR_SCOPED_TOKEN>
```
