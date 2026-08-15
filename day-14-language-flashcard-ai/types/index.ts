export type SupportedLanguage = 'spanish' | 'french' | 'german' | 'arabic' | 'urdu';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface ExampleSentence {
  target: string;
  english: string;
}

export interface Flashcard {
  id: string;
  word: string;
  phonetic: string; // IPA transcription
  translation: string;
  partOfSpeech: string;
  exampleSentences: ExampleSentence[];
  culturalNote: string;
  memoryHook: string; // Vivid mnemonic
  // SM-2 Review Metadata
  repetitions: number;
  interval: number; // Days until next review
  easeFactor: number; // SM-2 Ease Factor (min 1.3, default 2.5)
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewedDate?: string;
  lastQualityScore?: number; // 0 to 5
}

export interface Deck {
  id: string;
  title: string;
  language: SupportedLanguage;
  topic: string;
  level: CEFRLevel;
  cards: Flashcard[];
  createdAt: string;
}

export interface PronunciationScore {
  score: number; // 0 to 100
  feedback: string;
  phonemeAccuracy: number;
  syllableMatch: boolean;
  transcribedText: string;
}

export interface GamificationState {
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  level: number;
  cardsReviewedToday: number;
  dailyGoal: number; // e.g. 10 cards
  badges: { id: string; name: string; icon: string; description: string; unlocked: boolean }[];
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  rank: number;
  isCurrentUser?: boolean;
}
