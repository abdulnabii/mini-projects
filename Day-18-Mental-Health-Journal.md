# Day 18 — AI Mental Health Journaling App

## 🗓️ Day: 18 of 30
## 🏷️ Category: Healthcare AI / Wellness Tech
## ⚡ Difficulty: Intermediate
## 🕐 Estimated Build Time: 6–8 hours

---

## 📌 Project Overview

A private, encrypted journaling app powered by AI emotional intelligence. Users write freely and the AI provides compassionate reflection, mood tracking, pattern recognition across entries, coping suggestions, and celebrates progress. Unlike therapy replacement apps, this focuses on self-awareness and emotional literacy — a daily mental wellness habit built on privacy-first principles.

All data is end-to-end encrypted client-side. The AI never stores conversation history. Entry analysis happens via a one-time API call and results are stored locally.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Free-Form Journaling | Rich text editor with calming aesthetic |
| Mood Detection | AI detects emotional tone from writing |
| Mood Timeline | Visual chart of emotional patterns over 30 days |
| AI Reflection | Empathetic, non-judgmental AI response to entries |
| Cognitive Pattern Alerts | Identifies recurring negative thought patterns |
| Coping Suggestions | CBT-based techniques matched to detected mood |
| Gratitude Prompts | Daily gratitude journaling with AI encouragement |
| Streak System | Journaling streak with gentle habit reminders |
| Privacy First | Client-side encryption; AI sees nothing stored |
| Export & Delete | Full data export + account deletion anytime |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tiptap (rich text editor), Framer Motion
- **AI**: Google Gemini 1.5 Pro
- **Encryption**: Web Crypto API (AES-256-GCM client-side)
- **Database**: Supabase (encrypted blobs only)
- **Auth**: Supabase Auth
- **Charts**: Recharts
- **Deployment**: Vercel

---

## 🔧 Key Functions

### `analyzeEntry(text: string): Promise<MoodAnalysis>`
Sends journal entry text to Gemini with a mental wellness system prompt. Returns detected primary emotion, secondary emotions, sentiment score (-1 to 1), cognitive patterns detected, and empathetic reflection text.

### `encryptEntry(text: string, userKey: CryptoKey): Promise<EncryptedBlob>`
Uses Web Crypto API with AES-256-GCM to encrypt the journal entry client-side before any network transmission. The encryption key is derived from the user's password using PBKDF2.

### `detectCognitivePatterns(entries: Entry[]): Pattern[]`
Analyzes last 30 entries to identify recurring cognitive distortion patterns (catastrophizing, black-and-white thinking, personalization) with frequency and trend data.

### `generateMoodTimeline(entries: Entry[]): MoodDataPoint[]`
Processes encrypted local entries to build a 30-day mood score timeline for visualization in Recharts, with annotations for notable events.

### `getCopingSuggestion(mood: Mood, context: string): Promise<CopingPlan>`
Returns 3 evidence-based CBT coping techniques most appropriate for the detected mood and entry context, with step-by-step instructions.

---

## 📁 File Structure

```
mental-journal/
├── app/
│   ├── page.tsx              # Landing + onboarding
│   ├── journal/page.tsx      # Today's journal entry
│   ├── timeline/page.tsx     # Mood timeline chart
│   ├── insights/page.tsx     # Pattern analysis
│   └── api/analyze/route.ts  # AI analysis endpoint
├── components/
│   ├── JournalEditor.tsx     # Tiptap rich editor
│   ├── MoodTimeline.tsx      # Recharts mood chart
│   ├── AIReflection.tsx      # Empathetic response card
│   ├── CopingCard.tsx        # Coping technique cards
│   └── StreakCounter.tsx     # Habit streak display
└── lib/
    ├── crypto.ts             # Client-side encryption
    ├── gemini.ts
    └── pattern-detect.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are a compassionate, trauma-informed AI journaling companion trained in 
Cognitive Behavioral Therapy (CBT) principles. You help users develop emotional 
self-awareness, NOT replace professional mental health care.

Rules:
1. Never diagnose or suggest clinical conditions
2. Always validate feelings before offering perspective
3. Ask one gentle reflective question to encourage depth
4. Suggest only evidence-based CBT coping techniques
5. If crisis language detected (self-harm, hopelessness), provide crisis resources

Output JSON only:
{
  "primaryEmotion": "anxious",
  "secondaryEmotions": ["overwhelmed", "uncertain"],
  "sentimentScore": -0.62,
  "reflection": "Empathetic 2-3 sentence response acknowledging feelings",
  "gentleQuestion": "One soft question to encourage reflection",
  "cognitivePatterns": ["catastrophizing", "overgeneralization"],
  "copingSuggestions": [
    { "technique": "Box Breathing", "description": "...", "steps": ["..."] }
  ],
  "affirmation": "One specific, genuine encouragement based on the entry",
  "crisisFlag": false
}

JOURNAL ENTRY: {text}
```

---

## 📤 Expected Output (Result)

```json
{
  "primaryEmotion": "anxious",
  "secondaryEmotions": ["overwhelmed", "self-doubting"],
  "sentimentScore": -0.58,
  "reflection": "It sounds like you're carrying a lot right now, and that weight is real. Feeling overwhelmed when multiple things pile up doesn't mean you're failing — it means you're human. Your awareness of what you're feeling is already an act of courage.",
  "gentleQuestion": "Is there one thing on your list that, if completed, would make everything else feel more manageable?",
  "cognitivePatterns": ["catastrophizing", "all-or-nothing thinking"],
  "copingSuggestions": [
    {
      "technique": "5-4-3-2-1 Grounding",
      "description": "Brings you back to the present moment when anxiety spirals",
      "steps": [
        "Name 5 things you can see right now",
        "Name 4 things you can physically feel",
        "Name 3 things you can hear",
        "Name 2 things you can smell",
        "Name 1 thing you can taste"
      ]
    },
    {
      "technique": "Task Chunking",
      "description": "Break overwhelming tasks into 15-minute micro-sessions",
      "steps": ["List all pending tasks", "Pick the smallest one", "Set a 15-min timer and start only that"]
    }
  ],
  "affirmation": "You showed up to write today even when things felt heavy. That's not small — that's strength.",
  "crisisFlag": false
}
```

**UI Display:**
```
Today's Reflection
────────────────────────────────
😔 Mood: Anxious · Overwhelmed

💬 AI Reflection:
"It sounds like you're carrying a lot right now, and 
 that weight is real..."

🤔 Something to consider:
"Is there one thing on your list that, if completed,
 would make everything else feel more manageable?"

🛠️ Suggested Coping:
  • 5-4-3-2-1 Grounding Exercise
  • Task Chunking — 15-minute focus sessions

✨ "You showed up to write today even when things felt heavy."

[Save Entry 🔒] [View Mood Timeline] [Try Grounding Exercise]
```

---

## 🚀 Stretch Goals

- [ ] Weekly AI-generated insights report emailed to user
- [ ] Mood correlation with weather/sleep (user-optional data)
- [ ] Integration with Apple Health / Google Fit
- [ ] Therapist sharing mode (export summary for sessions)
- [ ] Guided meditation audio tied to detected mood
