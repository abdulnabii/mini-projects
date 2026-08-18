export type RoastIntensity = 'mild' | 'spicy' | 'nuclear';

export interface CategoryRoast {
  score: number; // 0-100
  grade: string; // A+, A, B, C, F
  roast: string;
  actionableTip: string;
  keyIssues: string[];
}

export interface RoastResult {
  id: string;
  targetUrlOrTitle: string;
  developerName: string;
  intensity: RoastIntensity;
  overallScore: number;
  overallVerdict: string;
  topRoastPunchline: string;
  survivalBadge: string;
  categories: {
    design: CategoryRoast;
    projects: CategoryRoast;
    aboutBio: CategoryRoast;
    uxAndSpeed: CategoryRoast;
    recruiterAppeal: CategoryRoast;
  };
  rewrittenHeroBio: {
    beforeBio: string;
    afterBio: string;
    improvedTagline: string;
    targetKeywords: string[];
  };
  actionRoadmap: {
    priority: number;
    title: string;
    description: string;
    impact: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  }[];
  createdAt: string;
}

export interface SamplePortfolioPreset {
  id: string;
  archetype: string;
  title: string;
  developerName: string;
  portfolioUrl: string;
  bioSnippet: string;
  projectsList: string[];
  stackTags: string[];
  avatar: string;
}
