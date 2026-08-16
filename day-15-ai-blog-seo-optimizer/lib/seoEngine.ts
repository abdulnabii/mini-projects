import {
  ActionPlanItem,
  ContentLengthMetric,
  GSCPerformance,
  HeadingNode,
  HeadingStructureMetric,
  KeywordDensityMetric,
  LinkOpportunity,
  MetaAuditMetric,
  ReadabilityMetric,
  SEOAuditResult,
} from '@/types';

// English Syllable Counter Helper
export function countSyllablesInWord(word: string): number {
  let w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w || w.length <= 3) return 1;

  w = w.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
  w = w.replace(/^y/, '');
  const syllables = w.match(/[aeiouy]{1,2}/g);
  return syllables ? Math.max(1, syllables.length) : 1;
}

export function scoreReadability(text: string): ReadabilityMetric {
  const clean = text.replace(/<[^>]*>/g, ' ').replace(/[#*_`~[\]]/g, ' ');
  const sentences = clean.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = clean.split(/\s+/).filter((w) => w.trim().length > 0);

  const totalWords = Math.max(1, words.length);
  const totalSentences = Math.max(1, sentences.length);

  let totalSyllables = 0;
  words.forEach((w) => {
    totalSyllables += countSyllablesInWord(w);
  });

  const avgSentenceLength = Number((totalWords / totalSentences).toFixed(1));
  const avgSyllablesPerWord = Number((totalSyllables / totalWords).toFixed(2));

  // Flesch Reading Ease Formula
  // 206.835 - (1.015 * ASL) - (84.6 * ASW)
  const rawEase = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
  const fleschScore = Math.max(0, Math.min(100, Math.round(rawEase)));

  // Flesch-Kincaid Grade Level Formula
  // (0.39 * ASL) + (11.8 * ASW) - 15.59
  const rawGrade = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;
  const gradeNumber = Math.max(1, Math.round(rawGrade));

  let label: ReadabilityMetric['label'] = 'Standard';
  let tip = 'Content readability is balanced for general audiences.';

  if (fleschScore >= 90) {
    label = 'Very Easy';
    tip = 'Very conversational and accessible to 5th grade readers.';
  } else if (fleschScore >= 80) {
    label = 'Easy';
    tip = 'Easy to read for 6th grade readers. Ideal for fast consumer browsing.';
  } else if (fleschScore >= 65) {
    label = 'Standard';
    tip = 'Plain English (8th–9th grade). Recommended sweet spot for technical blogs.';
  } else if (fleschScore >= 50) {
    label = 'Fairly Difficult';
    tip = '10th–12th grade level. Consider shortening long compound sentences.';
  } else if (fleschScore >= 30) {
    label = 'Difficult';
    tip = 'College level prose. Break sentences over 25 words into two shorter thoughts.';
  } else {
    label = 'Very Confusing';
    tip = 'Academic / legalistic complexity. Substantially rewrite dense passages.';
  }

  return {
    fleschScore,
    gradeLevel: `${gradeNumber}th Grade`,
    label,
    avgSentenceLength,
    avgSyllablesPerWord,
    totalWords,
    totalSentences,
    readingTimeMinutes: Math.max(1, Math.ceil(totalWords / 220)),
    improvementTip: tip,
  };
}

export function analyzeKeywords(
  content: string,
  targetKeyword: string,
  secondaryKeywords: string[],
  title: string,
  metaDescription: string
): KeywordDensityMetric {
  const normContent = content.toLowerCase();
  const normTarget = targetKeyword.trim().toLowerCase();
  const words = content.split(/\s+/).filter((w) => w.trim().length > 0);
  const totalWords = Math.max(1, words.length);

  // Target keyword frequency
  const targetRegex = new RegExp(`\\b${normTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
  const matches = normContent.match(targetRegex) || [];
  const occurrences = matches.length;
  const densityPercent = Number(((occurrences / totalWords) * 100).toFixed(2));

  let status: 'optimal' | 'under-optimized' | 'over-optimized' = 'optimal';
  if (densityPercent < 0.8) {
    status = 'under-optimized';
  } else if (densityPercent > 2.8) {
    status = 'over-optimized';
  }

  // Location checks
  const inTitle = title.toLowerCase().includes(normTarget);
  const first100Words = words.slice(0, 100).join(' ').toLowerCase();
  const inFirst100Words = first100Words.includes(normTarget);

  const lines = content.split('\n');
  let inH1 = false;
  let inH2Count = 0;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ') && trimmed.toLowerCase().includes(normTarget)) {
      inH1 = true;
    }
    if (trimmed.startsWith('## ') && trimmed.toLowerCase().includes(normTarget)) {
      inH2Count += 1;
    }
  });

  const inMetaDescription = metaDescription.toLowerCase().includes(normTarget);

  // Secondary keywords
  const secondary = secondaryKeywords.map((sec) => {
    const secNorm = sec.trim().toLowerCase();
    const secRegex = new RegExp(`\\b${secNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const secMatches = normContent.match(secRegex) || [];
    const secOccurrences = secMatches.length;
    return {
      keyword: sec,
      occurrences: secOccurrences,
      densityPercent: Number(((secOccurrences / totalWords) * 100).toFixed(2)),
    };
  });

  return {
    targetKeyword,
    occurrences,
    densityPercent,
    status,
    inTitle,
    inFirst100Words,
    inH1,
    inH2Count,
    inMetaDescription,
    secondaryKeywords: secondary,
  };
}

export function validateHeadings(content: string, targetKeyword: string): HeadingStructureMetric {
  const lines = content.split('\n');
  const headings: HeadingNode[] = [];
  let h1Count = 0;
  let h2Count = 0;
  let h3Count = 0;
  const issues: string[] = [];
  const normTarget = targetKeyword.trim().toLowerCase();

  let previousLevel = 0;
  let hasSkipped = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      h1Count += 1;
      const text = trimmed.replace(/^#\s+/, '');
      headings.push({ tag: 'h1', text, hasKeyword: text.toLowerCase().includes(normTarget) });
      previousLevel = 1;
    } else if (trimmed.startsWith('## ')) {
      h2Count += 1;
      const text = trimmed.replace(/^##\s+/, '');
      if (previousLevel === 0) hasSkipped = true;
      headings.push({ tag: 'h2', text, hasKeyword: text.toLowerCase().includes(normTarget) });
      previousLevel = 2;
    } else if (trimmed.startsWith('### ')) {
      h3Count += 1;
      const text = trimmed.replace(/^###\s+/, '');
      if (previousLevel === 1) {
        hasSkipped = true;
        issues.push(`Skipped heading hierarchy: H3 "${text.slice(0, 30)}..." used directly under H1 without an H2.`);
      }
      headings.push({
        tag: 'h3',
        text,
        hasKeyword: text.toLowerCase().includes(normTarget),
        isSkippedLevel: previousLevel === 1,
      });
      previousLevel = 3;
    }
  });

  if (h1Count === 0) {
    issues.push('Missing H1 heading: Post lacks a top-level # Title.');
  } else if (h1Count > 1) {
    issues.push(`Multiple H1 headings detected (${h1Count}). Recommended to use only 1 H1 per page.`);
  }

  if (h2Count === 0) {
    issues.push('Missing subheadings: Add H2 (##) headings to organize content for scanability.');
  }

  return {
    h1Count,
    h2Count,
    h3Count,
    headings,
    hasMissingH1: h1Count === 0,
    hasMultipleH1: h1Count > 1,
    hasSkippedLevels: hasSkipped,
    issues,
  };
}

export function auditMeta(title: string, metaDescription: string, targetKeyword: string): MetaAuditMetric {
  const titleLength = title.length;
  let titleStatus: 'optimal' | 'too_short' | 'too_long' = 'optimal';
  if (titleLength < 40) titleStatus = 'too_short';
  else if (titleLength > 65) titleStatus = 'too_long';

  const descLength = metaDescription.length;
  let descStatus: 'optimal' | 'too_short' | 'too_long' = 'optimal';
  if (descLength < 120) descStatus = 'too_short';
  else if (descLength > 165) descStatus = 'too_long';

  const normTarget = targetKeyword.trim().toLowerCase();
  const hasKeywordInTitle = title.toLowerCase().includes(normTarget);
  const hasKeywordInDescription = metaDescription.toLowerCase().includes(normTarget);

  return {
    title,
    titleLength,
    titleStatus,
    description: metaDescription,
    descriptionLength: descLength,
    descriptionStatus: descStatus,
    hasKeywordInTitle,
    hasKeywordInDescription,
    serpPixelWidth: Math.round(titleLength * 8.5),
  };
}

export function benchmarkContentLength(wordCount: number): ContentLengthMetric {
  const top10BenchmarkWords = 2450;
  const gapWords = Math.max(0, top10BenchmarkWords - wordCount);

  let status: 'comprehensive' | 'optimal' | 'thin' = 'optimal';
  let recommendation = 'Content depth aligns with top SERP competitors.';

  if (wordCount >= 2200) {
    status = 'comprehensive';
    recommendation = 'Excellent comprehensive depth for authoritative rankings.';
  } else if (wordCount < 1200) {
    status = 'thin';
    recommendation = `Add ~${gapWords} words covering practical case studies, FAQ snippets, and technical blueprints.`;
  }

  return {
    wordCount,
    top10BenchmarkWords,
    gapWords,
    status,
    recommendation,
  };
}

export function runFullSEOAudit(
  content: string,
  targetKeyword: string,
  title: string,
  metaDescription: string,
  secondaryKeywords: string[] = []
): SEOAuditResult {
  const readability = scoreReadability(content);
  const keywordDensity = analyzeKeywords(content, targetKeyword, secondaryKeywords, title, metaDescription);
  const headingStructure = validateHeadings(content, targetKeyword);
  const metaAudit = auditMeta(title, metaDescription, targetKeyword);
  const contentLength = benchmarkContentLength(readability.totalWords);

  // Calculate composite score (0 - 100)
  let score = 0;

  // Readability (25 pts)
  if (readability.fleschScore >= 60 && readability.fleschScore <= 75) score += 25;
  else if (readability.fleschScore >= 50 && readability.fleschScore <= 85) score += 20;
  else score += 12;

  // Keyword optimization (25 pts)
  if (keywordDensity.status === 'optimal') score += 12;
  else score += 6;
  if (keywordDensity.inTitle) score += 4;
  if (keywordDensity.inFirst100Words) score += 4;
  if (keywordDensity.inH2Count > 0) score += 3;
  if (keywordDensity.inMetaDescription) score += 2;

  // Meta Audit (20 pts)
  if (metaAudit.titleStatus === 'optimal') score += 5;
  if (metaAudit.hasKeywordInTitle) score += 5;
  if (metaAudit.descriptionStatus === 'optimal') score += 5;
  if (metaAudit.hasKeywordInDescription) score += 5;

  // Headings & Hierarchy (15 pts)
  if (!headingStructure.hasMissingH1 && !headingStructure.hasMultipleH1) score += 6;
  if (headingStructure.h2Count >= 3) score += 5;
  if (!headingStructure.hasSkippedLevels) score += 4;

  // Content Length (15 pts)
  if (contentLength.status === 'comprehensive') score += 15;
  else if (contentLength.status === 'optimal') score += 10;
  else score += 5;

  score = Math.min(100, Math.max(25, score));

  // Determine Grade
  let grade: SEOAuditResult['grade'] = 'B';
  if (score >= 90) grade = 'A+';
  else if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 58) grade = 'C';
  else if (score >= 45) grade = 'D';
  else grade = 'F';

  // Action plan items
  const actionPlan: ActionPlanItem[] = [];
  let priority = 1;

  if (!metaAudit.hasKeywordInTitle || metaAudit.titleStatus !== 'optimal') {
    actionPlan.push({
      priority: priority++,
      action: `Optimize Title: Ensure target keyword "${targetKeyword}" appears in the first 50 characters (Current: ${metaAudit.titleLength} chars).`,
      impact: 'HIGH',
      effort: 'LOW',
      category: 'Meta',
    });
  }

  if (!metaAudit.hasKeywordInDescription || metaAudit.descriptionStatus !== 'optimal') {
    actionPlan.push({
      priority: priority++,
      action: `Refine Meta Description: Expand to 140–160 chars with target keyword and clear call-to-action (Current: ${metaAudit.descriptionLength} chars).`,
      impact: 'HIGH',
      effort: 'LOW',
      category: 'Meta',
    });
  }

  if (keywordDensity.status === 'under-optimized') {
    actionPlan.push({
      priority: priority++,
      action: `Increase Keyword Presence: Naturally incorporate "${targetKeyword}" in 2–3 subheadings and opening paragraph (Current density: ${keywordDensity.densityPercent}%).`,
      impact: 'HIGH',
      effort: 'MEDIUM',
      category: 'Keyword',
    });
  } else if (keywordDensity.status === 'over-optimized') {
    actionPlan.push({
      priority: priority++,
      action: `Reduce Keyword Stuffing: Replace repetitive instances of "${targetKeyword}" with semantic LSI synonyms (Current density: ${keywordDensity.densityPercent}%).`,
      impact: 'HIGH',
      effort: 'MEDIUM',
      category: 'Keyword',
    });
  }

  if (contentLength.status === 'thin') {
    actionPlan.push({
      priority: priority++,
      action: `Expand Content Depth: Add ~${contentLength.gapWords} words of practical implementations & FAQs to outrank top 10 competitors.`,
      impact: 'HIGH',
      effort: 'HIGH',
      category: 'Content Length',
    });
  }

  if (readability.fleschScore < 55) {
    actionPlan.push({
      priority: priority++,
      action: `Improve Readability Grade: Simplify compound sentences (Average sentence length is ${readability.avgSentenceLength} words; aim for < 18 words).`,
      impact: 'MEDIUM',
      effort: 'MEDIUM',
      category: 'Readability',
    });
  }

  if (headingStructure.hasSkippedLevels || headingStructure.issues.length > 0) {
    actionPlan.push({
      priority: priority++,
      action: 'Fix Heading Hierarchy: Eliminate skipped H-tag levels and add descriptive subheadings.',
      impact: 'MEDIUM',
      effort: 'LOW',
      category: 'Headings',
    });
  }

  // Internal link opportunities
  const internalLinks: LinkOpportunity[] = [
    {
      anchorPhrase: 'modern architecture patterns',
      targetTopic: '/blog/software-architecture-best-practices',
      reason: 'Semantically related high-authority internal pillar page.',
    },
    {
      anchorPhrase: 'performance benchmarking metrics',
      targetTopic: '/blog/web-vitals-optimization-guide',
      reason: 'Deepens visitor time-on-site and passes PageRank equity.',
    },
    {
      anchorPhrase: 'cloud deployment workflows',
      targetTopic: '/blog/devops-ci-cd-pipelines',
      reason: 'Contextual link to practical execution tutorial.',
    },
  ];

  // GSC Performance Estimator
  const gscPerformance: GSCPerformance = {
    estimatedPosition: score >= 85 ? 4.2 : score >= 70 ? 11.5 : 28.4,
    projectedCTR: score >= 85 ? 6.8 : score >= 70 ? 2.9 : 0.8,
    projectedMonthlyClicks: score >= 85 ? 1420 : score >= 70 ? 380 : 65,
    projectedImpressions: score >= 85 ? 21000 : score >= 70 ? 13500 : 8200,
    rankingDifficulty: 'Medium',
  };

  // Split raw paragraphs
  const rawParagraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40 && !p.startsWith('#'));

  return {
    id: `audit_${Date.now()}`,
    targetKeyword,
    overallScore: score,
    grade,
    headlineSummary:
      score >= 85
        ? 'High-ranking content profile with strong keyword distribution and clear readability.'
        : score >= 70
        ? 'Solid on-page SEO foundation with minor heading and meta description optimization opportunities.'
        : 'Under-optimized content. Follow the prioritized action plan below to climb search rankings.',
    keywordDensity,
    readability,
    metaAudit,
    headingStructure,
    contentLength,
    internalLinks,
    actionPlan,
    gscPerformance,
    rawParagraphs,
    createdAt: new Date().toISOString(),
  };
}
