# Day 15 — AI-Powered Blog SEO Optimizer

| Field | Details |
|---|---|
| **Day** | 15 |
| **Category** | AI / Developer Tools / SEO |
| **Difficulty** | Intermediate |
| **Estimated Build Time** | 7–9 hours |

---

## 📌 Project Overview

The AI-Powered Blog SEO Optimizer is a comprehensive content audit tool that transforms any blog post from guesswork into data-driven publishing. Paste any blog post URL or raw text and the system runs it through an 8-point SEO health check: keyword density analysis, Flesch-Kincaid readability scoring, meta description quality assessment, heading structure validation (H1→H2→H3 hierarchy), internal and external linking opportunity detection, estimated search ranking potential, and a content length benchmark against the top-ranking pages for the target keyword. Weak sections get an AI rewrite recommendation on demand.

The tool integrates with the Google Search Console API to pull real performance data — impressions, clicks, average position, and CTR — for blog posts that are already published. This allows the optimizer to compare what the AI recommends against what Google is actually reporting, closing the loop between optimization and real-world performance. For posts not yet in Search Console, the tool estimates ranking potential using a composite score derived from keyword difficulty, content depth metrics, and backlink profile context.

Built as a Next.js 14 full-stack application, the SEO analysis pipeline runs server-side for accuracy (JSDOM for HTML parsing, custom readability scoring) while the AI rewriting functionality streams GPT-4o responses directly to the browser for a fast, responsive user experience. The final output is a prioritized action plan: a numbered list of improvements ranked by estimated SEO impact, making it immediately actionable for content teams and solo bloggers alike.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| **Keyword Density Analyzer** | Measures primary and secondary keyword frequency across body text, headings, meta, and alt tags |
| **Flesch-Kincaid Readability** | Computes reading ease score and grade level with sentence and syllable analysis |
| **Meta Description Auditor** | Checks length (120–160 chars), keyword presence, click-appeal, and uniqueness |
| **Heading Structure Validator** | Validates H1–H3 hierarchy, detects skipped levels, missing H1, and keyword optimization |
| **Internal Linking Suggester** | AI identifies semantically related topics in the post for internal link opportunities |
| **Google Search Console Integration** | Fetches real impressions, CTR, and position data for published URLs |
| **Estimated Ranking Score** | Composite 0–100 score predicting search performance based on on-page signals |
| **AI Section Rewriter** | Click any paragraph to get an AI-optimized rewrite with better keyword placement |
| **Content Length Benchmark** | Compares post word count against typical word count for top-10 ranking pages |
| **Prioritized Action Plan** | Numbered improvement list ordered by estimated SEO impact with effort scores |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **HTML Parsing:** JSDOM (server-side blog post scraping and structure analysis)
- **Readability:** Custom Flesch-Kincaid implementation + `syllable` npm package
- **AI Rewriting:** OpenAI GPT-4o (streaming section rewrites, improvement suggestions)
- **Google Search Console:** `googleapis` npm package (Search Console API v1)
- **Keyword Analysis:** Custom TF-IDF implementation + `natural` npm NLP library
- **Content Fetching:** `axios` + `cheerio` (URL-based post scraping)
- **Charts:** Recharts (readability score gauge, keyword density bars, GSC trend lines)
- **Auth:** Clerk + Google OAuth (for Search Console API authorization)
- **Database:** Supabase (save audit results and track improvements over time)
- **Streaming:** OpenAI streaming API (real-time rewrite output)
- **Deployment:** Vercel (Edge Functions for fast global scraping)

---

## 🔧 Key Functions

### `auditBlogPost(input: AuditInput): Promise<SEOAudit>`
Accepts either a URL (scraped via `axios` + `cheerio`) or raw HTML/text. Runs the full 8-point audit pipeline sequentially: `parseStructure()` → `analyzeKeywords()` → `scoreReadability()` → `auditMeta()` → `validateHeadings()` → `detectLinkOpportunities()` → `benchmarkLength()` → `computeRankingScore()`. Aggregates all results into a single `SEOAudit` object with scores, findings, and recommendations for each audit point. Total processing time < 3 seconds for posts up to 5,000 words.

### `scoreReadability(text: string): ReadabilityResult`
Implements the Flesch Reading Ease formula: `206.835 - (1.015 × ASL) - (84.6 × ASW)` where ASL = Average Sentence Length (words) and ASW = Average Syllables per Word (using the `syllable` npm package for English syllable counting). Also computes Flesch-Kincaid Grade Level: `(0.39 × ASL) + (11.8 × ASW) - 15.59`. Classifies the ease score into human-readable labels (Very Easy / Easy / Standard / Difficult / Very Difficult). Returns `ReadabilityResult` with `fleschScore`, `gradeLevel`, `label`, `avgSentenceLength`, `avgSyllablesPerWord`, and `improvementTip`.

