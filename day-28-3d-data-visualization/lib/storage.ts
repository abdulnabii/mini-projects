import { SavedVisualization } from '@/types';

const STORAGE_KEY = 'omnidata_saved_visualizations';

export function getSavedVisualizations(): SavedVisualization[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeds: SavedVisualization[] = [
        {
          id: 'saved_1',
          title: 'Global Pandemic & Healthcare Vulnerability Index',
          datasetName: 'Global COVID-19 & Vaccine Distribution Matrix',
          chartType: 'GLOBE_3D',
          narrative:
            'Planetary geospatial model mapping multi-wave infectious velocity and immunization efficacy.',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
      return seeds;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved visualizations:', e);
    return [];
  }
}

export function saveVisualization(vis: SavedVisualization): SavedVisualization[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedVisualizations();
    const updated = [vis, ...current.filter((v) => v.id !== vis.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save visualization:', e);
    return [];
  }
}

export function deleteSavedVisualization(id: string): SavedVisualization[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedVisualizations();
    const updated = current.filter((v) => v.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete visualization:', e);
    return [];
  }
}
