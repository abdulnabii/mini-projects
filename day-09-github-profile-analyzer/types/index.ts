export interface Repository {
  name: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  primaryLanguage: string;
  hasReadme: boolean;
  starGrowthRate: number; // e.g. 8.4 stars/week
  url: string;
  updatedAt: string;
}

export interface RankedRepository extends Repository {
  impactScore: number; // 0 - 100
  momentum: 'rising' | 'stable' | 'steady';
}

export interface LanguageStat {
  language: string;
  percentage: number;
  color: string;
  bytes: number;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface DeveloperPersona {
  archetype: string;
  summary: string;
  traits: string[];
  funFact: string;
  technicalStrength: string;
}

export interface GitHubProfileData {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  company: string;
  location: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalCommitsPastYear: number;
  currentStreakDays: number;
  longestStreakDays: number;
  nightOwlPercentage: number;
  uniqueCollaborators: number;
  languages: LanguageStat[];
  repos: RankedRepository[];
  contributions: ContributionDay[];
  persona: DeveloperPersona;
}
