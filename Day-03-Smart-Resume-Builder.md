# Day 03 — Smart Resume Builder

| Field | Details |
|---|---|
| **Day** | 03 |
| **Category** | AI / Productivity |
| **Difficulty** | Intermediate |
| **Estimated Build Time** | 6–8 hours |

---

## 📌 Project Overview

The Smart Resume Builder is an AI-powered web application that transforms raw work history text or a LinkedIn profile URL into a beautifully formatted, ATS-optimized resume in seconds. Abdul Nabi built this to solve one of the most universal pain points in the job market: spending hours reformatting a resume only to have it rejected by automated systems before a human ever sees it. The app leverages OpenAI GPT-4o to rewrite every bullet point into a compelling, action-verb-led achievement statement.

The system features a real-time ATS (Applicant Tracking System) score engine that compares resume keywords against a target job description and calculates a compatibility percentage. A gap analysis module identifies missing skills, certifications, or experience blocks that are common in similar roles. Three professional templates — Modern, Minimal, and Tech — ensure the final product looks as good as it performs in automated parsing.

Export options include one-click PDF generation via Puppeteer, as well as plain-text export for copy-pasting into ATS portals. The application is built as a Next.js 14 full-stack app with a Python FastAPI microservice handling the heavy AI lifting, giving users a blazing-fast experience while keeping concerns cleanly separated.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| **LinkedIn URL Ingestion** | Paste a LinkedIn profile URL; the scraper extracts work history, education, and skills via Puppeteer |
| **AI Bullet Point Rewriter** | GPT-4o rewrites each bullet into a STAR-format, action-verb-led achievement with quantifiable impact |
| **ATS Score Checker** | Compares resume keywords against a pasted job description and returns a 0–100 compatibility score |
| **Keyword Gap Optimizer** | Highlights missing high-value keywords from the job description and suggests natural injection points |
| **Experience Gap Analysis** | Detects career timeline gaps and suggests how to frame them positively (freelance, upskilling, etc.) |
| **3 Professional Templates** | Choose from Modern (color accent), Minimal (clean whitespace), or Tech (monospace developer style) |
| **PDF Export** | One-click export via Puppeteer that generates a pixel-perfect, parser-safe PDF |
| **Real-Time Preview** | Side-by-side live preview updates as the user edits any section of the resume |
| **Skills Cloud Auto-Suggest** | AI suggests role-relevant hard and soft skills based on the target job description |
| **Section Reorder Drag & Drop** | Drag-and-drop resume section reordering with react-beautiful-dnd |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend API:** Python FastAPI (AI microservice), Node.js API Routes (Next.js)
- **AI Engine:** OpenAI GPT-4o via `openai` Python SDK
- **Scraping:** Puppeteer (Node.js) for LinkedIn profile extraction
- **PDF Generation:** Puppeteer headless Chrome renderer
- **Drag & Drop:** `react-beautiful-dnd`
- **Charts:** Chart.js (ATS score gauge)
- **State Management:** Zustand
- **Database:** Supabase (PostgreSQL) for saving resume versions
- **Auth:** Clerk (Google OAuth)
- **Deployment:** Vercel (frontend) + Railway (FastAPI service)

---

## 🔧 Key Functions

### `rewriteBulletPoints(rawBullets: string[], jobDescription: string): Promise<string[]>`
Sends raw experience bullet points to GPT-4o with a structured system prompt instructing the model to rewrite each bullet using the STAR method. Injects keywords from the target job description naturally. Returns an array of polished bullet strings with action verbs and quantified impact wherever possible. Falls back to the original bullet if the AI response fails validation.

### `calculateATSScore(resumeText: string, jobDescription: string): Promise<ATSResult>`
Tokenizes both the resume text and the job description into keyword sets. Computes term frequency overlap, weights technical skills 2x over soft skills, and applies a penalty for keyword stuffing (density > 3%). Returns an `ATSResult` object with `score` (0–100), `matchedKeywords`, `missingKeywords`, and `suggestions` arrays.

### `scrapeLinkedInProfile(profileUrl: string): Promise<LinkedInProfile>`
Launches a headless Puppeteer browser session, navigates to the LinkedIn profile URL, and extracts structured data including work experience entries, education records, skills, certifications, and summary text. Returns a normalized `LinkedInProfile` object. Implements rate limiting and user-agent rotation to avoid detection.

### `detectCareerGaps(experience: ExperienceEntry[]): GapAnalysis[]`
Sorts experience entries by date and flags gaps exceeding 3 months. For each gap, calls GPT-4o to generate a suggested framing phrase based on surrounding context. Returns a `GapAnalysis[]` array with `startDate`, `endDate`, `durationMonths`, and `suggestedFraming` per gap.

### `generatePDF(resumeHTML: string, template: TemplateType): Promise<Buffer>`
Accepts rendered resume HTML and a template identifier (`modern | minimal | tech`). Launches a Puppeteer instance, injects the HTML with the corresponding CSS template, and renders a high-fidelity PDF at A4 dimensions with print-safe fonts. Returns the PDF as a Node.js `Buffer` streamed via a Next.js API route.

