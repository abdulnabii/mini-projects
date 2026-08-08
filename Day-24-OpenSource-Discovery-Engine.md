# Day 24 — Open Source Project Discovery Engine

## 🗓️ Day: 24 of 30
## 🏷️ Category: Developer Tools / GitHub API
## ⚡ Difficulty: Intermediate
## 🕐 Estimated Build Time: 5–7 hours

---

## 📌 Project Overview

A beautiful discovery engine for finding the perfect open-source projects to contribute to. Goes far beyond GitHub's basic search by filtering for beginner-friendly issues, matching your skill stack, measuring project health (activity level, maintainer responsiveness, documentation quality), and using AI to summarize what the project does and exactly how to make your first contribution. It's like a dating app for developers and open-source projects.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Skill-Based Matching | Filter by your exact tech stack |
| Contribution Difficulty | Filter: First Timer / Beginner / Intermediate |
| Project Health Score | Activity, responsiveness, documentation rating |
| AI Project Summary | 2-sentence plain English project explanation |
| First Contribution Guide | AI generates step-by-step first PR guide |
| Issue Queue | Browse open "good first issue" labeled issues |
| Maintainer Response Time | Average days to review PRs |
| Star Velocity | Trending calculation (stars gained this month) |
| Bookmark & Track | Save projects to your contribution list |
| Daily Discovery | Fresh curated project recommendations daily |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion
- **Data Source**: GitHub REST API v3 + GraphQL API v4
- **AI**: Google Gemini 1.5 Flash (fast summaries)
- **Caching**: Redis (Upstash) for API rate limit management
- **Database**: Supabase (bookmarks, user preferences)
- **Auth**: GitHub OAuth (reads user's repos for skill detection)
- **Deployment**: Vercel

---

## 🔧 Key Functions

### `discoverProjects(skills: string[], difficulty: Difficulty, language: string): Promise<Project[]>`
Queries GitHub Search API with constructed boolean query, enriches results with GraphQL for metrics (PR response time, issue close rate, last commit date), then scores and sorts by fit.

### `calculateProjectHealthScore(project: GitHubProject): HealthScore`
Computes composite health score from: days since last commit (max 30 days = 100%), open issue response time, PR acceptance rate, documentation completeness, and community size.

### `generateAIProjectSummary(readme: string, description: string): Promise<string>`
Sends project README (first 2000 chars) to Gemini Flash for a 2-sentence beginner-friendly plain English summary — stripping technical jargon.

### `generateFirstContributionGuide(project: Project, userSkills: string[]): Promise<ContributionGuide>`
Creates a personalized step-by-step guide for making the first PR: how to set up locally, which issue to pick first, coding conventions to follow, and PR description template.

### `detectUserSkillsFromGitHub(username: string): Promise<string[]>`
Uses GitHub GraphQL API to analyze user's top repositories by language and topic tags. Extracts technology skills ranked by frequency and recency of use.

---

## 📁 File Structure

```
opensource-discovery/
├── app/
│   ├── page.tsx              # Discovery feed
│   ├── project/[owner]/[repo]/
│   │   └── page.tsx          # Project detail + guide
│   ├── bookmarks/page.tsx    # Saved projects
│   └── api/
│       ├── discover/route.ts  # Project search
│       ├── summary/route.ts   # AI summary
│       └── guide/route.ts     # Contribution guide
├── components/
│   ├── ProjectCard.tsx       # Discovery card
│   ├── HealthBadge.tsx       # Health score badge
│   ├── SkillFilter.tsx       # Multi-select skill filter
│   ├── ContributionGuide.tsx # Step-by-step guide
│   └── IssueList.tsx         # Open issues list
└── lib/
    ├── github.ts             # GitHub API client
    ├── health-score.ts
    └── gemini.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are a developer advocate helping beginners make their first open-source contribution.

Given this GitHub project README and user's tech skills, create:
1. A 2-sentence plain English summary of what the project does
2. A specific first contribution guide tailored to their skills

Output JSON only:
{
  "summary": "Two sentences explaining what this project does in plain English",
  "guide": {
    "setupSteps": ["git clone ...", "npm install", "..."],
    "recommendedFirstIssue": "Look for issues labeled 'good first issue' tagged with {skill}",
    "codingConventions": ["Uses TypeScript strict mode", "..."],
    "prTemplate": "Markdown PR description template",
    "estimatedTime": "2-4 hours for first contribution"
  }
}

README: {readme}
USER SKILLS: {skills}
```

---

## 📤 Expected Output (Result)

```json
{
  "projectName": "shadcn/ui",
  "healthScore": 96,
  "summary": "A collection of beautifully designed, accessible React components that you copy-paste directly into your project — not a traditional component library you install as a dependency. Built with Radix UI and Tailwind CSS, it gives you full control over component code.",
  "guide": {
    "setupSteps": [
      "Fork the repository on GitHub",
      "git clone https://github.com/YOUR_USERNAME/ui.git",
      "cd ui && pnpm install",
      "pnpm run dev — opens docs site locally at localhost:3000"
    ],
    "recommendedFirstIssue": "Look for issues labeled 'good first issue' — documentation improvements, typo fixes, or adding missing Tailwind variants to existing components are great starting points given your TypeScript/React skills",
    "codingConventions": [
      "TypeScript strict mode throughout",
      "Uses pnpm (not npm/yarn)",
      "Components follow Radix UI primitive patterns",
      "Tailwind CSS for all styling — no custom CSS"
    ],
    "prTemplate": "## Changes\n\nCloses #[issue-number]\n\n## What Changed\n- [Describe your change]\n\n## Testing\n- [ ] Tested in latest Chrome\n- [ ] Checked accessibility",
    "estimatedTime": "1-3 hours for a documentation or minor UI fix"
  }
}
```

**UI Display:**
```
🔍 Open Source Discovery

Your Skills: React · TypeScript · Next.js · Tailwind

⭐ Top Match (96% fit):
────────────────────────────────
shadcn/ui  ⭐ 78,400 stars  📈 +4,200 this month

Health Score: 96/100 🟢 Excellent
  Last commit: 2 days ago
  PR response: avg 3 days
  Good first issues: 12 open

"A collection of beautifully designed React components 
 you copy-paste into your project. Uses Radix + Tailwind."

[View First Contribution Guide →] [Browse Issues] [Bookmark 🔖]
```

---

## 🚀 Stretch Goals

- [ ] Weekly newsletter with new matching projects
- [ ] Contribution tracker (log your merged PRs)
- [ ] Mentorship matching with project maintainers
- [ ] Browser extension for instant project health overlay on GitHub
