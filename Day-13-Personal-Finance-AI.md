# Day 13 — Personal Finance AI

| Field | Details |
|---|---|
| **Day** | 13 |
| **Category** | AI / Personal Finance |
| **Difficulty** | Advanced |
| **Estimated Build Time** | 9–12 hours |

---

## 📌 Project Overview

The Personal Finance AI is a comprehensive financial intelligence platform that transforms raw bank statement data into a sophisticated financial health dashboard. Users upload CSV or PDF bank statements — from any major bank — and within minutes the AI parses transactions, categorizes spending, builds a complete financial picture, and presents it through a set of professional-grade analytical views: net worth tracker, burn rate calculator, savings trajectory projection, 12-month forward forecast using linear regression, and the iconic FIRE (Financial Independence, Retire Early) date calculator.

The system goes beyond simple expense tracking by providing investment optimization advice tailored to the user's risk profile (assessed through a 5-question quiz), a debt payoff optimizer that computes both Avalanche (highest-interest-first) and Snowball (smallest-balance-first) strategies with visual timeline comparisons, and a savings trajectory simulator that models different contribution scenarios. All analysis runs in a privacy-first architecture: PDF parsing happens server-side with immediate data deletion after processing, and CSV files are processed entirely client-side.

The financial intelligence engine combines deterministic financial calculations (compound interest, debt amortization, FIRE number formula) with GPT-4o natural language generation to produce plain-English insights that any user can understand — not just finance professionals. The UX is inspired by premium fintech apps like Monarch Money and YNAB: clean, confident, and data-dense without feeling overwhelming.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| **Bank Statement Import** | Upload CSV or PDF bank statements; AI parses and normalizes transactions automatically |
| **Net Worth Tracker** | Input assets and liabilities; calculates real-time net worth with trend visualization |
| **Burn Rate Calculator** | Monthly fixed vs. variable expense breakdown with sustainable burn rate analysis |
| **12-Month Financial Forecast** | Linear regression projection of savings, spending, and net worth trajectory |
| **FIRE Calculator** | Computes FIRE number (25× annual expenses) and years-to-FIRE based on current savings rate |
| **Investment Recommendations** | Risk-profile-based portfolio allocation suggestions (ETFs, bonds, index funds) |
| **Debt Payoff Optimizer** | Avalanche vs. Snowball method comparison with payoff timeline and total interest saved |
| **AI Financial Advisor Chat** | Ask natural language questions about your finances; AI answers from your actual data |
| **Savings Trajectory Simulator** | Model "what if" scenarios (increase savings rate by 5%, cut dining budget, etc.) |
| **Monthly Financial Report PDF** | One-click generation of a comprehensive monthly financial health report |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Charts:** Recharts (line, area, bar, pie charts), `react-gauge-component`
- **PDF Parsing:** `pdf-parse` + `pdfjs-dist` (server-side) for statement extraction
- **CSV Parsing:** `Papa Parse` (client-side, privacy-preserving)
- **AI Engine:** OpenAI GPT-4o (categorization, advice, chat, narrative generation)
- **Financial Calculations:** Custom TypeScript finance library (FIRE, compound interest, amortization)
- **ML Forecasting:** Simple linear regression via `ml-regression` npm package
- **Database:** Supabase (encrypted session data, user financial snapshots)
- **Auth:** Clerk (with MFA — financial data sensitivity)
- **Encryption:** `crypto-js` (AES-256 client-side encryption before DB storage)
- **PDF Report:** Puppeteer (monthly report generation)
- **Deployment:** Vercel (Edge Functions for PDF parsing)

---

## 🔧 Key Functions

### `parseStatementTransactions(file: File): Promise<Transaction[]>`
Detects file type (CSV vs PDF). For CSV: uses Papa Parse to parse rows, auto-detects column mapping (date, description, amount, balance) across 15+ major bank formats using a fuzzy header matcher. For PDF: sends to the Next.js API route which uses `pdf-parse` to extract text, then passes to GPT-4o-mini with a structured extraction prompt to identify and normalize transaction records. Returns a standardized `Transaction[]` array with `date`, `description`, `amount`, `type` (`credit|debit`), `balance`, and `rawText`.

