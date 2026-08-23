import { ScheduledDraft, VoiceProfile } from '@/types';

const DRAFTS_KEY = 'threadgenius_saved_drafts';
const VOICE_KEY = 'threadgenius_active_voice';

export function getSavedDrafts(): ScheduledDraft[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to get drafts:', e);
    return [];
  }
}

export function saveDraft(draft: ScheduledDraft): ScheduledDraft[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedDrafts();
    const filtered = current.filter((d) => d.id !== draft.id);
    const updated = [draft, ...filtered];
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save draft:', e);
    return [];
  }
}

export function deleteDraft(id: string): ScheduledDraft[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedDrafts();
    const updated = current.filter((d) => d.id !== id);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete draft:', e);
    return [];
  }
}

export function getActiveVoiceProfile(): VoiceProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(VOICE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to get voice:', e);
    return null;
  }
}

export function saveVoiceProfile(profile: VoiceProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VOICE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save voice:', e);
  }
}
