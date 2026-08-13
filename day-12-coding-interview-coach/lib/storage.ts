import { InterviewSession } from '@/types';

const STORAGE_KEY = 'algocoach_sessions_v1';

export function getSessionHistory(): InterviewSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading session history:', e);
    return [];
  }
}

export function saveSessionToHistory(session: InterviewSession): InterviewSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = getSessionHistory();
    const updated = [session, ...history.filter((s) => s.id !== session.id)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving session to history:', e);
    return [];
  }
}

export function deleteSessionFromHistory(id: string): InterviewSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = getSessionHistory();
    const updated = history.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error deleting session from history:', e);
    return [];
  }
}
