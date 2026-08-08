# Day 10 — AI Email Composer

| Field | Details |
|---|---|
| **Day** | 10 |
| **Category** | AI / Productivity |
| **Difficulty** | Beginner–Intermediate |
| **Estimated Build Time** | 5–7 hours |

---

## 📌 Project Overview

The AI Email Composer is an intelligent writing assistant that transforms bullet-point intent into polished, professional emails tailored to the exact tone and purpose the user specifies. Instead of staring at a blank compose window, the user selects a tone (Formal, Casual, Persuasive, or Apologetic), a purpose (Job Application, Cold Outreach, Customer Complaint, Follow-up, or Networking), provides 3–5 bullet points of what they want to say, and the AI generates a complete, send-ready email in seconds.

The system's standout feature is the A/B Variant Generator: every email request produces three stylistically distinct versions — conservative, balanced, and bold — so the user can pick the version that best matches their instinct. A Subject Line Optimizer analyzes each email body and generates 5 subject line candidates with predicted open rate scores (0–100%), using data-driven patterns from email marketing research. Users can save any version, copy it with one click, or directly open it in Gmail via a `mailto:` deep link.

Built as a streamlined single-page Next.js app, the UX is designed for speed. The entire flow — from intent to ready-to-send email — takes under 30 seconds. A usage history panel stores the last 50 generated emails locally (IndexedDB), making it easy to revisit and refine past work. The app is designed to work as a Gmail browser extension in its stretch goal phase.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| **Tone Selector** | Choose from Formal, Casual, Persuasive, or Apologetic writing tone |
| **Purpose Templates** | Pre-configured context for Job Application, Cold Outreach, Follow-up, Complaint, and Networking |
| **Bullet-to-Email Conversion** | Input 3–5 bullet points; AI generates a complete, structured email |
| **A/B Variant Generator** | Generates 3 stylistically distinct email versions per request (conservative / balanced / bold) |
| **Subject Line Optimizer** | Generates 5 subject line candidates with predicted open rate score (0–100%) |
| **One-Click Copy** | Copy full email (subject + body) to clipboard with visual confirmation |
| **Gmail Deep Link** | "Open in Gmail" button pre-populates subject and body in Gmail compose window |
| **Email History Panel** | IndexedDB-stored history of last 50 generated emails with search |
| **Word Count & Reading Time** | Live word count and estimated reading time displayed per variant |
| **Tone Refinement Slider** | Fine-tune formality on a 1–10 scale after initial generation |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **AI Engine:** OpenAI GPT-4o (email generation, subject line optimization)
- **State Management:** Zustand (active session state)
- **Local Storage:** IndexedDB via `idb` npm package (email history)
- **Clipboard API:** `navigator.clipboard` (one-click copy)
- **Gmail Integration:** `mailto:` URI scheme + Gmail compose URL format
- **Analytics:** Vercel Analytics (usage tracking, most popular tone/purpose combos)
- **Rate Limiting:** Upstash Redis (per-IP request rate limiting)
- **Streaming:** OpenAI streaming API (real-time text streaming to UI)
- **Deployment:** Vercel

---

## 🔧 Key Functions

### `generateEmailVariants(config: EmailConfig): AsyncGenerator<EmailStreamChunk>`
Takes an `EmailConfig` object (tone, purpose, bullets, recipient context, senderName). Constructs three distinct system prompts — conservative (10% below average formality), balanced (target style), bold (10% above average assertiveness). Submits all three to GPT-4o in parallel using `Promise.all`, streams responses, and yields `EmailStreamChunk` events as each variant character arrives. Implements token usage tracking and stops generation cleanly on user cancellation.

### `optimizeSubjectLines(emailBody: string, purpose: EmailPurpose): Promise<SubjectLineResult[]>`
Analyzes the generated email body and calls GPT-4o-mini with a prompt trained on email marketing best practices: curiosity gap, personalization tokens, urgency signals, and length optimization (30–50 characters ideal). Returns 5 `SubjectLineResult` objects each with `subject`, `predictedOpenRate` (percentage), `strategyUsed` (curiosity/urgency/benefit/question/personalized), and `characterCount`.

