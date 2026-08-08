# Day 14 — Language Flashcard AI

| Field | Details |
|---|---|
| **Day** | 14 |
| **Category** | AI / EdTech |
| **Difficulty** | Intermediate |
| **Estimated Build Time** | 8–10 hours |

---

## 📌 Project Overview

The Language Flashcard AI is a scientifically-designed language learning application that combines the proven SM-2 (SuperMemo 2) spaced repetition algorithm with AI-powered card generation to create the most effective self-study tool possible. Unlike Duolingo's gamified skimming approach or Anki's manual card creation burden, this app generates high-quality, contextual flashcards automatically using GPT-4o: each card includes the target word, its native phonetic pronunciation guide, 2 example sentences in real conversational context, cultural notes where relevant, and a memory hook. The user simply picks a language and a topic, and the deck builds itself.

The spaced repetition engine is the scientific core of the application. The SM-2 algorithm calculates the optimal interval for each card review based on the user's recalled quality score (0–5). Cards answered correctly with high confidence are pushed further out in time; cards with low confidence are shown again sooner. This means users spend review time exactly where they need it most — a dramatic improvement over random review or simple list memorization. The algorithm state is persisted per card in Supabase, enabling consistent cross-device review scheduling.

Voice recognition brings pronunciation practice to life: after viewing a flashcard, the user can speak the word or phrase aloud and the Web Speech API captures and evaluates the pronunciation attempt against the target word using phoneme-level comparison. A gamification layer (streaks, XP points, level badges, and a weekly leaderboard) provides the motivational layer that keeps users coming back daily. Supported languages are Urdu, Arabic, French, Spanish, and Japanese — with particular care taken to handle RTL text rendering for Urdu and Arabic.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| **AI Flashcard Generation** | GPT-4o generates contextual flashcards with pronunciation, examples, and cultural notes |
| **SM-2 Spaced Repetition** | SuperMemo 2 algorithm schedules each card review at the scientifically optimal interval |
| **Voice Pronunciation Practice** | Web Speech API captures user pronunciation for comparison against target phonetics |
| **5 Language Support** | Urdu, Arabic, French, Spanish, Japanese — with RTL rendering for Urdu and Arabic |
| **Topic-Based Deck Generation** | Choose topic (Business, Food, Travel, Medical, Daily Life) for contextually relevant cards |
| **Cultural Context Notes** | Each card includes a cultural note explaining usage nuance and social context |
| **Gamification System** | Daily streaks, XP points, level badges, and a real-time weekly leaderboard |
| **Progress Analytics** | Retention rate charts, daily review stats, vocabulary growth tracker |
| **Review Queue Manager** | Smart daily review queue showing today's due cards ordered by urgency |
| **Offline Mode** | Cards and review state sync to device for offline review sessions |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **AI Card Generation:** OpenAI GPT-4o (card content + cultural notes)
- **Spaced Repetition:** Custom SM-2 TypeScript implementation
- **Voice Recognition:** Web Speech API (`SpeechRecognition`), Whisper API (fallback)
- **Text-to-Speech:** Web Speech Synthesis API (native pronunciation playback)
- **RTL Support:** `tailwind-rtl` plugin, `dir="rtl"` HTML attribute management
- **Charts:** Recharts (retention rate, review history, vocabulary growth)
- **Database:** Supabase (PostgreSQL — cards, SM-2 state, XP, streaks)
- **Auth:** Clerk (email, Google, Apple sign-in)
- **Offline Sync:** Service Worker + IndexedDB (`idb` library) for offline card caching
- **Leaderboard:** Supabase Realtime (live leaderboard updates)
- **Deployment:** Vercel + Supabase

---

## 🔧 Key Functions

### `generateFlashcardDeck(language: Language, topic: Topic, count: number): Promise<Flashcard[]>`
Constructs a detailed GPT-4o prompt specifying the target language, topic domain, B1 CEFR proficiency level, and required output structure per card. Requests `count` unique flashcards in a JSON array. Each card must include: `word` (target language), `phonetic` (IPA transcription), `translation` (English), `exampleSentences` (2 authentic sentences with English translations), `culturalNote` (1 sentence), `memoryHook` (vivid mnemonic), and `partOfSpeech`. Validates response schema and retries with temperature adjustment on parsing failure.

