# Day 08 — Smart Expense Tracker

| Field | Details |
|---|---|
| **Day** | 08 |
| **Category** | AI / Personal Finance |
| **Difficulty** | Intermediate |
| **Estimated Build Time** | 7–9 hours |

---

## 📌 Project Overview

The Smart Expense Tracker is an AI-first personal finance tool that eliminates the friction of manual expense logging by automating the entire intake pipeline. Users simply photograph a receipt and the app uses OCR (Optical Character Recognition) powered by Google Cloud Vision API to extract merchant name, date, line items, and total amount — then automatically categorizes the expense into one of 12 spending categories using GPT-4o classification. The result is a zero-effort expense diary that builds rich financial data over time.

The dashboard surfaces actionable intelligence from this data: monthly spending breakdown charts by category, trend lines showing month-over-month changes, budget allocation with real-time alerts when spending approaches limits, and an AI Spending Coach that analyzes spending patterns and delivers personalized, judgement-free advice on where to cut. The coach uses conversational AI to explain observations like "You spent 340% above your dining budget last month — here are 3 specific restaurants to cut."

A standout feature is the WhatsApp bot integration using Twilio's WhatsApp API: users can photograph a receipt on their phone and send it directly to a WhatsApp number. The bot transcribes, categorizes, and confirms the logged expense in seconds — making expense tracking as effortless as texting. CSV and Excel export round out the feature set for tax season.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| **Receipt OCR Scanner** | Photograph or upload receipt; Google Vision API extracts merchant, date, items, and total |
| **AI Auto-Categorization** | GPT-4o classifies each expense into 12 categories (Food, Transport, Health, etc.) |
| **Monthly Spending Charts** | Donut chart (by category), bar chart (monthly trend), and timeline view |
| **Budget Management** | Set monthly budgets per category; real-time progress bars with color-coded alerts |
| **AI Spending Coach** | Conversational AI analyzes patterns and gives personalized, actionable cutback advice |
| **WhatsApp Bot Integration** | Send receipt photos to a WhatsApp number via Twilio to log expenses instantly |
| **Manual Entry Form** | Quick-add form with smart merchant name autocomplete from history |
| **CSV/Excel Export** | Export all transactions with filters (date range, category) to CSV or XLSX |
| **Recurring Expense Detection** | AI detects recurring charges (subscriptions) and flags unexpected changes |
| **Multi-Currency Support** | Auto-converts foreign currency expenses using live exchange rates |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Charts:** Recharts (donut, bar, line charts)
- **OCR:** Google Cloud Vision API (document text detection)
- **AI Categorization & Coach:** OpenAI GPT-4o
- **WhatsApp Bot:** Twilio WhatsApp API + Twilio Functions
- **Currency Exchange:** Open Exchange Rates API
- **Database:** Supabase (PostgreSQL — transactions, budgets, categories)
- **Auth:** Clerk (email + Google OAuth)
- **File Storage:** Supabase Storage (receipt image hosting)
- **Excel Export:** `xlsx` npm package (SheetJS)
- **Image Processing:** `sharp` (receipt image preprocessing before OCR)
- **Deployment:** Vercel + Supabase

---

## 🔧 Key Functions

### `processReceiptOCR(imageBuffer: Buffer): Promise<ExtractedReceipt>`
Preprocesses the receipt image with `sharp` (contrast boost, grayscale, deskew) to improve OCR accuracy. Submits to Google Cloud Vision API's `TEXT_DETECTION` feature. Parses the raw OCR text using regex patterns and a GPT-4o-mini structured extraction call to identify `merchant`, `date`, `totalAmount`, `currency`, `lineItems[]`, and `taxAmount`. Returns a typed `ExtractedReceipt` object.

### `categorizeExpense(receipt: ExtractedReceipt, userHistory: Transaction[]): Promise<CategoryResult>`
Builds a context-aware categorization prompt that includes the merchant name, line items, amount, and the user's 20 most recent transactions for few-shot context. Sends to GPT-4o which selects from 12 predefined categories and returns a `CategoryResult` with `category`, `subcategory`, `confidence`, and `reasoning`. High-confidence results (>0.9) auto-apply; lower confidence prompts user confirmation.

### `generateSpendingCoachAdvice(userId: string, period: string): Promise<CoachReport>`
Retrieves 90 days of transaction history from Supabase, aggregates spending by category, computes month-over-month deltas, and identifies the top 3 overspent categories. Constructs a rich prompt for GPT-4o that includes anonymized spending data and user budget targets. Returns a `CoachReport` with an `overview` paragraph, `insights[]` (3–5 specific observations), `recommendations[]` (actionable cuts), and a `projectedSavings` monthly amount.

### `handleWhatsAppWebhook(req: TwilioWebhookRequest): Promise<string>`
Processes incoming Twilio WhatsApp webhook events. Extracts the media URL from the message, downloads the receipt image, runs it through `processReceiptOCR`, categorizes it, and saves it to Supabase. Constructs a confirmation reply message with the extracted details and a "Does this look right? Reply YES to confirm or type a correction." Returns the Twilio TwiML XML response string.

### `detectRecurringExpenses(transactions: Transaction[]): RecurringPattern[]`
Groups transactions by merchant name using fuzzy matching (Levenshtein distance). For each merchant group, calculates inter-transaction intervals and flags merchants where the standard deviation of intervals is less than 5 days (consistent billing cycle). Returns `RecurringPattern[]` with `merchant`, `frequency`, `estimatedMonthlyAmount`, `lastCharge`, and `nextExpected` fields.

---

## 📁 File Structure

