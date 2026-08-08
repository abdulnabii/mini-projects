# Day 09 — GitHub Profile Analyzer

| Field | Details |
|---|---|
| **Day** | 09 |
| **Category** | Developer Tools / Data Visualization |
| **Difficulty** | Intermediate |
| **Estimated Build Time** | 6–8 hours |

---

## 📌 Project Overview

The GitHub Profile Analyzer transforms any public GitHub username into a stunning visual portfolio analysis — the kind that makes a developer stop scrolling and share immediately. Enter a username and within seconds the app fetches data from the GitHub GraphQL API, processes it through a series of analysis pipelines, and renders an impressive multi-panel dashboard: language proficiency radar chart, 52-week contribution heatmap, top repositories ranked by a proprietary impact score, collaboration network visualization, and an AI-generated developer persona summary.

The impact score algorithm goes far beyond star counts. It computes a composite metric from repository stars, forks, open issues, pull request activity, commit frequency, documentation quality (README length, has wiki), and the growth trajectory of stars over time. Repositories are ranked by this score and displayed as cards with visual sparklines showing star growth history. The collaboration graph shows which users the developer has co-authored commits with, rendered as an interactive force-directed network using D3.js.

The most shareable feature is the AI Developer Persona: GPT-4o analyzes language distribution, repository topics, commit message style, and contribution patterns to write a 3-sentence personality-style description of the developer — like a horoscope for coders. The result ("You architect systems that prioritize scale over speed, your commit style reveals a preference for atomic, well-reasoned changes...") is packaged into a beautiful shareable card that can be downloaded as a PNG or shared via a unique URL.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| **Language Proficiency Radar** | Radar chart of top 8 programming languages weighted by bytes of code written |
| **52-Week Contribution Heatmap** | GitHub-style contribution calendar with color intensity representing daily commit count |
| **Impact Score Rankings** | Repos ranked by composite impact score (stars, forks, activity, growth, docs quality) |
| **AI Developer Persona** | GPT-4o generates a personality-style 3-paragraph developer description |
| **Collaboration Graph** | D3.js force-directed network of co-contributors and co-authored repos |
| **Contribution Streak** | Current and longest streak tracking with record badge |
| **Repository Deep Dive** | Click any repo for details: commit frequency chart, top contributors, language breakdown |
| **Productivity Pattern Analysis** | Heatmap of contribution by hour and day of week (when does this dev code?) |
| **Shareable Profile Card** | Beautiful PNG card with key stats, persona, and QR code for sharing |
| **Comparison Mode** | Enter two GitHub usernames to generate a side-by-side developer comparison |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Charts:** Chart.js (radar, bar), D3.js (force graph, heatmap), react-calendar-heatmap
- **GitHub Data:** GitHub GraphQL API v4 (comprehensive profile + repo data)
- **AI Persona:** OpenAI GPT-4o (developer personality synthesis)
- **Card Generation:** `html2canvas` + `canvas` API (PNG card export)
- **Network Graph:** D3.js (`d3-force` simulation)
- **Caching:** Redis / Upstash (60-minute profile data cache)
- **Rate Limiting:** GitHub API authenticated requests (5000 req/hour)
- **State Management:** Zustand
- **Unique URLs:** Supabase (store generated profiles with shareable slug)
- **Deployment:** Vercel

---

## 🔧 Key Functions

### `fetchGitHubProfile(username: string): Promise<GitHubProfile>`
Executes a comprehensive GitHub GraphQL query fetching: user bio, company, location, follower/following counts, total contribution count, 52-week contribution calendar, pinned repositories, all public repositories (paginated), and organization memberships. Uses an authenticated GitHub token for higher rate limits. Normalizes the response into a typed `GitHubProfile` object. Checks Redis cache before hitting the API.