### `analyzeKeywordDensity(content: string, targetKeyword: string, secondaryKeywords: string[]): KeywordAnalysis`
Tokenizes the content using the `natural` library's WordTokenizer. Counts target keyword occurrences across: full body text, H1/H2/H3 headings, first 100 words (introduction), meta description, and image alt texts. Computes density percentage `(occurrences / totalWords) × 100`. Identifies over-optimization (density > 3%, triggers "keyword stuffing" warning) and under-optimization (density < 0.5%, triggers "thin optimization" warning). Also checks secondary keyword presence and proximity to target keyword.

### `fetchSearchConsoleData(siteUrl: string, pageUrl: string, dateRange: DateRange): Promise<GSCMetrics>`
Authenticates with the Google Search Console API using the user's OAuth token via `googleapis`. Queries the `searchanalytics.query` endpoint with `dimensions: ["query", "page"]` and a date range filter. Filters results to the specific `pageUrl` and extracts the top 10 driving queries with `clicks`, `impressions`, `ctr`, and `position`. Also fetches the 90-day trend for total clicks and impressions. Returns a `GSCMetrics` object with `topQueries[]`, `totalClicks`, `avgPosition`, `avgCTR`, and `trendData[]`.

### `rewriteSection(paragraph: string, targetKeyword: string, context: string, improvementGoal: string): AsyncGenerator<string>`
Streams a GPT-4o rewrite of the specified paragraph with precise instructions for the improvement goal (e.g., "improve keyword placement", "increase readability grade", "strengthen the opening hook", "add a specific statistic"). Includes the post's target keyword, surrounding context paragraphs, and the current readability score so the model calibrates complexity appropriately. Yields streaming text chunks for real-time display in the editor. Returns the complete rewritten paragraph as the final yield.

---

## 📁 File Structure

```
blog-seo-optimizer/
├── app/
│   ├── page.tsx                    # Input: URL or paste text
│   ├── audit/[auditId]/page.tsx    # Full audit results dashboard
│   ├── history/page.tsx            # Past audits + score trends
│   └── api/
│       ├── audit/route.ts          # POST: Run full SEO audit
│       ├── rewrite/route.ts        # POST: Stream section rewrite
│       ├── search-console/
│       │   ├── auth/route.ts       # GET: OAuth redirect
│       │   └── data/route.ts       # POST: Fetch GSC metrics
│       └── scrape/route.ts         # POST: URL content extraction
├── components/
│   ├── input/
│   │   ├── URLInput.tsx            # URL submission with validation
│   │   ├── TextPasteArea.tsx       # Raw text/HTML paste area
│   │   └── KeywordInput.tsx        # Target keyword specification
│   ├── audit/
│   │   ├── SEOScoreCard.tsx        # Overall score with grade
│   │   ├── ReadabilityGauge.tsx    # Flesch score visual gauge
│   │   ├── KeywordDensityBars.tsx  # Per-keyword density bars
│   │   ├── HeadingTreeView.tsx     # H1/H2/H3 hierarchy display
│   │   ├── MetaAuditCard.tsx       # Meta description analysis
│   │   ├── ActionPlanList.tsx      # Prioritized numbered list
│   │   └── LengthBenchmarkBar.tsx  # Word count vs. target
│   ├── gsc/
│   │   ├── GSCConnectButton.tsx    # OAuth connect flow
│   │   ├── QueryTable.tsx          # Top queries with CTR/position
│   │   └── PerformanceTrend.tsx    # 90-day clicks/impressions chart
│   ├── rewriter/
│   │   ├── ContentEditor.tsx       # Annotated post with click-to-rewrite
│   │   ├── RewritePanel.tsx        # Streaming rewrite output
│   │   └── DiffViewer.tsx          # Before/after diff view
│   └── ui/
├── lib/
│   ├── seo/
│   │   ├── readability.ts          # Flesch-Kincaid implementation
│   │   ├── keywordAnalysis.ts      # TF-IDF + density calculator
│   │   ├── headingValidator.ts     # H-tag structure checks
│   │   ├── metaAuditor.ts          # Meta description evaluation
│   │   ├── linkSuggester.ts        # Internal link opportunity finder
│   │   └── rankingScore.ts         # Composite ranking estimator
│   ├── scraper/
│   │   ├── urlScraper.ts           # axios + cheerio URL fetcher
│   │   └── htmlParser.ts           # JSDOM structure extractor
│   ├── gsc/
│   │   └── searchConsole.ts        # Google API client wrapper
│   ├── openai.ts
│   └── zustand/auditStore.ts
├── types/seo.ts
├── .env.local
└── package.json
```

---

## 💡 AI Prompt Used

