export type MoodCategory =
  | 'joyful'
  | 'calm'
  | 'anxious'
  | 'overwhelmed'
  | 'down'
  | 'frustrated'
  | 'reflective';

export interface CopingTechnique {
  id: string;
  title: string;
  category: 'Breathing' | 'Grounding' | 'CBT Reframing' | 'Mindfulness' | 'Somatic';
  description: string;
  durationMinutes: number;
  steps: string[];
  icon: string;
}

export interface CognitivePattern {
  name: string; // e.g. "Catastrophizing", "Black-and-White Thinking"
  description: string;
  reframingThought: string;
}

export interface AIJournalAnalysis {
  primaryEmotion: string;
  secondaryEmotions: string[];
  sentimentScore: number; // -1.0 to +1.0
  empathyReflection: string;
  gentlePromptQuestion: string;
  detectedPatterns: CognitivePattern[];
  suggestedTechniques: CopingTechnique[];
  dailyAffirmation: string;
  crisisFlag: boolean;
}

export interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  moodTag: MoodCategory;
  date: string; // YYYY-MM-DD
  timestamp: string;
  analysis?: AIJournalAnalysis;
  wordCount: number;
  isFavorite?: boolean;
}

export interface MoodStats {
  totalEntries: number;
  streakDays: number;
  dominantMood: MoodCategory;
  averageValence: number; // -1 to +1
  moodCounts: Record<MoodCategory, number>;
}
