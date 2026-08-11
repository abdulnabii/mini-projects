import { BrandKit } from '@/types';

const STORAGE_KEY = 'brandcrafter_saved_kits_v1';

export function getSavedBrandKits(): BrandKit[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to read brand kits from storage:', err);
    return [];
  }
}

export function saveBrandKit(kit: BrandKit) {
  if (typeof window === 'undefined') return;
  const kits = getSavedBrandKits();
  const updated = [kit, ...kits.filter((k) => k.id !== kit.id)].slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteBrandKit(id: string) {
  if (typeof window === 'undefined') return;
  const kits = getSavedBrandKits();
  const updated = kits.filter((k) => k.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