### `categorizeTransactions(transactions: Transaction[]): Promise<CategorizedTransaction[]>`
Batches transactions in groups of 50 and sends to GPT-4o-mini for categorization into 15 predefined financial categories (Income, Rent/Mortgage, Groceries, Dining, Transport, Utilities, Healthcare, Entertainment, Shopping, Subscriptions, Investment, Savings, Education, Travel, Other). Uses few-shot examples in the prompt for consistency. Returns transactions with `category`, `subcategory`, and `confidence` fields added.

### `calculateFIREDate(profile: FinancialProfile): FIREAnalysis`
Implements the standard FIRE calculation: `fireNumber = annualExpenses × 25`. Current monthly savings rate computed from income minus expenses. Applies the 4% safe withdrawal rate rule. Calculates `yearsToFIRE = log(fireNumber / currentInvestments) / log(1 + annualReturn) - annualSavings / annualReturn` using the geometric series formula. Returns a `FIREAnalysis` with `fireNumber`, `currentSavingsRate`, `yearsToFIRE`, `expectedFIREDate`, `monthlyGapToFIRE`, and a `scenarioComparison` array modeling 3 different savings rate trajectories.

### `optimizeDebtPayoff(debts: Debt[]): DebtOptimizationResult`
Implements both Avalanche and Snowball strategies in pure TypeScript. For Avalanche: sorts debts by APR descending, applies all extra payment to highest-interest debt while paying minimums on others. For Snowball: sorts by balance ascending. Simulates month-by-month amortization for both strategies until all debts reach zero balance. Returns `DebtOptimizationResult` with `avalanche` and `snowball` plans each containing `payoffMonths`, `totalInterestPaid`, `monthlySchedule[]`, and `interestSaved` (vs. minimum payments only).

### `generateFinancialNarrative(analysis: FinancialAnalysis): Promise<FinancialNarrative>`
Takes the complete financial analysis object and sends it to GPT-4o to write a personalized, plain-English financial health narrative. Prompts GPT-4o to write in the style of a trusted financial advisor giving an annual financial review — honest about weaknesses, celebratory about strengths. Returns a `FinancialNarrative` with `headline` (one punchy sentence), `body` (3 paragraphs), `urgentActions[]` (2–3 prioritized tasks), and `financialHealthGrade` (A–F).

---

## 📁 File Structure

```
personal-finance-ai/
├── app/
│   ├── page.tsx                    # Landing + onboarding
│   ├── dashboard/page.tsx          # Main financial dashboard
│   ├── import/page.tsx             # Statement upload flow
│   ├── advisor/page.tsx            # AI chat interface
│   ├── debt/page.tsx               # Debt optimizer
│   ├── fire/page.tsx               # FIRE calculator
│   └── api/
│       ├── parse-pdf/route.ts      # POST: Server-side PDF parsing
│       ├── categorize/route.ts     # POST: Transaction categorization
│       ├── forecast/route.ts       # POST: ML forecast computation
│       ├── advisor/route.ts        # POST: GPT-4o financial chat
│       └── report/route.ts         # GET: Monthly PDF report
├── components/
│   ├── dashboard/
│   │   ├── NetWorthCard.tsx        # Total net worth + trend
│   │   ├── BurnRateCard.tsx        # Monthly burn analysis
│   │   ├── SavingsTrajectory.tsx   # Area chart projection
│   │   ├── SpendingBreakdown.tsx   # Category donut chart
│   │   └── FinancialHealthScore.tsx # Overall grade card
│   ├── import/
│   │   ├── StatementUploader.tsx   # Drag-drop file upload
│   │   ├── TransactionReview.tsx   # Categorization confirmation
│   │   └── ColumnMapper.tsx        # CSV column mapping UI
│   ├── debt/
│   │   ├── DebtInputForm.tsx       # Add debts (amount, APR, min payment)
│   │   ├── PayoffTimeline.tsx      # Gantt-style payoff chart
│   │   └── StrategyComparison.tsx  # Avalanche vs Snowball table
│   ├── fire/
│   │   ├── FIRECalculator.tsx      # Inputs + result display
│   │   ├── FIREGauge.tsx           # Progress-to-FIRE gauge
│   │   └── ScenarioSimulator.tsx   # "What if" sliders
│   ├── advisor/
│   │   ├── FinancialChat.tsx       # GPT-4o chat interface
│   │   └── QuickQuestions.tsx      # Suggested question chips
│   └── ui/
├── lib/
│   ├── finance/
│   │   ├── fire.ts                 # FIRE calculations
│   │   ├── debtOptimizer.ts        # Avalanche/Snowball engine
│   │   ├── forecast.ts             # Linear regression projector
│   │   └── netWorth.ts             # Net worth calculator
│   ├── parsing/
│   │   ├── csvParser.ts            # Papa Parse wrapper
│   │   ├── pdfParser.ts            # pdf-parse client
│   │   └── bankFormats.ts          # Bank format detection rules
│   ├── openai.ts
│   ├── encryption.ts               # AES-256 client encryption
│   └── zustand/financeStore.ts
├── types/finance.ts
└── package.json
```