---

## 📁 File Structure

```
smart-resume-builder/
├── app/
│   ├── (auth)/
│   │   └── sign-in/page.tsx
│   ├── builder/
│   │   ├── page.tsx               # Main builder interface
│   │   ├── preview/page.tsx       # Full-screen preview
│   │   └── layout.tsx
│   ├── api/
│   │   ├── scrape-linkedin/route.ts
│   │   ├── generate-pdf/route.ts
│   │   └── ats-score/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── builder/
│   │   ├── ResumeEditor.tsx        # Main editable form
│   │   ├── SectionBlock.tsx        # Draggable section wrapper
│   │   ├── BulletEditor.tsx        # Per-bullet AI rewrite UI
│   │   └── TemplateSelector.tsx
│   ├── preview/
│   │   ├── ModernTemplate.tsx
│   │   ├── MinimalTemplate.tsx
│   │   └── TechTemplate.tsx
│   ├── ats/
│   │   ├── ATSScoreGauge.tsx
│   │   ├── KeywordCloud.tsx
│   │   └── GapAnalysisPanel.tsx
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── zustand/resumeStore.ts
│   ├── puppeteer/scraper.ts
│   ├── pdf/generator.ts
│   └── utils.ts
├── ai-service/                     # Python FastAPI microservice
│   ├── main.py
│   ├── routes/
│   │   ├── rewrite.py
│   │   ├── ats.py
│   │   └── gaps.py
│   ├── prompts/
│   │   ├── bullet_rewriter.txt
│   │   └── gap_framer.txt
│   ├── requirements.txt
│   └── Dockerfile
├── public/templates/
├── .env.local
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 💡 AI Prompt Used

```
SYSTEM:
You are an expert resume writer and career coach with 15 years of experience helping 
professionals land roles at FAANG companies and top startups. You specialize in writing 
ATS-optimized resumes that highlight measurable impact. Your writing is concise, 
action-oriented, and uses strong verbs like "Engineered," "Spearheaded," "Reduced," 
"Delivered," and "Architected."

Rules:
1. Every bullet must start with a past-tense action verb.
2. Quantify impact wherever possible (%, $, time saved, users impacted).
3. Inject keywords from the job description naturally — never stuff.
4. Use STAR format implicitly (no labels needed).
5. Keep each bullet to 1–2 lines maximum.
6. Return ONLY a JSON array of rewritten bullets, no commentary.

USER:
Rewrite the following resume bullets for a "Senior Backend Engineer" role.
Target job description keywords: [Python, distributed systems, Kubernetes, REST APIs, 
PostgreSQL, high availability, microservices, CI/CD, AWS].

Raw bullets:
[
  "worked on backend services",
  "helped with database stuff",
  "did some DevOps work with containers"
]
```

---

## 📤 Expected Output (Result)

**AI Rewritten Bullets (JSON):**
```json
{
  "rewritten_bullets": [
    "Engineered high-throughput Python microservices handling 2M+ daily requests, reducing p99 latency by 38% across distributed REST APIs",
    "Optimized PostgreSQL query performance by redesigning schema indexes and introducing connection pooling, cutting average query time from 420ms to 65ms",
    "Containerized 12 backend services using Docker and Kubernetes on AWS EKS, achieving 99.97% uptime and cutting deployment time by 70% via CI/CD pipelines"
  ],
  "keywords_injected": ["Python", "microservices", "REST APIs", "PostgreSQL", "Kubernetes", "AWS", "CI/CD", "distributed"],
  "action_verbs_used": ["Engineered", "Optimized", "Containerized"]
}
```

**ATS Score Result:**
```json
{
  "score": 87,
  "grade": "A",
  "matched_keywords": ["Python", "Kubernetes", "REST APIs", "PostgreSQL", "AWS", "CI/CD", "microservices"],
  "missing_keywords": ["high availability", "distributed systems"],
  "suggestions": [
    "Add 'high availability' when describing uptime achievements",
    "Mention 'distributed systems' in your summary or skills section"
  ],
  "keyword_density": 2.4
}
```

**UI Status Text:**
```
✅ Resume Generated Successfully
📊 ATS Score: 87/100 (Grade: A)
🔑 7/9 target keywords matched
⚠️  2 keywords missing — click "Optimize" to auto-inject
📄 3 career gaps detected — click "Frame Gaps" for suggestions
🚀 PDF exported: Abdul_Nabi_Resume_Modern.pdf (142 KB)
```

---

## 🚀 Stretch Goals

- [ ] Add LinkedIn OAuth so users can import their profile without manual URL pasting
- [ ] Build a Chrome extension version that overlays the ATS scorer on any job posting page
- [ ] Add multi-language resume support (Arabic, French, German)
- [ ] Implement a Resume Version History with diff viewer (like GitHub for resumes)
- [ ] Train a custom fine-tuned model on 10,000 high-performing resumes for better rewrites
- [ ] Add a "Cold Email Generator" that writes a tailored outreach email alongside the resume
- [ ] Integrate with job boards (LinkedIn, Indeed) to apply directly from the app
