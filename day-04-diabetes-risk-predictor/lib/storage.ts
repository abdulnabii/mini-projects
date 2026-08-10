import { RiskSession } from '@/types';

const STORAGE_KEY = 'diabetes_risk_sessions_v1';

export function getSavedRiskSessions(): RiskSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read risk sessions from localStorage:', err);
    return [];
  }
}

export function saveRiskSession(session: RiskSession): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSavedRiskSessions();
    const updated = [session, ...existing.filter((s) => s.id !== session.id)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save risk session:', err);
  }
}

export function deleteRiskSession(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSavedRiskSessions();
    const filtered = existing.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete risk session:', err);
  }
}

export function clearAllRiskSessions(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear risk sessions:', err);
  }
}