---

## 💡 AI Prompt Used

```
SYSTEM:
You are a certified financial planner (CFP) AI assistant with deep expertise in 
personal finance, investment strategy, and behavioral economics. You have access to 
the user's complete financial data for this session. You give honest, specific, 
actionable advice. You never give generic advice — every response references the 
user's actual numbers. You are direct but not alarmist.

When asked about specific financial decisions, always:
1. Reference the relevant numbers from their data
2. Give a clear recommendation (not "it depends")  
3. Explain the reasoning in 2-3 sentences
4. Suggest one concrete next step

Financial data context:
{USER_FINANCIAL_SUMMARY_JSON}

USER:
"Should I be putting more money into my emergency fund or start investing in index funds?"
```

---

## 📤 Expected Output (Result)

**FIRE Analysis (JSON):**
```json
{
  "fireNumber": 1125000,
  "annualExpenses": 45000,
  "currentInvestments": 87000,
  "annualSavingsRate": 0.32,
  "annualMonthlySavings": 1386,
  "yearsToFIRE": 18.4,
  "expectedFIREDate": "2044-12-01",
  "scenarios": [
    {"savingsRateIncrease": 0.05, "yearsReduced": 3.2, "newFIREDate": "2041-10-01"},
    {"savingsRateIncrease": 0.10, "yearsReduced": 6.8, "newFIREDate": "2038-04-01"}
  ]
}
```

**Debt Optimizer (JSON):**
```json
{
  "debts": [
    {"name": "Credit Card A", "balance": 4200, "apr": 22.9, "minPayment": 105},
    {"name": "Student Loan", "balance": 18000, "apr": 5.8, "minPayment": 195},
    {"name": "Car Loan", "balance": 9400, "apr": 8.2, "minPayment": 220}
  ],
  "availableExtra": 400,
  "avalanche": {
    "payoffMonths": 34,
    "totalInterestPaid": 3847,
    "interestSavedVsMinimum": 2940
  },
  "snowball": {
    "payoffMonths": 37,
    "totalInterestPaid": 4623,
    "interestSavedVsMinimum": 2164
  },
  "recommendation": "avalanche",
  "reasoningNote": "Avalanche saves you $776 more in interest. Credit Card A's 22.9% APR is the clear priority."
}
```

**Financial Health Narrative:**
```
📊 Financial Health Grade: B+

"You're building wealth — just not as efficiently as you could be."

You're saving 32% of your income which puts you in the top 15% of earners your age — 
that's genuinely impressive. However, carrying $4,200 on a 22.9% credit card while 
investing is mathematically backward: your investments need to average 22.9% returns 
just to break even, and index funds average ~10%. Pay the card off first.

Your FIRE date of 2044 is achievable, but a 5% savings rate increase would pull that 
in by 3+ years. The quickest lever you have is the dining category — you spent $940/month 
against a $600 budget for 4 consecutive months.

⚡ Urgent Actions:
1. Redirect $400/month to Credit Card A (Avalanche) — paid off in 12 months
2. Cut dining budget to $700 and auto-invest the $240 difference
3. Increase 401(k) contribution by 2% to capture any employer match remaining
```

---

## 🚀 Stretch Goals

- [ ] Integrate Plaid API for automatic bank account connection and real-time sync
- [ ] Add tax optimization module (tax-loss harvesting suggestions, IRA contribution limits)
- [ ] Build a couple/household mode with shared financial dashboard and split expense tracking
- [ ] Implement machine learning anomaly detection to flag unusual charges automatically
- [ ] Add a financial goal tracker (vacation fund, down payment, emergency fund) with timeline
- [ ] Build a "Financial Time Machine" simulator — what if you had started investing 5 years earlier?
- [ ] Add support for international currencies and multi-country tax systems
