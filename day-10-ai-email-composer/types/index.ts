export type EmailTone = 'Persuasive' | 'Direct & Punchy' | 'Formal Executive' | 'Warm & Casual' | 'Urgent / Deadline';

export type EmailPurpose =
  | 'Cold Outreach'
  | 'Job Application'
  | 'Follow-up'
  | 'Customer Complaint'
  | 'Networking'
  | 'Investor Pitch'
  | 'SaaS Sales Demo';

export interface EmailConfig {
  tone: EmailTone;
  purpose: EmailPurpose;
  bullets: string[];
  senderName?: string;
  recipientName?: string;
  recipientCompany?: string;
}

export interface DeliverabilityMetrics {
  score: number; // 0 - 100
  inboxPlacement: 'High (Primary Inbox)' | 'Moderate' | 'Spam Risk';
  readingGrade: string;
  spamTriggersFound: string[];
  readingTimeSeconds: number;
}

export interface EmailVariant {
  id: string;
  label: 'Bold & Assertive' | 'Balanced & Value-Driven' | 'Short & Punchy (Mobile)' | 'Follow-up Sequence';
  subject: string;
  body: string;
  wordCount: number;
  readingTimeSeconds: number;
  followUpDay3?: string;
  followUpDay7?: string;
}

export interface SubjectLineCandidate {
  subject: string;
  predictedOpenRate: number; // 0 - 100
  strategy: 'Benefit + Curiosity' | 'Social Proof' | 'Low-Friction CTA' | 'Direct & Personal' | 'Urgency & Timing';
  characterCount: number;
}

export interface GeneratedEmailResponse {
  variants: EmailVariant[];
  subjectLines: SubjectLineCandidate[];
  recommendedSubjectIndex: number;
  deliverability: DeliverabilityMetrics;
}

export interface SavedEmail {
  id: string;
  createdAt: string;
  config: EmailConfig;
  variant: EmailVariant;
}
