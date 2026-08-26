import { Incident } from '@/types';
import { SAMPLE_INCIDENTS } from './sampleIncidents';

const STORAGE_KEY = 'opspulse_incident_history_v1';

export function getStoredIncidents(): Incident[] {
  if (typeof window === 'undefined') return SAMPLE_INCIDENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : SAMPLE_INCIDENTS;
  } catch (e) {
    return SAMPLE_INCIDENTS;
  }
}

export function saveIncidentsToStorage(incidents: Incident[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  } catch (e) {
    console.error('Failed to save incidents to localStorage:', e);
  }
}
