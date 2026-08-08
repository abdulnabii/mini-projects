# Day 30 — Full-Stack AI SaaS Boilerplate

## 🗓️ Day: 30 of 30
## 🏷️ Category: Full-Stack / SaaS Starter / Developer Productivity
## ⚡ Difficulty: Advanced
## 🕐 Estimated Build Time: 10–12 hours

---

## 📌 Project Overview

The grand finale. A production-ready, fully-featured SaaS boilerplate that Abdul Nabi (and other developers) can use to launch any AI-powered SaaS product within hours instead of weeks. Includes authentication, subscription billing (Stripe), multi-tenancy, AI feature flags, admin dashboard, usage-based billing metering, email system, and a one-command deployment pipeline. This becomes the foundation for every future SaaS project.

This is the most valuable project of the 30-day challenge — a reusable asset worth thousands of dollars in saved development time.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Auth System | Email/password + Google/GitHub OAuth via Clerk |
| Subscription Billing | Stripe Checkout, webhooks, portal, free tier |
| Multi-Tenancy | Organization/workspace system with member roles |
| AI Usage Metering | Per-user AI credit system with automatic limits |
| Admin Dashboard | User management, subscription overview, metrics |
| Email System | Transactional emails (welcome, invoice, alerts) |
| Feature Flags | Toggle features by plan (Free/Pro/Enterprise) |
| Rate Limiting | Per-user rate limiting with Upstash Redis |
| Landing Page | Conversion-optimized landing page template |
| One-Click Deploy | Vercel deploy + Supabase setup script included |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router + Server Actions)
- **Auth**: Clerk (complete auth solution)
- **Database**: Supabase (PostgreSQL + Row Level Security)
- **ORM**: Drizzle ORM (type-safe DB queries)
- **Billing**: Stripe (subscriptions + usage metering)
- **AI**: Google Gemini API (with usage tracking middleware)
- **Email**: Resend + React Email templates
- **Rate Limiting**: Upstash Redis
- **Analytics**: PostHog (product analytics)
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions (test + deploy pipeline)

---

## 🔧 Key Functions

### `withAIRateLimit(handler: Handler, credits: number): Handler`
Higher-order function that wraps any AI API route. Checks user's remaining AI credits in Redis, deducts the specified credits on success, and returns a 429 with remaining credits header if limit exceeded. Automatically resets credits on billing cycle renewal.

### `requireSubscription(plan: Plan): Middleware`
Server-side middleware that checks the current user's Stripe subscription status against the required plan tier. Redirects to `/pricing` if insufficient, or runs the handler if authorized. Uses cached subscription status from Supabase to minimize Stripe API calls.

### `createOrganization(adminUserId: string, name: string, plan: Plan): Promise<Organization>`
Creates a new multi-tenant organization: Supabase RLS policies, admin role assignment, Stripe customer creation, default feature flag configuration, and welcome email sequence trigger.

### `trackAIUsage(userId: string, orgId: string, feature: string, creditsUsed: number): Promise<void>`
Records AI feature usage in Supabase for billing metering, updates Redis credit counter atomically, and triggers usage alert email if user reaches 80% or 100% of their plan limit.

### `generateStripeCheckoutSession(userId: string, priceId: string, trialDays: number): Promise<string>`
Creates a Stripe Checkout session with pre-filled customer data, success/cancel URLs, trial period configuration, and webhook metadata for post-checkout organization provisioning.

---

## 📁 File Structure

```
ai-saas-boilerplate/
├── app/
│   ├── (marketing)/            # Public pages (no auth)
│   │   ├── page.tsx            # Landing page
│   │   └── pricing/page.tsx    # Pricing page
│   ├── (app)/                  # Authenticated app
│   │   ├── dashboard/page.tsx
│   │   ├── settings/page.tsx
│   │   └── billing/page.tsx
│   ├── admin/                  # Admin panel
│   │   └── page.tsx
│   └── api/
│       ├── ai/route.ts         # AI endpoint with metering
│       ├── webhooks/stripe/route.ts
│       └── usage/route.ts
├── components/
│   ├── ui/                     # Reusable design system
│   ├── billing/                # Stripe components
│   └── admin/                  # Admin components
├── lib/
│   ├── db/
│   │   ├── schema.ts           # Drizzle schema
│   │   └── queries.ts          # Reusable queries
│   ├── stripe.ts               # Stripe client + helpers
│   ├── ai.ts                   # AI client with usage tracking
│   ├── email.ts                # Resend email sender
│   └── rate-limit.ts           # Upstash rate limiter
├── emails/                     # React Email templates
│   ├── welcome.tsx
│   ├── invoice.tsx
│   └── usage-alert.tsx
├── drizzle/
│   └── migrations/             # DB migration files
└── scripts/
    └── setup.sh                # One-command setup script
```

