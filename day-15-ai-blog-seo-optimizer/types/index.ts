export interface KeywordDensityMetric {
  targetKeyword: string;
  occurrences: number;
  densityPercent: number; // e.g. 1.8%
  status: 'optimal' | 'under-optimized' | 'over-optimized';
  inTitle: boolean;
  inFirst100Words: boolean;
  inH1: boolean;
  inH2Count: number;
  inMetaDescription: boolean;
  secondaryKeywords: { keyword: string; occurrences: number; densityPercent: number }[];
}

export interface ReadabilityMetric {
  fleschScore: number; // 0 to 100
  gradeLevel: string; // e.g. "9th Grade"
  label: 'Very Easy' | 'Easy' | 'Standard' | 'Fairly Difficult' | 'Difficult' | 'Very Confusing';
  avgSentenceLength: number; // words per sentence
  avgSyllablesPerWord: number;
  totalWords: number;
  totalSentences: number;
  readingTimeMinutes: number;
  improvementTip: string;
}

export interface MetaAuditMetric {
  title: string;
  titleLength: number;
  titleStatus: 'optimal' | 'too_short' | 'too_long';
  description: string;
  descriptionLength: number;
  descriptionStatus: 'optimal' | 'too_short' | 'too_long';
  hasKeywordInTitle: boolean;
  hasKeywordInDescription: boolean;
  serpPixelWidth: number; // max ~600px desktop
}

export interface HeadingNode {
  tag: 'h1' | 'h2' | 'h3';
  text: string;
  hasKeyword: boolean;
  isSkippedLevel?: boolean;
}

export interface HeadingStructureMetric {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  headings: HeadingNode[];
  hasMissingH1: boolean;
  hasMultipleH1: boolean;
  hasSkippedLevels: boolean;
  issues: string[];
}

export interface ContentLengthMetric {
  wordCount: number;
  top10BenchmarkWords: number;
  gapWords: number;
  status: 'comprehensive' | 'optimal' | 'thin';
  recommendation: string;
}

export interface EEATMetric {
  experienceScore: number; // 0 to 100
  expertiseScore: number;
  authoritativenessScore: number;
  trustworthinessScore: number;
  compositeEEAT: number;
  searchIntent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  intentConfidence: number; // e.g. 92%
}

export interface NLPEntityItem {
  name: string;
  count: number;
  category: 'Concept' | 'Technology' | 'Metric' | 'Methodology';
}

export interface MissingNLPEntity {
  name: string;
  importance: 'HIGH' | 'MEDIUM';
  suggestedContext: string;
}

export interface NLPEntityMetric {
  coveredEntities: NLPEntityItem[];
  missingEntities: MissingNLPEntity[];
  entityCoverageScore: number; // 0 to 100
}

export interface CompetitorBenchmark {
  userWords: number;
  avgTop10Words: number;
  userHeadings: number;
  avgTop10Headings: number;
  userReadability: number;
  avgTop10Readability: number;
  userKeywordDensity: number;
  avgTop10KeywordDensity: number;
}

export interface LinkOpportunity {
  anchorPhrase: string;
  targetTopic: string;
  reason: string;
}

export interface ActionPlanItem {
  priority: number;
  action: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  category: 'Keyword' | 'Readability' | 'Meta' | 'Headings' | 'Content Length' | 'Links' | 'EEAT' | 'NLP';
}

export interface GSCPerformance {
  estimatedPosition: number;
  projectedCTR: number;
  projectedMonthlyClicks: number;
  projectedImpressions: number;
  rankingDifficulty: 'Low' | 'Medium' | 'High' | 'Very High';
}

export interface SEOAuditResult {
  id: string;
  url?: string;
  targetKeyword: string;
  overallScore: number; // 0 to 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  headlineSummary: string;
  keywordDensity: KeywordDensityMetric;
  readability: ReadabilityMetric;
  metaAudit: MetaAuditMetric;
  headingStructure: HeadingStructureMetric;
  contentLength: ContentLengthMetric;
  eeat: EEATMetric;
  nlpEntities: NLPEntityMetric;
  competitorBenchmark: CompetitorBenchmark;
  internalLinks: LinkOpportunity[];
  actionPlan: ActionPlanItem[];
  gscPerformance: GSCPerformance;
  rawParagraphs: string[];
  createdAt: string;
}

export interface SampleArticle {
  id: string;
  title: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  metaDescription: string;
  content: string;
  description: string;
}