### `buildEmailContext(purpose: EmailPurpose, bullets: string[]): EmailContext`
Maps the selected `purpose` enum to a context template object containing: `greeting` recommendation, `structure` guidance (opening hook, body paragraphs, CTA), `closingStyle`, and `avoidPatterns` (phrases to avoid for this purpose). Merges with the user's bullet points to build a rich, structured `EmailContext` fed to the generation prompt.

### `saveEmailToHistory(email: GeneratedEmail): Promise<void>`
Persists the generated email to IndexedDB using the `idb` library. Stores a `GeneratedEmail` object with `id` (UUID), `timestamp`, `config` (tone + purpose), `subject`, `body`, `variantLabel`, and `openRateScore`. Enforces a 50-item FIFO limit, removing the oldest entry when capacity is exceeded.

### `openInGmail(subject: string, body: string, recipientEmail?: string): void`
Constructs a Gmail compose URL: `https://mail.google.com/mail/?view=cm&fs=1&su={encodedSubject}&body={encodedBody}&to={recipient}`. URL-encodes all parameters and opens in a new tab. Falls back to a standard `mailto:` link if the user is not on a Gmail-aware browser. Tracks usage events for analytics.

---

## 📁 File Structure

```
ai-email-composer/
├── app/
│   ├── page.tsx                    # Main composer interface
│   ├── history/page.tsx            # Email history browser
│   └── api/
│       ├── generate/route.ts       # POST: Stream email variants
│       └── subjects/route.ts       # POST: Subject line optimization
├── components/
│   ├── composer/
│   │   ├── ToneSelector.tsx        # Tone icon-grid selector
│   │   ├── PurposeSelector.tsx     # Purpose dropdown/cards
│   │   ├── BulletInput.tsx         # Dynamic bullet point list
│   │   ├── ContextFields.tsx       # Recipient name, company, etc.
│   │   └── FormalitySlider.tsx     # Tone fine-tuning slider
│   ├── results/
│   │   ├── VariantTabs.tsx         # A/B/C variant tab switcher
│   │   ├── EmailPreview.tsx        # Rendered email with formatting
│   │   ├── SubjectLineRanker.tsx   # 5 subjects with open rate bars
│   │   ├── ActionBar.tsx           # Copy, Gmail, Save buttons
│   │   └── StreamingText.tsx       # Real-time streaming display
│   ├── history/
│   │   ├── HistoryList.tsx
│   │   └── HistorySearchBar.tsx
│   └── ui/
├── lib/
│   ├── openai.ts                   # OpenAI streaming client
│   ├── purposeTemplates.ts         # Purpose-to-context mapping
│   ├── idb/emailHistory.ts         # IndexedDB operations
│   ├── gmail.ts                    # Gmail URL builder
│   └── zustand/composerStore.ts
├── types/email.ts
├── .env.local
└── package.json
```

---

## 💡 AI Prompt Used

```
SYSTEM:
You are an elite professional email writer. You write emails that get responses. 
Your emails are:
- Concise: No filler words, no unnecessary pleasantries beyond one opening line
- Clear: One clear ask per email, stated explicitly
- Compelling: Every sentence earns its place

Current configuration:
- Tone: Persuasive
- Purpose: Cold Outreach (B2B sales / partnership request)
- Style variant: Bold (assertive, direct, confident)

Structure: 
1. Hook opening (1 sentence — specific, personalized, not generic)  
2. Value proposition (2-3 sentences — what you offer and why it matters to THEM)
3. Social proof (1 sentence — credibility signal)
4. Clear, low-friction CTA (1 sentence)
5. Professional sign-off

Output format: JSON { "subject": string, "body": string }

USER:
Sender: Abdul Nabi, AI/ML Engineer & Founder
Recipient: CTO of a healthcare startup (company: MedFlow Health)
Bullet points:
- Built AI diagnostic tool used by 3 hospitals
- Can integrate our AI into their patient triage system
- Want a 20-minute demo call this week
- Our tool reduces misdiagnosis by 34%
```

