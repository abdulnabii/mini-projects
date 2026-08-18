import { RoastResult } from '@/types';

const STORAGE_KEY = 'portfolioroaster_history_v1';

export const INITIAL_HALL_OF_FAME: {
  id: string;
  name: string;
  url: string;
  score: number;
  verdict: string;
  badge: string;
  isShame: boolean;
}[] = [
  {
    id: 'hall_1',
    name: 'Julian V. (Over-Engineered 3D)',
    url: 'https://julianvance.design',
    score: 42,
    verdict: 'Takes 15 seconds to load a spinning 3D skull, has zero projects with real users.',
    badge: '💀 CPU Melter Edition',
    isShame: true,
  },
  {
    id: 'hall_2',
    name: 'Sarah K. (Senior Cloud Architect)',
    url: 'https://sarahk-cloud.dev',
    score: 91,
    verdict: 'Razor-sharp ATS structure, live interactive architecture diagrams, and quantified business metrics.',
    badge: '🏆 Recruiter Magnet S-Tier',
    isShame: false,
  },
  {
    id: 'hall_3',
    name: 'Alex R. (Bootcamp Grad)',
    url: 'https://alex-rivera-portfolio.dev',
    score: 38,
    verdict: 'The holy trinity of Todo App, Calculator, and Weather widget. Unhireable without refactor.',
    badge: '🐣 Tutorial Graveyard',
    isShame: true,
  },
  {
    id: 'hall_4',
    name: 'Hamza Malik (Full-Stack AI)',
    url: 'https://hamzamalik.me',
    score: 88,
    verdict: 'Clean typography, instant sub-second load time, and live functional product demos.',
    badge: '🛡️ Production-Grade Builder',
    isShame: false,
  },
];

export function getStoredRoasts(): RoastResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveRoastToStorage(roast: RoastResult): RoastResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getStoredRoasts();
    const updated = [roast, ...current.filter((r) => r.id !== roast.id)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save roast:', e);
    return [];
  }
}
