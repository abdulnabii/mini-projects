# Day 22 — AI-Powered Legal Document Analyzer

## 🗓️ Day: 22 of 30
## 🏷️ Category: LegalTech / AI Document Processing
## ⚡ Difficulty: Intermediate
## 🕐 Estimated Build Time: 6–7 hours

---

## 📌 Project Overview

Upload any legal document — contracts, NDAs, terms of service, lease agreements, employment contracts — and the AI provides a plain-English summary, flags dangerous clauses (one-sided penalties, intellectual property grabs, non-compete overreach), highlights missing standard protections, and gives an overall risk score. Democratizing legal literacy for people who can't afford lawyers for every document.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| PDF/DOCX Upload | Drag-drop upload with text extraction |
| Plain-English Summary | Jargon-free explanation of document purpose |
| Risk Score | 0–100 risk meter with color coding |
| Dangerous Clause Highlighter | Flags risky clauses with exact text quotes |
| Missing Clause Alerts | Warns about absent standard protections |
| Clause-by-Clause Breakdown | Explains every major section simply |
| Negotiation Tips | Specific suggestions to push back on bad terms |
| Comparison Mode | Upload two versions to see tracked changes |
| Multi-Language | Analyze docs in Arabic, Urdu, French, Spanish |
| Ask Document Questions | Chat with the document for specific queries |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion
- **AI**: Google Gemini 1.5 Pro (128K context window for long docs)
- **PDF Parsing**: `pdf-parse` + `mammoth` (DOCX)
- **Text Highlighting**: `react-pdf-highlighter`
- **Database**: Supabase (optional document history)
- **Deployment**: Vercel

---

## 🔧 Key Functions

### `extractTextFromDocument(file: File): Promise<string>`
Handles both PDF (via `pdf-parse`) and DOCX (via `mammoth`) files. Strips formatting, preserves paragraph structure, and returns clean text. Truncates to 100,000 chars for API limits with intelligent section detection.

### `analyzeDocument(text: string, docType: DocType): Promise<LegalAnalysis>`
Sends document text to Gemini 1.5 Pro with a legal analyst system prompt. Returns structured analysis with risk score, dangerous clauses, missing clauses, and section-by-section breakdown.

### `identifyDangerousClauses(analysis: LegalAnalysis): DangerousClause[]`
Post-processes raw AI output to normalize clause severity (SEVERE/MODERATE/MILD), add category tags (IP/Non-Compete/Liability/Termination), and generate specific counter-proposal text.

### `chatWithDocument(question: string, documentText: string, history: Message[]): Promise<string>`
Maintains a conversational context with the full document text. Allows users to ask specific questions ("What are the termination conditions?") with accurate, text-grounded answers.

### `compareDocumentVersions(v1: string, v2: string): Promise<VersionDiff>`
Sends both document versions to Gemini and returns a structured diff showing new clauses added, removed clauses, and significantly modified clauses between versions.

---

## 📁 File Structure

```
legal-analyzer/
├── app/
│   ├── page.tsx              # Upload + landing
│   ├── analyze/[id]/
│   │   └── page.tsx          # Analysis results
│   └── api/
│       ├── analyze/route.ts  # Main analysis
│       ├── chat/route.ts     # Document Q&A
│       └── compare/route.ts  # Version comparison
├── components/
│   ├── DocumentUpload.tsx    # Drag-drop upload
│   ├── RiskMeter.tsx         # Animated risk gauge
│   ├── ClauseList.tsx        # Dangerous clauses list
│   ├── SectionBreakdown.tsx  # Section accordion
│   ├── DocumentChat.tsx      # Chat interface
│   └── CompareView.tsx       # Diff viewer
└── lib/
    ├── pdf-extract.ts
    ├── gemini.ts
    └── clause-classifier.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are an expert legal analyst specializing in contract review. Analyze this 
{docType} and provide a comprehensive risk assessment in plain English.

Your task:
1. Identify ALL clauses that are unusually one-sided or risky for the signing party
2. Flag standard protections that are missing
3. Rate overall risk 0-100 (0=very safe, 100=extremely risky)
4. Explain each section in plain English (Grade 8 reading level)

Output JSON only:
{
  "documentType": "NDA",
  "riskScore": 72,
  "riskVerdict": "HIGH RISK - Do not sign without negotiation",
  "summary": "Plain English 3-sentence description of what this document does",
  "dangerousClauses": [
    {
      "severity": "SEVERE",
      "category": "Intellectual Property",
      "title": "Broad IP Ownership Grab",
      "exactText": "...quote from document...",
      "plainEnglish": "This means: They own EVERYTHING you create, even on your own time, even unrelated to your job",
      "counterProposal": "Replace with: 'Company owns IP created using company resources during working hours for company purposes only'"
    }
  ],
  "missingClauses": [
    { "clause": "Termination Notice Period", "risk": "You could be fired instantly with no notice", "standard": "Industry standard is 2 weeks written notice" }
  ],
  "sections": [
    { "title": "Section 1: Definitions", "plainEnglish": "...", "riskLevel": "LOW" }
  ]
}

DOCUMENT: {text}
```

---

## 📤 Expected Output (Result)

```json
{
  "documentType": "Employment Contract",
  "riskScore": 74,
  "riskVerdict": "HIGH RISK — Negotiate 3 clauses before signing",
  "summary": "This is a full-time employment contract binding you exclusively to the company. It contains an unusually broad IP ownership clause, a 2-year non-compete covering 'any similar industry globally', and lacks a termination notice period entirely.",
  "dangerousClauses": [
    {
      "severity": "SEVERE",
      "category": "Intellectual Property",
      "title": "Unlimited IP Ownership",
      "exactText": "Employee assigns all inventions, creations, and developments conceived at any time...",
      "plainEnglish": "They own EVERYTHING you create — even personal projects built at home on weekends, completely unrelated to your job.",
      "counterProposal": "Add: '...conceived using Company resources or during working hours in furtherance of Company business'"
    },
    {
      "severity": "SEVERE",
      "category": "Non-Compete",
      "title": "Global 2-Year Non-Compete",
      "exactText": "Employee shall not engage in any similar business globally for 24 months...",
      "plainEnglish": "You cannot work in your entire field anywhere in the world for 2 years after leaving. This is extreme and likely unenforceable in many jurisdictions.",
      "counterProposal": "Limit to: 6 months, within [specific region], for direct competitors only"
    }
  ],
  "missingClauses": [
    {
      "clause": "Termination Notice Period",
      "risk": "Company can terminate your employment instantly with no notice",
      "standard": "Standard is 30 days written notice from both parties"
    }
  ]
}
```

**UI Display:**
```
⚖️ Legal Document Analysis — Employment Contract

Risk Score: 74/100 🔴 HIGH RISK
"Negotiate 3 clauses before signing"

🚨 Dangerous Clauses (2 Severe):
────────────────────────────────
🔴 SEVERE — Unlimited IP Ownership
   Plain English: They own everything you create, even at home on weekends.
   📝 Counter-proposal available

🔴 SEVERE — Global 2-Year Non-Compete  
   Plain English: Cannot work in your field anywhere in the world for 2 years.
   📝 Counter-proposal available

⚠️ Missing Protections (1):
   • No Termination Notice Period

[Ask a Question about this document] [View All Sections] [Export Analysis]
```

---

## 🚀 Stretch Goals

- [ ] Lawyer referral integration for complex cases
- [ ] GDPR/CCPA compliance checker for privacy policies
- [ ] Bulk analysis for multiple contracts
- [ ] Real-time collaboration with annotations
