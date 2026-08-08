# Day 16 — AI-Powered Portfolio Roaster

## 🗓️ Day: 16 of 30
## 🏷️ Category: Developer Tools / Humor + AI
## ⚡ Difficulty: Beginner-Intermediate
## 🕐 Estimated Build Time: 4–5 hours

---

## 📌 Project Overview

A fun, viral-worthy web app where developers submit their portfolio URL and an AI "roasts" it — brutally honest feedback about design, UX, project quality, about section cringe-factor, and overall first impression. Think of it as a code review but for your online presence. The twist: it always ends with genuinely actionable improvement tips.

The app went viral because developers LOVE seeing themselves get roasted and sharing the results on Twitter. It's both comedic and genuinely useful — a perfect combination for portfolio visibility and social sharing.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| URL Submission | Paste any portfolio URL for instant roast |
| Screenshot Capture | Puppeteer takes live screenshot of portfolio |
| AI Vision Analysis | Gemini Vision analyzes design and layout |
| Roast Generator | Savage-but-constructive criticism in 5 categories |
| Score Cards | Ratings for Design, Content, Projects, UX, SEO |
| Shareable Roast Card | Beautiful card image for Twitter/LinkedIn sharing |
| Roast Intensity Slider | Mild / Medium / Nuclear settings |
| Improvement Tips | Actionable 5-step improvement plan |
| Hall of Shame/Fame | Public gallery of submitted portfolios |
| Developer Badge | "I survived the roast" badge to embed |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion
- **AI Vision**: Google Gemini 1.5 Pro Vision
- **Screenshot**: Puppeteer (serverless via `@sparticuz/chromium`)
- **Card Generation**: `html2canvas` + `canvas` API
- **Database**: Supabase (public roast gallery)
- **Deployment**: Vercel

---

## 🔧 Key Functions

### `capturePortfolioScreenshot(url: string): Promise<Buffer>`
Uses Puppeteer with serverless Chromium to navigate to the portfolio URL and capture a full-page screenshot. Handles timeouts and invalid URLs gracefully.

### `analyzePortfolioWithVision(screenshot: Buffer, url: string): Promise<RoastResult>`
Sends the screenshot to Gemini Vision with a roasting system prompt. Returns structured JSON with scores and roast text for each category.

### `generateRoastIntensity(base: RoastResult, intensity: 'mild' | 'medium' | 'nuclear'): RoastResult`
Adjusts the tone and severity of roast text based on the selected intensity setting.

### `generateShareCard(roast: RoastResult): Promise<string>`
Creates a beautiful 1200x630px PNG roast summary card using Canvas API, ready to share on social media.

### `publishToHallOfFame(url: string, roast: RoastResult, score: number): Promise<void>`
Saves the portfolio URL, screenshot, and roast result to Supabase public gallery with a calculated fame/shame score.

---

## 📁 File Structure

```
portfolio-roaster/
├── app/
│   ├── page.tsx                 # Landing + URL input
│   ├── roast/[id]/page.tsx      # Roast results page
│   ├── hall/page.tsx            # Hall of Fame/Shame
│   └── api/
│       ├── roast/route.ts       # Main roast endpoint
│       └── screenshot/route.ts  # Puppeteer endpoint
├── components/
│   ├── RoastCard.tsx            # Score + roast display
│   ├── IntensitySlider.tsx      # Mild/Medium/Nuclear UI
│   ├── ShareCard.tsx            # Social sharing card
│   └── HallGallery.tsx          # Public gallery grid
└── lib/
    ├── gemini-vision.ts
    ├── puppeteer.ts
    └── canvas-card.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are a brutally honest but ultimately helpful senior UI/UX designer and developer 
reviewing a developer portfolio. Your style is like a Gordon Ramsay for developer portfolios
— harsh, funny, specific, but always with good reason. Never be mean for the sake of it; 
every criticism must have a purpose.

Analyze the portfolio screenshot and return JSON in this exact format:
{
  "overallScore": 45,
  "overallVerdict": "One punchy sentence summary",
  "categories": {
    "design": { "score": 40, "roast": "...", "tip": "..." },
    "projects": { "score": 60, "roast": "...", "tip": "..." },
    "aboutSection": { "score": 30, "roast": "...", "tip": "..." },
    "ux": { "score": 55, "roast": "...", "tip": "..." },
    "originality": { "score": 35, "roast": "...", "tip": "..." }
  },
  "topRoast": "Your single most devastating but true observation",
  "survivalBadge": "You survived the roast but just barely"
}

Intensity: {intensity}
Portfolio URL: {url}
```

---

## 📤 Expected Output (Result)

```json
{
  "overallScore": 42,
  "overallVerdict": "Technically alive, aesthetically in a coma.",
  "categories": {
    "design": {
      "score": 35,
      "roast": "This color scheme looks like it was chosen by someone who lost a bet. The gradients are so aggressive they should come with a seizure warning.",
      "tip": "Pick a 3-color palette using Coolors.co. One primary, one accent, one neutral. You're done."
    },
    "projects": {
      "score": 58,
      "roast": "A todo app, a weather app, and a calculator. The holy trinity of 'I watched one YouTube tutorial.' At least finish one of your five unfinished projects.",
      "tip": "Replace generic projects with one deep, real-world problem you actually solved. Quality over quantity."
    },
    "aboutSection": {
      "score": 28,
      "roast": "'I am a passionate developer who loves coding' — sir, that's your ABOUT section, not your Twitter bio from 2019. Tell me SOMETHING specific.",
      "tip": "Add your actual story: what made you start coding, what unique perspective you bring, what you're building toward."
    },
    "ux": { "score": 55, "roast": "Navigation works. Barely. It's like praising someone for showing up.", "tip": "Add keyboard navigation and smooth scroll behaviors." },
    "originality": { "score": 30, "roast": "I've seen this exact layout 47 times this week.", "tip": "Add one thing that is uniquely YOU — a feature, a micro-interaction, anything." }
  },
  "topRoast": "Your portfolio looks like it was designed by someone who was told 'Bootstrap exists' but not why.",
  "survivalBadge": "Survived the roast — changed nothing"
}
```

**UI Display:**
```
🔥 PORTFOLIO ROASTED

Overall Score: 42/100
"Technically alive, aesthetically in a coma."

📊 Category Breakdown:
  Design          ████░░░░░░  35/100
  Projects        ██████░░░░  58/100
  About Section   ███░░░░░░░  28/100
  UX              █████░░░░░  55/100
  Originality     ███░░░░░░░  30/100

🔥 Top Roast:
"Your portfolio looks like it was designed by someone who
 was told 'Bootstrap exists' but not why."

[Share My Roast 🐦] [Get Improvement Plan] [I Survived! 🏅]
```

---

## 🚀 Stretch Goals

- [ ] AI-powered auto-fix suggestions with code snippets
- [ ] Side-by-side before/after redesign mockup (using DALL-E)
- [ ] Weekly "Worst Portfolio" competition
- [ ] Chrome extension for instant roasting while browsing