### `scheduleSM2Review(card: CardState, qualityScore: number): CardState`
Pure function implementing the SM-2 algorithm. `qualityScore` is 0–5 (0–2 = forgot, 3+ = recalled). If `qualityScore < 3`: resets `repetitions = 0`, `interval = 1` day, `easeFactor` unchanged. If `qualityScore >= 3`: `interval = 1` (first review), then `interval = 6` (second), then `interval = round(previousInterval × easeFactor)`. Updates `easeFactor = max(1.3, easeFactor + 0.1 - (5 - qualityScore) × 0.08)`. Sets `nextReviewDate = today + interval`. Returns the updated `CardState`.

### `evaluatePronunciation(spokenText: string, targetText: string, language: Language): PronunciationScore`
Normalizes both strings for the given language (lowercases, strips diacritics for comparison purposes while preserving them for display). Computes character-level edit distance (Levenshtein), phoneme overlap using a language-specific phoneme mapping table, and syllable count match. Combines into a `PronunciationScore` object with `score` (0–100), `phonemeAccuracy`, `syllableMatch`, `feedback` string ("Close! Focus on the 'r' sound — it's rolled in Spanish"), and `suggestedRetry` boolean.

### `computeDailyReviewQueue(userId: string): Promise<ReviewQueue>`
Queries Supabase for all cards where `nextReviewDate <= today`. Sorts by urgency: overdue cards (nextReviewDate < today) prioritized first, then today's cards by easeFactor ascending (hardest cards first). Applies a daily cap of 50 new cards and 150 review cards to prevent overwhelm. Returns a `ReviewQueue` with `dueCards[]`, `newCards[]`, `totalEstimatedMinutes`, and `streakRiskCards[]` (cards that, if missed, would break a learning streak).

### `updateGamificationState(userId: string, reviewSession: ReviewSession): Promise<GamificationUpdate>`
Calculates XP earned from the review session: +10 XP per correct card, +5 XP per correct pronunciation, +50 XP streak bonus (if daily goal met), +100 XP perfect session bonus (100% recall). Checks for level-up threshold (XP thresholds: 0→500→1200→2500→...). Updates streak counter (increments if daily goal met, resets to 0 if missed yesterday). Writes to Supabase and triggers a Realtime leaderboard update. Returns `GamificationUpdate` with `xpGained`, `newTotal`, `levelUp`, `newStreak`, `badgesEarned[]`.

---

## 📁 File Structure

```
language-flashcard-ai/
├── app/
│   ├── page.tsx                    # Landing + language selection
│   ├── dashboard/page.tsx          # Learning dashboard
│   ├── review/page.tsx             # Active review session
│   ├── deck/[deckId]/page.tsx      # Deck browser + card list
│   ├── leaderboard/page.tsx        # Weekly XP leaderboard
│   ├── stats/page.tsx              # Personal analytics
│   └── api/
│       ├── generate/route.ts       # POST: Generate flashcard deck
│       ├── review/route.ts         # POST: Submit review + SM-2 update
│       ├── pronunciation/route.ts  # POST: Whisper pronunciation eval
│       └── gamification/route.ts  # POST: XP + streak update
├── components/
│   ├── flashcard/
│   │   ├── FlashCard.tsx           # 3D flip card component
│   │   ├── CardFront.tsx           # Word + phonetic + audio
│   │   ├── CardBack.tsx            # Translation + examples + notes
│   │   ├── QualityRater.tsx        # 0-5 recall quality buttons
│   │   └── PronunciationButton.tsx # Mic capture + feedback
│   ├── deck/
│   │   ├── DeckGenerator.tsx       # Language/topic/count selector
│   │   ├── DeckCard.tsx            # Deck summary card
│   │   └── CardBrowser.tsx         # Scrollable card list
│   ├── gamification/
│   │   ├── StreakDisplay.tsx        # Streak counter + fire icon
│   │   ├── XPProgressBar.tsx       # Level progress bar
│   │   ├── BadgeCollection.tsx     # Earned badges grid
│   │   └── LeaderboardTable.tsx    # Real-time weekly rankings
│   ├── analytics/
│   │   ├── RetentionChart.tsx      # 30-day retention rate line
│   │   ├── ReviewHeatmap.tsx       # Daily activity calendar
│   │   └── VocabularyGrowth.tsx    # Cumulative word count
│   └── ui/
├── lib/
│   ├── sm2/algorithm.ts            # SM-2 implementation
│   ├── pronunciation/
│   │   ├── evaluator.ts            # Phoneme comparison
│   │   └── phonemeMaps/            # Per-language phoneme tables
│   ├── rtl/                        # RTL text utilities
│   ├── openai.ts
│   ├── supabase.ts
│   ├── serviceWorker/
│   │   └── offline.ts              # Offline sync logic
│   └── zustand/
│       ├── reviewStore.ts
│       └── gamificationStore.ts
├── types/
│   ├── flashcard.ts
│   └── gamification.ts
└── package.json
```

