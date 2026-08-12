export type EmailTone = 'Formal' | 'Casual' | 'Persuasive' | 'Apologetic';

export type EmailPurpose =
  | 'Cold Outreach'
  | 'Job Application'
  | 'Follow-up'
  | 'Customer Complaint'
  | 'Networking';

export interface EmailConfig {
  tone: EmailTone;
  purpose: EmailPurpose;
  bullets: string[];
  senderName?: string;
  recipientName?: string;
  recipientCompany?: string;
}

export interface EmailVariant {
  id: string;
  label: 'Bold / Assertive' | 'Balanced / Standard' | 'Formal / Soft';
  subject: string;
  body: string;
  wordCount: number;
  readingTimeSeconds: number;
}

export interface SubjectLineCandidate {
  subject: string;
  predictedOpenRate: number; // 0 - 100
  strategy: 'Benefit + Curiosity' | 'Social Proof' | 'Low-Friction CTA' | 'Direct & Personal';
  characterCount: number;
}

export interface GeneratedEmailResponse {
  variants: EmailVariant[];
  subjectLines: SubjectLineCandidate[];
  recommendedSubjectIndex: number;
}

export interface SavedEmail {
  id: string;
  createdAt: string;
  config: EmailConfig;
  variant: EmailVariant;
}
