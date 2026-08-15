# LingoPulse.AI — AI Language Flashcards & Spaced Repetition Platform

LingoPulse.AI combines the scientifically-proven **SuperMemo 2 (SM-2)** spaced repetition algorithm with Gemini 1.5 Flash contextual flashcard generation to create an adaptive language learning system.

## Key Features
- **3D Interactive Flipping Flashcards**:
  - Front: Target word in native typography, IPA phonetic transcription, Web Speech TTS native audio playback, and microphone pronunciation assessor.
  - Back: English translation, part of speech, 2 authentic conversational example sentences, cultural context note, and memory mnemonic hook.
- **SM-2 Spaced Repetition Engine**:
  - Schedules review intervals ($I_1 = 1\text{d}, I_2 = 6\text{d}, I_n = I_{n-1} \times EF$) dynamically based on user recall ratings ($0 \dots 5$: Blackout to Perfect).
- **5 Supported Languages with Native RTL Support**:
  - Spanish, French, German, Arabic (RTL), and Urdu (RTL).
- **Web Speech API Voice Recognition & Pronunciation Scoring**:
  - Evaluates user's spoken pronunciation against native phonetics ($0\% \dots 100\%$).
- **Gamification & Analytics**:
  - XP points progression, learning streak flame counter, level badges, and a weekly global polyglot leaderboard.

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS & Framer Motion
- Web Speech API (Synthesis & Recognition)
- Google Gemini API (`@google/generative-ai`)
- Canvas Confetti
- Vercel Production