---

## 💡 AI Prompt Used

```
SYSTEM:
You are a professional linguist and language teacher specializing in creating memorable, 
contextually rich flashcards for adult language learners. Your cards are:
- Contextual: Example sentences feel authentic, not textbook
- Cultural: You explain not just meaning but usage customs
- Memorable: Each card includes a creative mnemonic hook
- Accurate: IPA phonetics are precise for the target language

Return a JSON array of flashcard objects. Each object must have exactly:
{
  "word": string,               // Word in target language
  "phonetic": string,           // IPA transcription
  "translation": string,        // English meaning
  "partOfSpeech": string,
  "exampleSentences": [
    {"target": string, "english": string},
    {"target": string, "english": string}
  ],
  "culturalNote": string,       // 1-2 sentences on cultural context
  "memoryHook": string          // Creative mnemonic (max 20 words)
}

USER:
Language: Spanish
Topic: Business & Professional
CEFR Level: B1
Count: 3
Context: For a developer working with Spanish-speaking tech clients
```

---

## 📤 Expected Output (Result)

**Generated Flashcards (JSON):**
```json
[
  {
    "word": "reunión",
    "phonetic": "/re.uˈnjon/",
    "translation": "meeting",
    "partOfSpeech": "noun (feminine)",
    "exampleSentences": [
      {"target": "Tenemos una reunión a las tres.", "english": "We have a meeting at three o'clock."},
      {"target": "La reunión fue muy productiva.", "english": "The meeting was very productive."}
    ],
    "culturalNote": "In Latin American business culture, meetings often start 10–15 minutes late and open with brief personal conversation — jumping straight to business can feel abrupt.",
    "memoryHook": "A REUNIONn is when everyone meets again — same root as English 'reunion'!"
  },
  {
    "word": "presupuesto",
    "phonetic": "/pɾe.su.ˈpwes.to/",
    "translation": "budget / quote",
    "partOfSpeech": "noun (masculine)",
    "exampleSentences": [
      {"target": "¿Cuál es el presupuesto del proyecto?", "english": "What is the project budget?"},
      {"target": "Te envío el presupuesto mañana.", "english": "I'll send you the quote tomorrow."}
    ],
    "culturalNote": "In Spain and Latin America, 'presupuesto' can mean both an organizational budget and a cost quote from a vendor — context makes it clear.",
    "memoryHook": "Think 'pre-supposed' costs — what you SUPPOSE you'll spend before the project starts."
  }
]
```

**SM-2 State Update (JSON):**
```json
{
  "cardId": "card_es_reunion_001",
  "qualityScore": 4,
  "previousState": {"repetitions": 1, "interval": 1, "easeFactor": 2.5},
  "newState": {
    "repetitions": 2,
    "interval": 6,
    "easeFactor": 2.5,
    "nextReviewDate": "2026-08-13"
  },
  "scheduled": "6 days from today"
}
```

**UI Display:**
```
🔥 Day 14 Streak  |  Level 7 — Conversationalist  |  ⭐ 2,840 XP

📚 Today's Review Queue: 23 cards due  |  ~18 min estimated

Card 1 of 23  [Spanish — Business]
┌─────────────────────────────────────────┐
│           r e u n i ó n                 │
│         /re.uˈnjon/  🔊                 │
└─────────────────────────────────────────┘
           [ Tap to flip ]

← Back shows: "meeting" + examples + cultural note

How well did you remember?
[0 Blackout] [1 Wrong] [2 Barely] [3 OK] [4 Good] [5 Perfect]

🎤 Practice pronunciation  |  ✅ +10 XP earned this card

🏆 Leaderboard: You're #3 this week with 2,840 XP
   #1 sarah_m: 3,120 XP  |  #2 ahmed_k: 2,980 XP
```

---

## 🚀 Stretch Goals

- [ ] Add immersive sentence-building exercises beyond simple flashcard review
- [ ] Implement a "Language Buddy" AI that carries on conversations in the target language
- [ ] Add image-word association cards using DALL-E generated contextual images
- [ ] Build a teacher mode where instructors can assign decks to students and track progress
- [ ] Integrate with YouTube — extract vocabulary from Spanish/French YouTube videos
- [ ] Add handwriting recognition for Japanese Kanji and Arabic script practice
- [ ] Build a podcast mode: AI generates a short 2-minute audio lesson per day in the target language
