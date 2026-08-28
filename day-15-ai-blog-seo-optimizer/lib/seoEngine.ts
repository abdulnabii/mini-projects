import {
  ActionPlanItem,
  CompetitorBenchmark,
  ContentLengthMetric,
  EEATMetric,
  GSCPerformance,
  HeadingNode,
  HeadingStructureMetric,
  KeywordDensityMetric,
  LinkOpportunity,
  MetaAuditMetric,
  MissingNLPEntity,
  NLPEntityItem,
  NLPEntityMetric,
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

  // Flesch Reading Ease Formula: 206.835 - (1.015 * ASL) - (84.6 * ASW)
  const rawEase = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
  const fleschScore = Math.max(0, Math.min(100, Math.round(rawEase)));

  // Flesch-Kincaid Grade Level Formula: (0.39 * ASL) + (11.8 * ASW) - 15.59
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

// Google E-E-A-T & Search Intent Engine
export function evaluateEEAT(content: string, title: string, keyword: string): EEATMetric {
  const text = content.toLowerCase();

  // Experience: first-person pronouns, empirical testing, real-world setup
  const expSignals = ['we tested', 'our team', 'in production', 'we benchmarked', 'case study', 'observed in', 'hands-on'];
  let expCount = 0;
  expSignals.forEach((s) => {
    if (text.includes(s)) expCount += 1;
  });
  const experienceScore = Math.min(100, Math.max(50, expCount * 22 + 45));

  // Expertise: technical terms, metrics, code, data points
  const expertSignals = ['ms', 'latency', 'architecture', 'throughput', 'algorithm', 'parameter', 'protocol', 'database', 'schema', 'api'];
  let expertCount = 0;
  expertSignals.forEach((s) => {
    if (text.includes(s)) expertCount += 1;
  });
  const expertiseScore = Math.min(100, Math.max(55, expertCount * 12 + 40));

  // Authoritativeness: industry standards, citations, comparative analysis
  const authSignals = ['according to', 'research by', 'rfc', 'iso', 'standard', 'framework', 'industry benchmark', 'compared to'];
  let authCount = 0;
  authSignals.forEach((s) => {
    if (text.includes(s)) authCount += 1;
  });
  const authoritativenessScore = Math.min(100, Math.max(45, authCount * 20 + 40));

  // Trustworthiness: clear takeaways, caveats, disclaimers, no spammy claims
  const trustSignals = ['tradeoff', 'limitation', 'consideration', 'best practice', 'security', 'compliance'];
  let trustCount = 0;
  trustSignals.forEach((s) => {
    if (text.includes(s)) trustCount += 1;
  });
  const trustworthinessScore = Math.min(100, Math.max(60, trustCount * 15 + 50));

  const compositeEEAT = Math.round(
    experienceScore * 0.25 + expertiseScore * 0.3 + authoritativenessScore * 0.25 + trustworthinessScore * 0.2
  );

  // Search intent classification
  let searchIntent: EEATMetric['searchIntent'] = 'Informational';
  let intentConfidence = 88;

  if (title.toLowerCase().includes('best') || title.toLowerCase().includes('vs') || title.toLowerCase().includes('review')) {
    searchIntent = 'Commercial';
    intentConfidence = 92;
  } else if (title.toLowerCase().includes('buy') || title.toLowerCase().includes('pricing') || title.toLowerCase().includes('download')) {
    searchIntent = 'Transactional';
    intentConfidence = 95;
  } else if (title.toLowerCase().includes('login') || title.toLowerCase().includes('portal')) {
    searchIntent = 'Navigational';
    intentConfidence = 90;
  }

  return {
    experienceScore,
    expertiseScore,
    authoritativenessScore,
    trustworthinessScore,
    compositeEEAT,
    searchIntent,
    intentConfidence,
  };
}

// NLP Semantic Entities & Topic Gaps Analyzer
export function analyzeNLPEntities(content: string, targetKeyword: string): NLPEntityMetric {
  const norm = content.toLowerCase();

  // Curated knowledge graph entities based on tech / SEO topics
  const candidateEntities: { name: string; category: NLPEntityItem['category'] }[] = [
    { name: 'Latency Benchmarks', category: 'Metric' },
    { name: 'Throughput (RPS)', category: 'Metric' },
    { name: 'Core Web Vitals', category: 'Metric' },
    { name: 'Next.js Turbopack', category: 'Technology' },
    { name: 'Kubernetes Pods', category: 'Technology' },
    { name: 'TypeScript Interface', category: 'Technology' },
    { name: 'PostgreSQL Connection Pool', category: 'Technology' },
    { name: 'Spaced Repetition SM-2', category: 'Methodology' },
    { name: 'Flesch-Kincaid Grade', category: 'Methodology' },
    { name: 'Token Bucket Limiter', category: 'Methodology' },
    { name: 'Zero-Shot Inference', category: 'Concept' },
    { name: 'Semantic Search Embeddings', category: 'Concept' },
    { name: 'Idempotency Keys', category: 'Concept' },
    { name: 'Multi-Tenant RBAC', category: 'Concept' },
    { name: 'Structured JSON-LD Schema', category: 'Technology' },
  ];

  const coveredEntities: NLPEntityItem[] = [];
  const missingEntities: MissingNLPEntity[] = [];

  candidateEntities.forEach((ent) => {
    const regex = new RegExp(`\\b${ent.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = norm.match(regex);
    if (matches && matches.length > 0) {
      coveredEntities.push({
        name: ent.name,
        count: matches.length,
        category: ent.category,
      });
    } else {
      if (missingEntities.length < 5) {
        missingEntities.push({
          name: ent.name,
          importance: missingEntities.length < 2 ? 'HIGH' : 'MEDIUM',
          suggestedContext: `Incorporate '${ent.name}' into technical implementation sections to signal deep semantic breadth to Google Gemini & RankBrain.`,
        });
      }
    }
  });

  const totalCandidate = candidateEntities.length;
  const entityCoverageScore = Math.min(
    100,
    Math.max(40, Math.round((coveredEntities.length / Math.max(1, candidateEntities.length * 0.6)) * 100))
  );

  return {
    coveredEntities,
    missingEntities,
    entityCoverageScore,
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
  const eeat = evaluateEEAT(content, title, targetKeyword);
  const nlpEntities = analyzeNLPEntities(content, targetKeyword);

  // Competitor Top-10 Benchmark
  const competitorBenchmark: CompetitorBenchmark = {
    userWords: readability.totalWords,
    avgTop10Words: 2450,
    userHeadings: headingStructure.headings.length,
    avgTop10Headings: 14,
    userReadability: readability.fleschScore,
    avgTop10Readability: 65,
    userKeywordDensity: keywordDensity.densityPercent,
    avgTop10KeywordDensity: 1.8,
  };

  // Calculate composite score (0 - 100)
  let score = 0;

  // Readability (20 pts)
  if (readability.fleschScore >= 60 && readability.fleschScore <= 75) score += 20;
  else if (readability.fleschScore >= 50 && readability.fleschScore <= 85) score += 16;
  else score += 10;

  // Keyword optimization (20 pts)
  if (keywordDensity.status === 'optimal') score += 10;
  else score += 5;
  if (keywordDensity.inTitle) score += 3;
  if (keywordDensity.inFirst100Words) score += 3;
  if (keywordDensity.inH2Count > 0) score += 2;
  if (keywordDensity.inMetaDescription) score += 2;

  // Meta Audit (15 pts)
  if (metaAudit.titleStatus === 'optimal') score += 4;
  if (metaAudit.hasKeywordInTitle) score += 4;
  if (metaAudit.descriptionStatus === 'optimal') score += 4;
  if (metaAudit.hasKeywordInDescription) score += 3;

  // Headings & Hierarchy (15 pts)
  if (!headingStructure.hasMissingH1 && !headingStructure.hasMultipleH1) score += 6;
  if (headingStructure.h2Count >= 3) score += 5;
  if (!headingStructure.hasSkippedLevels) score += 4;

  // E-E-A-T & NLP Entities (15 pts)
  score += Math.round((eeat.compositeEEAT / 100) * 8);
  score += Math.round((nlpEntities.entityCoverageScore / 100) * 7);

  // Content Length (15 pts)
  if (contentLength.status === 'comprehensive') score += 15;
  else if (contentLength.status === 'optimal') score += 10;
  else score += 5;

  score = Math.min(100, Math.max(30, score));

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
      action: `Optimize Title: Position target keyword "${targetKeyword}" in the first 50 characters (Current length: ${metaAudit.titleLength} chars).`,
      impact: 'HIGH',
      effort: 'LOW',
      category: 'Meta',
    });
  }

  if (!metaAudit.hasKeywordInDescription || metaAudit.descriptionStatus !== 'optimal') {
    actionPlan.push({
      priority: priority++,
      action: `Refine Meta Description: Expand to 140–160 chars with target keyword and value proposition (Current length: ${metaAudit.descriptionLength} chars).`,
      impact: 'HIGH',
      effort: 'LOW',
      category: 'Meta',
    });
  }

  if (keywordDensity.status === 'under-optimized') {
    actionPlan.push({
      priority: priority++,
      action: `Increase Keyword Density: Weave "${targetKeyword}" into 2 subheadings and the opening paragraph (Current density: ${keywordDensity.densityPercent}%).`,
      impact: 'HIGH',
      effort: 'MEDIUM',
      category: 'Keyword',
    });
  } else if (keywordDensity.status === 'over-optimized') {
    actionPlan.push({
      priority: priority++,
      action: `Mitigate Keyword Stuffing: Replace repetitive instances of "${targetKeyword}" with semantic LSI synonyms (Current density: ${keywordDensity.densityPercent}%).`,
      impact: 'HIGH',
      effort: 'MEDIUM',
      category: 'Keyword',
    });
  }

  if (nlpEntities.missingEntities.length > 0) {
    actionPlan.push({
      priority: priority++,
      action: `Inject Missing NLP Entities: Add topical coverage for '${nlpEntities.missingEntities[0].name}' to close competitor content gaps.`,
      impact: 'HIGH',
      effort: 'LOW',
      category: 'NLP',
    });
  }

  if (contentLength.status === 'thin') {
    actionPlan.push({
      priority: priority++,
      action: `Expand Content Depth: Add ~${contentLength.gapWords} words of practical blueprints & benchmarks to match Top-10 SERP averages.`,
      impact: 'HIGH',
      effort: 'HIGH',
      category: 'Content Length',
    });
  }

  if (eeat.compositeEEAT < 75) {
    actionPlan.push({
      priority: priority++,
      action: 'Strengthen E-E-A-T Signals: Add real-world benchmark metrics, hands-on production observations, and quantitative test findings.',
      impact: 'MEDIUM',
      effort: 'MEDIUM',
      category: 'EEAT',
    });
  }

  if (readability.fleschScore < 55) {
    actionPlan.push({
      priority: priority++,
      action: `Boost Flesch Reading Ease: Shorten compound sentences (Average sentence length is ${readability.avgSentenceLength} words; target < 18 words).`,
      impact: 'MEDIUM',
      effort: 'MEDIUM',
      category: 'Readability',
    });
  }

  // Internal link opportunities
  const internalLinks: LinkOpportunity[] = [
    {
      anchorPhrase: 'autonomous agentic workflows',
      targetTopic: '/blog/ai-agent-architecture-guide',
      reason: 'Semantically related high-authority internal pillar page.',
    },
    {
      anchorPhrase: 'real-time latency benchmarks',
      targetTopic: '/blog/web-vitals-performance-optimization',
      reason: 'Deepens visitor time-on-site and passes PageRank equity.',
    },
    {
      anchorPhrase: 'cloud architecture deployment',
      targetTopic: '/blog/devops-ci-cd-pipelines',
      reason: 'Contextual link to practical execution tutorial.',
    },
  ];

  // GSC Performance Estimator
  const gscPerformance: GSCPerformance = {
    estimatedPosition: score >= 85 ? 3.8 : score >= 70 ? 9.2 : 24.5,
    projectedCTR: score >= 85 ? 7.4 : score >= 70 ? 3.2 : 0.9,
    projectedMonthlyClicks: score >= 85 ? 1850 : score >= 70 ? 490 : 75,
    projectedImpressions: score >= 85 ? 24500 : score >= 70 ? 15200 : 8800,
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
        ? 'Exceptional on-page SEO profile with robust keyword distribution, high E-E-A-T signals, and plain English readability.'
        : score >= 70
        ? 'Solid SEO foundation. Resolve minor entity gaps and heading hierarchy warnings to climb to Page 1.'
        : 'Under-optimized content asset. Execute the prioritized roadmap below to achieve competitive search ranking.',
    keywordDensity,
    readability,
    metaAudit,
    headingStructure,
    contentLength,
    eeat,
    nlpEntities,
    competitorBenchmark,
    internalLinks,
    actionPlan,
    gscPerformance,
    rawParagraphs,
    createdAt: new Date().toISOString(),
  };
}
