import { Repository, RankedRepository } from '@/types';

export function calculateImpactScores(repos: Repository[]): RankedRepository[] {
  const ranked = repos.map((repo) => {
    // Weighted scoring formula
    const rawScore =
      repo.stars * 1.0 +
      repo.forks * 1.5 +
      repo.openIssues * 0.2 +
      (repo.hasReadme ? 15 : 0) +
      repo.starGrowthRate * 2.5;

    // Normalize to 0 - 100 scale
    const impactScore = Math.min(99, Math.max(25, Math.round(Math.sqrt(rawScore) * 3.2)));

    let momentum: 'rising' | 'stable' | 'steady' = 'stable';
    if (repo.starGrowthRate > 5) momentum = 'rising';
    else if (repo.starGrowthRate < 1) momentum = 'steady';

    return {
      ...repo,
      impactScore,
      momentum,
    };
  });

  return ranked.sort((a, b) => b.impactScore - a.impactScore);
}
