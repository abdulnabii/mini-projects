import { ReviewSession } from '@/types';

const STORAGE_KEY = 'ai_code_review_bot_history';

export function getSavedReviews(): ReviewSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load code review history:', error);
    return [];
  }
}

export function saveReview(session: ReviewSession): void {
  if (typeof window === 'undefined') return;
  try {
    const sessions = getSavedReviews();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save review session:', error);
  }
}

export function deleteReview(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const sessions = getSavedReviews().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to delete review session:', error);
  }
}

export function clearAllReviews(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear reviews:', error);
  }
}
