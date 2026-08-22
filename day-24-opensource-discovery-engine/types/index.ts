export type TechSkill =
  | 'React'
  | 'TypeScript'
  | 'Next.js'
  | 'Tailwind CSS'
  | 'Python'
  | 'Rust'
  | 'Go'
  | 'FastAPI'
  | 'Node.js'
  | 'Vue'
  | 'Svelte'
  | 'Docker'
  | 'AI / LLM'
  | 'GraphQL';

export type DifficultyLevel =
  | 'all'
  | 'first_timers'
  | 'beginner'
  | 'intermediate'
  | 'advanced';

export interface HealthScore {
  score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  daysSinceLastCommit: number;
  avgPrReviewDays: number;
  prAcceptanceRate: number; // Percentage
  docQualityRating: number; // 0 - 100
  openIssuesCount: number;
  goodFirstIssuesCount: number;
}

export interface ContributionGuide {
  setupSteps: string[];
  recommendedFirstIssue: string;
  codingConventions: string[];
  prTemplate: string;
  estimatedTime: string;
}

export interface GoodFirstIssue {
  id: number;
  number: number;
  title: string;
  url: string;
  comments: number;
  createdAt: string;
  labels: string[];
}

export interface OpenSourceProject {
  id: string;
  owner: string;
  repo: string;
  fullName: string;
  description: string;
  stars: number;
  starVelocityMonth: number;
  forks: number;
  language: string;
  topics: string[];
  healthScore: HealthScore;
  aiSummary: string;
  difficulty: Exclude<DifficultyLevel, 'all'>;
  license: string;
  githubUrl: string;
  homepageUrl?: string;
  openGoodFirstIssues: GoodFirstIssue[];
  defaultGuide?: ContributionGuide;
  matchFitPercent?: number;
}

export type ContributionStatus =
  | 'targeted'
  | 'forked'
  | 'pr_submitted'
  | 'merged';

export interface ContributionTarget {
  id: string;
  projectFullName: string;
  projectUrl: string;
  status: ContributionStatus;
  issueTitle?: string;
  issueUrl?: string;
  notes?: string;
  addedAt: string;
  updatedAt: string;
}
