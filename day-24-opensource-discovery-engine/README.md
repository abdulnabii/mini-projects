# GitMatch.AI — Open Source Project Discovery & AI First-Contribution Matchmaker

> **Day 24 of 30 Mini Projects**  
> AI-powered discovery engine and matchmaker for finding high-impact open-source repositories calibrated to your tech skills. Features repository health scoring (0–100), automated GitHub profile skill detection, and personalized first PR contribution blueprints with Gemini 1.5 Flash.

---

## 🌟 Key Features

1. **⚡ Skill-Based Matching Matrix**:
   - Multi-select tech stack filter chips (*React*, *TypeScript*, *Next.js*, *Tailwind CSS*, *Python*, *Rust*, *Go*, *FastAPI*, *AI / LLM*, *Node.js*, *Docker*, *GraphQL*).
   - Difficulty target selector (*First-Timer Friendly*, *Beginner*, *Intermediate*, *Advanced*).
   - Real-time Match Fit % scoring based on your active skills.

2. **📊 Composite Project Health Score (0–100 Gauge)**:
   - Evaluates commit recency, average PR review latency (e.g. ~2.1 days), PR acceptance rates (88%+), and documentation completeness.

3. **🤖 Gemini 1.5 Flash Plain-English Summaries & First PR Blueprints**:
   - 2-Sentence plain English explanation of what the repository does (stripping away jargon).
   - Step-by-step first contribution roadmap: Local dev setup bash commands, recommended starting issues tailored to your skills, coding conventions checklist, and copy-paste ready GitHub PR Markdown template!

4. **🔍 Auto-Detect Skills from GitHub Profile**:
   - Enter any GitHub username (e.g., `abdulnabii`) to scan public repositories and automatically detect your tech stack!

5. **🔖 Personal PR Contribution Pipeline (`/bookmarks`)**:
   - Kanban-style progress tracker: *1. Targeted / Saved*, *2. Forked & In Progress*, *3. PR Submitted*, *4. Merged! 🎉* with celebration confetti.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack) with App Router
- **Styling**: Tailwind CSS, Lucide React, Framer Motion
- **AI Engine**: Google Gemini 1.5 Flash
- **Data Source**: GitHub REST API v3
- **Language**: TypeScript

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/abdulnabii/mini-projects.git
cd mini-projects/day-24-opensource-discovery-engine

# Install dependencies
npm install

# Set environment variables (.env.local)
GEMINI_API_KEY=your_gemini_api_key_here

# Run development server
npm run dev
```

---

## 👨‍💻 Author
Built with ❤️ by **[Abdul Nabi](https://github.com/abdulnabii)**
