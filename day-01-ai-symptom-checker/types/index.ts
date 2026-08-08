export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export interface PossibleCondition {
  name: string;
  confidence: number; // 0.0 to 1.0
  description: string;
  recommendation?: string;
}

export interface PatientContext {
  age?: number;
  gender?: string;
  duration?: string; // e.g. "3 days", "2 hours"
  severity?: number; // 1 to 10
  preExistingConditions?: string;
}

export interface TriageAssessment {
  riskLevel: RiskLevel;
  possibleConditions: PossibleCondition[];
  nextSteps: string[];
  urgency: string;
  summary: string;
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  assessment?: TriageAssessment;
  followUpQuestion?: string;
}

export interface TriageSession {
  id: string;
  title: string;
  createdAt: string;
  patientContext?: PatientContext;
  messages: ChatMessage[];
  finalAssessment?: TriageAssessment;
}
