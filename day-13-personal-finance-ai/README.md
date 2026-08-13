# WealthPulse.AI — AI Personal Finance & FIRE Intelligence Platform

WealthPulse.AI is a full-stack personal finance platform that transforms raw bank statement data into a financial health dashboard featuring net worth tracking, monthly burn rate analysis, FIRE retirement date projections, and debt payoff optimization.

## Key Features
- **Bank Statement CSV Parser**: Upload bank statements with privacy-first client-side parsing + pre-loaded Chase & Bank of America demo profiles.
- **Net Worth & Monthly Burn Rate Dashboard**: Tracks assets vs liabilities, fixed vs variable expense ratios, and net savings rate.
- **FIRE Target Calculator (4% Safe Withdrawal Rule)**: Computes FIRE target portfolio ($25 \times \text{annual expenses}$), years to FIRE date, and interactive "What-If" scenario sliders.
- **Debt Payoff Engine (Avalanche vs. Snowball)**: Compares Avalanche (highest interest first) vs. Snowball (lowest balance first) with total interest saved.
- **AI Certified Financial Planner (CFP) Review & Advisor Chat**: Gemini 1.5 Flash provides letter grade ratings ($A \dots F$), 3 urgent priority action items, and natural language Q&A.

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS & Lucide Icons
- PapaParse CSV Parser
- Google Gemini API (`@google/generative-ai`)
- Vercel Production
