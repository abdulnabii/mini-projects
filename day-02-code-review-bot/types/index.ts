export type Severity = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';

export type Category = 'Security' | 'Bugs & Errors' | 'Performance' | 'Code Quality' | 'Best Practices';

export interface CodeIssue {
  id: string;
  line: number;
  severity: Severity;
  category: Category;
  title: string;
  description: string;
  fix: string;
  suggestedCodeSnippet?: string;
}

export interface ReviewResult {
  score: number; // 0 to 100
  language: string;
  summary: string;
  criticalCount: number;
  majorCount: number;
  minorCount: number;
  infoCount: number;
  issues: CodeIssue[];
  fixedCode: string;
  refactoringTips?: string[];
}

export interface ReviewSession {
  id: string;
  title: string;
  createdAt: string;
  language: string;
  originalCode: string;
  reviewResult: ReviewResult;
}

export interface CodePreset {
  id: string;
  title: string;
  language: string;
  description: string;
  code: string;
}
