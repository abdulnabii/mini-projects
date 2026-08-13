export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Category =
  | 'Arrays & Strings'
  | 'Dynamic Programming'
  | 'Graphs & Trees'
  | 'System Design'
  | 'Behavioral';

export type ProgrammingLanguage =
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'cpp'
  | 'java';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSecret?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: Category;
  timeLimitMinutes: number;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: Record<ProgrammingLanguage, string>;
  testCases: TestCase[];
}

export interface InterviewMessage {
  id: string;
  sender: 'interviewer' | 'candidate';
  text: string;
  timestamp: string;
}

export interface Hint {
  tier: 1 | 2 | 3;
  title: string;
  content: string;
  penaltyPoints: number;
}

export interface TestCaseResult {
  testId: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  executionTimeMs: number;
}

export interface EvaluationReport {
  overallScore: number; // 0-100
  correctnessScore: number;
  codeQualityScore: number;
  communicationScore: number;
  timeComplexity: string; // e.g. "O(N)"
  spaceComplexity: string; // e.g. "O(1)"
  passedTestsCount: number;
  totalTestsCount: number;
  testResults: TestCaseResult[];
  strengths: string[];
  improvements: string[];
  optimalSolution: string;
  optimalExplanation: string;
  roadmapTopics: string[];
}

export interface InterviewSession {
  id: string;
  problem: Problem;
  language: ProgrammingLanguage;
  code: string;
  messages: InterviewMessage[];
  hintsGiven: Hint[];
  startTime: string;
  endTime?: string;
  evaluation?: EvaluationReport;
}
