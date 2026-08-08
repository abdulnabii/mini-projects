# Day 17 — Smart Job Application Tracker

## 🗓️ Day: 17 of 30
## 🏷️ Category: Productivity / Full-Stack Web App
## ⚡ Difficulty: Intermediate
## 🕐 Estimated Build Time: 6–8 hours

---

## 📌 Project Overview

A Kanban-style job application tracker that goes far beyond a simple spreadsheet. Users drag applications through pipeline stages (Wishlist → Applied → Phone Screen → Technical → Final Round → Offer → Rejected). AI analyzes each job description and matches it against your resume, showing a fit score, missing skills, and tailored cover letter suggestions. Built-in follow-up email reminders and interview scheduler integration.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Kanban Board | Drag-and-drop pipeline across 7 stages |
| AI Job-Resume Match | Upload resume + paste JD to get match % |
| Skill Gap Analyzer | Lists skills you have vs skills required |
| Cover Letter AI | Auto-generates tailored cover letter |
| Follow-up Reminders | Smart email reminders at optimal times |
| Interview Scheduler | Calendar integration with prep checklist |
| Salary Insights | Market salary data from Glassdoor/LinkedIn |
| Analytics Dashboard | Application funnel conversion rates |
| Chrome Extension | One-click save from LinkedIn/Indeed |
| Export to CSV | Full application history export |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, @dnd-kit (drag-and-drop), Tailwind CSS
- **AI**: Google Gemini 1.5 Pro
- **Database**: Supabase (PostgreSQL + Row Level Security)
- **Auth**: Supabase Auth (Google OAuth)
- **Calendar**: Google Calendar API
- **Email**: Resend API
- **Deployment**: Vercel

---

## 🔧 Key Functions

### `matchJobToResume(jobDescription: string, resumeText: string): Promise<MatchResult>`
Uses Gemini to compare job requirements against resume content. Returns percentage match, matched skills array, missing skills array, and suggested additions.

### `generateCoverLetter(job: Job, resume: Resume, tone: Tone): Promise<string>`
Creates a personalized cover letter using job title, company, requirements, and candidate's background. Tone options: Professional, Enthusiastic, Creative.

### `moveApplication(appId: string, fromStage: Stage, toStage: Stage): Promise<void>`
Handles Kanban card drag-and-drop state update with optimistic UI, Supabase persistence, and auto-creates follow-up task if moved to certain stages.

### `scheduleFollowUp(application: Application, delayDays: number): Promise<void>`
Creates a follow-up reminder via Resend email or push notification based on application stage and last-contact date.

### `calculateFunnelMetrics(applications: Application[]): FunnelMetrics`
Computes stage-by-stage conversion rates, average time-in-stage, response rate by company size/industry, and overall job search health score.

---

## 📁 File Structure

```
job-tracker/
├── app/
│   ├── page.tsx              # Landing / Auth
│   ├── board/page.tsx        # Main Kanban board
│   ├── analytics/page.tsx    # Funnel analytics
│   ├── resume/page.tsx       # Resume manager
│   └── api/
│       ├── match/route.ts    # Job-resume matching
│       └── cover/route.ts    # Cover letter gen
├── components/
│   ├── KanbanBoard.tsx
│   ├── ApplicationCard.tsx
│   ├── MatchScorePanel.tsx
│   ├── CoverLetterModal.tsx
│   └── FunnelChart.tsx
└── lib/
    ├── supabase.ts
    ├── gemini.ts
    └── email.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are an expert career coach and resume analyst. Compare the job description and resume 
and return a detailed match analysis.

Output JSON only:
{
  "matchScore": 78,
  "verdict": "Strong match — apply with minor tweaks",
  "matchedSkills": ["React", "Node.js", "PostgreSQL", "REST APIs"],
  "missingSkills": ["GraphQL", "AWS Lambda", "Docker"],
  "resumeStrengths": ["Strong project portfolio", "Relevant domain experience"],
  "gapRecommendations": [
    "Add one AWS project to your portfolio",
    "Mention any GraphQL exposure even if minor"
  ],
  "tailoredSummary": "Suggested 2-sentence resume summary optimized for this role"
}

JOB DESCRIPTION: {jobDescription}
RESUME: {resumeText}
```

---

## 📤 Expected Output (Result)

```json
{
  "matchScore": 78,
  "verdict": "Strong match — apply confidently with 2 minor tweaks",
  "matchedSkills": ["React", "Next.js", "Node.js", "PostgreSQL", "REST APIs", "TypeScript", "Git"],
  "missingSkills": ["GraphQL", "AWS Lambda", "Docker", "Kubernetes"],
  "resumeStrengths": [
    "4 relevant production projects",
    "Healthcare AI experience matches their domain",
    "Strong TypeScript proficiency"
  ],
  "gapRecommendations": [
    "Add 'Basic Docker containerization' to your skills — even course exposure counts",
    "One sentence mentioning AWS (even free-tier project) significantly boosts match",
    "Reframe 'Blood Sugar Tracker' to emphasize the ML pipeline — that's a standout"
  ],
  "tailoredSummary": "Full-stack developer with 2+ years building AI-integrated healthcare web applications using React, Next.js, and Node.js. Experienced in shipping production-grade TypeScript applications with PostgreSQL backends and clean REST API design."
}
```

**UI Display:**
```
📊 Job Match Analysis
────────────────────────────────
Match Score: 78% ✅ Strong Match

✅ You Have (7 skills):
  React, Next.js, Node.js, PostgreSQL,
  REST APIs, TypeScript, Git

❌ You're Missing (4 skills):
  GraphQL, AWS Lambda, Docker, Kubernetes

💡 Quick Wins:
  • Mention any AWS free-tier project
  • Add Docker to skills if you've used it even once

[Generate Cover Letter] [Edit Resume Bullets] [Apply Now →]
```

---

## 🚀 Stretch Goals

- [ ] Chrome extension to one-click save from LinkedIn
- [ ] AI interview question predictor based on job description
- [ ] Salary negotiation script generator
- [ ] Job offer comparison calculator (salary, equity, benefits)
