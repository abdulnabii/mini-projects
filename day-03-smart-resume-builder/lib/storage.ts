import { SavedResumeSession } from '@/types';

const STORAGE_KEY = 'smart_resume_builder_sessions_v1';

export function getSavedSessions(): SavedResumeSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read resume sessions from localStorage:', err);
    return [];
  }
}

export function saveSession(session: SavedResumeSession): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSavedSessions();
    const updated = [session, ...existing.filter((s) => s.id !== session.id)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save resume session:', err);
  }
}

export function deleteSession(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSavedSessions();
    const filtered = existing.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete resume session:', err);
  }
}

export function clearAllSessions(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear resume sessions:', err);
  }
}