### `calculateImpactScores(repos: Repository[]): RankedRepository[]`
Applies a weighted scoring formula to each repository: `score = (stars × 1.0) + (forks × 1.5) + (openIssues × 0.3) + (recentCommits × 2.0) + (hasReadme × 50) + (starGrowthRate × 3.0)`. Normalizes scores to 0–100. Adds a `momentum` flag for repos gaining stars faster than their historical average. Returns the `repos` array sorted by `impactScore` descending with scores attached.

### `buildCollaborationGraph(username: string, repos: Repository[]): CollaborationGraph`
Fetches contributor lists for the top 10 repositories via the GitHub REST API. Deduplicates contributors, builds an adjacency list mapping the target user to each co-contributor. Identifies "power collaborators" (appear in 3+ repos). Returns a `CollaborationGraph` with `nodes` (user objects with avatar, username) and `edges` (pairs with `sharedRepos` count as edge weight) for D3.js rendering.

### `generateDeveloperPersona(profile: GitHubProfile, rankedRepos: RankedRepository[]): Promise<DeveloperPersona>`
Constructs a rich context object: top languages by percentage, most-starred repo topics, commit message vocabulary sample (first words of last 50 commits), contribution pattern (night owl / early bird / weekend warrior), primary domains (web, systems, ML, mobile). Sends to GPT-4o with a prompt to write a 3-paragraph developer persona in the style of a thoughtful engineering blog introduction. Returns `DeveloperPersona` with `summary`, `traits[]`, `archetype`, and `funFact`.

### `renderShareableCard(profile: GitHubProfile, persona: DeveloperPersona): Promise<Blob>`
Uses `html2canvas` to capture a specially designed off-screen card component populated with the user's avatar, name, top stats (repos, stars, commits, streak), top 3 languages as colored pills, persona excerpt, and a QR code pointing to the shareable profile URL. Renders at 2x resolution (1200×630px) for crisp sharing. Returns a PNG `Blob` for download.

---

## 📁 File Structure

```
github-profile-analyzer/
├── app/
│   ├── page.tsx                    # Username input landing
│   ├── [username]/page.tsx         # Full analysis dashboard
│   ├── compare/page.tsx            # Side-by-side comparison
│   ├── card/[username]/page.tsx    # Shareable card page
│   └── api/
│       ├── profile/route.ts        # GET: Full profile fetch
│       ├── persona/route.ts        # POST: GPT-4o persona
│       ├── collaborators/route.ts  # GET: Co-contributor graph
│       └── card/route.ts           # POST: Card generation
├── components/
│   ├── analysis/
│   │   ├── LanguageRadar.tsx       # Chart.js radar chart
│   │   ├── ContributionHeatmap.tsx # 52-week calendar heatmap
│   │   ├── ImpactScoreList.tsx     # Ranked repo cards
│   │   ├── CollaborationGraph.tsx  # D3.js force network
│   │   ├── ProductivityPattern.tsx # Hour/day heatmap
│   │   └── StreakBadge.tsx         # Contribution streak display
│   ├── persona/
│   │   ├── PersonaCard.tsx         # AI persona display
│   │   └── TraitBadges.tsx         # Personality trait pills
│   ├── share/
│   │   ├── ShareableCard.tsx       # PNG-exportable card
│   │   └── ShareButtons.tsx        # Twitter, LinkedIn, copy link
│   ├── repo/
│   │   ├── RepoCard.tsx            # Repository summary card
│   │   └── RepoDetailModal.tsx     # Deep-dive modal
│   └── ui/
├── lib/
│   ├── github/
│   │   ├── graphql.ts              # GraphQL query client
│   │   ├── queries.ts              # GQL query strings
│   │   └── rest.ts                 # REST API calls
│   ├── analysis/
│   │   ├── impactScore.ts
│   │   ├── collaborationGraph.ts
│   │   └── productivityPattern.ts
│   ├── openai.ts
│   ├── redis.ts                    # Cache client
│   └── zustand/profileStore.ts
├── types/github.ts
└── package.json
```

---

## 💡 AI Prompt Used

