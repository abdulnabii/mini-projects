export type DocType =
  | 'Employment Agreement'
  | 'Non-Disclosure Agreement (NDA)'
  | 'Commercial Lease Agreement'
  | 'Freelance / Master Services Agreement (MSA)'
  | 'Terms of Service & Privacy Policy'
  | 'General Legal Contract';

export type RiskSeverity = 'SEVERE' | 'MODERATE' | 'MILD';

export type RiskVerdict =
  | 'SAFE — Standard Balanced Terms'
  | 'MODERATE RISK — Minor Adjustments Advised'
  | 'HIGH RISK — Negotiate Before Signing'
  | 'CRITICAL RISK — Severely One-Sided / Do Not Sign';

export type SupportedLanguage = 'English' | 'Arabic' | 'Urdu' | 'French' | 'Spanish';

export interface DangerousClause {
  id: string;
  severity: RiskSeverity;
  category: 'Intellectual Property' | 'Non-Compete' | 'Indemnification & Liability' | 'Termination & Severance' | 'Jurisdiction & Dispute' | 'Payment Terms' | 'General';
  title: string;
  exactText: string;
  plainEnglish: string;
  counterProposal: string;
  legalImplication: string;
}

export interface MissingClause {
  id: string;
  clause: string;
  risk: string;
  standardRecommendation: string;
  importance: 'CRITICAL' | 'IMPORTANT' | 'RECOMMENDED';
}

export interface SectionAnalysis {
  id: string;
  title: string;
  plainEnglish: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  keyTakeaway: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  references?: string[];
}

export interface VersionDiff {
  id: string;
  summary: string;
  addedClauses: string[];
  removedClauses: string[];
  modifiedClauses: {
    title: string;
    original: string;
    modified: string;
    explanation: string;
    favorability: 'MORE_FAVORABLE' | 'LESS_FAVORABLE' | 'NEUTRAL';
  }[];
}

export interface LegalAnalysis {
  id: string;
  docTitle: string;
  docType: DocType;
  language: SupportedLanguage;
  createdAt: string;
  riskScore: number; // 0 to 100
  riskVerdict: RiskVerdict;
  executiveSummary: string;
  overallPros: string[];
  overallCons: string[];
  dangerousClauses: DangerousClause[];
  missingClauses: MissingClause[];
  sections: SectionAnalysis[];
  rawText: string;
}