---

## 📤 Expected Output (Result)

**Generated Email Variants (JSON):**
```json
{
  "variants": [
    {
      "label": "Bold",
      "subject": "34% fewer misdiagnoses — 20 min to show you how",
      "body": "Your triage team is making decisions in seconds with incomplete information — our AI changes that.\n\nI'm Abdul Nabi, and the diagnostic AI I built is now deployed across 3 hospitals, reducing misdiagnosis rates by 34% in prospective trials. I built it specifically for the kind of high-velocity patient intake environment MedFlow operates in.\n\nWe've helped triage teams at similar-sized systems cut critical miss rates by a third in under 6 weeks of integration.\n\nI'd like 20 minutes this week to show you a live demo. Would Thursday or Friday work?",
      "wordCount": 94,
      "readingTime": "22 seconds"
    },
    {
      "label": "Balanced",
      "subject": "AI that reduces misdiagnosis by 34% — quick demo for MedFlow?",
      "body": "Hi,\n\nI came across MedFlow Health and wanted to reach out because what you're building in patient triage aligns closely with work I've done recently.\n\nI'm Abdul Nabi — I've built an AI diagnostic tool now used across 3 hospitals that has reduced misdiagnosis rates by 34% in clinical testing. I believe there's a meaningful opportunity to integrate this capability into MedFlow's triage workflow.\n\nWould you be open to a 20-minute demo call this week? I can walk you through exactly how it works and what integration looks like.",
      "wordCount": 101,
      "readingTime": "24 seconds"
    }
  ]
}
```

**Subject Line Optimizer (JSON):**
```json
{
  "subjectLines": [
    {"subject": "34% fewer misdiagnoses — 20 min to show you how", "predictedOpenRate": 68, "strategy": "benefit + curiosity", "characterCount": 49},
    {"subject": "AI triage tool → 3 hospitals, 34% less misdiagnosis", "predictedOpenRate": 62, "strategy": "social proof + benefit", "characterCount": 50},
    {"subject": "Quick question about MedFlow's triage workflow", "predictedOpenRate": 57, "strategy": "personalized + curiosity", "characterCount": 46},
    {"subject": "The diagnostic AI your triage team needs", "predictedOpenRate": 51, "strategy": "direct benefit", "characterCount": 40},
    {"subject": "Can I show you something in 20 minutes?", "predictedOpenRate": 48, "strategy": "low-friction CTA", "characterCount": 39}
  ],
  "recommended": 0,
  "topStrategy": "Benefit + Curiosity gap drove highest predicted open rate"
}
```

**UI Status:**
```
✅ 3 email variants generated  |  ⚡ 2.1s generation time

📧 Variant A (Bold)      — 94 words  |  22s read  |  ⭐ Recommended
📧 Variant B (Balanced)  — 101 words |  24s read
📧 Variant C (Soft)      — 118 words |  28s read

🎯 Top Subject Line: "34% fewer misdiagnoses — 20 min to show you how"  
   Predicted Open Rate: 68%  |  Strategy: Benefit + Curiosity

[📋 Copy Email]  [📬 Open in Gmail]  [💾 Save to History]
```

---

## 🚀 Stretch Goals

- [ ] Build a Chrome extension that injects the composer directly into Gmail's compose window
- [ ] Add email thread context: paste a previous email chain and AI writes a contextual reply
- [ ] Implement a "Did it work?" tracker — users report back on reply rates to improve the model
- [ ] Add LinkedIn message mode (shorter, platform-appropriate format)
- [ ] Build a team template library for sales teams to share high-performing email templates
- [ ] Add multilingual support (Spanish, French, Arabic, German cold outreach emails)
- [ ] Integrate with CRM tools (HubSpot, Salesforce) to auto-populate recipient context
