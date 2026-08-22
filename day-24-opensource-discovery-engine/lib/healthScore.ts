import { HealthScore } from '@/types';

export function calculateHealthScore(
  daysSinceLastCommit: number,
  avgPrReviewDays: number,
  prAcceptanceRate: number,
  docQualityRating: number,
  openIssuesCount: number,
  goodFirstIssuesCount: number
): HealthScore {
  // 1. Commit freshness (max 30 pts)
  let commitScore = 30;
  if (daysSinceLastCommit > 30) commitScore = 5;
  else if (daysSinceLastCommit > 14) commitScore = 15;
  else if (daysSinceLastCommit > 7) commitScore = 24;

  // 2. PR Review Turnaround (max 25 pts)
  let prSpeedScore = 25;
  if (avgPrReviewDays > 14) prSpeedScore = 5;
  else if (avgPrReviewDays > 7) prSpeedScore = 12;
  else if (avgPrReviewDays > 3) prSpeedScore = 20;

  // 3. PR Acceptance Rate (max 20 pts)
  const acceptanceScore = Math.round((prAcceptanceRate / 100) * 20);

  // 4. Documentation Quality (max 15 pts)
  const docScore = Math.round((docQualityRating / 100) * 15);

  // 5. Beginner Friendliness & Good First Issues (max 10 pts)
  const beginnerScore = Math.min(10, goodFirstIssuesCount * 1.5);

  const rawTotal = commitScore + prSpeedScore + acceptanceScore + docScore + beginnerScore;
  const score = Math.min(100, Math.max(20, Math.round(rawTotal)));

  let grade: HealthScore['grade'] = 'D';
  if (score >= 90) grade = 'A+';
  else if (score >= 80) grade = 'A';
  else if (score >= 68) grade = 'B';
  else if (score >= 50) grade = 'C';

  return {
    score,
    grade,
    daysSinceLastCommit,
    avgPrReviewDays,
    prAcceptanceRate,
    docQualityRating,
    openIssuesCount,
    goodFirstIssuesCount,
  };
}
