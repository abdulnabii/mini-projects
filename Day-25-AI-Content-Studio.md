# Day 25 — AI Tweet & LinkedIn Content Studio

## 🗓️ Day: 25 of 30
## 🏷️ Category: Social Media AI / Content Creation
## ⚡ Difficulty: Beginner-Intermediate
## 🕐 Estimated Build Time: 4–6 hours

---

## 📌 Project Overview

A content creation studio for developers and tech professionals to generate, optimize, and schedule viral Twitter threads and LinkedIn posts. Input your raw idea, project update, or technical concept and the AI generates platform-optimized content in your voice — complete with hooks, emojis, hashtags, and optimal posting time recommendations. Includes an A/B variant generator and predicted engagement score.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Idea-to-Thread Generator | Raw idea → full 10-tweet thread with hooks |
| LinkedIn Post Generator | Professional long-form post generator |
| Voice Calibration | Learns your writing style from sample posts |
| Hook Generator | 5 alternative opening hook variations |
| Hashtag Optimizer | AI-selected hashtags by relevance + volume |
| Engagement Score | Predicted engagement based on pattern analysis |
| A/B Variant Generator | 3 versions: Educational / Storytelling / Provocative |
| Posting Time Optimizer | Best time to post for your audience timezone |
| Carousel Creator | LinkedIn carousel slide content generator |
| Analytics Tracker | Track which generated posts perform best |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion
- **AI**: Google Gemini 1.5 Pro
- **Auth**: Clerk (Twitter/LinkedIn OAuth)
- **Database**: Supabase (post history, analytics)
- **Scheduling**: Cron via Vercel (scheduled posting)
- **Twitter API**: Twitter API v2 (post scheduling)
- **Deployment**: Vercel

---

## 🔧 Key Functions

### `generateTwitterThread(idea: string, style: Style, userVoice?: string): Promise<Tweet[]>`
Creates a complete 8–15 tweet thread with a powerful hook tweet, educational middle tweets with spacing and formatting, engagement tweet (poll/question), and a clear CTA closer. Adapts to user's voice if sample provided.

### `generateLinkedInPost(topic: string, format: 'story' | 'list' | 'insight', userRole: string): Promise<string>`
Generates a LinkedIn-optimized post with a scroll-stopping first line, structured body, and engagement-driving question at the end. Formats for LinkedIn's algorithm preferences.

### `generateHookVariants(mainTopic: string): Promise<Hook[]>`
Produces 5 distinct hook styles for the same content: Contrarian Take, Bold Statistic, Personal Story, Provocative Question, and Numbered List. Each with predicted CTR.

### `calculateEngagementScore(content: string, platform: Platform): Promise<EngagementPrediction>`
Analyzes content against viral patterns (hook strength, readability, emotional triggers, hashtag quality) and returns predicted engagement percentile and specific improvement tips.

### `calibrateUserVoice(samplePosts: string[]): Promise<VoiceProfile>`
Analyzes a user's past posts to extract writing style: average sentence length, use of emojis, tone (casual/formal/technical), common phrases, and structural patterns for future generation.

---

## 📁 File Structure

```
content-studio/
├── app/
│   ├── page.tsx              # Landing + quick create
│   ├── studio/page.tsx       # Main creation interface
│   ├── history/page.tsx      # Past generated posts
│   ├── analytics/page.tsx    # Performance tracking
│   └── api/
│       ├── thread/route.ts   # Twitter thread gen
│       ├── linkedin/route.ts # LinkedIn post gen
│       ├── hooks/route.ts    # Hook variations
│       └── score/route.ts    # Engagement scoring
├── components/
│   ├── ThreadPreview.tsx     # Tweet thread preview
│   ├── LinkedInPreview.tsx   # LinkedIn post preview
│   ├── HookSelector.tsx      # Hook variation picker
│   ├── EngagementMeter.tsx   # Predicted score gauge
│   └── VoiceCalibrator.tsx   # Voice training input
└── lib/
    ├── gemini.ts
    ├── twitter.ts
    └── voice-profile.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are a viral content strategist specializing in developer/tech Twitter and LinkedIn.
You write content that educates AND entertains, using proven viral formulas.

TWITTER THREAD RULES:
- Tweet 1: Hook that creates curiosity or makes a bold claim (max 200 chars)
- Tweets 2-8: One idea per tweet, concrete examples, numbered if educational
- Tweet 9: Engagement driver (question or poll)  
- Tweet 10: CTA + personal note
- Use double line breaks for readability
- Max 2 hashtags total (never mid-thread, only in last tweet)

Output JSON:
{
  "thread": [
    { "number": 1, "text": "Hook tweet text here", "type": "hook" },
    { "number": 2, "text": "...", "type": "content" }
  ],
  "hooks": [
    { "style": "Contrarian", "text": "Alternative hook 1", "predictedCTR": "4.2%" }
  ],
  "hashtags": ["#WebDev", "#ReactJS"],
  "postingTime": "Tuesday 9AM EST — peak dev Twitter activity",
  "engagementScore": 78
}

TOPIC: {topic}
USER VOICE: {voiceProfile}
```

---

## 📤 Expected Output (Result)

**Topic:** "I built an AI symptom checker in 6 hours with Gemini API"

```json
{
  "thread": [
    {
      "number": 1,
      "text": "I built an AI medical symptom checker in 6 hours.\n\nNo medical degree. No hospital partnership. Just Gemini API + Next.js.\n\nHere's exactly how it works (and why it matters):\n\n🧵 Thread",
      "type": "hook"
    },
    {
      "number": 2,
      "text": "The problem I was solving:\n\n87% of people Google their symptoms.\n\nGoogle gives you a list of diseases sorted by how terrifying they are.\n\nNobody needs more health anxiety.\n\nThey need triage.",
      "type": "content"
    },
    {
      "number": 8,
      "text": "The hardest part wasn't the AI.\n\nIt was writing prompts that make the AI ask ONE question at a time.\n\nMost symptom checkers overwhelm you with a 40-question form.\n\nConversational = 3x higher completion rate.",
      "type": "content"
    },
    {
      "number": 9,
      "text": "Would you use an AI triage tool before deciding whether to see a doctor?\n\n↓ Drop your answer below",
      "type": "engagement"
    },
    {
      "number": 10,
      "text": "If this was useful, follow me @abdulnabii — I'm building 30 projects in 30 days.\n\nNext up: a real-time code review bot.\n\nRT if you'd use this tool 🙏\n\n#BuildInPublic #AI",
      "type": "cta"
    }
  ],
  "engagementScore": 84,
  "postingTime": "Tuesday 9AM PKT / Tuesday 4AM EST"
}
```

**UI Display:**
```
✍️ Content Studio

Topic: "I built an AI symptom checker in 6 hours"
Platform: Twitter Thread

Preview:
────────────────────────────────
Tweet 1/10  [Hook]
"I built an AI medical symptom checker in 6 hours.
 No medical degree. No hospital partnership. Just
 Gemini API + Next.js.
 Here's exactly how it works: 🧵"

[◀ Prev] Tweet 2 of 10 [Next ▶]

Predicted Engagement: 84/100 🟢 High
Best Time to Post: Tuesday 9AM

[Copy Full Thread] [Schedule Post] [Generate 3 Variants]
```

---

## 🚀 Stretch Goals

- [ ] Auto-post to Twitter + LinkedIn simultaneously
- [ ] Analytics dashboard with real engagement vs prediction
- [ ] Instagram carousel content generator
- [ ] Newsletter edition generator from tweet threads