```
SYSTEM:
You are a senior engineering talent analyst who writes insightful, specific, and 
entertaining developer personality profiles. Your writing is warm, clever, and reads 
like a great LinkedIn recommendation crossed with a Myers-Briggs profile for engineers. 
You draw conclusions from concrete data — language choices, commit patterns, project 
domains — never from names or photos.

Write a 3-paragraph profile:
1. Developer archetype and primary coding personality
2. Technical strengths inferred from their portfolio
3. A fun, specific "fun fact" about their coding behavior

Keep total length under 150 words. Make it shareable and worth screenshotting.

USER:
Developer data:
- Username: abdulnabi-dev
- Top languages: TypeScript (41%), Python (28%), Go (12%), CSS (11%), Shell (8%)
- Repository topics: ["machine-learning", "healthcare", "next.js", "fastapi", "docker", "cli-tools"]
- Contribution pattern: 73% of commits between 10pm–2am (night owl)
- Top repo: "medical-diagnosis-ai" (847 stars, 124 forks)
- Commit style analysis: Commits average 8 words, consistently start with verbs (Fix, Add, Refactor, Build)
- Streak: 127 days current, 143 days longest
- Co-contributors: 34 unique collaborators across 8 repos
```

---

## 📤 Expected Output (Result)

**Developer Persona (JSON):**
```json
{
  "archetype": "The Midnight Architect",
  "summary": "You're a TypeScript-first polyglot who moonlights in Python when the ML gets serious. Your commit history reads like a product roadmap — verb-led, purposeful, and disturbingly organized for someone who codes past midnight. The 127-day streak isn't discipline; it's addiction.",
  "traits": ["Systems Thinker", "Healthcare Technologist", "Night Owl", "Clean Committer", "Serial Collaborator"],
  "funFact": "You've contributed code between 10pm and 2am for 73% of your commits — your best architecture decisions happen when the rest of the world is asleep.",
  "technicalStrength": "Full-stack AI engineering with particular depth in healthcare ML pipelines and TypeScript backend systems."
}
```

**Impact Score Rankings (JSON sample):**
```json
{
  "rankedRepos": [
    {
      "name": "medical-diagnosis-ai",
      "impactScore": 94,
      "stars": 847,
      "forks": 124,
      "momentum": "rising",
      "topics": ["machine-learning", "healthcare", "tensorflow"],
      "starGrowthRate": 12.4
    },
    {
      "name": "nextjs-ai-starter",
      "impactScore": 78,
      "stars": 312,
      "forks": 58,
      "momentum": "stable",
      "topics": ["next.js", "ai", "boilerplate"],
      "starGrowthRate": 4.2
    }
  ]
}
```

**UI Display:**
```
👤 abdulnabi-dev  |  The Midnight Architect  |  127🔥 day streak

📊 Language DNA:
   TypeScript  ████████████████░░░░  41%
   Python      ███████████░░░░░░░░░  28%
   Go          █████░░░░░░░░░░░░░░░  12%

🏆 Top Repositories by Impact:
   1. medical-diagnosis-ai     ★847  ⑂124  Score: 94/100  🚀 Rising
   2. nextjs-ai-starter        ★312  ⑂58   Score: 78/100  ➡ Stable

🤝 34 unique collaborators across 8 repos
🌙 Night owl — 73% of commits between 10pm–2am

📤 Shareable card generated — download PNG or copy link
```

---

## 🚀 Stretch Goals

- [ ] Add GitLab and Bitbucket support for non-GitHub developers
- [ ] Build a "Developer Growth Report" showing how the profile has evolved year over year
- [ ] Implement semantic similarity to find GitHub users with similar portfolios
- [ ] Add a "Hire Me" score — a recruiter-friendly assessment of portfolio quality
- [ ] Create an embeddable widget (iframe or script tag) for portfolio sites
- [ ] Add a public leaderboard of top developers by impact score in each language
- [ ] Build a VS Code extension that shows the persona card on hover of any GitHub username