```
SYSTEM:
You are an expert SEO content editor with 10 years of experience writing and optimizing 
blog content for technical topics. You write at a Flesch Reading Ease score of 60–70 
(standard / plain English). Your rewrites:
- Naturally incorporate the target keyword in the first 2 sentences if possible
- Use shorter sentences (avg < 20 words)
- Replace passive voice with active voice
- Add specific data points or examples where the original is vague
- Preserve the author's original voice and factual claims
- NEVER add facts that aren't in the original — only restructure and improve

Return the rewritten paragraph only. No commentary. No prefix like "Here is the rewrite:".

USER:
Target keyword: "machine learning in healthcare"
Improvement goal: "Improve readability (current grade: 14th grade, target: 10th grade) 
and strengthen keyword placement in opening sentence"
Current readability: Flesch 38.2 (Difficult)

Original paragraph:
"The utilization of machine learning methodologies within the context of contemporary 
healthcare delivery systems has demonstrated considerable potential for the augmentation 
of diagnostic accuracy across a multifaceted array of clinical applications, particularly 
in domains characterized by high-dimensional imaging data wherein pattern recognition 
capabilities of algorithmic systems exceed those achievable through conventional human 
interpretation frameworks."
```

---

## 📤 Expected Output (Result)

**Full SEO Audit (JSON):**
```json
{
  "auditId": "audit_a9f3c2",
  "url": "https://abdulnabi.dev/blog/ml-in-healthcare",
  "wordCount": 1847,
  "overallScore": 64,
  "grade": "C+",
  "breakdown": {
    "keywordDensity": {
      "score": 55,
      "targetKeyword": "machine learning in healthcare",
      "density": 0.8,
      "occurrences": 15,
      "status": "under-optimized",
      "recommendation": "Increase keyword appearances by 5–8 naturally in subheadings and conclusion"
    },
    "readability": {
      "score": 82,
      "fleschEase": 62.4,
      "gradeLevel": "9th grade",
      "label": "Standard",
      "avgSentenceLength": 18.2
    },
    "metaDescription": {
      "score": 45,
      "current": "This post covers machine learning in healthcare applications.",
      "length": 57,
      "status": "too_short",
      "recommendation": "Expand to 140–160 chars. Add benefit language and target keyword near the start."
    },
    "headingStructure": {
      "score": 70,
      "issues": ["H2 'Conclusion' has no keyword", "H3 level skipped after first H2"],
      "h1Count": 1,
      "h2Count": 4,
      "h3Count": 2
    },
    "contentLength": {
      "score": 60,
      "wordCount": 1847,
      "benchmarkForTopRanking": 2800,
      "gapWords": 953,
      "recommendation": "Add ~950 words covering clinical case studies and implementation challenges"
    }
  },
  "gscData": {
    "avgPosition": 14.3,
    "totalClicks30Days": 284,
    "avgCTR": 3.2,
    "topQuery": "ml applications in healthcare"
  },
  "actionPlan": [
    {"priority": 1, "action": "Rewrite meta description (57→155 chars with keyword)", "impact": "high", "effort": "low"},
    {"priority": 2, "action": "Add 950+ words: clinical case studies section", "impact": "high", "effort": "high"},
    {"priority": 3, "action": "Add target keyword to 3 H2 headings", "impact": "medium", "effort": "low"},
    {"priority": 4, "action": "Fix H3 hierarchy skip after second H2", "impact": "low", "effort": "low"}
  ]
}
```

**AI Section Rewrite Output:**
```
ORIGINAL (Flesch: 38.2 — Difficult):
"The utilization of machine learning methodologies within the context of contemporary 
healthcare delivery systems has demonstrated considerable potential..."

REWRITTEN (Flesch: 63.1 — Standard):
"Machine learning in healthcare is changing how doctors diagnose disease. AI models 
can now detect patterns in X-rays, MRI scans, and blood tests that human eyes miss. 
In some studies, these systems match or outperform experienced specialists. The result: 
faster diagnoses and fewer errors for patients who need answers quickly."

📊 Improvement:
   Readability:     38.2 → 63.1 (+24.9 points)
   Grade Level:     14th → 9th grade  
   Avg Sentence:    47 words → 16 words
   Keyword in opener: ✅ Present
```

---

## 🚀 Stretch Goals

- [ ] Add competitor analysis: scrape and compare the top 5 ranking pages for the target keyword
- [ ] Build a WordPress plugin version that audits and rewrites directly in the Gutenberg editor
- [ ] Add image SEO audit (alt text quality, file name, size optimization recommendations)
- [ ] Implement a content brief generator: before writing, generate an SEO-optimized outline
- [ ] Add schema markup generator (Article, FAQ, HowTo structured data for rich snippets)
- [ ] Build a content calendar that schedules posts based on keyword seasonality trends
- [ ] Integrate with Ahrefs/SEMrush API for real keyword difficulty and search volume data
