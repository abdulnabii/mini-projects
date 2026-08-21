import { JournalEntry, MoodStats, MoodCategory } from '@/types';
import { DEFAULT_JOURNAL_ENTRIES } from './defaultEntries';

const ENTRIES_STORAGE_KEY = 'mindsanctuary_entries_v1';

export function getStoredJournalEntries(): JournalEntry[] {
  if (typeof window === 'undefined') return DEFAULT_JOURNAL_ENTRIES;
  try {
    const raw = localStorage.getItem(ENTRIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_JOURNAL_ENTRIES;
  } catch (e) {
    return DEFAULT_JOURNAL_ENTRIES;
  }
}

export function saveJournalEntriesToStorage(entries: JournalEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save entries to localStorage:', e);
  }
}

export function calculateMoodStats(entries: JournalEntry[]): MoodStats {
  const moodCounts: Record<MoodCategory, number> = {
    joyful: 0,
    calm: 0,
    anxious: 0,
    overwhelmed: 0,
    down: 0,
    frustrated: 0,
    reflective: 0,
  };

  let totalValence = 0;

  entries.forEach((e) => {
    if (moodCounts[e.moodTag] !== undefined) {
      moodCounts[e.moodTag] += 1;
    }
    if (e.analysis?.sentimentScore !== undefined) {
      totalValence += e.analysis.sentimentScore;
    }
  });

  // Calculate dominant mood
  let dominantMood: MoodCategory = 'reflective';
  let maxCount = -1;
  (Object.keys(moodCounts) as MoodCategory[]).forEach((m) => {
    if (moodCounts[m] > maxCount) {
      maxCount = moodCounts[m];
      dominantMood = m;
    }
  });

  const averageValence = entries.length > 0 ? Number((totalValence / entries.length).toFixed(2)) : 0.2;

  return {
    totalEntries: entries.length,
    streakDays: Math.min(entries.length, 5),
    dominantMood,
    averageValence,
    moodCounts,
  };
}
