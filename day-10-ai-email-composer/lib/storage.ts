import { SavedEmail, EmailConfig, EmailVariant } from '@/types';

const STORAGE_KEY = 'emailpulse_saved_emails_v1';

export function getSavedEmails(): SavedEmail[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to read saved emails from storage:', err);
    return [];
  }
}

export function saveEmailToHistory(config: EmailConfig, variant: EmailVariant): SavedEmail[] {
  if (typeof window === 'undefined') return [];
  const current = getSavedEmails();
  const newEntry: SavedEmail = {
    id: `email-${Date.now()}`,
    createdAt: new Date().toISOString(),
    config,
    variant,
  };

  const updated = [newEntry, ...current].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteSavedEmail(id: string): SavedEmail[] {
  if (typeof window === 'undefined') return [];
  const current = getSavedEmails();
  const updated = current.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
