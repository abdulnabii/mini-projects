import { LegalAnalysis } from '@/types';
import { SAMPLE_CONTRACTS } from './sampleContracts';

const STORAGE_KEY = 'clausewise_contract_history';

export function getStoredAnalyses(): LegalAnalysis[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with sample contracts
      const seeded = SAMPLE_CONTRACTS.map((s) => ({
        ...s.analysis,
        rawText: s.rawText,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading contract history:', e);
    return [];
  }
}

export function saveAnalysisToStorage(analysis: LegalAnalysis): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredAnalyses();
    const filtered = existing.filter((item) => item.id !== analysis.id);
    const updated = [analysis, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving contract analysis:', e);
  }
}

export function getAnalysisById(id: string): LegalAnalysis | null {
  const all = getStoredAnalyses();
  return all.find((item) => item.id === id) || null;
}

export function deleteAnalysisFromStorage(id: string): LegalAnalysis[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getStoredAnalyses();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error deleting analysis:', e);
    return [];
  }
}
