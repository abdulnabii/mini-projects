import { ArchitectureDesignResult } from '@/types';

const STORAGE_KEY = 'archcraft_history_v1';

export function getStoredArchitectures(): ArchitectureDesignResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveArchitectureToStorage(arch: ArchitectureDesignResult): ArchitectureDesignResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getStoredArchitectures();
    const updated = [arch, ...current.filter((a) => a.id !== arch.id)].slice(0, 15);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save architecture design:', e);
    return [];
  }
}
