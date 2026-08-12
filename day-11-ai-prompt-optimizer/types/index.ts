export type TargetModel =
  | 'Gemini 1.5 Pro/Flash'
  | 'Claude 3.5 Sonnet'
  | 'GPT-4o / GPT-4'
  | 'Midjourney v6';

export type OptimizationGoal =
  | 'production'
  | 'reasoning'
  | 'creative'
  | 'few-shot';

export interface ScorecardMetric {
  name: string;
  score: number; // 0-20
  maxScore: number;
  description: string;
  feedback: string;
}

export interface PromptScorecard {
  totalScore: number; // 0-100
  clarity: ScorecardMetric;
  context: ScorecardMetric;
  constraints: ScorecardMetric;
  formatting: ScorecardMetric;
  guardrails: ScorecardMetric;
  summaryFeedback: string;
}

export interface PromptVariant {
  id: string;
  title: string;
  goalTag: OptimizationGoal;
  description: string;
  systemInstruction?: string;
  userPrompt: string;
  estimatedTokens: number;
  extractedVariables: string[];
}

export interface OptimizationResult {
  id: string;
  rawPrompt: string;
  targetModel: TargetModel;
  scorecard: PromptScorecard;
  variants: PromptVariant[];
  createdAt: string;
}

export interface PresetPrompt {
  id: string;
  title: string;
  category: string;
  rawPrompt: string;
  targetModel: TargetModel;
  description: string;
}