```
smart-expense-tracker/
├── app/
│   ├── dashboard/page.tsx          # Main dashboard
│   ├── expenses/page.tsx           # Transaction list + filters
│   ├── budgets/page.tsx            # Budget management
│   ├── coach/page.tsx              # AI Spending Coach chat
│   ├── scan/page.tsx               # Receipt scanner
│   └── api/
│       ├── receipt/route.ts        # POST: OCR + categorize
│       ├── whatsapp/route.ts       # POST: Twilio webhook
│       ├── coach/route.ts          # POST: Coach report
│       ├── transactions/route.ts   # CRUD: Transactions
│       ├── budgets/route.ts        # CRUD: Budgets
│       └── export/route.ts         # GET: CSV/XLSX export
├── components/
│   ├── dashboard/
│   │   ├── SpendingDonut.tsx       # Category breakdown chart
│   │   ├── MonthlyTrendBar.tsx     # Month-over-month bars
│   │   ├── BudgetProgress.tsx      # Per-category budget bars
│   │   └── SummaryCards.tsx        # Total spent, saved, etc.
│   ├── scanner/
│   │   ├── CameraCapture.tsx       # Browser camera access
│   │   ├── ReceiptPreview.tsx      # OCR result editor
│   │   └── CategoryConfirm.tsx     # Categorization confirm/edit
│   ├── coach/
│   │   ├── CoachReport.tsx         # Insight cards + advice
│   │   └── CoachChat.tsx           # Follow-up Q&A chat
│   ├── expenses/
│   │   ├── TransactionTable.tsx
│   │   ├── FilterPanel.tsx
│   │   └── ExportButtons.tsx
│   └── ui/
├── lib/
│   ├── vision.ts                   # Google Cloud Vision client
│   ├── openai.ts                   # GPT-4o client
│   ├── twilio.ts                   # Twilio WhatsApp client
│   ├── supabase.ts                 # DB client
│   ├── currencyConverter.ts        # Exchange rate fetcher
│   └── recurringDetector.ts        # Pattern detection
├── types/expense.ts
├── .env.local
└── package.json
```

---

## 💡 AI Prompt Used

```
SYSTEM:
You are a personal finance AI spending coach. Your role is to analyze a user's spending 
patterns and provide honest, compassionate, and highly actionable financial advice. 
You are non-judgmental but direct. You identify specific areas of overspending and 
suggest concrete alternatives. Never give generic advice — always reference the user's 
actual numbers.

Return a JSON object with:
{
  "overview": string,         // 2-sentence summary of financial health
  "insights": [               // 3-5 observations with specific data points
    {"title": string, "detail": string, "severity": "info"|"warning"|"critical"}
  ],
  "recommendations": [        // 3-5 actionable suggestions
    {"action": string, "estimatedMonthlySaving": number, "effort": "easy"|"medium"|"hard"}
  ],
  "projectedMonthlySaving": number
}

USER:
Monthly income: $5,200
Spending data (last 3 months average):
  Food & Dining: $940 (budget: $600) — 57% OVER
  Transport: $280 (budget: $300) — on track
  Entertainment: $420 (budget: $200) — 110% OVER  
  Shopping: $680 (budget: $400) — 70% OVER
  Subscriptions: $187 (budget: $100) — 87% OVER
  Health: $120 (budget: $150) — under budget
  Other: $240
Total Spending: $2,867 | Net Savings: $2,333/month
```

---

## 📤 Expected Output (Result)

**Coach Report (JSON):**
```json
{
  "overview": "You're saving $2,333/month which is excellent at 45% of income, but three categories — Dining, Entertainment, and Shopping — are consistently over budget by a combined $840/month. Addressing these could increase your savings rate to 61%.",
  "insights": [
    {"title": "Dining Overspend: +$340/month", "detail": "You're spending $940 on food vs your $600 budget. This single category is responsible for 40% of your total budget overage.", "severity": "critical"},
    {"title": "Entertainment at 2x budget", "detail": "Entertainment costs $420/month against a $200 budget. This has been consistent for 3 months, suggesting it may be structural rather than one-off.", "severity": "warning"},
    {"title": "Subscription Creep: $87 over", "detail": "You have $187 in monthly subscriptions. The average person forgets 35% of their recurring charges — review and cancel unused ones.", "severity": "warning"}
  ],
  "recommendations": [
    {"action": "Cook at home 3 additional days per week — target $700 dining budget", "estimatedMonthlySaving": 240, "effort": "medium"},
    {"action": "Audit all subscriptions and cancel 2-3 unused ones", "estimatedMonthlySaving": 65, "effort": "easy"},
    {"action": "Apply a 48-hour rule before any non-essential purchase over $50", "estimatedMonthlySaving": 200, "effort": "easy"}
  ],
  "projectedMonthlySaving": 505
}
```

**WhatsApp Bot Response:**
```
🤖 SmartSpend Bot

✅ Receipt scanned successfully!

📋 Details extracted:
   Merchant: Starbucks
   Date: Aug 6, 2026
   Amount: $14.80 USD
   Category: ☕ Food & Dining

📊 August Dining budget: $214.80 / $600 (36% used)

Does this look right? Reply YES to save or type a correction.
```

---

## 🚀 Stretch Goals

- [ ] Build a bank statement PDF import pipeline (auto-import 3 months of history)
- [ ] Add a gamification layer — expense logging streaks, savings milestones, badges
- [ ] Implement group expense splitting (like Splitwise) with AI-powered bill parsing
- [ ] Add predictive spending alerts ("Based on trends, you'll exceed dining budget by Aug 20")
- [ ] Build an investment recommendation engine based on surplus savings amounts
- [ ] Add voice-to-expense logging ("I spent $12 on lunch at McDonald's")
- [ ] Create a tax season report that categorizes deductible business expenses automatically