---

## 💡 AI Prompt Used

```
This boilerplate's AI feature uses a structured system prompt pattern:

For any AI feature integrated into the SaaS:

SYSTEM PROMPT:
You are the AI assistant for {appName}, a SaaS platform for {domain}.

Current user context:
- User ID: {userId}
- Plan: {plan} ({creditsRemaining} AI credits remaining this month)
- Organization: {orgName}

{feature-specific instructions here}

Always:
- Stay within the scope of {domain}
- Cite that this is AI-generated content when relevant
- Never expose other users' data

USAGE TRACKING:
Every AI call automatically logs:
{
  "userId": "user_xxx",
  "orgId": "org_xxx",
  "feature": "RESUME_ANALYSIS|BLOG_GENERATION|CODE_REVIEW",
  "creditsUsed": 5,
  "timestamp": "2026-08-07T08:00:00Z",
  "inputTokens": 1240,
  "outputTokens": 890,
  "latencyMs": 1840
}
```

---

## 📤 Expected Output (Result)

**Setup output after running `./scripts/setup.sh`:**

```bash
$ ./scripts/setup.sh

🚀 AI SaaS Boilerplate Setup
══════════════════════════════════════════════

[1/8] ✅ Checking Node.js version (18.17.0) — OK
[2/8] ✅ Installing dependencies (npm install) — 47 packages
[3/8] ✅ Supabase project created — Project ID: abc123xyz
[4/8] ✅ Running DB migrations (12 tables created)
[5/8] ✅ Stripe products created:
        Free: $0/mo (50 AI credits)
        Pro: $19/mo (500 AI credits)  
        Enterprise: $99/mo (unlimited)
[6/8] ✅ Clerk application configured
[7/8] ✅ Environment variables written to .env.local
[8/8] ✅ Vercel deployment configured

══════════════════════════════════════════════
✨ Setup complete in 43 seconds!

Your SaaS boilerplate is ready at: http://localhost:3000

Admin dashboard: http://localhost:3000/admin
Default admin: Set ADMIN_EMAIL in .env.local

Next steps:
  1. Customize branding in app/(marketing)/page.tsx
  2. Add your AI features to app/api/ai/route.ts
  3. Run: git push origin main → Vercel auto-deploys

Happy shipping! 🎉
```

**Dashboard UI Display:**
```
📊 Abdul Nabi's SaaS — Admin Dashboard

Users: 247  |  MRR: $1,840  |  Churn: 2.1%  |  AI Calls Today: 3,421

Plan Distribution:
  Free:       180 users  ████████░░  73%
  Pro:         58 users  ██░░░░░░░░  24%
  Enterprise:   9 users  ░░░░░░░░░░   3%

Top AI Features Used:
  1. Resume Analysis    ████████  1,842 calls
  2. Blog Generation    █████░░░  1,241 calls
  3. Code Review        ███░░░░░    338 calls

🚨 Usage Alerts Sent: 12 users at 80% credit limit

[Manage Users] [View Invoices] [Feature Flags] [API Usage]
```

---

## 🏆 30-Day Challenge Complete!

This boilerplate represents the culmination of everything learned across 29 projects:

| Day | Technology |
|-----|------------|
| 01-05 | AI APIs, Healthcare AI, NLP |
| 06-10 | Real-time data, Developer Tools, APIs |
| 11-15 | ML models, Education tech, SEO automation |
| 16-20 | Viral apps, Job tech, Mental health, Collaboration |
| 21-25 | Performance engineering, Legal tech, IoT, Content AI |
| 26-30 | Healthcare PWA, DevOps, 3D Visualization, SaaS |

**Abdul Nabi — Built 30 real projects in 30 days. 🚀**

---

## 🚀 Stretch Goals

- [ ] Add OpenAI, Anthropic, Cohere as AI provider options
- [ ] White-label theming system (custom domain per org)
- [ ] Mobile app template (React Native) using same Supabase backend
- [ ] Marketplace of pre-built AI feature modules to add to any project
