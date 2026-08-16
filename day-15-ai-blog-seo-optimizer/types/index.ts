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
  gapWords: number; // positive means need more words
  status: 'comprehensive' | 'optimal' | 'thin';
  recommendation: string;
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
  category: 'Keyword' | 'Readability' | 'Meta' | 'Headings' | 'Content Length' | 'Links';
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
